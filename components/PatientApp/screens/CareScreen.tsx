import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Check, Flame, ClipboardList, History, CalendarDays, BookOpen } from 'lucide-react';
import { Clinic, CarePlan } from '../../../types';
import { cn } from '../../Doctor/ui/primitives';
import { GradientCard, Glass, SectionLabel, Display, Button, Chip, ProgressRing, EmptyState, BigNumber } from '../ui';

interface Props {
  clinic: Clinic;
  activePlan?: CarePlan;
  pastPlans: CarePlan[];
  onToggleTask: (itemId: string) => void;
  onBooking: () => void;
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

const CareScreen: React.FC<Props> = ({ clinic, activePlan, pastPlans, onToggleTask, onBooking }) => {
  const reduce = !!useReducedMotion();
  const tasks = activePlan?.checklist || [];
  const done = tasks.filter((t) => t.completed).length;
  const pct = tasks.length ? done / tasks.length : 0;
  const streak = streakFrom(activePlan?.adherenceRecord);

  return (
    <div className="space-y-5">
      <motion.div {...fade(0, reduce)} className="px-1">
        <SectionLabel>Treatment</SectionLabel>
        <Display as="h1" className="mt-1 text-3xl">Your care</Display>
      </motion.div>

      {activePlan ? (
        <>
          <motion.div {...fade(1, reduce)}>
            <GradientCard accent={clinic.primaryColor} className="p-5">
              <div className="flex items-center justify-between">
                <div className="min-w-0">
                  <Chip tone="glass">Active plan</Chip>
                  <p className="mt-3 truncate font-display text-xl font-bold tracking-tight text-white">{activePlan.treatmentName}</p>
                  <p className="mt-1 text-xs text-white/70">
                    Started {new Date(activePlan.assignedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
                  </p>
                </div>
                <ProgressRing value={pct} size={104} stroke={9} accent="#FFFFFF" track="rgba(255,255,255,0.25)">
                  <span className="font-display text-xl font-bold tracking-tight text-white">{Math.round(pct * 100)}%</span>
                  <span className="font-mono text-[9px] uppercase tracking-widest text-white/70">today</span>
                </ProgressRing>
              </div>
              <div className="mt-5 flex items-center gap-3">
                <Chip tone="glass">{done} of {tasks.length} done</Chip>
                {streak > 0 && <Chip tone="glass"><Flame size={11} /> {streak} day streak</Chip>}
              </div>
            </GradientCard>
          </motion.div>

          <motion.div {...fade(2, reduce)}>
            <Glass className="p-5">
              <div className="flex items-center gap-2"><ClipboardList size={16} className="text-ink-400" /><SectionLabel>Daily routine</SectionLabel></div>
              <div className="mt-3 space-y-2">
                {tasks.length === 0 && <p className="text-sm text-ink-400">No daily tasks — follow the steps below.</p>}
                {tasks.map((t) => (
                  <button key={t.id} onClick={() => onToggleTask(t.id)}
                    className={cn('flex w-full items-center gap-3 rounded-2xl border px-3.5 py-3 text-left transition-transform active:scale-[0.99]',
                      t.completed ? 'border-leaf/40 bg-leaf-soft' : 'border-white/50 bg-white/50')}>
                    <span className={cn('flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border', t.completed ? 'border-transparent text-white' : 'border-ink-950/20')}
                      style={t.completed ? { backgroundColor: clinic.primaryColor } : undefined}>
                      {t.completed && <Check size={14} />}
                    </span>
                    <span className={cn('text-sm font-semibold', t.completed ? 'text-ink-400 line-through' : 'text-ink-800')}>{t.task}</span>
                  </button>
                ))}
              </div>
            </Glass>
          </motion.div>

          {activePlan.instructions?.length > 0 && (
            <motion.div {...fade(3, reduce)}>
              <Glass className="p-5">
                <div className="flex items-center gap-2"><BookOpen size={16} className="text-ink-400" /><SectionLabel>What to do</SectionLabel></div>
                <ul className="mt-4 space-y-3">
                  {activePlan.instructions.map((step, i) => (
                    <li key={i} className="flex gap-3">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/70 font-mono text-[10px] font-bold text-ink-500">{i + 1}</span>
                      <span className="text-sm leading-relaxed text-ink-700">{step}</span>
                    </li>
                  ))}
                </ul>
              </Glass>
            </motion.div>
          )}
        </>
      ) : (
        <motion.div {...fade(1, reduce)}>
          <Glass className="p-2">
            <EmptyState
              icon={<ClipboardList size={24} />}
              title="No active treatment"
              hint="After a visit, your aftercare plan and daily routine will appear here."
              action={<Button accent={clinic.primaryColor} onClick={onBooking}><CalendarDays size={16} /> Book a visit</Button>}
            />
          </Glass>
        </motion.div>
      )}

      {pastPlans.length > 0 && (
        <motion.div {...fade(4, reduce)}>
          <Glass className="p-5">
            <div className="flex items-center gap-2"><History size={16} className="text-ink-400" /><SectionLabel>Past treatments</SectionLabel></div>
            <div className="mt-3 divide-y divide-ink-950/[0.06]">
              {pastPlans.map((cp) => (
                <div key={cp.id} className="flex items-center justify-between py-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold text-ink-800">{cp.treatmentName}</p>
                    <p className="text-xs text-ink-400">{new Date(cp.assignedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                  </div>
                  <Chip tone={cp.status === 'COMPLETED' ? 'leaf' : 'neutral'}>{cp.status === 'COMPLETED' ? 'Completed' : 'Ended'}</Chip>
                </div>
              ))}
            </div>
          </Glass>
        </motion.div>
      )}
    </div>
  );
};

export default CareScreen;
