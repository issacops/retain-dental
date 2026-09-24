import React, { useMemo, useState } from 'react';
import { Search, Plus, ChevronRight, Users, AlertTriangle } from 'lucide-react';
import { User, Wallet, Transaction, Clinic, Appointment } from '../../../types';
import { Card, Label, Pill, Avatar, Empty, cn } from '../ui/primitives';

interface Props {
  clinic: Clinic;
  users: User[];
  wallets: Wallet[];
  transactions: Transaction[];
  appointments: Appointment[];
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  onSelectPatient: (u: User) => void;
  onAddPatient: () => void;
}

const TIER_TONE: Record<string, 'leaf' | 'sun' | 'mist'> = { PLATINUM: 'leaf', GOLD: 'sun', MEMBER: 'mist' };
const day = 1000 * 60 * 60 * 24;
type Filter = 'all' | 'overdue' | 'family';

const PatientDirectory: React.FC<Props> = ({
  clinic, users, wallets, transactions, appointments, searchQuery, setSearchQuery, onSelectPatient, onAddPatient,
}) => {
  const [filter, setFilter] = useState<Filter>('all');

  const rows = useMemo(() => {
    const now = Date.now();

    const walletByUser = new Map<string, Wallet>(wallets.map((w) => [w.userId, w] as const));

    const lastEarnByWallet = new Map<string, number>();
    for (const t of transactions) {
      if (t.clinicId !== clinic.id || t.type !== 'EARN') continue;
      const at = +new Date(t.date);
      const prev = lastEarnByWallet.get(t.walletId);
      if (prev === undefined || at > prev) lastEarnByWallet.set(t.walletId, at);
    }

    const nextApptByPatient = new Map<string, Appointment>();
    for (const a of appointments) {
      if (a.clinicId !== clinic.id || +new Date(a.startTime) <= now) continue;
      const prev = nextApptByPatient.get(a.patientId);
      if (!prev || +new Date(a.startTime) < +new Date(prev.startTime)) nextApptByPatient.set(a.patientId, a);
    }

    return users.map((u) => {
      const wallet = walletByUser.get(u.id);
      const lastVisit = wallet ? (lastEarnByWallet.get(wallet.id) ?? 0) : 0;
      const days = lastVisit ? Math.round((now - lastVisit) / day) : null;
      const overdue = days === null || days > 182;
      return {
        user: u,
        points: wallet?.balance || 0,
        lastVisit,
        days,
        overdue,
        upcoming: nextApptByPatient.get(u.id),
        alerts: (u.metadata?.medicalAlerts || []).length,
      };
    }).sort((a, b) => a.user.name.localeCompare(b.user.name));
  }, [users, wallets, transactions, appointments, clinic.id]);

  const visible = rows.filter((r) => {
    if (filter === 'overdue' && !r.overdue) return false;
    if (filter === 'family' && !r.user.familyGroupId) return false;
    return true;
  });

  const overdueCount = rows.filter((r) => r.overdue).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-[clamp(1.5rem,2.4vw,2.1rem)] font-bold tracking-tight text-ink-900">Patients</h1>
          <p className="mt-2 text-sm font-medium text-ink-500">
            {rows.length} record{rows.length === 1 ? '' : 's'}
            {overdueCount > 0 && <> · <span className="text-sun-deep font-semibold">{overdueCount} overdue for recall</span></>}
          </p>
        </div>
        <button onClick={onAddPatient} className="inline-flex items-center gap-2 rounded-full bg-ink-950 px-4 py-2.5 text-xs font-bold uppercase tracking-[0.08em] text-cream-50 transition-colors hover:bg-ink-800">
          <Plus size={14} /> Add patient
        </button>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative min-w-[220px] flex-1 sm:max-w-sm">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400" />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name or mobile"
            className="w-full rounded-full border border-ink-950/10 bg-white py-2.5 pl-10 pr-4 text-sm font-semibold text-ink-900 outline-none transition-colors placeholder:text-ink-400 focus:border-ink-950/30"
          />
        </div>
        <div className="flex gap-1 rounded-full border border-ink-950/10 bg-white p-1">
          {([['all', 'All'], ['overdue', 'Overdue'], ['family', 'Family']] as const).map(([k, l]) => (
            <button key={k} onClick={() => setFilter(k)}
              className={cn('rounded-full px-3.5 py-1.5 text-xs font-bold transition-colors',
                filter === k ? 'bg-ink-950 text-cream-50' : 'text-ink-500 hover:text-ink-900')}>
              {l}
            </button>
          ))}
        </div>
      </div>

      {/* Directory */}
      <Card tone="white" padded={false} className="overflow-hidden">
        <div className="hidden grid-cols-[minmax(0,2.2fr)_1fr_1fr_1.2fr_1.4fr_auto] gap-4 border-b border-ink-950/5 px-5 py-3 md:grid">
          {['Patient', 'Tier', 'Points', 'Last visit', 'Status', ''].map((h) => (
            <span key={h} className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-400">{h}</span>
          ))}
        </div>

        {visible.length === 0 ? (
          <Empty title="No patients found" hint={searchQuery ? 'Try a different search.' : 'Add your first patient to get started.'} icon={<Users size={22} />} />
        ) : (
          visible.map((r) => (
            <button
              key={r.user.id}
              onClick={() => onSelectPatient(r.user)}
              className="group grid w-full grid-cols-1 items-center gap-3 border-b border-ink-950/5 px-5 py-3.5 text-left transition-colors last:border-b-0 hover:bg-cream-50 md:grid-cols-[minmax(0,2.2fr)_1fr_1fr_1.2fr_1.4fr_auto] md:gap-4"
            >
              <div className="flex min-w-0 items-center gap-3">
                <Avatar name={r.user.name} tone="neutral" />
                <div className="min-w-0">
                  <p className="flex items-center gap-2 truncate text-sm font-semibold text-ink-900">
                    {r.user.name}
                    {r.alerts > 0 && <AlertTriangle size={12} className="shrink-0 text-blush-deep" />}
                  </p>
                  <p className="truncate font-mono text-[10px] uppercase tracking-[0.12em] text-ink-500 md:hidden">{r.user.mobile}</p>
                </div>
              </div>

              <div className="hidden md:block"><Pill tone={TIER_TONE[r.user.currentTier] || 'neutral'}>{r.user.currentTier.toLowerCase()}</Pill></div>

              <div className="hidden md:block font-display text-sm font-bold text-ink-900">{r.points.toLocaleString('en-IN')}</div>

              <div className="hidden md:block text-xs font-medium text-ink-600">
                {r.lastVisit ? `${r.days}d ago` : 'Never'}
              </div>

              <div className="hidden md:flex">
                {r.upcoming ? <Pill tone="mist">Booked</Pill>
                  : r.overdue ? <Pill tone="sun">Recall due</Pill>
                  : <Pill tone="leaf">Active</Pill>}
              </div>

              <ChevronRight size={15} className="hidden shrink-0 text-ink-300 transition-transform group-hover:translate-x-0.5 md:block" />

              {/* mobile summary row */}
              <div className="flex items-center gap-2 md:hidden">
                <Pill tone={TIER_TONE[r.user.currentTier] || 'neutral'}>{r.user.currentTier.toLowerCase()}</Pill>
                <span className="font-display text-xs font-bold text-ink-900">{r.points.toLocaleString('en-IN')} pts</span>
                {r.overdue ? <Pill tone="sun">Recall due</Pill> : r.upcoming ? <Pill tone="mist">Booked</Pill> : <Pill tone="leaf">Active</Pill>}
              </div>
            </button>
          ))
        )}
      </Card>

      <p className="text-xs text-ink-400">
        Select a patient to open their record. Records open full-page, so nothing gets squeezed.
      </p>
    </div>
  );
};

export default PatientDirectory;
