import webpush from 'web-push';
import { createClient } from '@supabase/supabase-js';

/**
 * Scheduled automations — creates patient notifications from the clinic's
 * configured rules, then delivers them via Web Push.
 *
 * Trigger: a scheduler (Vercel Cron, Cloudflare Cron Trigger, or any external
 * cron) hitting this endpoint. Also safe to call manually.
 *
 * Rules (per clinic, from clinics.settings.automations):
 *   appointmentReminder — remind N days before an upcoming visit
 *   recallNudge         — nudge patients overdue by N months
 *   birthday            — warm wish on the patient's birthday
 *   festive             — fixed-date greetings (New Year, Valentine's, Christmas…)
 *
 * Every insert carries a deterministic dedupe_key, so re-running is safe and
 * a patient is never messaged twice for the same event.
 *
 * Env: SUPABASE_URL (or VITE_SUPABASE_URL), SUPABASE_SERVICE_ROLE_KEY,
 *      VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY, VAPID_SUBJECT.
 */

const FESTIVE = [
  { key: 'newyear', md: '01-01', title: 'Happy New Year, {first_name}!', body: 'From all of us at {clinic}, wishing you a healthy and happy new year.' },
  { key: 'valentine', md: '02-14', title: 'Happy Valentine’s Day, {first_name}', body: 'A little love for your smile from everyone at {clinic}.' },
  { key: 'womensday', md: '03-08', title: 'Happy Women’s Day, {first_name}!', body: 'Celebrating you today from all of us at {clinic}.' },
  { key: 'christmas', md: '12-25', title: 'Merry Christmas, {first_name}!', body: 'Warm wishes from everyone at {clinic}. Enjoy the day!' },
];

const pad = (n) => String(n).padStart(2, '0');

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceRoleKey) {
    return res.status(500).json({ error: 'Supabase service credentials missing' });
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey);
  const now = new Date();
  const todayMd = `${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
  const year = now.getFullYear();
  const summary = { clinics: 0, created: 0, skipped: 0, errors: [] };

  try {
    const { data: clinics, error } = await supabase
      .from('clinics')
      .select('id, name, emergency_phone, settings');
    if (error) throw error;

    for (const clinic of clinics || []) {
      const auto = clinic.settings?.automations;
      if (!auto) continue;
      summary.clinics += 1;

      const rows = [];

      // --- Appointment reminders ---
      if (auto.appointmentReminder?.enabled) {
        const leadDays = Math.max(0, Number(auto.appointmentReminder.leadDays) || 1);
        const until = new Date(now.getTime() + leadDays * 86400000).toISOString();
        const { data: appts } = await supabase
          .from('appointments')
          .select('id, patient_id, start_time, type, status')
          .eq('clinic_id', clinic.id)
          .in('status', ['SCHEDULED', 'CONFIRMED'])
          .gte('start_time', now.toISOString())
          .lte('start_time', until);

        for (const a of appts || []) {
          const when = new Date(a.start_time);
          rows.push({
            clinic_id: clinic.id,
            patient_id: a.patient_id,
            title: 'Your appointment is coming up',
            body: `Hi, a reminder that your appointment at ${clinic.name} is on ${when.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })} at ${when.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}. Reply in the app if you need to change it.`,
            category: 'Appointment',
            status: 'SENT',
            sent_at: now.toISOString(),
            sent_by: 'Automation',
            dedupe_key: `appt-reminder-${a.id}`,
          });
        }
      }

      // --- Recall nudges ---
      if (auto.recallNudge?.enabled) {
        const months = Math.max(1, Number(auto.recallNudge.intervalMonths) || 6);
        const cutoff = new Date(now.getTime() - months * 30 * 86400000).toISOString();
        const { data: profiles } = await supabase
          .from('profiles')
          .select('id, full_name, metadata')
          .eq('clinic_id', clinic.id)
          .eq('role', 'PATIENT');
        const patientIds = (profiles || []).map((p) => p.id);
        if (patientIds.length) {
          const { data: wallets } = await supabase.from('wallets').select('id, user_id').in('user_id', patientIds);
          const walletOwner = new Map((wallets || []).map((w) => [w.id, w.user_id]));
          const { data: earns } = await supabase
            .from('transactions')
            .select('wallet_id, created_at')
            .eq('clinic_id', clinic.id)
            .eq('type', 'EARN');
          const lastVisit = new Map();
          for (const t of earns || []) {
            const uid = walletOwner.get(t.wallet_id);
            if (!uid) continue;
            const at = +new Date(t.created_at);
            if (!lastVisit.has(uid) || at > lastVisit.get(uid)) lastVisit.set(uid, at);
          }
          for (const p of profiles || []) {
            const last = lastVisit.get(p.id);
            if (last && last > +new Date(cutoff)) continue;
            rows.push({
              clinic_id: clinic.id,
              patient_id: p.id,
              title: 'Your check-up is due',
              body: `Hi ${(p.full_name || 'there').split(' ')[0]}, it has been a while since your last visit to ${clinic.name}. We would love to get you back on track — book whenever suits you.`,
              category: 'Recall',
              status: 'SENT',
              sent_at: now.toISOString(),
              sent_by: 'Automation',
              dedupe_key: `recall-${p.id}-${year}-${pad(now.getMonth() + 1)}`,
            });
          }
        }
      }

      // --- Birthday + festive (need patient metadata) ---
      if (auto.birthday?.enabled || auto.festive?.enabled) {
        const { data: profiles } = await supabase
          .from('profiles')
          .select('id, full_name, metadata')
          .eq('clinic_id', clinic.id)
          .eq('role', 'PATIENT');

        for (const p of profiles || []) {
          const first = (p.full_name || 'there').split(' ')[0];

          if (auto.birthday?.enabled) {
            const dob = p.metadata?.emr?.demographics?.dateOfBirth || p.metadata?.dateOfBirth;
            if (dob && String(dob).slice(5, 10) === todayMd) {
              rows.push({
                clinic_id: clinic.id,
                patient_id: p.id,
                title: `Happy birthday, ${first}!`,
                body: `Wishing you a wonderful birthday from all of us at ${clinic.name}. We would love to see your smile this month.`,
                category: 'Greeting',
                status: 'SENT',
                sent_at: now.toISOString(),
                sent_by: 'Automation',
                dedupe_key: `birthday-${p.id}-${year}`,
              });
            }
          }

          if (auto.festive?.enabled) {
            for (const f of FESTIVE) {
              if (f.md !== todayMd) continue;
              rows.push({
                clinic_id: clinic.id,
                patient_id: p.id,
                title: f.title.replace('{first_name}', first),
                body: f.body.replace('{clinic}', clinic.name).replace('{first_name}', first),
                category: 'Greeting',
                status: 'SENT',
                sent_at: now.toISOString(),
                sent_by: 'Automation',
                dedupe_key: `festive-${f.key}-${p.id}-${year}`,
              });
            }
          }
        }
      }

      if (!rows.length) continue;

      const { data: inserted, error: insErr } = await supabase
        .from('patient_notifications')
        .upsert(rows, { onConflict: 'dedupe_key', ignoreDuplicates: true })
        .select('id');
      if (insErr) { summary.errors.push(`${clinic.name}: ${insErr.message}`); continue; }

      summary.created += (inserted || []).length;
      summary.skipped += rows.length - (inserted || []).length;

      // Deliver via push (best-effort)
      if ((inserted || []).length) {
        try {
          const host = req.headers['x-forwarded-host'] || req.headers.host;
          const proto = (req.headers['x-forwarded-proto'] || 'https').split(',')[0];
          await fetch(`${proto}://${host}/api/send-push`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ clinicId: clinic.id, notificationIds: inserted.map((r) => r.id) }),
          });
        } catch { /* in-app feed still delivers */ }
      }
    }

    return res.status(200).json({ ok: true, ...summary });
  } catch (e) {
    return res.status(500).json({ error: e.message || 'Automation run failed', ...summary });
  }
}
