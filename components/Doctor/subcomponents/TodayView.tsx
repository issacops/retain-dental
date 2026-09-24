import React, { useMemo } from 'react';
import {
  Plus, CalendarDays, CreditCard, Sparkles, QrCode, ArrowRight, Clock,
  HeartPulse, BellRing, Wallet as WalletIcon, Star, ChevronRight, CheckCircle2,
} from 'lucide-react';
import { IBackendService } from '../../../services/IBackendService';
import { User, Wallet, Transaction, FamilyGroup, Clinic, CarePlan, Appointment } from '../../../types';
import { TIER_THRESHOLDS } from '../../../types';
import { Card, Label, Stat, Pill, IconChip, SegmentBar, SectionHeader, Avatar, Empty, cn } from '../ui/primitives';

interface Props {
  clinic: Clinic;
  backendService: IBackendService;
  currentUser: User;
  allUsers: User[];
  wallets: Wallet[];
  transactions: Transaction[];
  familyGroups: FamilyGroup[];
  carePlans: CarePlan[];
  appointments: Appointment[];
  stats: any;
  onAddPatient: () => void;
  onGoTo: (section: string) => void;
  onSelectPatient: (u: User) => void;
  onOpenQR: () => void;
  onOpenSocial: () => void;
}

const greet = () => {
  const h = new Date().getHours();
  return h < 12 ? 'Good morning' : h < 18 ? 'Good afternoon' : 'Good evening';
};
const firstName = (n: string) => (n || 'Doctor').replace(/^Dr\.?\s*/i, '').split(' ')[0];
const money = (n: number) => `₹${(n || 0).toLocaleString('en-IN')}`;
const isSameDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

const TodayView: React.FC<Props> = ({
  clinic, backendService, currentUser, allUsers, wallets, transactions, familyGroups, carePlans, appointments, stats,
  onAddPatient, onGoTo, onSelectPatient, onOpenQR, onOpenSocial,
}) => {
  const [retention, setRetention] = React.useState<any>(null);
  React.useEffect(() => {
    let mounted = true;
    backendService.getRetentionMetrics(clinic.id).then((r) => { if (mounted) setRetention(r); });
    return () => { mounted = false; };
  }, [backendService, clinic.id]);
  const patients = useMemo(
    () => (allUsers || []).filter((u) => u.clinicId === clinic.id && u.role === 'PATIENT'),
    [allUsers, clinic.id],
  );

  const patientById = useMemo(
    () => new Map<string, User>(patients.map((p) => [p.id, p] as const)),
    [patients],
  );

  const today = new Date();
  const todaysAppts = useMemo(
    () =>
      (appointments || [])
        .filter((a) => a.clinicId === clinic.id && isSameDay(new Date(a.startTime), today))
        .sort((a, b) => +new Date(a.startTime) - +new Date(b.startTime)),
    [appointments, clinic.id],
  );
  const now = Date.now();
  const nextAppt = todaysAppts.find((a) => +new Date(a.endTime) >= now);

  /* ---------------- Needs you now: real, actionable signals ---------------- */
  const attention = useMemo(() => {
    const items: { id: string; tone: 'blush' | 'sun' | 'mist' | 'leaf'; icon: React.ReactNode; title: string; who: string; detail: string; cta: string; patient?: User; go?: string }[] = [];

    // Precompute wallet owner + last visit per patient (avoids O(patients x transactions x wallets))
    const walletOwner = new Map<string, string>(wallets.map((w) => [w.id, w.userId] as const));
    const lastVisitByPatient = new Map<string, number>();
    for (const t of transactions || []) {
      if (t.clinicId !== clinic.id) continue;
      const uid = walletOwner.get(t.walletId);
      if (!uid) continue;
      const at = +new Date(t.date);
      const prev = lastVisitByPatient.get(uid);
      if (prev === undefined || at > prev) lastVisitByPatient.set(uid, at);
    }

    // Aftercare falling behind
    (carePlans || [])
      .filter((cp) => cp.clinicId === clinic.id && cp.isActive && (cp.checklist?.length || 0) > 0)
      .forEach((cp) => {
        const done = cp.checklist!.filter((i) => i.completed).length;
        const pct = Math.round((done / cp.checklist!.length) * 100);
        const patient = patientById.get(cp.userId);
        if (pct < 60 && patient) {
          items.push({
            id: `care-${cp.id}`, tone: 'blush', icon: <HeartPulse size={16} />,
            title: 'Aftercare falling behind', who: patient.name,
            detail: `${cp.treatmentName} · ${pct}% complete`, cta: 'Follow up', patient,
          });
        }
      });

    // Recall overdue (no visit in 6+ months)
    const SIX_MONTHS = 1000 * 60 * 60 * 24 * 182;
    patients.forEach((p) => {
      const last = lastVisitByPatient.get(p.id) ?? 0;
      if (last && now - last > SIX_MONTHS) {
        items.push({
          id: `recall-${p.id}`, tone: 'sun', icon: <BellRing size={16} />,
          title: 'Recall overdue', who: p.name,
          detail: `Last visit ${Math.round((now - last) / (1000 * 60 * 60 * 24))} days ago`, cta: 'Send recall', patient: p,
        });
      }
    });

    // Unconfirmed appointments in the next 7 days
    const week = now + 1000 * 60 * 60 * 24 * 7;
    (appointments || [])
      .filter((a) => a.clinicId === clinic.id && a.status !== 'CONFIRMED' && +new Date(a.startTime) > now && +new Date(a.startTime) < week)
      .forEach((a) => {
        const p = patientById.get(a.patientId);
        items.push({
          id: `appt-${a.id}`, tone: 'mist', icon: <CalendarDays size={16} />,
          title: 'Appointment unconfirmed', who: p?.name || 'Patient',
          detail: new Date(a.startTime).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }) + ' · ' + new Date(a.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          cta: 'Confirm', go: 'Schedule',
        });
      });

    // Close to next tier
    patients.forEach((p) => {
      const next = p.currentTier === 'MEMBER' ? TIER_THRESHOLDS.GOLD : p.currentTier === 'GOLD' ? TIER_THRESHOLDS.PLATINUM : 0;
      if (next && p.lifetimeSpend >= next * 0.8 && p.lifetimeSpend < next) {
        items.push({
          id: `tier-${p.id}`, tone: 'leaf', icon: <Star size={16} />,
          title: `Close to ${p.currentTier === 'MEMBER' ? 'Gold' : 'Platinum'}`, who: p.name,
          detail: `${money(next - p.lifetimeSpend)} away`, cta: 'Nudge', patient: p,
        });
      }
    });

    return items.slice(0, 6);
  }, [carePlans, patients, patientById, transactions, wallets, appointments, clinic.id, now]);

  /* ---------------- Practice pulse ---------------- */
  const tierBars = useMemo(() => {
    const tiers: { key: string; label: string; tone: 'leaf' | 'sun' | 'mist' }[] = [
      { key: 'PLATINUM', label: 'Platinum', tone: 'leaf' },
      { key: 'GOLD', label: 'Gold', tone: 'sun' },
      { key: 'MEMBER', label: 'Member', tone: 'mist' },
    ];
    const total = patients.length || 1;
    const counts = new Map<string, number>();
    for (const p of patients) counts.set(p.currentTier, (counts.get(p.currentTier) || 0) + 1);
    return tiers.map((t) => {
      const count = counts.get(t.key) || 0;
      return { ...t, count, pct: count / total };
    });
  }, [patients]);

  const revenueToday = useMemo(() => {
    return (transactions || [])
      .filter((t) => t.clinicId === clinic.id && isSameDay(new Date(t.date), today))
      .reduce((s, t) => s + (t.amountPaid || 0), 0);
  }, [transactions, clinic.id, today]);

  /* ---------------- Mini calendar ---------------- */
  const calendar = useMemo(() => {
    const y = today.getFullYear(), m = today.getMonth();
    const first = new Date(y, m, 1);
    const days = new Date(y, m + 1, 0).getDate();
    const lead = (first.getDay() + 6) % 7; // Monday-first
    const cells: (number | null)[] = [...Array(lead).fill(null), ...Array.from({ length: days }, (_, i) => i + 1)];
    const apptDays = new Set(
      (appointments || [])
        .filter((a) => a.clinicId === clinic.id && new Date(a.startTime).getMonth() === m && new Date(a.startTime).getFullYear() === y)
        .map((a) => new Date(a.startTime).getDate()),
    );
    return { cells, apptDays, monthLabel: today.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) };
  }, [appointments, clinic.id, today]);

  const nextTime = nextAppt ? new Date(nextAppt.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : null;

  return (
    <div className="space-y-6">
      {/* Greeting */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-[clamp(1.75rem,3vw,2.5rem)] font-bold tracking-tight text-ink-900">
            {greet()}, Dr. {firstName(currentUser.name)}
          </h1>
          <p className="mt-2 text-sm font-medium text-ink-500">
            {todaysAppts.length} patient{todaysAppts.length === 1 ? '' : 's'} today
            {nextTime ? ` · next at ${nextTime}` : ''}
            {attention.length ? ` · ${attention.length} need${attention.length === 1 ? 's' : ''} you` : ''}.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button onClick={() => onGoTo('Schedule')} className="inline-flex items-center gap-2 rounded-full border border-ink-950/10 bg-white px-4 py-2.5 text-xs font-bold uppercase tracking-[0.08em] text-ink-800 hover:bg-cream-50 transition-colors">
            <CalendarDays size={14} /> Schedule
          </button>
          <button onClick={onOpenQR} className="inline-flex items-center gap-2 rounded-full border border-ink-950/10 bg-white px-4 py-2.5 text-xs font-bold uppercase tracking-[0.08em] text-ink-800 hover:bg-cream-50 transition-colors">
            <QrCode size={14} /> Patient app
          </button>
        </div>
      </div>

      {/* Stat row */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card tone="sun">
          <Label>Today</Label>
          <div className="mt-2 flex items-end justify-between">
            <Stat value={todaysAppts.length} label="" size="lg" />
            <IconChip tone="white" size="sm"><CalendarDays size={15} /></IconChip>
          </div>
          <p className="mt-2 text-xs font-semibold text-sun-deep">
            {nextTime ? `Next appointment ${nextTime}` : 'No appointments booked'}
          </p>
        </Card>

        <Card tone="blush">
          <Label>Needs you now</Label>
          <div className="mt-2 flex items-end justify-between">
            <Stat value={attention.length} label="" size="lg" />
            <IconChip tone="white" size="sm"><BellRing size={15} /></IconChip>
          </div>
          <p className="mt-2 text-xs font-semibold text-blush-deep">
            {attention.length ? 'Follow-ups waiting below' : 'Nothing waiting'}
          </p>
        </Card>

        <Card tone="leaf">
          <Label>Retention</Label>
          <div className="mt-2 flex items-end justify-between">
            <Stat value={`${retention?.retentionRate ?? stats?.retentionRate ?? 0}%`} label="" size="lg" />
            <IconChip tone="white" size="sm"><HeartPulse size={15} /></IconChip>
          </div>
          <p className="mt-2 text-xs font-semibold text-leaf-deep">Points engagement {retention?.pointsParticipation ?? 0}%</p>
        </Card>

        <Card tone="mist">
          <Label>Collected today</Label>
          <div className="mt-2 flex items-end justify-between">
            <Stat value={money(revenueToday)} label="" size="lg" />
            <IconChip tone="white" size="sm"><WalletIcon size={15} /></IconChip>
          </div>
          <p className="mt-2 text-xs font-semibold text-mist-deep">Lifetime value {money(retention?.ltv || 0)}</p>
        </Card>
      </div>

      {/* Main grid */}
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-6 min-w-0">
          {/* Needs you now */}
          <Card tone="white" padded={false} className="overflow-hidden">
            <div className="flex items-center justify-between p-5">
              <SectionHeader eyebrow="Decision queue" title="Needs you now" />
              {attention.length > 0 && <Pill tone="blush">{attention.length} open</Pill>}
            </div>
            <div className="border-t border-ink-950/5">
              {attention.length === 0 ? (
                <Empty title="Nothing needs you right now" hint="Aftercare, recalls and confirmations are all on track." icon={<CheckCircle2 size={22} />} />
              ) : (
                attention.map((a) => (
                  <button
                    key={a.id}
                    onClick={() => (a.patient ? onSelectPatient(a.patient) : a.go && onGoTo(a.go))}
                    className="group flex w-full items-center gap-4 border-b border-ink-950/5 px-5 py-3.5 text-left transition-colors last:border-b-0 hover:bg-cream-50"
                  >
                    <IconChip tone={a.tone}>{a.icon}</IconChip>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-ink-900">{a.title} · <span className="text-ink-600">{a.who}</span></p>
                      <p className="truncate text-xs text-ink-500">{a.detail}</p>
                    </div>
                    <span className="hidden shrink-0 items-center gap-1 text-[11px] font-bold uppercase tracking-[0.08em] text-ink-500 group-hover:text-ink-900 sm:inline-flex">
                      {a.cta} <ArrowRight size={12} />
                    </span>
                  </button>
                ))
              )}
            </div>
          </Card>

          {/* Today's patients */}
          <Card tone="white" padded={false} className="overflow-hidden">
            <div className="flex items-center justify-between p-5">
              <SectionHeader eyebrow="Schedule" title="Today's patients" />
              <button onClick={() => onGoTo('Schedule')} className="text-[11px] font-bold uppercase tracking-[0.08em] text-ink-500 hover:text-ink-900">View all</button>
            </div>
            <div className="border-t border-ink-950/5">
              {todaysAppts.length === 0 ? (
                <Empty title="No appointments today" hint="Book a visit or add a walk-in patient." icon={<CalendarDays size={22} />} />
              ) : (
                todaysAppts.map((a) => {
                  const p = patientById.get(a.patientId);
                  const inChair = now >= +new Date(a.startTime) && now <= +new Date(a.endTime);
                  const done = a.status === 'COMPLETED';
                  return (
                    <button
                      key={a.id}
                      onClick={() => p && onSelectPatient(p)}
                      className={cn('flex w-full items-center gap-4 border-b border-ink-950/5 px-5 py-3.5 text-left transition-colors last:border-b-0 hover:bg-cream-50', inChair && 'bg-blush-soft/60')}
                    >
                      <span className="w-14 shrink-0 font-mono text-xs font-bold text-ink-600">
                        {new Date(a.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      <Avatar name={p?.name || '?'} tone={inChair ? 'blush' : 'neutral'} />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-ink-900">{p?.name || 'Unknown patient'}</p>
                        <p className="truncate text-xs text-ink-500">{a.type}{a.notes ? ` · ${a.notes}` : ''}</p>
                      </div>
                      {inChair ? <Pill tone="blush">In chair</Pill>
                        : done ? <Pill tone="leaf">Done</Pill>
                        : a.status === 'CONFIRMED' ? <Pill tone="neutral">Confirmed</Pill>
                        : <Pill tone="sun">Awaiting</Pill>}
                      <ChevronRight size={14} className="shrink-0 text-ink-300" />
                    </button>
                  );
                })
              )}
            </div>
          </Card>

          {/* Practice pulse */}
          <div className="grid gap-4 sm:grid-cols-2">
            <Card tone="white">
              <SectionHeader eyebrow="Growth" title="Practice pulse" />
              <div className="mt-5 grid grid-cols-2 gap-4">
                <Stat label="Total revenue" value={money(stats?.totalRevenue || 0)} size="sm" />
                <Stat label="Active patients" value={stats?.totalPatients || patients.length} size="sm" />
                <Stat label="Redemption" value={`${stats?.redemptionRate ?? 0}%`} size="sm" />
                <Stat label="Chair time" value={`${stats?.activeChairTime || 0}h`} size="sm" />
              </div>
            </Card>
            <Card tone="white">
              <SectionHeader eyebrow="Loyalty" title="Tier distribution" />
              <div className="mt-5 space-y-4">
                {tierBars.map((t) => (
                  <div key={t.key}>
                    <div className="mb-1.5 flex items-center justify-between">
                      <span className="text-xs font-semibold text-ink-700">{t.label}</span>
                      <span className="font-mono text-xs text-ink-500">{t.count}</span>
                    </div>
                    <SegmentBar value={t.pct} tone={t.tone} />
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>

        {/* Right rail */}
        <div className="space-y-6">
          <Card tone="white">
            <div className="flex items-center justify-between">
              <Label>{calendar.monthLabel}</Label>
              <div className="flex gap-1">
                <span className="h-5 w-5 rounded-full border border-ink-950/10" />
                <span className="h-5 w-5 rounded-full border border-ink-950/10" />
              </div>
            </div>
            <div className="mt-4 grid grid-cols-7 gap-1 text-center">
              {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
                <span key={i} className="font-mono text-[10px] font-bold text-ink-400">{d}</span>
              ))}
              {calendar.cells.map((day, i) => {
                const isToday = day === today.getDate();
                const has = day && calendar.apptDays.has(day);
                return (
                  <span
                    key={i}
                    className={cn(
                      'relative mx-auto flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold',
                      !day && 'opacity-0',
                      isToday ? 'bg-ink-950 text-cream-50' : 'text-ink-700',
                    )}
                  >
                    {day}
                    {has && !isToday && <span className="absolute bottom-0.5 h-1 w-1 rounded-full bg-primary" />}
                  </span>
                );
              })}
            </div>
          </Card>

          <Card tone="white" padded={false} className="overflow-hidden">
            <div className="p-5"><SectionHeader eyebrow="Timeline" title="Your day" /></div>
            <div className="border-t border-ink-950/5">
              {todaysAppts.length === 0 ? (
                <Empty title="Open day" hint="Nothing on the schedule." icon={<Clock size={20} />} />
              ) : (
                <ol className="relative p-5">
                  <span className="absolute left-[26px] top-6 bottom-6 w-px bg-ink-950/10" />
                  {todaysAppts.map((a) => {
                    const p = patientById.get(a.patientId);
                    const inChair = now >= +new Date(a.startTime) && now <= +new Date(a.endTime);
                    return (
                      <li key={a.id} className="relative flex gap-3 py-2.5 pl-1">
                        <span className={cn('z-10 mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2', inChair ? 'border-blush-deep bg-blush' : 'border-ink-950/15 bg-white')} />
                        <div className="min-w-0">
                          <p className="font-mono text-[11px] font-bold text-ink-500">{new Date(a.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                          <p className="truncate text-sm font-semibold text-ink-900">{p?.name || 'Patient'}</p>
                          <p className="truncate text-xs text-ink-500">{a.type}</p>
                        </div>
                      </li>
                    );
                  })}
                </ol>
              )}
            </div>
          </Card>

          <Card tone="dark">
            <div className="flex items-center gap-2">
              <Sparkles size={15} className="text-sun" />
              <Label onDark>Marketing</Label>
            </div>
            <p className="mt-3 text-sm font-semibold text-cream-50">Turn this week's treatments into posts.</p>
            <p className="mt-1 text-xs text-cream-50/60">Branded content, ready in seconds.</p>
            <button onClick={onOpenSocial} className="mt-4 w-full rounded-full bg-blush px-4 py-2.5 text-xs font-bold uppercase tracking-[0.08em] text-ink-950 hover:bg-blush-soft transition-colors">
              Open social studio
            </button>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TodayView;
