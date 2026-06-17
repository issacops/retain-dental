import { useState } from 'react';

const kpis = [
  { label: 'Revenue', value: '$48.2K', change: '+12%', icon: '💰', color: 'emerald' },
  { label: 'Patients', value: '1,247', change: '+8%', icon: '👥', color: 'teal' },
  { label: 'Retention', value: '96.4%', change: '+3.2%', icon: '📈', color: 'teal' },
  { label: 'Reviews', value: '4.8★', change: '+0.3', icon: '⭐', color: 'amber' },
];

const chartMonths = ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const chartValues = [72, 78, 82, 89, 93, 96];

const topFamilies = [
  { name: 'Johnson Family', spend: '$4,200', tier: 'Platinum' },
  { name: 'Williams Household', spend: '$3,800', tier: 'Gold' },
  { name: 'Garcia Family', spend: '$3,200', tier: 'Gold' },
];

export default function FeatureDashboard() {
  const [timeRange, setTimeRange] = useState('1M');

  return (
    <div className="max-w-lg mx-auto space-y-4">
      {/* KPI cards */}
      <div className="grid grid-cols-2 gap-2">
        {kpis.map((kpi, i) => (
          <div key={i} className="bg-white rounded-2xl p-3.5 border border-cream-200 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{kpi.label}</span>
              <span className="text-sm">{kpi.icon}</span>
            </div>
            <p className="text-xl font-black text-slate-900">{kpi.value}</p>
            <span className={`text-[10px] font-bold text-${kpi.color}-600`}>{kpi.change}</span>
          </div>
        ))}
      </div>

      {/* Retention chart */}
      <div className="bg-white rounded-3xl p-4 border border-cream-200 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-xs font-bold text-slate-900">Patient Retention</p>
            <p className="text-[9px] text-slate-400">Last 6 months</p>
          </div>
          <div className="flex bg-slate-100 rounded-full p-0.5">
            {['1W', '1M', '3M', '1Y'].map(r => (
              <button
                key={r}
                onClick={() => setTimeRange(r)}
                className={`px-2.5 py-1 rounded-full text-[9px] font-bold transition-all ${
                  timeRange === r ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400'
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
              <line key={y} x1="0" y1={y} x2="300" y2={y} stroke="#f1f5f9" strokeWidth="1"/>
            ))}
            {/* Area fill */}
            <defs>
              <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#0d9488" stopOpacity="0.3"/>
                <stop offset="100%" stopColor="#0d9488" stopOpacity="0"/>
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
              stroke="#0d9488"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Dots */}
            {chartValues.map((v, i) => (
              <circle key={i} cx={i * 60} cy={120 - v * 1.2} r="4" fill="white" stroke="#0d9488" strokeWidth="3"/>
            ))}
          </svg>
          {/* X labels */}
          <div className="absolute bottom-0 left-0 right-0 flex justify-between px-1">
            {chartMonths.map(m => (
              <span key={m} className="text-[8px] text-slate-400 font-semibold">{m}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Top families */}
      <div className="bg-white rounded-3xl p-4 border border-cream-200 shadow-sm">
        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-3">Power Households</p>
        <div className="space-y-2">
          {topFamilies.map((f, i) => (
            <div key={i} className="flex items-center gap-3 p-2 rounded-xl bg-slate-50">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-white text-[9px] font-bold ${
                i === 0 ? 'bg-gradient-to-br from-amber-400 to-amber-600' : i === 1 ? 'bg-gradient-to-br from-slate-400 to-slate-500' : 'bg-gradient-to-br from-amber-600 to-amber-700'
              }`}>
                #{i + 1}
              </div>
              <div className="flex-1">
                <p className="text-xs font-bold text-slate-900">{f.name}</p>
                <p className="text-[9px] text-slate-400">{f.tier} tier</p>
              </div>
              <span className="text-xs font-black text-slate-700">{f.spend}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
