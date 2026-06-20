import { useState } from 'react';

const kpis = [
  { label: 'Revenue', value: '₹48.2K', change: '+12%', icon: (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-400"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
  )},
  { label: 'Patients', value: '1,247', change: '+8%', icon: (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-sky-400"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
  )},
  { label: 'Chair Time', value: '84%', change: '+5%', icon: (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-400"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
  )},
  { label: 'Redemption', value: '12.4%', change: '+1.2%', icon: (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-violet-400"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>
  )},
];

const chartMonths = ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const chartValues = [72, 78, 82, 89, 93, 96];

const topFamilies = [
  { name: 'Johnson Family', spend: '₹4,200', tier: 'PLATINUM' },
  { name: 'Williams Household', spend: '₹3,800', tier: 'GOLD' },
  { name: 'Garcia Family', spend: '₹3,200', tier: 'GOLD' },
];

const tierColors: Record<string, string> = {
  PLATINUM: 'bg-violet-600',
  GOLD: 'bg-amber-500',
  MEMBER: 'bg-onDark-500',
};

export default function FeatureDashboard() {
  const [timeRange, setTimeRange] = useState('1M');

  return (
    <div className="max-w-lg mx-auto space-y-4">
      {/* KPI cards */}
      <div className="grid grid-cols-2 gap-2">
        {kpis.map((kpi, i) => (
          <div key={i} className="bg-ink-900 rounded p-3.5 border border-ink-border shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[9px] font-semibold text-onDark-500 uppercase tracking-widest">{kpi.label}</span>
              <span className="text-sm">{kpi.icon}</span>
            </div>
            <p className="text-xl font-semibold text-onDark-100">{kpi.value}</p>
            <span className="text-[10px] font-semibold text-violet-400">{kpi.change}</span>
          </div>
        ))}
      </div>

      {/* Retention chart */}
      <div className="bg-ink-900 rounded p-4 border border-ink-border shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-xs font-semibold text-onDark-100">Patient Retention</p>
            <p className="text-[9px] text-onDark-500">Last 6 months</p>
          </div>
          <div className="flex bg-ink-800 rounded p-0.5">
            {['1W', '1M', '3M', '1Y'].map(r => (
              <button
                key={r}
                onClick={() => setTimeRange(r)}
                className={`px-2.5 py-1 rounded text-[9px] font-semibold transition-all cursor-pointer ${
                  timeRange === r ? 'bg-ink-900 text-onDark-100 shadow-sm' : 'text-onDark-500 hover:text-onDark-300'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        {/* Simple SVG chart */}
        <div className="relative h-32">
          <svg viewBox="0 0 300 120" className="w-full h-full" preserveAspectRatio="none">
            {/* Grid lines */}
            {[0, 30, 60, 90, 120].map(y => (
              <line key={y} x1="0" y1={y} x2="300" y2={y} stroke="#2A1A32" strokeWidth="1"/>
            ))}
            {/* Area fill */}
            <defs>
              <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#6366F1" stopOpacity="0.3"/>
                <stop offset="100%" stopColor="#6366F1" stopOpacity="0"/>
              </linearGradient>
            </defs>
            <path
              d={`M0,${120 - chartValues[0] * 1.2} ${chartValues.map((v, i) => `L${i * 60},${120 - v * 1.2}`).join(' ')} L300,120 L0,120 Z`}
              fill="url(#areaGrad)"
            />
            {/* Line */}
            <polyline
              points={chartValues.map((v, i) => `${i * 60},${120 - v * 1.2}`).join(' ')}
              fill="none"
              stroke="#6366F1"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Dots */}
            {chartValues.map((v, i) => (
              <circle key={i} cx={i * 60} cy={120 - v * 1.2} r="4" fill="#170B1C" stroke="#6366F1" strokeWidth="3"/>
            ))}
          </svg>
          {/* X labels */}
          <div className="absolute bottom-0 left-0 right-0 flex justify-between px-1">
            {chartMonths.map(m => (
              <span key={m} className="text-[8px] text-onDark-500 font-semibold">{m}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Top families */}
      <div className="bg-ink-900 rounded p-4 border border-ink-border shadow-sm">
        <p className="text-[9px] font-semibold text-onDark-500 uppercase tracking-widest mb-3">Power Households</p>
        <div className="space-y-2">
          {topFamilies.map((f, i) => (
            <div key={i} className="flex items-center gap-3 p-2 rounded bg-ink-800 cursor-pointer hover:bg-ink-700 transition-colors">
              <div className={`w-7 h-7 rounded flex items-center justify-center text-white text-[9px] font-semibold ${
                tierColors[f.tier] ?? 'bg-onDark-500'
              }`}>
                #{i + 1}
              </div>
              <div className="flex-1">
                <p className="text-xs font-semibold text-onDark-100">{f.name}</p>
                <p className="text-[9px] text-onDark-500">{f.tier} tier</p>
              </div>
              <span className="text-xs font-semibold text-onDark-500">{f.spend}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
