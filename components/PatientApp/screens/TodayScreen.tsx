import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import {
  CalendarDays, MapPin, Phone, MessageCircle, ChevronRight, Check,
  Sparkles, Flame, HeartPulse, ArrowRight,
} from 'lucide-react';
import { Clinic, User, CarePlan, Appointment, PatientNotification } from '../../../types';
import { cn } from '../../Doctor/ui/primitives';
import { Surface, SectionLabel, Display, Button, Chip, ProgressRing, Avatar, countdown, dayGreeting, relTime } from '../ui';

interface Props {
  currentUser: User;
  clinic: Clinic;
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

const todayKey = () => new Date().toISOString().slice(0, 10);

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
  currentUser, clinic, nextAppt, activePlan, points, unreadCount, notifications,
  onToggleTask, onOpenMessages, onOpenBooking, onGoCare, onGoRewards,
}) => {
  const reduce = useReducedMotion();
  const firstName = (currentUser.name || 'there').split(' ')[0];

  const tasks = activePlan?.checklist || [];
  const done = tasks.filter((t) => t.completed).length;
  const pct = tasks.length ? done / tasks.length : 0;
  const streak = streakFrom(activePlan?.adherenceRecord);

  const latest = (notifications || [])[0];
  const mapsUrl = clinic.settings?.address
    ? `https://maps.google.com/?q=${encodeURIComponent(clinic.settings.address)}`
    : null;

  const status = nextAppt
    ? `Your next visit is ${countdown(nextAppt.startTime).toLowerCase()}.`
    : 'No upcoming visit. Book whenever you are ready.';

  return (
    <div className="space-y-5">
      {/* Greeting */}
      <div>
        <Display as="h1">{dayGreeting()}, {firstName}</Display>
        <p className="mt-1 text-sm text-ink-500">{status}</p>
      </div>

      {/* Next appointment */}
      {nextAppt ? (
        <Surface className="overflow-hidden p-0">
          <div className="p-5" style={{ backgroundColor: clinic.primaryColor }}>
            <div className="flex items-center justify-between">
              <Chip tone="dark" className="!bg-white/20 !text-white">{countdown(nextAppt.startTime)}</Chip>
              <CalendarDays size={18} className="text-white/80" />
            </div>
            <p className="mt-4 font-display text-3xl font-bold tracking-tight text-white">
              {new Date(nextAppt.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </p>
            <p className="mt-1 text-sm font-semibold text-white/80">
              {new Date(nextAppt.startTime).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </p>
          </div>
          <div className="flex items-center gap-3 p-4">
            <span className="rounded-2xl bg-ink-950/[0.05] px-3 py-2 font-mono text-[10px] font-bold uppercase tracking-wider text-ink-600">
              {(nextAppt.type || 'visit').toString()}
            </span>
            {nextAppt.notes && <span className="truncate text-xs text-ink-500">{nextAppt.notes}</span>}
            <div className="ml-auto flex gap-2">
              {mapsUrl && (
                <a href={mapsUrl} target="_blank" rel="noreferrer" aria-label="Directions"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-ink-950/10 text-ink-600">
                  <MapPin size={16} />
                </a>
              )}
              {clinic.emergencyPhone && (
                <a href={`tel:${clinic.emergencyPhone}`} aria-label="Call the clinic"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-ink-950/10 text-ink-600">
                  <Phone size={16} />
                </a>
              )}
            </div>
          </div>
        </Surface>
      ) : (
        <Surface className="p-5">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-ink-950/[0.05] text-ink-400"><CalendarDays size={20} /></span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-ink-800">No upcoming appointment</p>
              <p className="text-xs text-ink-400">Regular visits keep treatment on track.</p>
            </div>
          </div>
          <Button accent={clinic.primaryColor} block className="mt-4" onClick={onOpenBooking}>Book a visit</Button>
        </Surface>
      )}

      {/* Today's care */}
      {activePlan ? (
        <Surface className="p-5">
          <div className="flex items-center justify-between">
            <div className="min-w-0">
              <SectionLabel>Today's care</SectionLabel>
              <p className="mt-1 truncate font-display text-base font-bold text-ink-900">{activePlan.treatmentName}</p>
            </div>
            {streak > 1 && (
              <Chip tone="sun" className="shrink-0"><Flame size={11} /> {streak} day{streak === 1 ? '' : 's'}</Chip>
            )}
          </div>

          <div className="mt-4 flex items-center gap-5">
            <ProgressRing value={pct} size={104} stroke={9} accent={clinic.primaryColor}>
              <span className="font-display text-xl font-bold tracking-tight text-ink-900">{done}<span className="text-ink-300">/{tasks.length}</span></span>
              <SectionLabel>done</SectionLabel>
            </ProgressRing>
            <div className="min-w-0 flex-1 space-y-1.5">
              {tasks.slice(0, 4).map((t) => (
                <button
                  key={t.id}
                  onClick={() => onToggleTask(t.id)}
                  className="flex w-full items-center gap-2.5 rounded-2xl border border-ink-950/[0.06] bg-cream-50 px-3 py-2 text-left transition-colors active:scale-[0.99]"
                >
                  <span className={cn('flex h-5 w-5 shrink-0 items-center justify-center rounded-md border', t.completed ? 'border-transparent text-white' : 'border-ink-950/20')}
                    style={t.completed ? { backgroundColor: clinic.primaryColor } : undefined}>
                    {t.completed && <Check size={12} />}
                  </span>
                  <span className={cn('truncate text-xs font-semibold', t.completed ? 'text-ink-300 line-through' : 'text-ink-700')}>{t.task}</span>
                </button>
              ))}
              {tasks.length === 0 && <p className="text-xs text-ink-400">No daily tasks. Your plan steps are in Care.</p>}
            </div>
          </div>

          <button onClick={onGoCare} className="mt-4 flex w-full items-center justify-center gap-1.5 text-xs font-bold uppercase tracking-wider text-ink-500">
            View full plan <ArrowRight size={13} />
          </button>
        </Surface>
      ) : (
        <Surface className="p-5">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-mist-soft text-mist-deep"><HeartPulse size={20} /></span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-ink-800">No active treatment</p>
              <p className="text-xs text-ink-400">Your aftercare plan appears here after a visit.</p>
            </div>
          </div>
        </Surface>
      )}

      {/* Messages preview */}
      {latest && (
        <Surface interactive className="p-4" onClick={onOpenMessages}>
          <div className="flex items-start gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-ink-950/[0.05] text-ink-500"><MessageCircle size={18} /></span>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <p className="truncate text-sm font-bold text-ink-800">{latest.title}</p>
                {unreadCount > 0 && <span className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: clinic.primaryColor }} />}
              </div>
              <p className="mt-0.5 line-clamp-2 text-xs text-ink-500">{latest.body}</p>
              <p className="mt-1 font-mono text-[10px] uppercase tracking-wider text-ink-300">{relTime(latest.createdAt)}</p>
            </div>
            <ChevronRight size={16} className="mt-1 shrink-0 text-ink-300" />
          </div>
        </Surface>
      )}

      {/* Points */}
      <Surface interactive className="p-5" onClick={onGoRewards}>
        <div className="flex items-center gap-4">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sun-soft text-sun-deep"><Sparkles size={22} /></span>
          <div className="flex-1">
            <SectionLabel>Smile Points</SectionLabel>
            <p className="font-display text-2xl font-bold tracking-tight text-ink-900">{points.toLocaleString('en-IN')}</p>
          </div>
          <span className="flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-ink-400">Redeem <ChevronRight size={14} /></span>
        </div>
      </Surface>

      {/* Quick actions */}
      <div className="grid grid-cols-2 gap-3">
        <Button variant="ghost" block onClick={onOpenBooking} className="!py-3.5"><CalendarDays size={16} /> Book visit</Button>
        <a href={clinic.emergencyPhone ? `tel:${clinic.emergencyPhone}` : undefined} className="contents">
          <Button variant="ghost" block className="!py-3.5"><Phone size={16} /> Call clinic</Button>
        </a>
      </div>
    </div>
  );
};

export default TodayScreen;
