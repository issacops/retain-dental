import React, { useMemo, useState } from 'react';
import {
  Activity, AlertTriangle, Printer, CalendarPlus, Trash2, Users, HeartPulse,
  ClipboardCheck, FileImage, FileSignature, ChevronRight, Sparkles, Clock,
  TrendingUp, Wallet as WalletIcon, Check, Stethoscope, ArrowLeft, Pill as PillIcon,
} from 'lucide-react';
import { User, Wallet, Transaction, CarePlan, Clinic, FamilyGroup, Appointment, TransactionCategory, TransactionType } from '../../../types';
import { TIER_THRESHOLDS } from '../../../types';
import { IBackendService } from '../../../services/IBackendService';
import DoctorTreatmentDetail from './DoctorTreatmentDetail';
import ClinicalTab from './profile_tabs/ClinicalTab';
import { Card, Label, Stat, Pill, Avatar, SegmentBar, SectionHeader, Empty, cn } from '../ui/primitives';

interface Props {
  selectedPatient: User;
  clinic: Clinic;
  wallets: Wallet[];
  carePlans: CarePlan[];
  transactions: Transaction[];
  allUsers: User[];
  familyGroups: FamilyGroup[];
  appointments?: Appointment[];
  backendService: IBackendService;
  onBack: () => void;
  onProcessTransaction: (patientId: string, amount: number, category: TransactionCategory, type: TransactionType, carePlanTemplate?: any) => any;
  onAssignPlan: (clinicId: string, patientId: string, template: any) => Promise<any>;
  onTerminateCarePlan?: (carePlanId: string) => Promise<any>;
  onToggleChecklistItem: (carePlanId: string, itemId: string) => Promise<any>;
  onUpdateCarePlan: (carePlanId: string, updates: Partial<CarePlan>) => Promise<any>;
  onDeletePatient: (patientId: string) => Promise<any>;
  onRefreshData?: () => void;
  onBookReview?: () => void;
}

const TIER_TONE: Record<string, 'leaf' | 'sun' | 'mist'> = { PLATINUM: 'leaf', GOLD: 'sun', MEMBER: 'mist' };
const money = (n: number) => `₹${(n || 0).toLocaleString('en-IN')}`;
const day = 1000 * 60 * 60 * 24;

const PatientProfile: React.FC<Props> = ({
  selectedPatient, clinic, wallets, carePlans, transactions, allUsers, familyGroups, appointments = [],
  backendService, onBack, onProcessTransaction, onAssignPlan, onTerminateCarePlan, onToggleChecklistItem,
  onUpdateCarePlan, onDeletePatient, onRefreshData, onBookReview,
}) => {
  const [tab, setTab] = useState<'Overview' | 'Records' | 'Payments'>('Overview');
  const [viewingPlan, setViewingPlan] = useState<CarePlan | null>(null);

  const wallet = wallets.find((w) => w.userId === selectedPatient.id);
  const points = wallet?.balance || 0;
  const emr = selectedPatient.metadata?.emr;
  const medicalAlerts: string[] = selectedPatient.metadata?.medicalAlerts || [];
  const conditions: string[] = emr?.medicalHistory?.conditions || [];
  const allergies: string[] = emr?.medicalHistory?.allergies || [];
  const vitals = emr?.vitals || {};
  const notes = selectedPatient.metadata?.clinicalNotes || [];
  const chart = selectedPatient.metadata?.dentalChart || {};

  const activeCarePlan = useMemo(
    () => carePlans.find((cp) => cp.userId === selectedPatient?.id && cp.isActive && cp.clinicId === clinic.id),
    [carePlans, selectedPatient, clinic.id],
  );

  const txs = useMemo(
    () => transactions.filter((t) => t.walletId === wallet?.id && t.clinicId === clinic.id).sort((a, b) => +new Date(b.date) - +new Date(a.date)),
    [transactions, wallet, clinic.id],
  );

  const visits = txs.filter((t) => t.type === 'EARN');
  const lastVisit = visits[0] ? +new Date(visits[0].date) : 0;
  const daysSinceVisit = lastVisit ? Math.round((Date.now() - lastVisit) / day) : null;
  const visitsThisYear = visits.filter((t) => Date.now() - +new Date(t.date) < 365 * day).length;

  const adherence = activeCarePlan && activeCarePlan.checklist?.length
    ? activeCarePlan.checklist.filter((c) => c.completed).length / activeCarePlan.checklist.length
    : null;

  const nextTier = selectedPatient.currentTier === 'MEMBER' ? TIER_THRESHOLDS.GOLD : selectedPatient.currentTier === 'GOLD' ? TIER_THRESHOLDS.PLATINUM : 0;
  const tierProgress = nextTier ? Math.min(1, selectedPatient.lifetimeSpend / nextTier) : 1;

  const upcoming = useMemo(
    () => appointments.filter((a) => a.clinicId === clinic.id && a.patientId === selectedPatient.id && +new Date(a.startTime) > Date.now()).sort((a, b) => +new Date(a.startTime) - +new Date(b.startTime))[0],
    [appointments, clinic.id, selectedPatient.id],
  );

  const familyMembers = useMemo(
    () => (selectedPatient.familyGroupId ? allUsers.filter((u) => u.familyGroupId === selectedPatient.familyGroupId && u.id !== selectedPatient.id) : []),
    [allUsers, selectedPatient],
  );

  const chartCounts = useMemo(() => {
    const out: Record<string, number> = {};
    Object.values(chart as Record<number, string>).forEach((c) => { out[c] = (out[c] || 0) + 1; });
    return out;
  }, [chart]);

  const documents = useMemo(() => {
    const imgs = (emr?.imaging || []).map((i: any) => ({ kind: 'Imaging', title: i.type, date: i.date, icon: <FileImage size={15} /> }));
    const consents = (emr?.consents || []).map((c: any) => ({ kind: 'Consent', title: `${c.procedure}`, date: c.signedAt, icon: <FileSignature size={15} /> }));
    const rx = (emr?.prescriptions || []).map((p: any) => ({ kind: 'Rx', title: `${p.medications?.length || 0} medication${(p.medications?.length || 0) === 1 ? '' : 's'}`, date: p.date, icon: <PillIcon size={15} /> }));
    return [...imgs, ...consents, ...rx].sort((a, b) => +new Date(b.date) - +new Date(a.date)).slice(0, 4);
  }, [emr]);

  const vitalsList = [
    ['BP', vitals.bloodPressure], ['Pulse', vitals.pulseRate], ['Temp', vitals.temperature],
    ['SpO2', vitals.spO2], ['Weight', vitals.weight], ['Height', vitals.height],
  ].filter(([, v]) => v) as [string, string][];

  /* next best action from real signals */
  const action = useMemo(() => {
    if (adherence !== null && adherence < 0.6) return { tone: 'blush' as const, title: 'Aftercare needs a nudge', body: `${selectedPatient.name} is at ${Math.round(adherence * 100)}% on ${activeCarePlan?.treatmentName}.`, cta: 'Send reminder', do: () => onBookReview?.() };
    if (daysSinceVisit !== null && daysSinceVisit > 182) return { tone: 'sun' as const, title: 'Recall overdue', body: `Last visit was ${daysSinceVisit} days ago. Bring them back in.`, cta: 'Send recall', do: () => onBookReview?.() };
    if (nextTier && tierProgress >= 0.8) return { tone: 'leaf' as const, title: 'Close to the next tier', body: `${money(nextTier - selectedPatient.lifetimeSpend)} away from ${selectedPatient.currentTier === 'MEMBER' ? 'Gold' : 'Platinum'}.`, cta: 'Plan a visit', do: () => onBookReview?.() };
    if (medicalAlerts.length) return { tone: 'mist' as const, title: 'Review medical alerts', body: `${medicalAlerts.join(', ')}. Confirm before surgical treatment.`, cta: 'Open records', do: () => setTab('Records') };
    return { tone: 'leaf' as const, title: 'All on track', body: 'No follow-ups, overdue recalls, or alerts right now.', cta: 'Book review', do: () => onBookReview?.() };
  }, [adherence, activeCarePlan, daysSinceVisit, nextTier, tierProgress, selectedPatient, medicalAlerts, onBookReview]);

  const signals = [
    { label: 'Aftercare adherence', value: adherence === null ? 'No plan' : `${Math.round(adherence * 100)}%`, pct: adherence ?? 0, tone: 'leaf' as const },
    { label: 'Visits this year', value: String(visitsThisYear), pct: Math.min(1, visitsThisYear / 4), tone: 'mist' as const },
    { label: 'Recall status', value: daysSinceVisit === null ? 'No visits' : daysSinceVisit > 182 ? `${daysSinceVisit}d overdue` : 'On track', pct: daysSinceVisit === null ? 0 : Math.max(0.05, Math.min(1, 1 - daysSinceVisit / 365)), tone: (daysSinceVisit !== null && daysSinceVisit > 182 ? 'sun' : 'leaf') as 'sun' | 'leaf' },
    { label: `To ${selectedPatient.currentTier === 'PLATINUM' ? 'top tier' : selectedPatient.currentTier === 'MEMBER' ? 'Gold' : 'Platinum'}`, value: `${Math.round(tierProgress * 100)}%`, pct: tierProgress, tone: 'brand' as const },
  ];

  return (
    <div className="w-full space-y-6 pb-16">
      {/* Identity header band */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <button onClick={onBack} title="Back to patients" aria-label="Back to patients" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-ink-950/10 bg-white text-ink-600 transition-colors hover:text-ink-900">
            <ArrowLeft size={16} />
          </button>
          <Avatar name={selectedPatient.name} tone="dark" className="h-12 w-12 text-sm" />
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="truncate font-display text-[clamp(1.4rem,2.2vw,1.9rem)] font-bold tracking-tight text-ink-900">{selectedPatient.name}</h1>
              {activeCarePlan && <Pill tone="leaf">Active treatment plan</Pill>}
              {medicalAlerts.length > 0 && <Pill tone="blush"><AlertTriangle size={11} /> {medicalAlerts.length} alert{medicalAlerts.length === 1 ? '' : 's'}</Pill>}
            </div>
            <div className="mt-1.5 flex flex-wrap items-center gap-2">
              <Pill tone={TIER_TONE[selectedPatient.currentTier] || 'neutral'}>{selectedPatient.currentTier.toLowerCase()}</Pill>
              <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink-500">{selectedPatient.mobile}</span>
              {emr?.demographics?.gender && <><span className="text-ink-300">·</span><span className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink-500">{emr.demographics.gender}</span></>}
              {emr?.demographics?.bloodGroup && <><span className="text-ink-300">·</span><span className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink-500">{emr.demographics.bloodGroup}</span></>}
            </div>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="hidden items-center gap-5 rounded-full border border-ink-950/10 bg-white px-5 py-2.5 sm:flex">
            <div><Label>Points</Label><p className="font-display text-sm font-bold text-ink-900">{points.toLocaleString('en-IN')}</p></div>
            <span className="h-6 w-px bg-ink-950/10" />
            <div><Label>Lifetime</Label><p className="font-display text-sm font-bold text-ink-900">{money(selectedPatient.lifetimeSpend)}</p></div>
            <span className="h-6 w-px bg-ink-950/10" />
            <div><Label>Visits</Label><p className="font-display text-sm font-bold text-ink-900">{visits.length}</p></div>
          </div>
          {onBookReview && (
            <button onClick={onBookReview} className="inline-flex items-center gap-2 rounded-full border border-ink-950/10 bg-white px-4 py-2.5 text-xs font-bold uppercase tracking-[0.08em] text-ink-800 transition-colors hover:bg-cream-50">
              <CalendarPlus size={14} /> Book review
            </button>
          )}
          <button onClick={() => window.print()} title="Print record" aria-label="Print record" className="flex h-10 w-10 items-center justify-center rounded-full border border-ink-950/10 bg-white text-ink-600 transition-colors hover:text-ink-900"><Printer size={16} /></button>
          <button onClick={() => { if (confirm('Delete this patient record permanently?')) onDeletePatient(selectedPatient.id); }} title="Delete patient" aria-label="Delete patient" className="flex h-10 w-10 items-center justify-center rounded-full border border-ink-950/10 bg-white text-ink-400 transition-colors hover:border-blush hover:text-blush-deep"><Trash2 size={16} /></button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 rounded-full border border-ink-950/10 bg-white p-1 w-fit">
        {(['Overview', 'Records', 'Payments'] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={cn('rounded-full px-4 py-2 text-xs font-bold transition-colors', tab === t ? 'bg-ink-950 text-cream-50' : 'text-ink-500 hover:text-ink-900')}>
            {t}
          </button>
        ))}
      </div>

      {/* Overview */}
      {tab === 'Overview' && (
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_300px]">
          <div className="min-w-0 space-y-6">
            {/* Signals */}
            <Card tone="white">
              <SectionHeader eyebrow="Signals" title="Patient overview" />
              <div className="mt-6 grid gap-x-8 gap-y-6 sm:grid-cols-2">
                {signals.map((s) => (
                  <div key={s.label}>
                    <div className="mb-2 flex items-baseline justify-between gap-3">
                      <span className="text-sm font-semibold text-ink-700">{s.label}</span>
                      <span className="font-display text-base font-bold text-ink-900">{s.value}</span>
                    </div>
                    <SegmentBar value={s.pct} tone={s.tone} />
                  </div>
                ))}
              </div>
            </Card>

            {/* Alerts + vitals + conditions */}
            {(medicalAlerts.length > 0 || vitalsList.length > 0 || conditions.length > 0 || allergies.length > 0) && (
              <div className="grid gap-4 sm:grid-cols-2">
                {(medicalAlerts.length > 0 || allergies.length > 0 || conditions.length > 0) && (
                  <Card tone="blush">
                    <div className="flex items-center gap-2"><AlertTriangle size={14} className="text-blush-deep" /><Label>Clinical flags</Label></div>
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {[...medicalAlerts, ...allergies, ...conditions].filter((v, i, a) => a.indexOf(v) === i).map((a) => (
                        <span key={a} className="rounded-full bg-white/70 px-2.5 py-1 text-[11px] font-bold text-blush-deep">{a}</span>
                      ))}
                    </div>
                  </Card>
                )}
                {vitalsList.length > 0 && (
                  <Card tone="white">
                    <div className="flex items-center gap-2"><Stethoscope size={14} className="text-ink-400" /><Label>Last vitals</Label></div>
                    <div className="mt-3 grid grid-cols-3 gap-3">
                      {vitalsList.map(([k, v]) => (
                        <div key={k}><Label>{k}</Label><p className="font-display text-sm font-bold text-ink-900">{v}</p></div>
                      ))}
                    </div>
                  </Card>
                )}
              </div>
            )}

            {/* Aftercare */}
            {activeCarePlan ? (
              <Card tone="white" padded={false} className="overflow-hidden">
                <div className="flex items-center justify-between gap-4 p-5">
                  <SectionHeader eyebrow="Aftercare" title={activeCarePlan.treatmentName} />
                  {adherence !== null && <Pill tone={adherence >= 0.6 ? 'leaf' : 'blush'}>{Math.round(adherence * 100)}%</Pill>}
                </div>
                <div className="border-t border-ink-950/5">
                  {(activeCarePlan.checklist || []).map((item, i) => (
                    <button key={item.id} onClick={() => onToggleChecklistItem(activeCarePlan.id, item.id)}
                      className="flex w-full items-center gap-3 border-b border-ink-950/5 px-5 py-3 text-left transition-colors last:border-b-0 hover:bg-cream-50">
                      <span className={cn('flex h-6 w-6 shrink-0 items-center justify-center rounded-[8px] border text-[10px] font-bold', item.completed ? 'border-leaf-deep bg-leaf-deep text-white' : 'border-ink-950/15 bg-white text-ink-400')}>
                        {item.completed ? <Check size={12} strokeWidth={4} /> : i + 1}
                      </span>
                      <span className={cn('text-sm font-semibold', item.completed ? 'text-ink-400 line-through' : 'text-ink-800')}>{item.task}</span>
                    </button>
                  ))}
                </div>
                <div className="border-t border-ink-950/5 p-4">
                  <button onClick={() => setViewingPlan(activeCarePlan)} className="w-full rounded-full bg-ink-950 py-2.5 text-xs font-bold uppercase tracking-[0.08em] text-cream-50 transition-colors hover:bg-ink-800">Open treatment plan</button>
                </div>
              </Card>
            ) : (
              <Card tone="white"><Empty title="No active aftercare" hint="Assign a treatment plan from the Records tab." icon={<ClipboardCheck size={22} />} /></Card>
            )}

            {/* Notes + chart */}
            <div className="grid gap-4 sm:grid-cols-2">
              <Card tone="white">
                <SectionHeader eyebrow="Clinical" title="Latest note" />
                {notes[0] ? (
                  <div className="mt-4">
                    <div className="flex items-center gap-2">
                      {notes[0].type && <Pill tone="mist">{notes[0].type}</Pill>}
                      <Label>{new Date(notes[0].date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</Label>
                    </div>
                    <p className="mt-3 text-sm leading-relaxed text-ink-700">{notes[0].text}</p>
                  </div>
                ) : <Empty title="No clinical notes" hint="Add one from Records." />}
              </Card>
              <Card tone="white">
                <SectionHeader eyebrow="Charting" title="Dental chart" />
                {Object.keys(chartCounts).length ? (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {Object.entries(chartCounts).map(([cond, count]) => (
                      <span key={cond} className="rounded-full border border-ink-950/10 bg-cream-50 px-3 py-1 text-xs font-semibold capitalize text-ink-700">{cond} · {count}</span>
                    ))}
                  </div>
                ) : <Empty title="No findings charted" hint="Open the odontogram in Records." />}
              </Card>
            </div>
          </div>

          {/* Rail */}
          <div className="space-y-6">
            <Card tone={action.tone === 'blush' ? 'blush' : action.tone === 'sun' ? 'sun' : action.tone === 'mist' ? 'mist' : 'leaf'}>
              <div className="flex items-center gap-2"><Sparkles size={14} className="text-ink-700" /><Label>Next best action</Label></div>
              <p className="mt-3 font-display text-base font-bold tracking-tight text-ink-900">{action.title}</p>
              <p className="mt-1.5 text-sm leading-relaxed text-ink-700">{action.body}</p>
              <button onClick={action.do} className="mt-4 w-full rounded-full bg-ink-950 py-2.5 text-xs font-bold uppercase tracking-[0.08em] text-cream-50 transition-colors hover:bg-ink-800">{action.cta}</button>
            </Card>

            <Card tone="white">
              <div className="flex items-center gap-2"><Clock size={14} className="text-ink-400" /><Label>Next appointment</Label></div>
              {upcoming ? (
                <div className="mt-3">
                  <p className="font-display text-lg font-bold tracking-tight text-ink-900">{new Date(upcoming.startTime).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</p>
                  <p className="mt-0.5 text-sm font-semibold text-ink-600">{new Date(upcoming.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} · {upcoming.type}</p>
                </div>
              ) : <p className="mt-3 text-sm text-ink-500">Nothing booked.</p>}
            </Card>

            {familyMembers.length > 0 && (
              <Card tone="white">
                <div className="flex items-center gap-2"><Users size={14} className="text-ink-400" /><Label>Family</Label></div>
                <div className="mt-3 space-y-2.5">
                  {familyMembers.map((m) => (
                    <div key={m.id} className="flex items-center gap-2">
                      <Avatar name={m.name} tone="neutral" className="h-7 w-7 text-[10px]" />
                      <span className="truncate text-xs font-semibold text-ink-700">{m.name}</span>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            <Card tone="white" padded={false} className="overflow-hidden">
              <div className="p-5"><SectionHeader eyebrow="Files" title="Documents" /></div>
              <div className="border-t border-ink-950/5">
                {documents.length === 0 ? <Empty title="No documents" /> : documents.map((d, i) => (
                  <div key={i} className="flex items-center gap-3 border-b border-ink-950/5 px-5 py-3 last:border-b-0">
                    <span className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-cream-100 text-ink-600">{d.icon}</span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-semibold text-ink-800">{d.title}</p>
                      <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink-400">{d.kind} · {new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card tone="white" padded={false} className="overflow-hidden">
              <div className="flex items-center justify-between p-5">
                <SectionHeader eyebrow="Ledger" title="Recent payments" />
                <WalletIcon size={14} className="text-ink-400" />
              </div>
              <div className="border-t border-ink-950/5">
                {txs.length === 0 ? <Empty title="No transactions" /> : txs.slice(0, 4).map((t) => (
                  <div key={t.id} className="flex items-center justify-between gap-3 border-b border-ink-950/5 px-5 py-3 last:border-b-0">
                    <div className="min-w-0">
                      <p className="truncate text-xs font-semibold text-ink-800">{t.description}</p>
                      <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink-400">{new Date(t.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} · {t.category}</p>
                    </div>
                    <span className="font-mono text-xs font-bold text-ink-900">{money(t.amountPaid)}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      )}

      {tab === 'Records' && (
        <div className="min-w-0">
          <ClinicalTab
            clinic={clinic}
            patient={selectedPatient}
            activeCarePlan={activeCarePlan}
            backendService={backendService}
            onUpdateCarePlan={onUpdateCarePlan}
            onTerminateCarePlan={onTerminateCarePlan || (async () => ({ success: true }))}
            onToggleChecklistItem={onToggleChecklistItem}
            onOpenConsole={(plan) => setViewingPlan(plan)}
            onRefreshData={onRefreshData}
            onProcessTransaction={onProcessTransaction}
            onAssignPlan={onAssignPlan}
          />
        </div>
      )}

      {tab === 'Payments' && (
        <div className="min-w-0 space-y-6">
          <div className="grid gap-4 sm:grid-cols-3">
            <Card tone="mist"><Label>Points balance</Label><div className="mt-2"><Stat value={points.toLocaleString('en-IN')} label="" size="sm" /></div></Card>
            <Card tone="leaf"><Label>Lifetime spend</Label><div className="mt-2"><Stat value={money(selectedPatient.lifetimeSpend)} label="" size="sm" /></div></Card>
            <Card tone="sun"><Label>Visits</Label><div className="mt-2"><Stat value={visits.length} label="" size="sm" /></div></Card>
          </div>
          <Card tone="white" padded={false} className="overflow-hidden">
            <div className="p-5"><SectionHeader eyebrow="History" title="Transaction ledger" /></div>
            <div className="border-t border-ink-950/5">
              {txs.length === 0 ? <Empty title="No transactions yet" /> : txs.map((t) => (
                <div key={t.id} className="flex items-center gap-4 border-b border-ink-950/5 px-5 py-3.5 last:border-b-0">
                  <span className={cn('flex h-9 w-9 items-center justify-center rounded-[12px]', t.type === 'EARN' ? 'bg-leaf-soft text-leaf-deep' : 'bg-blush-soft text-blush-deep')}>
                    {t.type === 'EARN' ? <TrendingUp size={15} /> : <Activity size={15} />}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-ink-800">{t.description}</p>
                    <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink-400">{t.category} · {new Date(t.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                  </div>
                  <span className="font-mono text-sm font-bold text-ink-900">{money(t.amountPaid)}</span>
                  <span className={cn('font-mono text-xs font-bold', t.type === 'EARN' ? 'text-teal-700' : 'text-blush-deep')}>{t.pointsEarned > 0 ? '+' : ''}{t.pointsEarned}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {viewingPlan && (
        <DoctorTreatmentDetail plan={viewingPlan} patient={selectedPatient} clinic={clinic}
          onClose={() => setViewingPlan(null)} onUpdatePlan={onUpdateCarePlan} />
      )}
    </div>
  );
};

export default React.memo(PatientProfile);
