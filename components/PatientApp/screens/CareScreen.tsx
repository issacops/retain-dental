import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Check, Flame, ClipboardList, History, CalendarDays, BookOpen, HeartPulse, Sparkles } from 'lucide-react';
import { Clinic, CarePlan } from '../../../types';
import { cn } from '../../Doctor/ui/primitives';
import { Surface, Well, GradientCard, SectionLabel, Display, Button, Chip, ProgressRing, StatCard, EmptyState, stagger, rise, Noise } from '../ui';

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

const CareScreen: React.FC<Props> = ({ clinic, activePlan, pastPlans, onToggleTask, onBooking }) => {
  const reduce = !!useReducedMotion();
  const tasks = activePlan?.checklist || [];
  const done = tasks.filter((t) => t.completed).length;
  const pct = tasks.length ? done / tasks.length : 0;
  const streak = streakFrom(activePlan?.adherenceRecord);

  return (
    <motion.div variants={stagger(0.06)} initial={reduce ? false : 'hidden'} animate="show" className="space-y-4">
      <motion.div variants={rise} className="px-1 pb-1">
        <Display as="h1" className="text-[1.75rem] leading-tight">Your care</Display>
        <p className="mt-1 text-sm font-medium text-ink-500">
          {activePlan ? 'Follow your plan and tick off each day.' : 'Your treatment plan will appear here after a visit.'}
        </p>
      </motion.div>

      {activePlan ? (
        <>
          {/* Plan hero */}
          <motion.div variants={rise}>
            <GradientCard accent={clinic.primaryColor} className="p-5">
              <div className="flex items-center justify-between">
                <Chip tone="glass">Active plan</Chip>
                <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-white/20 text-white ring-1 ring-inset ring-white/25"><HeartPulse size={16} /></span>
              </div>
              <div className="mt-4 flex items-center gap-5">
                <ProgressRing value={pct} size={100} stroke={9} accent="#FFFFFF" track="rgba(255,255,255,0.25)" glow>
                  <span className="font-display text-xl font-bold tracking-tight text-white">{Math.round(pct * 100)}%</span>
                  <span className="font-mono text-[9px] uppercase tracking-widest text-white/70">today</span>
                </ProgressRing>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-display text-lg font-bold tracking-tight text-white">{activePlan.treatmentName}</p>
                  <p className="mt-1 text-xs text-white/70">Started {new Date(activePlan.assignedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Chip tone="glass">{done} of {tasks.length} done</Chip>
                    {streak > 0 && <Chip tone="glass"><Flame size={11} /> {streak}-day</Chip>}
                  </div>
                </div>
              </div>
            </GradientCard>
          </motion.div>

          {/* Stat tiles */}
          <motion.div variants={rise} className="grid grid-cols-3 gap-3">
            <StatCard icon={<Sparkles size={15} />} value={`${Math.round(pct * 100)}%`} label="Today" accent={clinic.primaryColor} className="!p-3.5" />
            <StatCard icon={<Flame size={15} />} value={streak} label="Day streak" accent="#F59E0B" className="!p-3.5" />
            <StatCard icon={<ClipboardList size={15} />} value={tasks.length - done} label="Tasks left" accent="#EC4899" className="!p-3.5" />
          </motion.div>

          {/* Routine */}
          <motion.div variants={rise}>
            <Surface tone="white" className="p-5">
              <div className="flex items-center gap-2"><ClipboardList size={16} className="text-ink-400" /><SectionLabel>Daily routine</SectionLabel></div>
              <Well className="mt-3">
                <div className="space-y-2">
                  {tasks.length === 0 && <p className="text-sm text-ink-400">No daily tasks — follow the steps below.</p>}
                  {tasks.map((t) => (
                    <button key={t.id} onClick={() => onToggleTask(t.id)}
                      className={cn('flex w-full items-center gap-3 rounded-2xl border px-3.5 py-3 text-left transition-all duration-200 active:scale-[0.98]',
                        t.completed ? 'border-leaf/40 bg-leaf-soft/70' : 'border-ink-950/[0.05] bg-white')}>
                      <span className={cn('flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border', t.completed ? 'border-transparent text-white' : 'border-ink-950/20')}
                        style={t.completed ? { backgroundImage: `linear-gradient(140deg, ${clinic.primaryColor}, ${clinic.primaryColor}cc)` } : undefined}>
                        {t.completed && <Check size={14} />}
                      </span>
                      <span className={cn('text-sm font-semibold', t.completed ? 'text-ink-400 line-through' : 'text-ink-800')}>{t.task}</span>
                    </button>
                  ))}
                </div>
              </Well>
            </Surface>
          </motion.div>

          {/* Instructions */}
          {activePlan.instructions?.length > 0 && (
            <motion.div variants={rise}>
              <Surface tone="white" className="p-5">
                <div className="flex items-center gap-2"><BookOpen size={16} className="text-ink-400" /><SectionLabel>What to do</SectionLabel></div>
                <ul className="mt-4 space-y-3">
                  {activePlan.instructions.map((step, i) => (
                    <li key={i} className="flex gap-3">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-ink-950/[0.05] font-mono text-[10px] font-bold text-ink-500">{i + 1}</span>
                      <span className="text-sm leading-relaxed text-ink-700">{step}</span>
                    </li>
                  ))}
                </ul>
              </Surface>
            </motion.div>
          )}
        </>
      ) : (
        <motion.div variants={rise}>
          <Surface tone="white" className="p-2">
            <EmptyState icon={<ClipboardList size={24} />} title="No active treatment"
              hint="After a visit, your aftercare plan and daily routine will appear here."
              action={<Button accent={clinic.primaryColor} onClick={onBooking}><CalendarDays size={16} /> Book a visit</Button>} />
          </Surface>
        </motion.div>
      )}

      {pastPlans.length > 0 && (
        <motion.div variants={rise}>
          <Surface tone="white" className="p-5">
            <div className="flex items-center gap-2"><History size={16} className="text-ink-400" /><SectionLabel>Past treatments</SectionLabel></div>
            <Well className="mt-3 !p-2">
              <div className="divide-y divide-ink-950/[0.06]">
                {pastPlans.map((cp) => (
                  <div key={cp.id} className="flex items-center justify-between px-2.5 py-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold text-ink-800">{cp.treatmentName}</p>
                      <p className="text-xs text-ink-400">{new Date(cp.assignedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                    </div>
                    <Chip tone={cp.status === 'COMPLETED' ? 'leaf' : 'neutral'}>{cp.status === 'COMPLETED' ? 'Completed' : 'Ended'}</Chip>
                  </div>
                ))}
              </div>
            </Well>
          </Surface>
        </motion.div>
      )}
    </motion.div>
  );
};

export default CareScreen;
