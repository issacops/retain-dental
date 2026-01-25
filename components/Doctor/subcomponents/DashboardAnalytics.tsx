import React from 'react';
import { ResponsiveContainer, AreaChart, Area, CartesianGrid, XAxis, Tooltip } from 'recharts';
import { Clinic } from '../../../types';

interface Props {
    clinic: Clinic;
    stats: any;
}


const DashboardAnalytics: React.FC<Props> = React.memo(({ clinic, stats }) => (
    <div className="flex-1 p-16 overflow-y-auto fade-in duration-700">
        <div className="max-w-6xl mx-auto space-y-12">
            <h2 className="text-7xl font-black tracking-tighter text-slate-900">Practice <span className="text-slate-300">Pulse.</span></h2>
            <div className="grid grid-cols-3 gap-8">
                <div className="col-span-2 glass-panel p-12 rounded-[56px] shadow-sm border border-white/50">
                    <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-[0.3em] mb-12 px-1">Global Revenue Flow</h4>
                    <ResponsiveContainer width="100%" height={350}>
                        <AreaChart data={[{ n: 'Mon', r: 45000 }, { n: 'Tue', r: 52000 }, { n: 'Wed', r: 39000 }, { n: 'Thu', r: 74000 }, { n: 'Fri', r: 96000 }]}>
                            <defs>
                                <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor={clinic.primaryColor} stopOpacity={0.2} />
                                    <stop offset="95%" stopColor={clinic.primaryColor} stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis dataKey="n" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 800 }} />
                            <Tooltip cursor={{ stroke: clinic.primaryColor, strokeWidth: 2 }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                            <Area type="monotone" dataKey="r" stroke={clinic.primaryColor} strokeWidth={4} fillOpacity={1} fill="url(#colorRev)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
                <div className="glass-panel p-12 rounded-[56px] shadow-sm border border-white/50 flex flex-col justify-between">
                    <div>
                        <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Total Lifetime GTV</p>
                        <h3 className="text-5xl font-black tracking-tighter text-slate-900">₹{(stats?.totalRevenue || 0).toLocaleString()}</h3>
                    </div>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center py-4 border-b border-slate-100">
                            <span className="text-xs font-bold text-slate-400">Retention</span>
                            <span className="text-xs font-black text-emerald-500">96.4%</span>
                        </div>
                        <div className="flex justify-between items-center py-4 border-b border-slate-100">
                            <span className="text-xs font-bold text-slate-400">Churn Risk</span>
                            <span className="text-xs font-black text-rose-500">2.1%</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
));

export default DashboardAnalytics;
