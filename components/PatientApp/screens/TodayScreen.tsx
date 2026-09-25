import React, { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import {
  CalendarDays, MapPin, Phone, MessageCircle, Check, Sparkles, HeartPulse,
  ArrowRight, Users, Pencil,
} from 'lucide-react';
import { Clinic, User, CarePlan, Appointment, PatientNotification } from '../../../types';
import { cn } from '../../Doctor/ui/primitives';
import {
  Surface, Well, SectionLabel, Display, Button, Chip, ProgressRing, CountUp,
  StatCard, PillSlider, WeekCalendar, AvatarStack, EventCard, stagger, rise,
  daysUntil, dayGreeting, relTime,
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
  household?: User[];
  onToggleTask: (itemId: string) => void;
  onOpenMessages: () => void;
  onOpenBooking: () => void;
  onGoCare: () => void;
  onGoRewards: () => void;
  onOpenFamily?: () => void;
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
  household = [], onToggleTask, onOpenMessages, onOpenBooking, onGoCare, onGoRewards, onOpenFamily,
  comfort, onSetComfort,
}) => {
  const reduce = !!useReducedMotion();
  const firstName = (currentUser.name || 'there').split(' ')[0];
  const [comf] = useState(() => (typeof comfort === 'number' ? comfort : 7));
  const comfortValue = typeof comfort === 'number' ? comfort : comf;

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
  const comfortLabel = (v: number) => (v >= 8 ? 'Great' : v >= 5 ? 'Okay' : 'Sore');
  const mapsUrl = clinic.settings?.address ? `https://maps.google.com/?q=${encodeURIComponent(clinic.settings.address)}` : null;

  const sub = [
    nextAppt ? `Next visit ${dLeft === 0 ? 'today' : dLeft === 1 ? 'tomorrow' : `in ${dLeft} days`}` : 'No upcoming visit',
    activePlan && tasks.length ? `${done}/${tasks.length} care tasks done` : null,
  ].filter(Boolean).join(' · ');

  return (
    <motion.div variants={stagger(0.06)} initial={reduce ? false : 'hidden'} animate="show" className="space-y-4">
      {/* Greeting */}
      <motion.div variants={rise} className="px-1 pb-1">
        <Display as="h1" className="text-[1.75rem] leading-tight">{dayGreeting()}, {firstName}</Display>
        <p className="mt-1 text-sm font-medium text-ink-500">{sub}</p>
      </motion.div>

      {/* Schedule + next visit */}
      <motion.div variants={rise}>
        <Surface tone="white" className="p-5">
          <WeekCalendar accent={clinic.primaryColor} markedDays={markedDays} />
          {nextAppt ? (
            <div className="mt-5">
              <EventCard
                accent={clinic.primaryColor}
                eyebrow={`${new Date(nextAppt.startTime).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })} · ${new Date(nextAppt.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`}
                title={(nextAppt.type || 'Appointment').toString()}
                meta={nextAppt.notes || clinic.name}
                people={[currentUser.name]}
                onClick={onOpenBooking}
              />
              <div className="mt-2 flex gap-2">
                {mapsUrl && (
                  <a href={mapsUrl} target="_blank" rel="noreferrer" className="flex flex-1 items-center justify-center gap-2 rounded-full bg-ink-950/[0.05] py-2.5 text-xs font-bold text-ink-700">
                    <MapPin size={14} /> Directions
                  </a>
                )}
                <button onClick={onOpenBooking} className="flex flex-1 items-center justify-center gap-2 rounded-full bg-ink-950/[0.05] py-2.5 text-xs font-bold text-ink-700">
                  <CalendarDays size={14} /> Reschedule
                </button>
              </div>
            </div>
          ) : (
            <Button accent={clinic.primaryColor} block className="mt-5" onClick={onOpenBooking}>
              <CalendarDays size={16} /> Book a visit
            </Button>
          )}
        </Surface>
      </motion.div>

      {/* Bento stats */}
      <motion.div variants={rise} className="grid grid-cols-2 gap-3">
        <StatCard icon={<CalendarDays size={16} />} value={dLeft === null ? '—' : dLeft === 0 ? 'Now' : dLeft} unit={dLeft && dLeft > 1 ? 'days' : undefined} label="Until next visit" accent={clinic.primaryColor} onClick={onOpenBooking} />
        <StatCard icon={<Sparkles size={16} />} value={<CountUp value={points} />} label="Smile Points" accent="#EAB308" onClick={onGoRewards} />
        <StatCard icon={<HeartPulse size={16} />} value={activePlan ? `${Math.round(pct * 100)}%` : '—'} label="Care today" accent="#22C55E" onClick={onGoCare} />
        <StatCard icon={<MessageCircle size={16} />} value={unreadCount || '—'} label={unreadCount ? 'Unread messages' : 'All caught up'} accent="#EC4899" onClick={onOpenMessages} />
      </motion.div>

      {/* Today's care */}
      {activePlan && (
        <motion.div variants={rise}>
          <Surface tone="white" className="p-5">
            <div className="flex items-center justify-between">
              <div className="min-w-0">
                <SectionLabel>Today's care</SectionLabel>
                <p className="mt-0.5 truncate font-display text-base font-bold text-ink-900">{activePlan.treatmentName}</p>
              </div>
              {streak > 1 ? <Chip tone="sun"><Sparkles size={11} /> {streak} days</Chip> : <Chip tone="leaf">{done}/{tasks.length}</Chip>}
            </div>

            <div className="mt-4 flex items-center gap-5">
              <ProgressRing value={pct} size={84} stroke={8} accent={clinic.primaryColor} track="rgba(10,10,10,0.08)" glow>
                <span className="font-display text-base font-bold tracking-tight text-ink-900">{done}<span className="text-ink-300">/{tasks.length}</span></span>
              </ProgressRing>
              <Well className="min-w-0 flex-1 !p-3">
                <div className="space-y-1.5">
                  {tasks.slice(0, 3).map((t) => (
                    <button key={t.id} onClick={() => onToggleTask(t.id)} className="flex w-full items-center gap-2.5 text-left">
                      <span className={cn('flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-colors', t.completed ? 'border-transparent text-white' : 'border-ink-950/20 bg-white')}
                        style={t.completed ? { backgroundImage: `linear-gradient(140deg, ${clinic.primaryColor}, ${clinic.primaryColor}cc)` } : undefined}>
                        {t.completed && <Check size={12} />}
                      </span>
                      <span className={cn('truncate text-xs font-semibold', t.completed ? 'text-ink-300 line-through' : 'text-ink-700')}>{t.task}</span>
                    </button>
                  ))}
                  {tasks.length === 0 && <p className="text-xs text-ink-400">No daily tasks.</p>}
                </div>
              </Well>
            </div>

            <button onClick={onGoCare} className="mt-4 flex w-full items-center justify-center gap-1.5 text-xs font-bold uppercase tracking-wider text-ink-400">
              Full plan <ArrowRight size={13} />
            </button>
          </Surface>
        </motion.div>
      )}

      {/* Daily check-in */}
      <motion.div variants={rise}>
        <Surface tone="white" className="p-5">
          <div className="flex items-center justify-between">
            <SectionLabel>Daily check-in</SectionLabel>
            <span className="rounded-full px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-wider text-white"
              style={{ backgroundImage: `linear-gradient(135deg, ${clinic.primaryColor}, ${clinic.primaryColor}bb)` }}>{comfortLabel(comfortValue)}</span>
          </div>
          <p className="mt-2 font-display text-base font-bold text-ink-900">How does your smile feel today?</p>
          <PillSlider value={comfortValue} min={0} max={10} onChange={(v) => onSetComfort?.(v)} label={comfortLabel} className="mt-4" />
          <div className="mt-1.5 flex justify-between font-mono text-[10px] font-bold uppercase tracking-wider text-ink-400">
            <span>Sore</span><span>Great</span>
          </div>
        </Surface>
      </motion.div>

      {/* Family */}
      {household.length > 1 && (
        <motion.div variants={rise}>
          <Surface tone="white" className="flex items-center gap-4 p-5">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-ink-950/[0.05] text-ink-500"><Users size={18} /></span>
            <div className="min-w-0 flex-1">
              <SectionLabel>Family</SectionLabel>
              <div className="mt-2"><AvatarStack names={household.map((h) => h.name)} accent={clinic.primaryColor} /></div>
            </div>
            <button onClick={onOpenFamily} aria-label="Manage family" className="flex h-10 w-10 items-center justify-center rounded-full bg-ink-950 text-cream-50">
              <Pencil size={15} />
            </button>
          </Surface>
        </motion.div>
      )}

      {/* Latest message */}
      {latest && (
        <motion.div variants={rise}>
          <Surface tone="white" interactive className="p-4" onClick={onOpenMessages}>
            <div className="flex items-start gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-blush-soft text-blush-deep"><MessageCircle size={18} /></span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold text-ink-800">{latest.title}</p>
                <p className="mt-0.5 line-clamp-2 text-xs text-ink-500">{latest.body}</p>
                <p className="mt-1 font-mono text-[10px] uppercase tracking-wider text-ink-300">{relTime(latest.createdAt)}</p>
              </div>
              <ArrowRight size={16} className="mt-1 shrink-0 text-ink-300" />
            </div>
          </Surface>
        </motion.div>
      )}

      {/* Quick actions */}
      <motion.div variants={rise} className="grid grid-cols-2 gap-3">
        <Button accent={clinic.primaryColor} block onClick={onOpenBooking} className="!py-3.5"><CalendarDays size={16} /> Book visit</Button>
        <a href={clinic.emergencyPhone ? `tel:${clinic.emergencyPhone}` : undefined} className="contents">
          <Button variant="glass" block className="!py-3.5"><Phone size={16} /> Call clinic</Button>
        </a>
      </motion.div>
    </motion.div>
  );
};

export default TodayScreen;
