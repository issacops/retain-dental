import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import {
  CalendarDays, MapPin, Phone, MessageCircle, ChevronRight, Check,
  Sparkles, Flame, HeartPulse, ArrowRight, Clock,
} from 'lucide-react';
import { Clinic, User, CarePlan, Appointment, PatientNotification } from '../../../types';
import { cn } from '../../Doctor/ui/primitives';
import {
  GradientCard, Glass, Surface, SectionLabel, Display, Button, Chip, ProgressRing,
  BigNumber, DayStrip, countdown, daysUntil, dayGreeting, relTime, money,
} from '../ui';

interface Props {
  currentUser: User;
  clinic: Clinic;
  appointments: Appointment[];
  nextAppt?: Appointment;
  activePlan?: CarePlan;
  points: number;
  unreadCount: number;
  notifications: PatientNotification[] | null;
  onToggleTask: (itemId: string) => void;
  onOpenMessages: () => void;
  onOpenBooking: () => void;
  onGoCare: () => void;
  onGoRewards: () => void;
}

const streakFrom = (record?: Record<string, number>) => {
  if (!record) return 0;
  let streak = 0;
  const d = new Date();
  for (let i = 0; i < 60; i++) {
    const key = new Date(d.getFullYear(), d.getMonth(), d.getDate() - i).toISOString().slice(0, 10);
    const v = record[key];
    if (v && v > 0) streak += 1;
    else if (i > 0) break;
  }
  return streak;
};

const fade = (i: number, reduce: boolean) => ({
  initial: reduce ? false : { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.35, delay: reduce ? 0 : i * 0.06, ease: [0.22, 1, 0.36, 1] as const },
});

const TodayScreen: React.FC<Props> = ({
  currentUser, clinic, appointments, nextAppt, activePlan, points, unreadCount, notifications,
  onToggleTask, onOpenMessages, onOpenBooking, onGoCare, onGoRewards,
}) => {
  const reduce = !!useReducedMotion();
  const firstName = (currentUser.name || 'there').split(' ')[0];

  const tasks = activePlan?.checklist || [];
  const done = tasks.filter((t) => t.completed).length;
  const pct = tasks.length ? done / tasks.length : 0;
  const streak = streakFrom(activePlan?.adherenceRecord);

  const markedDays = new Set(
    appointments.filter((a) => +new Date(a.startTime) >= Date.now() && +new Date(a.startTime) < Date.now() + 7 * 86400000)
      .map((a) => new Date(a.startTime).getDate()),
  );

  const dLeft = nextAppt ? daysUntil(nextAppt.startTime) : null;
  const heroValue = dLeft === null ? '—' : dLeft === 0 ? 'Today' : dLeft === 1 ? 'Tomorrow' : dLeft;
  const heroUnit = dLeft !== null && dLeft >= 2 ? 'days' : '';
  const latest = (notifications || [])[0];
  const mapsUrl = clinic.settings?.address ? `https://maps.google.com/?q=${encodeURIComponent(clinic.settings.address)}` : null;

  return (
    <div className="space-y-5">
      {/* Greeting */}
      <motion.div {...fade(0, reduce)} className="px-1">
        <SectionLabel>{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</SectionLabel>
        <Display as="h1" className="mt-1 text-3xl">{dayGreeting()}, {firstName}</Display>
      </motion.div>

      {/* Hero — next visit */}
      {nextAppt ? (
        <motion.div {...fade(1, reduce)}>
          <GradientCard accent={clinic.primaryColor} className="p-5">
            <div className="flex items-center justify-between">
              <Chip tone="glass">Next visit</Chip>
              <CalendarDays size={18} className="text-white/70" />
            </div>
            <div className="mt-5 flex items-end justify-between">
              <BigNumber value={heroValue} unit={heroUnit} label="until your visit" onDark />
              <div className="pb-1 text-right">
                <p className="font-display text-lg font-bold text-white">
                  {new Date(nextAppt.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
                <p className="text-xs text-white/70">{(nextAppt.type || 'visit').toString()}</p>
              </div>
            </div>
            <div className="mt-5"><DayStrip accent={clinic.primaryColor} markedDays={markedDays} /></div>
            <div className="mt-5 flex gap-2">
              {mapsUrl && (
                <a href={mapsUrl} target="_blank" rel="noreferrer" className="flex flex-1 items-center justify-center gap-2 rounded-full bg-white/20 py-2.5 text-xs font-bold text-white backdrop-blur-md">
                  <MapPin size={14} /> Directions
                </a>
              )}
              {clinic.emergencyPhone && (
                <a href={`tel:${clinic.emergencyPhone}`} className="flex flex-1 items-center justify-center gap-2 rounded-full bg-white/20 py-2.5 text-xs font-bold text-white backdrop-blur-md">
                  <Phone size={14} /> Call clinic
                </a>
              )}
            </div>
          </GradientCard>
        </motion.div>
      ) : (
        <motion.div {...fade(1, reduce)}>
          <GradientCard accent={clinic.primaryColor} className="p-6">
            <SectionLabel onDark>No upcoming visit</SectionLabel>
            <p className="mt-2 font-display text-2xl font-bold tracking-tight text-white">Ready when you are</p>
            <p className="mt-1 text-sm text-white/70">Regular visits keep your treatment on track.</p>
            <div className="mt-5"><DayStrip accent={clinic.primaryColor} markedDays={markedDays} /></div>
            <button onClick={onOpenBooking} className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-white py-3 text-sm font-bold" style={{ color: clinic.primaryColor }}>
              <CalendarDays size={16} /> Book a visit
            </button>
          </GradientCard>
        </motion.div>
      )}

      {/* Bento */}
      <div className="grid grid-cols-2 gap-3">
        {/* Care */}
        <motion.div {...fade(2, reduce)} className="col-span-2">
          <Glass className="p-5">
            <div className="flex items-center justify-between">
              <div className="min-w-0">
                <SectionLabel>Today's care</SectionLabel>
                <p className="mt-1 truncate font-display text-base font-bold text-ink-900">
                  {activePlan ? activePlan.treatmentName : 'No active plan'}
                </p>
              </div>
              {streak > 1 && <Chip tone="sun"><Flame size={11} /> {streak}</Chip>}
            </div>

            {activePlan ? (
              <div className="mt-4 flex items-center gap-5">
                <ProgressRing value={pct} size={96} stroke={9} accent={clinic.primaryColor} track="rgba(10,10,10,0.08)">
                  <span className="font-display text-lg font-bold tracking-tight text-ink-900">{done}<span className="text-ink-300">/{tasks.length}</span></span>
                </ProgressRing>
                <div className="min-w-0 flex-1 space-y-1.5">
                  {tasks.slice(0, 3).map((t) => (
                    <button key={t.id} onClick={() => onToggleTask(t.id)}
                      className="flex w-full items-center gap-2.5 rounded-2xl bg-white/60 px-3 py-2 text-left transition-transform active:scale-[0.99]">
                      <span className={cn('flex h-5 w-5 shrink-0 items-center justify-center rounded-md border', t.completed ? 'border-transparent text-white' : 'border-ink-950/20')}
                        style={t.completed ? { backgroundColor: clinic.primaryColor } : undefined}>
                        {t.completed && <Check size={12} />}
                      </span>
                      <span className={cn('truncate text-xs font-semibold', t.completed ? 'text-ink-300 line-through' : 'text-ink-700')}>{t.task}</span>
                    </button>
                  ))}
                  {tasks.length === 0 && <p className="text-xs text-ink-400">No daily tasks today.</p>}
                </div>
              </div>
            ) : (
              <button onClick={onOpenBooking} className="mt-4 flex w-full items-center gap-3 rounded-2xl bg-white/60 p-4 text-left">
                <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-mist-soft text-mist-deep"><HeartPulse size={18} /></span>
                <span className="flex-1 text-sm font-semibold text-ink-600">Your aftercare appears here after a visit.</span>
              </button>
            )}

            {activePlan && (
              <button onClick={onGoCare} className="mt-4 flex w-full items-center justify-center gap-1.5 text-xs font-bold uppercase tracking-wider text-ink-400">
                Full plan <ArrowRight size={13} />
              </button>
            )}
          </Glass>
        </motion.div>

        {/* Points */}
        <motion.button {...fade(3, reduce)} onClick={onGoRewards} className="col-span-1 text-left">
          <Glass className="h-full p-4" interactive>
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-sun-soft text-sun-deep"><Sparkles size={18} /></span>
            <p className="mt-3 font-display text-2xl font-bold tracking-tight text-ink-900">{points.toLocaleString('en-IN')}</p>
            <SectionLabel className="mt-0.5 block">Smile Points</SectionLabel>
          </Glass>
        </motion.button>

        {/* Messages */}
        <motion.button {...fade(4, reduce)} onClick={onOpenMessages} className="col-span-1 text-left">
          <Glass className="h-full p-4" interactive>
            <span className="relative flex h-10 w-10 items-center justify-center rounded-2xl bg-blush-soft text-blush-deep">
              <MessageCircle size={18} />
              {unreadCount > 0 && <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[9px] font-bold text-white" style={{ backgroundColor: clinic.primaryColor }}>{unreadCount}</span>}
            </span>
            <p className="mt-3 font-display text-2xl font-bold tracking-tight text-ink-900">{unreadCount > 0 ? unreadCount : '—'}</p>
            <SectionLabel className="mt-0.5 block">{unreadCount > 0 ? 'New messages' : 'No new messages'}</SectionLabel>
          </Glass>
        </motion.button>
      </div>

      {/* Latest message */}
      {latest && (
        <motion.div {...fade(5, reduce)}>
          <Glass interactive className="p-4" onClick={onOpenMessages}>
            <div className="flex items-start gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white/70 text-ink-500"><MessageCircle size={18} /></span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold text-ink-800">{latest.title}</p>
                <p className="mt-0.5 line-clamp-2 text-xs text-ink-500">{latest.body}</p>
                <p className="mt-1 font-mono text-[10px] uppercase tracking-wider text-ink-300">{relTime(latest.createdAt)}</p>
              </div>
              <ChevronRight size={16} className="mt-1 shrink-0 text-ink-300" />
            </div>
          </Glass>
        </motion.div>
      )}

      {/* Quick actions */}
      <motion.div {...fade(6, reduce)} className="grid grid-cols-2 gap-3">
        <Button variant="glass" block onClick={onOpenBooking} className="!py-3.5"><CalendarDays size={16} /> Book visit</Button>
        <a href={clinic.emergencyPhone ? `tel:${clinic.emergencyPhone}` : undefined} className="contents">
          <Button variant="glass" block className="!py-3.5"><Phone size={16} /> Call clinic</Button>
        </a>
      </motion.div>
    </div>
  );
};

export default TodayScreen;
