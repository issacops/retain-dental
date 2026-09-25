import React, { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import {
  CalendarDays, MapPin, Phone, MessageCircle, Check, Sparkles, HeartPulse,
  ArrowRight, Clock, Plus,
} from 'lucide-react';
import { Clinic, User, CarePlan, Appointment, PatientNotification } from '../../../types';
import { cn } from '../../Doctor/ui/primitives';
import { Glass, SectionLabel, ProgressRing, CountUp, DayStrip, stagger, rise, daysUntil, dayGreeting, relTime, Noise, Segmented, WeekStrip, GradientSlider } from '../ui';
import CardStack, { StackItem } from '../CardStack';

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
  comfort?: number;
  onSetComfort?: (v: number) => void;
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

const TodayScreen: React.FC<Props> = ({
  currentUser, clinic, appointments, nextAppt, activePlan, points, unreadCount, notifications,
  onToggleTask, onOpenMessages, onOpenBooking, onGoCare, onGoRewards,
  comfort, onSetComfort,
}) => {
  const reduce = !!useReducedMotion();
  const [weekView, setWeekView] = useState<'WEEK' | 'MONTH'>('WEEK');
  const comfortValue = typeof comfort === 'number' ? comfort : 7;
  const comfortLabel = comfortValue >= 8 ? 'Great' : comfortValue >= 5 ? 'Okay' : 'Sore';
  const firstName = (currentUser.name || 'there').split(' ')[0];

  const tasks = activePlan?.checklist || [];
  const done = tasks.filter((t) => t.completed).length;
  const pct = tasks.length ? done / tasks.length : 0;
  const streak = streakFrom(activePlan?.adherenceRecord);
  const latest = (notifications || [])[0];

  const markedDays = new Set(
    appointments.filter((a) => +new Date(a.startTime) >= Date.now() && +new Date(a.startTime) < Date.now() + 7 * 86400000)
      .map((a) => new Date(a.startTime).getDate()),
  );
  const dLeft = nextAppt ? daysUntil(nextAppt.startTime) : null;
  const heroValue = dLeft === null ? '—' : dLeft === 0 ? 'Today' : dLeft === 1 ? 'Tomorrow' : dLeft;
  const heroUnit = dLeft !== null && dLeft >= 2 ? 'days' : '';
  const mapsUrl = clinic.settings?.address ? `https://maps.google.com/?q=${encodeURIComponent(clinic.settings.address)}` : null;

  const items: StackItem[] = [
    {
      id: 'visit',
      label: 'Next visit',
      sub: nextAppt ? `${new Date(nextAppt.startTime).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })} · ${new Date(nextAppt.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : 'Nothing booked yet',
      icon: <CalendarDays size={17} />,
      gradient: 'linear-gradient(155deg, #3B82F6 0%, #0B2447 100%)',
      content: nextAppt ? (
        <div>
          <div className="flex items-end gap-2">
            <span className="font-display text-5xl font-bold leading-none tracking-tighter text-white">{heroValue}</span>
            {heroUnit && <span className="mb-2 text-sm font-semibold text-white/70">{heroUnit} to go</span>}
          </div>
          <div className="mt-4 rounded-2xl bg-white/12 p-3 ring-1 ring-inset ring-white/15 backdrop-blur-sm">
            <DayStrip accent="#3B82F6" markedDays={markedDays} />
          </div>
          <div className="mt-3 flex gap-2">
            {mapsUrl && (
              <a href={mapsUrl} target="_blank" rel="noreferrer" className="flex flex-1 items-center justify-center gap-2 rounded-full bg-white/15 py-2.5 text-xs font-bold text-white ring-1 ring-inset ring-white/20">
                <MapPin size={14} /> Directions
              </a>
            )}
            <button onClick={onOpenBooking} className="flex flex-1 items-center justify-center gap-2 rounded-full bg-white/15 py-2.5 text-xs font-bold text-white ring-1 ring-inset ring-white/20">
              <CalendarDays size={14} /> Reschedule
            </button>
          </div>
        </div>
      ) : (
        <div>
          <p className="text-sm text-white/75">Regular visits keep your treatment on track.</p>
          <button onClick={onOpenBooking} className="mt-3 flex w-full items-center justify-center gap-2 rounded-full bg-white py-3 text-sm font-bold text-[#0B2447]">
            <Plus size={16} /> Book a visit
          </button>
        </div>
      ),
    },
    {
      id: 'care',
      label: "Today's care",
      sub: activePlan ? `${done} of ${tasks.length} done${streak > 1 ? ` · ${streak}-day streak` : ''}` : 'No active treatment',
      icon: <HeartPulse size={17} />,
      gradient: 'linear-gradient(155deg, #22C55E 0%, #052E16 100%)',
      content: activePlan ? (
        <div>
          <div className="flex items-center gap-5">
            <ProgressRing value={pct} size={92} stroke={9} accent="#FFFFFF" track="rgba(255,255,255,0.25)" glow>
              <span className="font-display text-lg font-bold tracking-tight text-white">{Math.round(pct * 100)}%</span>
            </ProgressRing>
            <div className="min-w-0 flex-1 space-y-1.5">
              {tasks.slice(0, 3).map((t) => (
                <button key={t.id} onClick={() => onToggleTask(t.id)}
                  className={cn('flex w-full items-center gap-2.5 rounded-2xl px-3 py-2 text-left transition-transform active:scale-[0.98]',
                    t.completed ? 'bg-white/12' : 'bg-white/20')}>
                  <span className={cn('flex h-5 w-5 shrink-0 items-center justify-center rounded-md border', t.completed ? 'border-transparent bg-white text-[#052E16]' : 'border-white/40')}>
                    {t.completed && <Check size={12} />}
                  </span>
                  <span className={cn('truncate text-xs font-semibold text-white', t.completed && 'opacity-60 line-through')}>{t.task}</span>
                </button>
              ))}
            </div>
          </div>
          <button onClick={onGoCare} className="mt-3 flex w-full items-center justify-center gap-1.5 text-xs font-bold uppercase tracking-wider text-white/70">
            Full plan <ArrowRight size={13} />
          </button>
        </div>
      ) : (
        <button onClick={onOpenBooking} className="flex w-full items-center gap-3 rounded-2xl bg-white/12 p-3.5 text-left">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/20 text-white"><HeartPulse size={18} /></span>
          <span className="flex-1 text-sm font-semibold text-white/85">Your aftercare appears here after a visit.</span>
        </button>
      ),
    },
    {
      id: 'rewards',
      label: 'Rewards',
      sub: `${points.toLocaleString('en-IN')} Smile Points`,
      icon: <Sparkles size={17} />,
      gradient: 'linear-gradient(155deg, #F5A524 0%, #4A2200 100%)',
      content: (
        <div className="flex items-center justify-between gap-4">
          <div>
            <span className="font-display text-4xl font-bold leading-none tracking-tighter text-white"><CountUp value={points} /></span>
            <p className="mt-1 text-xs font-medium text-white/70">Available to redeem</p>
          </div>
          <button onClick={onGoRewards} className="rounded-full bg-white px-4 py-2.5 text-xs font-bold text-[#4A2200]">Redeem</button>
        </div>
      ),
    },
    {
      id: 'messages',
      label: 'Messages',
      sub: unreadCount > 0 ? `${unreadCount} unread` : 'All caught up',
      icon: <MessageCircle size={17} />,
      gradient: 'linear-gradient(155deg, #EC4899 0%, #4A0E2E 100%)',
      content: latest ? (
        <button onClick={onOpenMessages} className="w-full text-left">
          <p className="font-display text-base font-bold text-white">{latest.title}</p>
          <p className="mt-1 line-clamp-3 text-sm text-white/75">{latest.body}</p>
          <p className="mt-2 font-mono text-[10px] uppercase tracking-wider text-white/50">{latest.category} · {relTime(latest.createdAt)}</p>
        </button>
      ) : (
        <p className="text-sm text-white/75">No messages yet. Reminders and greetings from your clinic will appear here.</p>
      ),
    },
  ];

  return (
    <div className="space-y-5">
      {/* Dark dotted deck */}
      <motion.div variants={stagger(0.08)} initial={reduce ? false : 'hidden'} animate="show"
        className="relative overflow-hidden rounded-[40px] px-3 pb-4 pt-6"
        style={{ background: '#0A0A0F' }}>
        {/* dot grid + glows + grain */}
        <div aria-hidden className="pointer-events-none absolute inset-0 opacity-70"
          style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,0.07) 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
        <div aria-hidden className="pointer-events-none absolute -left-16 -top-10 h-48 w-48 rounded-full bg-[#3B82F6] opacity-25 blur-[70px]" />
        <div aria-hidden className="pointer-events-none absolute -right-12 top-24 h-40 w-40 rounded-full bg-[#EC4899] opacity-20 blur-[70px]" />
        <Noise opacity={0.06} />

        {/* Title */}
        <motion.div variants={rise} className="relative px-3 pb-5">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-full text-[10px] font-bold text-white ring-1 ring-inset ring-white/25" style={{ backgroundImage: `linear-gradient(140deg, ${clinic.primaryColor}, ${clinic.primaryColor}99)` }}>
              {(clinic.name || 'C').slice(0, 1)}
            </span>
            <span className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-white/55">{clinic.name}</span>
          </div>
          <h1 className="mt-3 font-display text-3xl font-bold tracking-tight text-white">
            {dayGreeting()}, {firstName}
          </h1>
          <p className="mt-1 text-xs font-medium text-white/50">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </p>
        </motion.div>

        <motion.div variants={rise}>
          <CardStack items={items} initial="visit" />
        </motion.div>

        {/* Neon action */}
        <motion.button variants={rise} onClick={onOpenBooking}
          whileTap={{ scale: 0.97 }}
          className="relative mt-4 flex w-full items-center justify-center gap-2 rounded-full py-3.5 text-sm font-bold text-[#1A1A00]"
          style={{ background: 'linear-gradient(135deg, #EAFB4B, #C8E31F)', boxShadow: '0 14px 34px -10px rgba(200,227,31,0.65)' }}>
          <Plus size={16} /> Book a visit
        </motion.button>
      </motion.div>

      {/* Schedule + check-in (iOS bento) */}
      <motion.div variants={rise} className="space-y-3">
        <Glass className="p-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <SectionLabel>Schedule</SectionLabel>
              <p className="mt-0.5 font-display text-base font-bold text-ink-900">Your week</p>
            </div>
            <Segmented
              className="w-[10.5rem]"
              value={weekView}
              onChange={setWeekView}
              options={[{ key: 'WEEK', label: 'Week' }, { key: 'MONTH', label: 'Month' }]}
            />
          </div>
          {weekView === 'WEEK' ? (
            <WeekStrip accent={clinic.primaryColor} markedDays={markedDays} className="mt-4" />
          ) : (
            <p className="mt-4 text-sm text-ink-500">
              {appointments.filter((a) => +new Date(a.startTime) >= Date.now()).length} upcoming visit(s) in the weeks ahead.
            </p>
          )}
        </Glass>

        <Glass tint="#F6C9DC" className="p-5">
          <div className="flex items-center justify-between">
            <SectionLabel>Daily check-in</SectionLabel>
            <span className="rounded-full px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-wider text-white"
              style={{ backgroundImage: `linear-gradient(135deg, ${clinic.primaryColor}, ${clinic.primaryColor}bb)` }}>{comfortLabel}</span>
          </div>
          <p className="mt-2 font-display text-base font-bold text-ink-900">How does your smile feel today?</p>
          <GradientSlider value={comfortValue} onChange={(v) => onSetComfort?.(v)} className="mt-4" />
          <div className="mt-1 flex justify-between font-mono text-[10px] font-bold uppercase tracking-wider text-ink-400">
            <span>Sore</span><span>Great</span>
          </div>
        </Glass>
      </motion.div>

      {/* Quick contact */}
      <div className="grid grid-cols-2 gap-3">
        <button onClick={onOpenMessages} className="flex items-center justify-center gap-2 rounded-full border border-white/70 bg-white/60 py-3.5 text-sm font-bold text-ink-700 backdrop-blur-md">
          <MessageCircle size={16} /> Messages
        </button>
        <a href={clinic.emergencyPhone ? `tel:${clinic.emergencyPhone}` : undefined} className="contents">
          <button className="flex w-full items-center justify-center gap-2 rounded-full border border-white/70 bg-white/60 py-3.5 text-sm font-bold text-ink-700 backdrop-blur-md">
            <Phone size={16} /> Call clinic
          </button>
        </a>
      </div>
    </div>
  );
};

export default TodayScreen;
