import React, { useEffect, useMemo, useState } from 'react';
import { Bell, BellOff, BellRing, Check, Smartphone, Share } from 'lucide-react';
import { Clinic, User, PatientNotification } from '../../../types';
import { getPushState, enablePush, disablePush, isIOS, isStandalone, PushState } from '../../../lib/push';

interface Props {
  currentUser: User;
  clinic: Clinic;
  onGetNotifications: (clinicId: string, patientId?: string) => Promise<{ success: boolean; updatedData?: PatientNotification[] }>;
  onMarkNotificationRead: (id: string) => Promise<{ success: boolean }>;
  onSavePushSubscription: (userId: string, clinicId: string, sub: { endpoint: string; keys: { p256dh: string; auth: string } }) => Promise<{ success: boolean }>;
  onDeletePushSubscription: (endpoint: string) => Promise<{ success: boolean }>;
}

const timeAgo = (iso: string) => {
  const mins = Math.round((Date.now() - +new Date(iso)) / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.round(hrs / 24)}d ago`;
};

const NotificationCenter: React.FC<Props> = ({
  currentUser, clinic, onGetNotifications, onMarkNotificationRead, onSavePushSubscription, onDeletePushSubscription,
}) => {
  const [items, setItems] = useState<PatientNotification[] | null>(null);
  const [pushState, setPushState] = useState<PushState>(() => getPushState());
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = () => onGetNotifications(clinic.id, currentUser.id).then((r) => setItems(r.updatedData || []));

  useEffect(() => {
    let mounted = true;
    onGetNotifications(clinic.id, currentUser.id).then((r) => { if (mounted) setItems(r.updatedData || []); });
    return () => { mounted = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clinic.id, currentUser.id]);

  const unread = useMemo(() => (items || []).filter((n) => n.status !== 'READ').length, [items]);

  const handleEnable = async () => {
    setBusy(true);
    setError(null);
    try {
      const sub = await enablePush();
      await onSavePushSubscription(currentUser.id, clinic.id, sub);
      setPushState('granted');
    } catch (e: any) {
      setError(e?.message || 'Could not enable notifications.');
      setPushState(getPushState());
    } finally {
      setBusy(false);
    }
  };

  const handleDisable = async () => {
    setBusy(true);
    setError(null);
    try {
      const endpoint = await disablePush();
      if (endpoint) await onDeletePushSubscription(endpoint);
      setPushState(getPushState());
    } catch (e: any) {
      setError(e?.message || 'Could not turn off notifications.');
    } finally {
      setBusy(false);
    }
  };

  const openItem = async (n: PatientNotification) => {
    if (n.status === 'READ') return;
    setItems((prev) => (prev || []).map((x) => (x.id === n.id ? { ...x, status: 'READ' } : x)));
    await onMarkNotificationRead(n.id);
  };

  const iosNeedsInstall = isIOS() && !isStandalone();

  return (
    <div className="space-y-4">
      {/* Push toggle */}
      <div className="bg-white rounded-[32px] p-6 border border-slate-100 shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl" style={{ backgroundColor: `${clinic.primaryColor}15`, color: clinic.primaryColor }}>
              {pushState === 'granted' ? <BellRing size={18} /> : <Bell size={18} />}
            </span>
            <div>
              <p className="text-sm font-black text-slate-800 tracking-tight">App notifications</p>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                {pushState === 'granted' ? 'On for this device' : 'Reminders on your phone'}
              </p>
            </div>
          </div>

          {pushState === 'granted' ? (
            <button onClick={handleDisable} disabled={busy}
              className="flex items-center gap-1.5 rounded-full border border-slate-200 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-slate-500">
              <BellOff size={12} /> Turn off
            </button>
          ) : (
            <button onClick={handleEnable} disabled={busy || pushState === 'unsupported' || pushState === 'unconfigured'}
              className="rounded-full px-4 py-2 text-[10px] font-black uppercase tracking-widest text-white disabled:opacity-40"
              style={{ backgroundColor: clinic.primaryColor }}>
              {busy ? '…' : 'Turn on'}
            </button>
          )}
        </div>

        {iosNeedsInstall && pushState !== 'granted' && (
          <p className="mt-4 flex items-start gap-2 rounded-2xl bg-slate-50 p-3 text-[11px] font-medium text-slate-500">
            <Share size={13} className="mt-0.5 shrink-0" />
            On iPhone, add this app to your Home Screen first (Share → Add to Home Screen), then turn notifications on.
          </p>
        )}
        {pushState === 'denied' && (
          <p className="mt-4 rounded-2xl bg-rose-50 p-3 text-[11px] font-medium text-rose-500">
            Notifications are blocked for this app. Enable them in your device settings to receive reminders.
          </p>
        )}
        {pushState === 'unconfigured' && (
          <p className="mt-4 rounded-2xl bg-slate-50 p-3 text-[11px] font-medium text-slate-500">
            Notifications aren't set up for this clinic yet. Your messages still appear below.
          </p>
        )}
        {error && <p className="mt-3 text-[11px] font-semibold text-rose-500">{error}</p>}
      </div>

      {/* Feed */}
      <div className="bg-white rounded-[32px] p-6 border border-slate-100 shadow-sm">
        <div className="flex items-center justify-between">
          <h4 className="text-lg font-black text-slate-900 tracking-tight">Messages</h4>
          {unread > 0 && (
            <span className="rounded-full px-2.5 py-1 text-[10px] font-black text-white" style={{ backgroundColor: clinic.primaryColor }}>
              {unread} new
            </span>
          )}
        </div>

        <div className="mt-4 space-y-2">
          {items === null ? (
            <p className="py-6 text-center text-xs text-slate-400">Loading…</p>
          ) : items.length === 0 ? (
            <div className="py-8 text-center">
              <Smartphone size={22} className="mx-auto text-slate-200" />
              <p className="mt-3 text-xs font-bold text-slate-400">No messages yet</p>
              <p className="mt-1 text-[11px] text-slate-300">Reminders and updates from your clinic will appear here.</p>
            </div>
          ) : (
            items.map((n) => {
              const isUnread = n.status !== 'READ';
              return (
                <button key={n.id} onClick={() => openItem(n)}
                  className="flex w-full items-start gap-3 rounded-[22px] border border-slate-100 bg-slate-50/50 p-4 text-left active:scale-[0.99] transition-transform">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full"
                    style={{ backgroundColor: isUnread ? clinic.primaryColor : '#e2e8f0', color: '#fff' }}>
                    {isUnread ? <Bell size={12} /> : <Check size={12} />}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-black text-slate-800 tracking-tight">{n.title}</span>
                    <span className="mt-1 block whitespace-pre-wrap text-xs font-medium leading-relaxed text-slate-500">{n.body}</span>
                    <span className="mt-2 block text-[10px] font-bold uppercase tracking-widest text-slate-300">{timeAgo(n.createdAt)}</span>
                  </span>
                </button>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationCenter;
