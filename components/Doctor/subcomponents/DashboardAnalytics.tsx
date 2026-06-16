import React from 'react';
import { ResponsiveContainer, AreaChart, Area, CartesianGrid, XAxis, Tooltip } from 'recharts';
import { Clinic } from '../../../types';
import { TrendingUp, Users, Clock, Activity } from 'lucide-react';

interface Props {
    clinic: Clinic;
    stats: any;
}

const DashboardAnalytics: React.FC<Props> = React.memo(({ clinic, stats }) => {
    const brandColor = clinic.primaryColor || '#0d9488';
    const revenueData = [
        { n: 'Mon', r: 45000 }, { n: 'Tue', r: 52000 },
        { n: 'Wed', r: 39000 }, { n: 'Thu', r: 74000 },
        { n: 'Fri', r: 96000 }
    ];

    return (
        <div className="space-y-8 fade-in duration-700">
            <div className="flex items-end justify-between">
                <div>
                    <h2 className="text-5xl font-black tracking-tighter text-gray-900">
                        Practice <span className="text-gray-300">Pulse.</span>
                    </h2>
                    <p className="text-sm font-semibold text-gray-400 uppercase tracking-wider mt-2">
                        {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                    </p>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 rounded-xl border border-emerald-100">
                    <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></div>
                    <span className="text-[10px] font-black text-emerald-700 uppercase tracking-wider">Live</span>
                </div>
            </div>

            {/* KPI Grid */}
            <div className="grid grid-cols-4 gap-5">
                {[
                    { label: 'Total Revenue', value: `₹${(stats?.totalRevenue || 0).toLocaleString()}`, icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100' },
                    { label: 'Active Patients', value: stats?.totalPatients || 0, icon: Users, color: 'text-teal-600', bg: 'bg-teal-50', border: 'border-teal-100' },
                    { label: 'Chair Time', value: `${stats?.activeChairTime || 0}h`, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-100' },
                    { label: 'Redemption', value: `${stats?.redemptionRate || 0}%`, icon: Activity, color: 'text-teal-600', bg: 'bg-teal-50', border: 'border-teal-100' },
                ].map((kpi, i) => (
                    <div key={i}
                        className="bg-white rounded-3xl p-6 border border-gray-100 shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] transition-all duration-300 hover:-translate-y-0.5">
                        <div className="flex items-center justify-between mb-4">
                            <span className={`text-[9px] font-black uppercase tracking-widest text-gray-400`}>{kpi.label}</span>
                            <div className={`p-2 rounded-xl ${kpi.bg} ${kpi.color}`}>
                                <kpi.icon size={16} />
                            </div>
                        </div>
                        <p className="text-3xl font-black text-gray-900 tracking-tight">{kpi.value}</p>
                    </div>
                ))}
            </div>

            {/* Revenue Area Chart */}
            <div className="bg-white rounded-[32px] p-8 border border-gray-100 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h4 className="text-lg font-black text-gray-900">Revenue Flow</h4>
                        <p className="text-xs font-semibold text-gray-400 mt-1">Weekly performance</p>
                    </div>
                    <div className="flex gap-2">
                        {['1W', '1M', '3M', '1Y'].map(r => (
                            <button key={r}
                                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                                    r === '1W' ? 'bg-gray-900 text-white shadow-lg' : 'bg-gray-50 text-gray-400 hover:bg-gray-100'
                                }`}>
                                {r}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="h-[280px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={revenueData}>
                            <defs>
                                <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor={brandColor} stopOpacity={0.15} />
                                    <stop offset="95%" stopColor={brandColor} stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis dataKey="n" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 700 }} dy={10} />
                            <Tooltip
                                cursor={{ stroke: brandColor, strokeWidth: 2, strokeDasharray: '4 4' }}
                                contentStyle={{
                                    borderRadius: '16px', border: 'none',
                                    boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
                                    background: 'rgba(255,255,255,0.95)',
                                    backdropFilter: 'blur(8px)',
                                    padding: '12px 16px'
                                }}
                                formatter={(value: number) => [`₹${value.toLocaleString()}`, 'Revenue']}
                            />
                            <Area type="monotone" dataKey="r" stroke={brandColor} strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
});

export default DashboardAnalytics;
