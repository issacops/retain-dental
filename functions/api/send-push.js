import { createClient } from '@supabase/supabase-js';
import { sendWebPush } from '../../lib/webpush.js';

/**
 * Cloudflare Pages Function — deliver notifications to patient devices via
 * Web Push (PWA). No SMS/WhatsApp provider involved.
 *
 * POST body: { clinicId: string, notificationIds?: string[] }
 * Degrades gracefully when VAPID env vars are absent.
 */
export async function onRequest(context) {
  const { request, env } = context;
  const headers = new Headers({
    'Access-Control-Allow-Origin': request.headers.get('Origin') || '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
  });

  if (request.method === 'OPTIONS') return new Response(null, { headers, status: 204 });
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method Not Allowed' }), { headers, status: 405 });
  }

  const publicKey = env.VAPID_PUBLIC_KEY;
  const privateKey = env.VAPID_PRIVATE_KEY;
  const subject = env.VAPID_SUBJECT || 'mailto:support@retaindental.com';
  if (!publicKey || !privateKey) {
    return new Response(JSON.stringify({ ok: false, reason: 'push-not-configured' }), { headers, status: 200 });
  }

  const supabaseUrl = env.VITE_SUPABASE_URL || env.SUPABASE_URL;
  const serviceRoleKey = env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceRoleKey) {
    return new Response(JSON.stringify({ error: 'Supabase service credentials missing' }), { headers, status: 500 });
  }

  let body = {};
  try { body = await request.json(); } catch { /* empty body */ }
  const { clinicId, notificationIds } = body;
  if (!clinicId) return new Response(JSON.stringify({ error: 'clinicId is required' }), { headers, status: 400 });

  const supabase = createClient(supabaseUrl, serviceRoleKey);
  const vapid = { publicKey, privateKey, subject };

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
      return new Response(JSON.stringify({ ok: true, sent: 0, pruned: 0 }), { headers, status: 200 });
    }

    const patientIds = [...new Set(notifications.map((n) => n.patient_id))];
    const { data: subscriptions, error: subErr } = await supabase
      .from('push_subscriptions')
      .select('endpoint, keys, user_id')
      .in('user_id', patientIds);
    if (subErr) throw subErr;

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
        const r = await sendWebPush({ endpoint: sub.endpoint, keys: sub.keys }, payload, vapid);
        if (r.ok) sent += 1;
        else if (r.status === 404 || r.status === 410) stale.push(sub.endpoint);
      } catch (err) {
        // Dead subscription → prune
        if (err && /41[0-9]|404/.test(String(err.message))) stale.push(sub.endpoint);
      }
    }

    if (stale.length) await supabase.from('push_subscriptions').delete().in('endpoint', stale);

    return new Response(JSON.stringify({ ok: true, sent, pruned: stale.length }), { headers, status: 200 });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message || 'Push delivery failed' }), { headers, status: 500 });
  }
}
