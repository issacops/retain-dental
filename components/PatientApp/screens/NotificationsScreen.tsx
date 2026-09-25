import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import {
  ArrowLeft, CalendarDays, BellRing, HeartPulse, CreditCard, Sparkles, Users,
  PartyPopper, CheckCheck, Bell,
} from 'lucide-react';
import { PatientNotification, NotificationCategory } from '../../../types';
import { cn } from '../../Doctor/ui/primitives';
import { Aurora, SectionLabel, PillTabs, EmptyState, relTime } from '../ui';
import { haptic } from '../../../lib/haptics';

interface Props {
  open: boolean;
  onClose: () => void;
  accent: string;
  notifications: PatientNotification[] | null;
  onRead: (id: string) => void;
  onReadAll: () => void;
}

type Filter = 'ALL' | 'REMINDERS' | 'GREETINGS' | 'OFFERS';

const META: Record<NotificationCategory, { icon: React.ElementType; tint: string }> = {
  Appointment: { icon: CalendarDays, tint: 'bg-sun-soft text-sun-deep' },
  Recall: { icon: BellRing, tint: 'bg-blush-soft text-blush-deep' },
  Clinical: { icon: HeartPulse, tint: 'bg-mist-soft text-mist-deep' },
  Financial: { icon: CreditCard, tint: 'bg-leaf-soft text-leaf-deep' },
  Loyalty: { icon: Sparkles, tint: 'bg-leaf-soft text-leaf-deep' },
  Retention: { icon: Users, tint: 'bg-ink-950/[0.06] text-ink-500' },
  Greeting: { icon: PartyPopper, tint: 'bg-blush-soft text-blush-deep' },
};

const FILTERS: Record<Filter, NotificationCategory[] | null> = {
  ALL: null,
  REMINDERS: ['Appointment', 'Recall', 'Clinical'],
  GREETINGS: ['Greeting'],
  OFFERS: ['Loyalty', 'Financial', 'Retention'],
};

const NotificationsScreen: React.FC<Props> = ({ open, onClose, accent, notifications, onRead, onReadAll }) => {
  const reduce = !!useReducedMotion();
  const [filter, setFilter] = useState<Filter>('ALL');

  const list = useMemo(() => {
    const cats = FILTERS[filter];
    const all = notifications || [];
    return cats ? all.filter((n) => cats.includes(n.category)) : all;
  }, [notifications, filter]);

  const unread = (notifications || []).filter((n) => n.status !== 'READ').length;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[90] font-sans"
          initial={reduce ? { opacity: 0 } : { x: '100%' }}
          animate={reduce ? { opacity: 1 } : { x: 0 }}
          exit={reduce ? { opacity: 0 } : { x: '100%' }}
          transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        >
          <Aurora accent={accent} />

          <header className="sticky top-0 z-10 border-b border-white/40 bg-cream-50/70 backdrop-blur-xl">
            <div className="mx-auto flex max-w-md items-center gap-3 px-5 py-3">
              <button onClick={() => { haptic('light'); onClose(); }} aria-label="Back"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/60 bg-white/60 text-ink-600 backdrop-blur-md">
                <ArrowLeft size={17} />
              </button>
              <div className="min-w-0 flex-1">
                <SectionLabel>Inbox</SectionLabel>
                <p className="font-display text-base font-bold leading-tight text-ink-900">Notifications</p>
              </div>
              {unread > 0 && (
                <button onClick={() => { haptic('success'); onReadAll(); }}
                  className="flex items-center gap-1.5 rounded-full border border-white/60 bg-white/60 px-3 py-2 text-[11px] font-bold text-ink-600 backdrop-blur-md">
                  <CheckCheck size={13} /> Read all
                </button>
              )}
            </div>
          </header>

          <main className="mx-auto max-w-md px-5 pb-12 pt-4">
            <PillTabs
              accent={accent}
              value={filter}
              onChange={(v) => { haptic('selection'); setFilter(v); }}
              tabs={[
                { key: 'ALL', label: 'All' },
                { key: 'REMINDERS', label: 'Reminders' },
                { key: 'GREETINGS', label: 'Greetings' },
                { key: 'OFFERS', label: 'Offers' },
              ]}
            />

            <div className="mt-4 space-y-2">
              {notifications === null ? (
                <p className="py-12 text-center text-sm text-ink-400">Loading…</p>
              ) : list.length === 0 ? (
                <div className="rounded-[30px] border border-white/60 bg-white/55 backdrop-blur-xl">
                  <EmptyState icon={<Bell size={22} />} title="Nothing here yet"
                    hint={filter === 'ALL' ? 'Reminders, greetings and offers from your clinic will appear here.' : 'No notifications in this category.'} />
                </div>
              ) : (
                list.map((n) => {
                  const meta = META[n.category] || META.Appointment;
                  const Icon = meta.icon;
                  const unreadItem = n.status !== 'READ';
                  return (
                    <button key={n.id} onClick={() => onRead(n.id)}
                      className={cn('flex w-full items-start gap-3 rounded-[26px] border p-3.5 text-left transition-transform active:scale-[0.99]',
                        unreadItem ? 'border-white/60 bg-white/70 shadow-[0_8px_24px_-16px_rgba(16,24,40,0.35)] backdrop-blur-xl' : 'border-white/40 bg-white/40 backdrop-blur-md')}>
                      <span className={cn('flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl', meta.tint)}>
                        <Icon size={18} />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="flex items-center gap-2">
                          <span className="truncate text-sm font-bold text-ink-800">{n.title}</span>
                          {unreadItem && <span className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: accent }} />}
                        </span>
                        <span className="mt-1 block whitespace-pre-wrap text-xs leading-relaxed text-ink-500">{n.body}</span>
                        <span className="mt-1.5 block font-mono text-[10px] uppercase tracking-wider text-ink-300">
                          {n.category} · {relTime(n.createdAt)}
                        </span>
                      </span>
                    </button>
                  );
                })
              )}
            </div>
          </main>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default NotificationsScreen;
