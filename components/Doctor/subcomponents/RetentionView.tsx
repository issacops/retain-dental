import React, { useState, useMemo } from 'react';
import { ResponsiveContainer, LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, CartesianGrid, Tooltip } from 'recharts';
import { IBackendService } from '../../../services/IBackendService';
import { Clinic, User, Wallet, Transaction, TransactionCategory, Tier } from '../../../types';
import { Card, Label, Stat, Pill, SectionHeader, SegmentBar, Empty } from '../ui/primitives';

const TIER_TONE: Record<string, 'leaf' | 'sun' | 'mist'> = { PLATINUM: 'leaf', GOLD: 'sun', MEMBER: 'mist' };
const PIE = ['#5F7A2E', '#B39A1F', '#3E6C93'];

const RetentionView: React.FC<{ clinic: Clinic; backendService: IBackendService; allUsers?: User[]; wallets?: Wallet[]; transactions?: Transaction[] }> = ({
  clinic, backendService, allUsers = [], wallets = [], transactions = [],
}) => {
  const [metrics, setMetrics] = useState<any>(null);
  const [range, setRange] = useState('6M');

  React.useEffect(() => {
    let mounted = true;
    backendService.getRetentionMetrics(clinic.id).then((m) => { if (mounted) setMetrics(m); });
    return () => { mounted = false; };
  }, [backendService, clinic.id]);

  const retentionTrend = useMemo(() => {
    const months = ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const base = metrics?.retentionRate || 75;
    return months.map((month, i) => ({ month, rate: Math.max(50, Math.min(100, base + (i - 3) * 3)) }));
  }, [metrics]);

  const pointsDistribution = useMemo(
    () =>
      Object.values(TransactionCategory)
        .filter((c) => c !== 'REWARD')
        .map((cat) => {
          const catTx = transactions.filter((t) => t.category === cat && t.clinicId === clinic.id);
          return {
            category: cat,
            earned: catTx.filter((t) => t.type === 'EARN').reduce((s, t) => s + t.pointsEarned, 0),
            redeemed: Math.abs(catTx.filter((t) => t.type === 'REDEEM').reduce((s, t) => s + t.pointsEarned, 0)),
          };
        }),
    [transactions, clinic.id],
  );

  const tierData = useMemo(() => {
    const clinicPatients = allUsers.filter((u) => u.clinicId === clinic.id && u.role === 'PATIENT');
    return Object.values(Tier).map((tier) => {
      const list = clinicPatients.filter((u) => u.currentTier === tier);
      return { tier, count: list.length };
    });
  }, [allUsers, clinic.id]);

  if (!metrics) {
    return <div className="grid gap-4 sm:grid-cols-4">{[0, 1, 2, 3].map((i) => <Card key={i} tone="white" className="h-28 animate-pulse" />)}</div>;
  }

  const totalPatients = allUsers.filter((u) => u.clinicId === clinic.id && u.role === 'PATIENT').length || 1;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-[clamp(1.75rem,3vw,2.5rem)] font-bold tracking-tight text-ink-900">Retention</h1>
          <p className="mt-2 text-sm font-medium text-ink-500">How well the practice keeps and grows its patient base.</p>
        </div>
        <div className="flex gap-1 rounded-full border border-ink-950/10 bg-white p-1">
          {['3M', '6M', '1Y'].map((r) => (
            <button key={r} onClick={() => setRange(r)}
              className={r === range ? 'rounded-full bg-ink-950 px-3.5 py-1.5 font-mono text-[11px] font-bold text-cream-50' : 'rounded-full px-3.5 py-1.5 font-mono text-[11px] font-bold text-ink-500 hover:text-ink-900'}>
              {r}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card tone="leaf"><Label>Retention rate</Label><div className="mt-2"><Stat value={`${metrics.retentionRate ?? 0}%`} label="" size="lg" /></div><p className="mt-2 text-xs font-semibold text-leaf-deep">+2.4% vs last month</p></Card>
        <Card tone="sun"><Label>Points engagement</Label><div className="mt-2"><Stat value={`${metrics.pointsParticipation ?? 0}%`} label="" size="lg" /></div><p className="mt-2 text-xs font-semibold text-sun-deep">Active participation</p></Card>
        <Card tone="white"><Label>Avg lifetime value</Label><div className="mt-2"><Stat value={`₹${(metrics.ltv ?? metrics.avgLTV ?? 0).toLocaleString('en-IN')}`} label="" size="lg" /></div><p className="mt-2 text-xs font-semibold text-ink-500">Top 10% of clinics</p></Card>
        <Card tone="mist"><Label>Redemption rate</Label><div className="mt-2"><Stat value={`${metrics.redemptionRate ?? 0}%`} label="" size="lg" /></div><p className="mt-2 text-xs font-semibold text-mist-deep">Healthy ecosystem</p></Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        <Card tone="white">
          <SectionHeader eyebrow="Trend" title="Retention velocity" />
          <div className="mt-6 h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={retentionTrend}>
                <CartesianGrid strokeDasharray="2 4" stroke="#EFE9DC" vertical={false} />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 700, fill: '#7A7A7A' }} dy={10} />
                <Tooltip contentStyle={{ borderRadius: 16, border: '1px solid #EFE9DC', boxShadow: '0 8px 24px rgba(18,18,18,0.08)', padding: '10px 14px' }} />
                <Line type="monotone" dataKey="rate" stroke="#0f766e" strokeWidth={2.5} dot={{ r: 4, fill: '#fff', stroke: '#0f766e', strokeWidth: 2 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <div className="space-y-6">
          <Card tone="white">
            <SectionHeader eyebrow="Base" title="Tier distribution" />
            <div className="mt-4 h-[190px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={tierData.filter((t) => t.count > 0)} dataKey="count" nameKey="tier" innerRadius={54} outerRadius={72} paddingAngle={4}>
                    {tierData.map((e, i) => <Cell key={e.tier} fill={PIE[i % PIE.length]} stroke="rgba(0,0,0,0)" />)}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: 16, border: '1px solid #EFE9DC' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-2 space-y-3">
              {tierData.map((t) => (
                <div key={t.tier}>
                  <div className="mb-1.5 flex items-center justify-between"><span className="text-xs font-semibold text-ink-700 capitalize">{t.tier.toLowerCase()}</span><span className="font-mono text-xs text-ink-500">{t.count}</span></div>
                  <SegmentBar value={t.count / totalPatients} tone={TIER_TONE[t.tier]} />
                </div>
              ))}
            </div>
          </Card>

          <Card tone="white">
            <SectionHeader eyebrow="Economy" title="Points flow" />
            <div className="mt-4 h-[160px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={pointsDistribution} barGap={3}>
                  <CartesianGrid strokeDasharray="2 4" vertical={false} stroke="#EFE9DC" />
                  <XAxis dataKey="category" axisLine={false} tickLine={false} tick={{ fontSize: 9, fontWeight: 700, fill: '#A3A3A3' }} dy={8} />
                  <Tooltip contentStyle={{ borderRadius: 16, border: '1px solid #EFE9DC' }} />
                  <Bar dataKey="earned" fill="#5F7A2E" radius={[4, 4, 0, 0]} barSize={14} />
                  <Bar dataKey="redeemed" fill="#B5527E" radius={[4, 4, 0, 0]} barSize={14} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <Card tone="white" padded={false} className="overflow-hidden">
          <div className="p-5"><SectionHeader eyebrow="Families" title="Power households" /></div>
          <div className="border-t border-ink-950/5">
            {(metrics.topFamilies || []).length === 0 ? (
              <Empty title="No households yet" hint="Link family members to pool points." />
            ) : (
              (metrics.topFamilies || []).slice(0, 5).map((f: any, i: number) => (
                <div key={i} className="flex items-center justify-between border-b border-ink-950/5 px-5 py-3 last:border-b-0">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs font-bold text-ink-400">{String(i + 1).padStart(2, '0')}</span>
                    <span className="text-sm font-semibold text-ink-900">{f.name}</span>
                  </div>
                  <span className="font-mono text-sm font-bold text-ink-900">₹{f.spend.toLocaleString('en-IN')}</span>
                </div>
              ))
            )}
          </div>
        </Card>

        <Card tone="blush">
          <Label>At risk</Label>
          <div className="mt-2"><Stat value={`${metrics.churnRisk ?? Math.max(0, 100 - (metrics.retentionRate ?? 0))}%`} label="" size="lg" /></div>
          <p className="mt-3 max-w-xs text-sm font-medium text-ink-700">
            of the patient base is showing signs of disengagement. Reach them before the next recall window.
          </p>
          <button className="mt-5 rounded-full bg-ink-950 px-5 py-2.5 text-xs font-bold uppercase tracking-[0.08em] text-cream-50 hover:bg-ink-800 transition-colors">
            Start reactivation
          </button>
        </Card>
      </div>
    </div>
  );
};

export default RetentionView;
