import React, { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import {
  Users, Bell, BellRing, BellOff, Phone, MapPin, Clock, Mail, ShieldCheck, Plus,
  CalendarDays, Share, History, Vibrate,
} from 'lucide-react';
import { Clinic, User, Appointment, PatientNotification } from '../../../types';
import { cn } from '../../Doctor/ui/primitives';
import { GradientCard, Glass, Surface, SectionLabel, Display, Button, Chip, Avatar, ListRow, EmptyState } from '../ui';
import { getPushState, enablePush, disablePush, isIOS, isStandalone, PushState } from '../../../lib/push';
import { haptic, hapticsEnabled, setHapticsEnabled, hapticsSupported } from '../../../lib/haptics';

interface Props {
  currentUser: User;
  clinic: Clinic;
  household: User[];
  pastAppointments: Appointment[];
  nextAppt?: Appointment;
  notifications: PatientNotification[] | null;
  onSwitchProfile: (userId: string) => void;
  onOpenFamily: () => void;
  onOpenBooking: () => void;
  onSavePushSubscription?: (userId: string, clinicId: string, sub: any) => Promise<{ success: boolean }>;
  onDeletePushSubscription?: (endpoint: string) => Promise<{ success: boolean }>;
}

const fade = (i: number, reduce: boolean) => ({
  initial: reduce ? false : { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.35, delay: reduce ? 0 : i * 0.06, ease: [0.22, 1, 0.36, 1] as const },
});

const YouScreen: React.FC<Props> = ({
  currentUser, clinic, household, pastAppointments, nextAppt, notifications,
  onSwitchProfile, onOpenFamily, onOpenBooking, onSavePushSubscription, onDeletePushSubscription,
}) => {
  const reduce = !!useReducedMotion();
  const [pushState, setPushState] = useState<PushState>(() => getPushState());
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hapticsOn, setHapticsOn] = useState<boolean>(() => hapticsEnabled());

  const canPush = !!onSavePushSubscription && !!onDeletePushSubscription;

  const togglePush = async () => {
    setBusy(true);
    setError(null);
    try {
      if (pushState === 'granted') {
        const endpoint = await disablePush();
        if (endpoint) await onDeletePushSubscription?.(endpoint);
      } else {
        const sub = await enablePush();
        await onSavePushSubscription?.(currentUser.id, clinic.id, sub);
      }
      setPushState(getPushState());
    } catch (e: any) {
      setError(e?.message || 'Could not update notifications.');
      setPushState(getPushState());
    } finally {
      setBusy(false);
    }
  };

  const iosNeedsInstall = isIOS() && !isStandalone();

  return (
    <div className="space-y-5">
      <motion.div {...fade(0, reduce)}>
        <GradientCard accent={clinic.primaryColor} className="p-5">
          <div className="flex items-center gap-4">
            <Avatar name={currentUser.name} accent="rgba(255,255,255,0.28)" size={56} />
            <div className="min-w-0 flex-1">
              <p className="truncate font-display text-xl font-bold tracking-tight text-white">{currentUser.name}</p>
              <div className="mt-1.5 flex items-center gap-2">
                <Chip tone="glass">{currentUser.currentTier}</Chip>
                <span className="font-mono text-[10px] uppercase tracking-wider text-white/70">{currentUser.mobile}</span>
              </div>
            </div>
          </div>
        </GradientCard>
      </motion.div>

      {/* Notifications */}
      {canPush && (
        <motion.div {...fade(1, reduce)}>
          <Glass className="p-5">
            <div className="flex items-center gap-4">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/60" style={{ color: clinic.primaryColor }}>
                {pushState === 'granted' ? <BellRing size={19} /> : <Bell size={19} />}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-ink-800">App notifications</p>
                <p className="text-xs text-ink-400">{pushState === 'granted' ? 'On for this device' : 'Reminders on your phone'}</p>
              </div>
              <Button variant={pushState === 'granted' ? 'glass' : 'primary'} accent={clinic.primaryColor} loading={busy}
                disabled={pushState === 'unsupported' || pushState === 'unconfigured'} onClick={togglePush} className="!px-4 !py-2.5 !text-xs">
                {pushState === 'granted' ? <><BellOff size={13} /> Off</> : 'Turn on'}
              </Button>
            </div>
            {iosNeedsInstall && pushState !== 'granted' && (
              <p className="mt-3 flex items-start gap-2 rounded-2xl bg-white/50 p-3 text-[11px] text-ink-500">
                <Share size={13} className="mt-0.5 shrink-0" />
                On iPhone, add this app to your Home Screen first (Share → Add to Home Screen), then turn notifications on.
              </p>
            )}
            {pushState === 'denied' && <p className="mt-3 rounded-2xl bg-blush-soft p-3 text-[11px] font-medium text-blush-deep">Notifications are blocked for this app. Enable them in your device settings.</p>}
            {pushState === 'unconfigured' && <p className="mt-3 rounded-2xl bg-white/50 p-3 text-[11px] text-ink-500">Notifications aren't set up for this clinic yet. Messages still appear in the app.</p>}
            {error && <p className="mt-3 text-[11px] font-semibold text-blush-deep">{error}</p>}
          </Glass>
        </motion.div>
      )}

      {/* Haptics */}
      {hapticsSupported() && (
        <motion.div {...fade(2, reduce)}>
          <Glass className="p-5">
            <div className="flex items-center gap-4">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/60" style={{ color: clinic.primaryColor }}>
                <Vibrate size={19} />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-ink-800">Haptics</p>
                <p className="text-xs text-ink-400">A light tap as you use the app</p>
              </div>
              <button
                onClick={() => { const next = !hapticsOn; setHapticsEnabled(next); setHapticsOn(next); if (next) haptic('medium'); }}
                aria-pressed={hapticsOn}
                className={cn('relative h-6 w-11 shrink-0 rounded-full transition-colors', hapticsOn ? 'bg-primary' : 'bg-ink-950/15')}
              >
                <span className={cn('absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all', hapticsOn ? 'left-[1.375rem]' : 'left-0.5')} />
              </button>
            </div>
          </Glass>
        </motion.div>
      )}

      {/* Family */}
      <motion.div {...fade(2, reduce)}>
        <Glass className="p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2"><Users size={16} className="text-ink-400" /><SectionLabel>Family</SectionLabel></div>
            <button onClick={onOpenFamily} className="flex items-center gap-1 text-xs font-bold text-ink-600"><Plus size={13} /> Add</button>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-3">
            <div className="rounded-2xl border border-white/50 bg-white/50 p-3.5">
              <Avatar name={currentUser.name} accent={clinic.primaryColor} size={34} />
              <p className="mt-2 truncate text-sm font-bold text-ink-800">{currentUser.name}</p>
              <p className="font-mono text-[10px] uppercase tracking-wider text-ink-400">Primary</p>
            </div>
            {household.filter((h) => h.id !== currentUser.id).map((m) => (
              <button key={m.id} onClick={() => onSwitchProfile(m.id)} className="rounded-2xl border border-white/50 bg-white/50 p-3.5 text-left transition-transform active:scale-[0.98]">
                <Avatar name={m.name} accent="#A3A3A3" size={34} />
                <p className="mt-2 truncate text-sm font-bold text-ink-800">{m.name}</p>
                <p className="font-mono text-[10px] uppercase tracking-wider text-ink-400">{(m.metadata as any)?.relation || 'Family'}</p>
              </button>
            ))}
          </div>
        </Glass>
      </motion.div>

      {/* Visits */}
      <motion.div {...fade(3, reduce)}>
        <Glass className="p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2"><History size={16} className="text-ink-400" /><SectionLabel>Visits</SectionLabel></div>
            <button onClick={onOpenBooking} className="flex items-center gap-1 text-xs font-bold text-ink-600"><CalendarDays size={13} /> Book</button>
          </div>
          {nextAppt && (
            <div className="mt-3 rounded-2xl p-4" style={{ backgroundColor: `${clinic.primaryColor}14` }}>
              <SectionLabel>Next visit</SectionLabel>
              <p className="mt-1 text-sm font-bold text-ink-800">
                {new Date(nextAppt.startTime).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })} · {new Date(nextAppt.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          )}
          <div className="mt-3 divide-y divide-ink-950/[0.06]">
            {pastAppointments.length === 0 ? (
              <EmptyState title="No past visits" hint="Your visit history will appear here." />
            ) : pastAppointments.slice(0, 6).map((a) => (
              <div key={a.id} className="flex items-center justify-between py-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-ink-800">{(a.type || 'Visit').toString()}</p>
                  <p className="text-xs text-ink-400">{new Date(a.startTime).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                </div>
                <Chip tone={a.status === 'COMPLETED' ? 'leaf' : 'neutral'}>{a.status}</Chip>
              </div>
            ))}
          </div>
        </Glass>
      </motion.div>

      {/* Clinic */}
      <motion.div {...fade(4, reduce)}>
        <Glass className="p-5">
          <SectionLabel>Your clinic</SectionLabel>
          <p className="mt-1 font-display text-base font-bold text-ink-900">{clinic.name}</p>
          <div className="mt-3 space-y-1.5">
            {clinic.settings?.address && <ListRow icon={<MapPin size={16} />} title={clinic.settings.address} />}
            {clinic.settings?.openingHours && <ListRow icon={<Clock size={16} />} title={clinic.settings.openingHours} />}
            {clinic.adminEmail && <ListRow icon={<Mail size={16} />} title={clinic.adminEmail} />}
          </div>
          {clinic.emergencyPhone && (
            <a href={`tel:${clinic.emergencyPhone}`} className="mt-3 flex items-center justify-center gap-2 rounded-full bg-ink-950 py-3 text-sm font-bold text-cream-50">
              <Phone size={16} /> Emergency: {clinic.emergencyPhone}
            </a>
          )}
        </Glass>
      </motion.div>

      <div className="flex items-center justify-center gap-2 pb-2 pt-1 text-ink-300">
        <ShieldCheck size={13} />
        <span className="font-mono text-[10px] uppercase tracking-wider">Your data stays private to your clinic</span>
      </div>
    </div>
  );
};

export default YouScreen;
