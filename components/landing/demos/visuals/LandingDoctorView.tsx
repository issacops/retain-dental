import React from 'react';
import { Activity, Zap, TrendingUp, Grid, Bell, Search, Calendar, UserPlus, CreditCard, LayoutGrid } from 'lucide-react';

export const LandingDoctorView: React.FC = () => {
    return (
        <div className="flex flex-col h-full text-slate-900 font-sans overflow-hidden bg-slate-50 relative selection:bg-teal-100">
            {/* Simple Glow Effect - replacing complex blurred divs */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-teal-500/5 rounded-full blur-[100px] pointer-events-none"></div>

            {/* Sidebar Mock */}
            <div className="flex h-full overflow-hidden">
                <aside className="w-64 bg-white/50 backdrop-blur-xl border-r border-white/40 flex flex-col p-6 z-20 relative">
                    <div className="flex items-center gap-3 mb-10">
                        <div className="h-8 w-8 bg-teal-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-teal-500/30">
                            <Activity size={16} />
                        </div>
                        <div>
                            <h1 className="font-black text-sm text-slate-900">Roots & Co.</h1>
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Pro Tier</p>
                        </div>
                    </div>

                    <nav className="space-y-1">
                        <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-teal-600 text-white shadow-lg shadow-teal-500/20">
                            <Grid size={16} />
                            <span className="font-bold text-xs tracking-wide">Operational Hub</span>
                        </div>
                        {['Schedule', 'Patients', 'Retention', 'Finance'].map((item) => (
                            <div key={item} className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400">
                                <div className="w-4 h-4 rounded-full border-2 border-slate-200"></div>
                                <span className="font-bold text-xs tracking-wide">{item}</span>
                            </div>
                        ))}
                    </nav>

                    <div className="mt-auto bg-slate-900 rounded-xl p-4 text-white">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="h-2 w-2 bg-emerald-400 rounded-full animate-pulse"></div>
                            <span className="text-[10px] font-black uppercase tracking-widest">System Live</span>
                        </div>
                        <p className="text-[10px] text-slate-400 leading-relaxed">Sync active with Dentrix G7.</p>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="flex-1 relative overflow-hidden flex flex-col">
                    {/* Header Mock */}
                    <header className="px-8 py-4 flex justify-between items-center bg-white/40 border-b border-white/20 backdrop-blur-md">
                        <div>
                            <h2 className="text-xl font-black text-slate-800">Good Morning, Dr. Smith</h2>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Wednesday, Oct 24th</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="h-9 px-3 bg-white border border-slate-200 rounded-lg flex items-center gap-2 text-slate-400 text-xs font-bold">
                                <Search size={14} /> Search...
                            </div>
                            <div className="h-9 w-9 bg-white border border-slate-200 rounded-lg flex items-center justify-center text-slate-400 relative">
                                <Bell size={16} />
                                <div className="absolute top-2 right-2 h-1.5 w-1.5 bg-rose-500 rounded-full border border-white"></div>
                            </div>
                        </div>
                    </header>

                    <div className="p-8 space-y-6 flex-1 overflow-hidden">
                        {/* KPI Cards */}
                        <div className="grid grid-cols-4 gap-6">
                            <div className="col-span-1 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-[2rem] p-6 text-white shadow-xl shadow-emerald-500/10 relative overflow-hidden">
                                <Activity className="absolute top-4 right-4 opacity-20" size={40} />
                                <p className="text-[9px] font-black uppercase tracking-widest opacity-80 mb-2">Retention Rate</p>
                                <h3 className="text-4xl font-black tracking-tighter">84<span className="text-xl opacity-60">%</span></h3>
                                <p className="text-[10px] font-bold mt-1 opacity-80">+2.4% vs last month</p>
                            </div>
                            <div className="col-span-1 bg-gradient-to-br from-teal-500 to-violet-600 rounded-[2rem] p-6 text-white shadow-xl shadow-teal-500/10 relative overflow-hidden">
                                <Zap className="absolute top-4 right-4 opacity-20" size={40} />
                                <p className="text-[9px] font-black uppercase tracking-widest opacity-80 mb-2">Active Patients</p>
                                <h3 className="text-4xl font-black tracking-tighter">1,240</h3>
                                <p className="text-[10px] font-bold mt-1 opacity-80">98% App Adoption</p>
                            </div>
                            <div className="col-span-2 bg-white rounded-[2rem] p-6 border border-slate-100 shadow-md flex items-center justify-between">
                                <div>
                                    <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-2">Projected Revenue (LTV)</p>
                                    <h3 className="text-4xl font-black tracking-tighter text-slate-900">₹4.2M</h3>
                                    <div className="flex items-center gap-1 text-emerald-500 text-[10px] font-bold mt-1">
                                        <TrendingUp size={12} /> Top 10% Performance
                                    </div>
                                </div>
                                <div className="h-16 w-32 bg-slate-50 rounded-xl overflow-hidden relative">
                                    {/* Fake Mini Chart */}
                                    <div className="absolute bottom-0 left-0 w-full flex items-end gap-1 px-2 pb-2 h-full">
                                        {[40, 60, 45, 70, 50, 80, 65].map((h, i) => (
                                            <div key={i} className="flex-1 bg-teal-500/20 rounded-t-sm" style={{ height: `${h}%` }}></div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Main Grid */}
                        <div className="grid grid-cols-12 gap-6 h-full">
                            {/* Main Chart Area */}
                            <div className="col-span-8 bg-white/80 rounded-[2.5rem] p-8 border border-white/60 shadow-lg relative overflow-hidden">
                                <div className="flex justify-between items-center mb-10">
                                    <h4 className="text-lg font-black text-slate-900">Retention Velocity</h4>
                                    <div className="flex gap-2">
                                        <div className="h-2 w-2 rounded-full bg-teal-500"></div>
                                        <div className="h-2 w-2 rounded-full bg-slate-200"></div>
                                    </div>
                                </div>
                                {/* CSS Only Line Chart Mockup */}
                                <div className="h-48 w-full relative">
                                    {/* Grid Lines */}
                                    <div className="absolute inset-0 flex flex-col justify-between">
                                        {[1, 2, 3, 4].map(i => <div key={i} className="w-full h-px bg-slate-100"></div>)}
                                    </div>
                                    {/* The Line (SVG path) */}
                                    <svg className="absolute inset-0 w-full h-full overflow-visible" preserveAspectRatio="none">
                                        <path d="M0 150 C 100 140, 200 100, 300 110 S 500 40, 600 50 S 800 20, 900 10" fill="none" stroke="#14b8a6" strokeWidth="4" strokeLinecap="round" />
                                        <path d="M0 150 L 900 150" fill="none" stroke="transparent" />
                                        {/* Area fill would be complex, keeping simple line */}
                                    </svg>
                                    {/* Dots */}
                                    <div className="absolute top-[110px] left-[33%] h-4 w-4 bg-white border-4 border-teal-500 rounded-full shadow-lg z-10"></div>
                                    <div className="absolute top-[50px] left-[66%] h-4 w-4 bg-white border-4 border-teal-500 rounded-full shadow-lg z-10"></div>
                                </div>
                            </div>

                            {/* Sidebar Widgets */}
                            <div className="col-span-4 space-y-6">
                                {/* Quick Actions */}
                                <div className="bg-white/80 rounded-[2.5rem] p-6 border border-white/60 shadow-lg">
                                    <h4 className="text-sm font-black text-slate-900 mb-4">Quick Actions</h4>
                                    <div className="grid grid-cols-2 gap-3">
                                        {[
                                            { icon: <UserPlus size={16} />, label: 'Add Patient' },
                                            { icon: <Calendar size={16} />, label: 'Book Visit' },
                                            { icon: <CreditCard size={16} />, label: 'Invoice' },
                                            { icon: <Zap size={16} />, label: 'Campaign' }
                                        ].map((action, i) => (
                                            <div key={i} className="p-4 bg-slate-50 rounded-2xl flex flex-col items-center gap-2 border border-slate-100">
                                                <div className="text-slate-400">{action.icon}</div>
                                                <span className="text-[10px] font-bold text-slate-600 uppercase">{action.label}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Patient Queue Mock */}
                                <div className="bg-slate-900 rounded-[2.5rem] p-6 text-white relative overflow-hidden">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="h-2 w-2 bg-emerald-400 rounded-full animate-pulse"></div>
                                        <span className="text-xs font-bold uppercase tracking-widest">Live Queue</span>
                                    </div>
                                    <div className="space-y-3">
                                        <div className="p-3 bg-white/10 rounded-xl flex items-center gap-3 border border-white/10">
                                            <div className="h-8 w-8 rounded-full bg-teal-500 flex items-center justify-center text-[10px] font-black">JS</div>
                                            <div>
                                                <p className="text-xs font-bold">James Smith</p>
                                                <p className="text-[9px] opacity-60">In Chair • Hygiene</p>
                                            </div>
                                        </div>
                                        <div className="p-3 bg-white/5 rounded-xl flex items-center gap-3 border border-white/5 opacity-60">
                                            <div className="h-8 w-8 rounded-full bg-slate-700 flex items-center justify-center text-[10px] font-black">RK</div>
                                            <div>
                                                <p className="text-xs font-bold">Riya Kapoor</p>
                                                <p className="text-[9px] opacity-60">Waiting • 10:30 AM</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};
