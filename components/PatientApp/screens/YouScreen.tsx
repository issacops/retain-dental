import React, { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import {
  Users, Bell, BellOff, Phone, MapPin, Clock, Mail, ShieldCheck, Plus, CalendarDays,
  Share, History, Pencil, Vibrate, ChevronRight,
} from 'lucide-react';
import { Clinic, User, Appointment, PatientNotification } from '../../../types';
import { cn } from '../../Doctor/ui/primitives';
import { Surface, Well, GradientCard, SectionLabel, Display, Button, Chip, Avatar, AvatarStack, EmptyState, stagger, rise } from '../ui';
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

const Toggle: React.FC<{ on: boolean; onClick: () => void }> = ({ on, onClick }) => (
  <button onClick={onClick} aria-pressed={on} className={cn('relative h-7 w-12 shrink-0 rounded-full transition-colors', on ? 'bg-primary' : 'bg-ink-950/15')}>
    <span className={cn('absolute top-0.5 h-6 w-6 rounded-full bg-white shadow transition-all', on ? 'left-[1.375rem]' : 'left-0.5')} />
  </button>
);

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
  const iosNeedsInstall = isIOS() && !isStandalone();

  const togglePush = async () => {
    setBusy(true); setError(null);
    try {
      if (pushState === 'granted') { const endpoint = await disablePush(); if (endpoint) await onDeletePushSubscription?.(endpoint); }
      else { const sub = await enablePush(); await onSavePushSubscription?.(currentUser.id, clinic.id, sub); }
      setPushState(getPushState());
    } catch (e: any) {
      setError(e?.message || 'Could not update notifications.');
      setPushState(getPushState());
    } finally { setBusy(false); }
  };

  return (
    <motion.div variants={stagger(0.06)} initial={reduce ? false : 'hidden'} animate="show" className="space-y-4">
      <motion.div variants={rise} className="px-1 pb-1">
        <Display as="h1" className="text-[1.75rem] leading-tight">You</Display>
        <p className="mt-1 text-sm font-medium text-ink-500">Your profile, family and preferences.</p>
      </motion.div>

      {/* Profile */}
      <motion.div variants={rise}>
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

      {/* Preferences */}
      <motion.div variants={rise}>
        <Surface tone="white" className="overflow-hidden">
          <div className="px-5 pb-1 pt-5"><SectionLabel>Preferences</SectionLabel></div>
          {canPush && (
            <div className="flex items-center gap-4 px-5 py-4">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-ink-950/[0.05]" style={{ color: clinic.primaryColor }}>
                {pushState === 'granted' ? <Bell size={18} /> : <BellOff size={18} />}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-ink-800">Notifications</p>
                <p className="text-xs text-ink-400">{pushState === 'granted' ? 'On for this device' : 'Reminders on your phone'}</p>
              </div>
              <Toggle on={pushState === 'granted'} onClick={togglePush} />
            </div>
          )}
          {hapticsSupported() && (
            <div className="flex items-center gap-4 border-t border-ink-950/[0.05] px-5 py-4">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-ink-950/[0.05]" style={{ color: clinic.primaryColor }}><Vibrate size={18} /></span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-ink-800">Haptics</p>
                <p className="text-xs text-ink-400">A light tap as you use the app</p>
              </div>
              <Toggle on={hapticsOn} onClick={() => { const next = !hapticsOn; setHapticsEnabled(next); setHapticsOn(next); if (next) haptic('medium'); }} />
            </div>
          )}
        </Surface>
        {iosNeedsInstall && pushState !== 'granted' && (
          <div className="mt-2 flex items-start gap-2 rounded-2xl bg-white/70 px-4 py-3 text-[11px] text-ink-500 ring-1 ring-ink-950/[0.05]">
            <Share size={13} className="mt-0.5 shrink-0" />
            On iPhone, add this app to your Home Screen first (Share → Add to Home Screen), then turn notifications on.
          </div>
        )}
        {pushState === 'denied' && <p className="mt-2 rounded-2xl bg-blush-soft px-4 py-3 text-[11px] font-medium text-blush-deep">Notifications are blocked for this app. Enable them in your device settings.</p>}
        {error && <p className="mt-2 text-[11px] font-semibold text-blush-deep">{error}</p>}
      </motion.div>

      {/* Family */}
      <motion.div variants={rise}>
        <Surface tone="white" className="flex items-center gap-4 p-5">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-ink-950/[0.05] text-ink-500"><Users size={18} /></span>
          <div className="min-w-0 flex-1">
            <SectionLabel>Family</SectionLabel>
            <div className="mt-2"><AvatarStack names={[currentUser.name, ...household.filter((h) => h.id !== currentUser.id).map((h) => h.name)]} accent={clinic.primaryColor} /></div>
          </div>
          <button onClick={onOpenFamily} aria-label="Manage family" className="flex h-10 w-10 items-center justify-center rounded-full bg-ink-950 text-cream-50"><Pencil size={15} /></button>
        </Surface>
        {household.filter((h) => h.id !== currentUser.id).length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {household.filter((h) => h.id !== currentUser.id).map((m) => (
              <button key={m.id} onClick={() => onSwitchProfile(m.id)} className="flex items-center gap-2 rounded-full border border-ink-950/[0.06] bg-white py-1.5 pl-1.5 pr-3.5 shadow-[0_8px_20px_-18px_rgba(16,24,40,0.5)]">
                <Avatar name={m.name} accent="#A3A3A3" size={26} />
                <span className="text-xs font-semibold text-ink-700">{m.name}</span>
              </button>
            ))}
          </div>
        )}
      </motion.div>

      {/* Visits */}
      <motion.div variants={rise}>
        <Surface tone="white" className="p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2"><History size={16} className="text-ink-400" /><SectionLabel>Visits</SectionLabel></div>
            <button onClick={onOpenBooking} className="flex items-center gap-1 text-xs font-bold text-ink-600"><CalendarDays size={13} /> Book</button>
          </div>
          {nextAppt && (
            <Well className="mt-3 !py-3.5" style={{ backgroundColor: `${clinic.primaryColor}12` }}>
              <SectionLabel>Next visit</SectionLabel>
              <p className="mt-1 text-sm font-bold text-ink-800">
                {new Date(nextAppt.startTime).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })} · {new Date(nextAppt.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </Well>
          )}
          <Well className="mt-3 !p-2">
            {pastAppointments.length === 0 ? (
              <EmptyState title="No past visits" hint="Your visit history will appear here." />
            ) : (
              <div className="divide-y divide-ink-950/[0.06]">
                {pastAppointments.slice(0, 6).map((a) => (
                  <div key={a.id} className="flex items-center justify-between px-2.5 py-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-ink-800">{(a.type || 'Visit').toString()}</p>
                      <p className="text-xs text-ink-400">{new Date(a.startTime).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                    </div>
                    <Chip tone={a.status === 'COMPLETED' ? 'leaf' : 'neutral'}>{a.status}</Chip>
                  </div>
                ))}
              </div>
            )}
          </Well>
        </Surface>
      </motion.div>

      {/* Clinic */}
      <motion.div variants={rise}>
        <Surface tone="white" className="p-5">
          <SectionLabel>Your clinic</SectionLabel>
          <p className="mt-1 font-display text-base font-bold text-ink-900">{clinic.name}</p>
          <div className="mt-3 space-y-2">
            {clinic.settings?.address && (
              <div className="flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-ink-950/[0.05] text-ink-500"><MapPin size={16} /></span><span className="text-sm font-semibold text-ink-700">{clinic.settings.address}</span></div>
            )}
            {clinic.settings?.openingHours && (
              <div className="flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-ink-950/[0.05] text-ink-500"><Clock size={16} /></span><span className="text-sm font-semibold text-ink-700">{clinic.settings.openingHours}</span></div>
            )}
            {clinic.adminEmail && (
              <div className="flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-ink-950/[0.05] text-ink-500"><Mail size={16} /></span><span className="text-sm font-semibold text-ink-700">{clinic.adminEmail}</span></div>
            )}
          </div>
          {clinic.emergencyPhone && (
            <a href={`tel:${clinic.emergencyPhone}`}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-full py-3 text-sm font-bold text-white"
              style={{ backgroundImage: `linear-gradient(135deg, ${clinic.primaryColor}, ${clinic.primaryColor}bb)` }}>
              <Phone size={16} /> Emergency: {clinic.emergencyPhone}
            </a>
          )}
        </Surface>
      </motion.div>

      <div className="flex items-center justify-center gap-2 pb-2 pt-1 text-ink-300">
        <ShieldCheck size={13} />
        <span className="font-mono text-[10px] uppercase tracking-wider">Your data stays private to your clinic</span>
      </div>
    </motion.div>
  );
};

export default YouScreen;
