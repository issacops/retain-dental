import webpush from 'web-push';
import { createClient } from '@supabase/supabase-js';

/**
 * Vercel Serverless Function — deliver queued/sent notifications to patient
 * devices via Web Push (PWA). No SMS/WhatsApp provider involved.
 *
 * POST body: { clinicId: string, notificationIds?: string[] }
 *   - with notificationIds: deliver just those (used right after a manual send)
 *   - without: deliver any recent notifications that have not been pushed yet
 *
 * Required env: VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY, VAPID_SUBJECT,
 *               SUPABASE_URL (or VITE_SUPABASE_URL), SUPABASE_SERVICE_ROLE_KEY
 *
 * Degrades gracefully: if VAPID keys are absent it returns
 * { ok:false, reason:'push-not-configured' } and the in-app feed still works.
 */
export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

    const publicKey = process.env.VAPID_PUBLIC_KEY;
    const privateKey = process.env.VAPID_PRIVATE_KEY;
    const subject = process.env.VAPID_SUBJECT || 'mailto:support@retaindental.com';

    if (!publicKey || !privateKey) {
        return res.status(200).json({ ok: false, reason: 'push-not-configured' });
    }

    const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!supabaseUrl || !serviceRoleKey) {
        return res.status(500).json({ error: 'Supabase service credentials missing' });
    }

    const { clinicId, notificationIds } = req.body || {};
    if (!clinicId) return res.status(400).json({ error: 'clinicId is required' });

    webpush.setVapidDetails(subject, publicKey, privateKey);
    const supabase = createClient(supabaseUrl, serviceRoleKey);

    try {
        let query = supabase
            .from('patient_notifications')
            .select('id, patient_id, title, body, category, created_at')
            .eq('clinic_id', clinicId);

        if (Array.isArray(notificationIds) && notificationIds.length) {
            query = query.in('id', notificationIds);
        } else {
            const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
            query = query.gte('created_at', since);
        }

        const { data: notifications, error: notifErr } = await query;
        if (notifErr) throw notifErr;
        if (!notifications || notifications.length === 0) {
            return res.status(200).json({ ok: true, sent: 0, pruned: 0 });
        }

        const patientIds = [...new Set(notifications.map((n) => n.patient_id))];
        const { data: subscriptions, error: subErr } = await supabase
            .from('push_subscriptions')
            .select('endpoint, keys, user_id')
            .in('user_id', patientIds);
        if (subErr) throw subErr;

        // Group notifications per patient so one device gets one push per patient.
        const byPatient = new Map();
        for (const n of notifications) {
            if (!byPatient.has(n.patient_id)) byPatient.set(n.patient_id, []);
            byPatient.get(n.patient_id).push(n);
        }

        let sent = 0;
        const stale = [];

        for (const sub of subscriptions || []) {
            const items = byPatient.get(sub.user_id);
            if (!items || items.length === 0) continue;

            const payload = JSON.stringify({
                title: items[0].title,
                content: items[0].body,
                category: items[0].category,
                count: items.length,
                url: '/patient',
            });

            try {
                await webpush.sendNotification(
                    { endpoint: sub.endpoint, keys: sub.keys },
                    payload,
                );
                sent += 1;
            } catch (err) {
                // 404/410 → subscription is dead; prune it.
                if (err && (err.statusCode === 404 || err.statusCode === 410)) {
                    stale.push(sub.endpoint);
                }
            }
        }

        if (stale.length) {
            await supabase.from('push_subscriptions').delete().in('endpoint', stale);
        }

        return res.status(200).json({ ok: true, sent, pruned: stale.length });
    } catch (e) {
        return res.status(500).json({ error: e.message || 'Push delivery failed' });
    }
}
