import React from 'react';
import { Check, Flame, ClipboardList, History, CalendarDays, BookOpen } from 'lucide-react';
import { Clinic, CarePlan } from '../../../types';
import { cn } from '../../Doctor/ui/primitives';
import { Surface, SectionLabel, Display, Button, Chip, ProgressRing, EmptyState } from '../ui';

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
  const tasks = activePlan?.checklist || [];
  const done = tasks.filter((t) => t.completed).length;
  const pct = tasks.length ? done / tasks.length : 0;
  const streak = streakFrom(activePlan?.adherenceRecord);

  return (
    <div className="space-y-5">
      <div>
        <Display as="h1">Care</Display>
        <p className="mt-1 text-sm text-ink-500">Your treatment, aftercare and history in one place.</p>
      </div>

      {activePlan ? (
        <>
          <Surface className="p-5">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <SectionLabel>Active treatment</SectionLabel>
                <p className="mt-1 font-display text-lg font-bold tracking-tight text-ink-900">{activePlan.treatmentName}</p>
                <p className="mt-1 text-xs text-ink-400">
                  Started {new Date(activePlan.assignedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
                </p>
              </div>
              <Chip tone="leaf">Active</Chip>
            </div>

            <div className="mt-5 flex items-center gap-5">
              <ProgressRing value={pct} size={116} stroke={10} accent={clinic.primaryColor}>
                <span className="font-display text-2xl font-bold tracking-tight text-ink-900">{Math.round(pct * 100)}%</span>
                <SectionLabel>today</SectionLabel>
              </ProgressRing>
              <div className="flex-1 space-y-3">
                <div>
                  <SectionLabel>You have completed</SectionLabel>
                  <p className="font-display text-base font-bold text-ink-900">{done} of {tasks.length} today</p>
                </div>
                {streak > 0 && (
                  <Chip tone="sun"><Flame size={11} /> {streak} day streak</Chip>
                )}
              </div>
            </div>
          </Surface>

          <Surface className="p-5">
            <div className="flex items-center gap-2">
              <ClipboardList size={16} className="text-ink-400" />
              <SectionLabel>Daily routine</SectionLabel>
            </div>
            <div className="mt-3 space-y-2">
              {tasks.length === 0 && <p className="text-sm text-ink-400">No daily tasks — follow the steps below.</p>}
              {tasks.map((t) => (
                <button key={t.id} onClick={() => onToggleTask(t.id)}
                  className={cn('flex w-full items-center gap-3 rounded-2xl border px-3.5 py-3 text-left transition-colors active:scale-[0.99]',
                    t.completed ? 'border-leaf/40 bg-leaf-soft' : 'border-ink-950/[0.07] bg-cream-50')}>
                  <span className={cn('flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border', t.completed ? 'border-transparent text-white' : 'border-ink-950/20')}
                    style={t.completed ? { backgroundColor: clinic.primaryColor } : undefined}>
                    {t.completed && <Check size={14} />}
                  </span>
                  <span className={cn('text-sm font-semibold', t.completed ? 'text-ink-400 line-through' : 'text-ink-800')}>{t.task}</span>
                </button>
              ))}
            </div>
          </Surface>

          {activePlan.instructions?.length > 0 && (
            <Surface tone="white" className="p-5">
              <div className="flex items-center gap-2">
                <BookOpen size={16} className="text-ink-400" />
                <SectionLabel>What to do</SectionLabel>
              </div>
              <ul className="mt-4 space-y-3">
                {activePlan.instructions.map((step, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-ink-950/[0.05] font-mono text-[10px] font-bold text-ink-500">{i + 1}</span>
                    <span className="text-sm leading-relaxed text-ink-700">{step}</span>
                  </li>
                ))}
              </ul>
            </Surface>
          )}
        </>
      ) : (
        <Surface className="p-2">
          <EmptyState
            icon={<ClipboardList size={24} />}
            title="No active treatment"
            hint="After a visit, your aftercare plan and daily routine will appear here."
            action={<Button accent={clinic.primaryColor} onClick={onBooking}><CalendarDays size={16} /> Book a visit</Button>}
          />
        </Surface>
      )}

      {pastPlans.length > 0 && (
        <Surface className="p-5">
          <div className="flex items-center gap-2">
            <History size={16} className="text-ink-400" />
            <SectionLabel>Past treatments</SectionLabel>
          </div>
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
        </Surface>
      )}
    </div>
  );
};

export default CareScreen;
