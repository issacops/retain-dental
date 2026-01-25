import React from 'react';
import { Home, History, HeartPulse, User, Trophy, ChevronRight, CheckCircle, Activity, Calendar } from 'lucide-react';

interface Props {
    initialTab?: 'HOME' | 'WALLET' | 'CARE' | 'PROFILE';
}

export const LandingPatientView: React.FC<Props> = ({ initialTab = 'HOME' }) => {
    // We visually simulate the tab, but it's static or simple
    const activeTab = initialTab;

    return (
        <div className="w-full h-full bg-slate-50 text-slate-900 font-sans relative overflow-hidden flex flex-col">
            {/* Background Gradients */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-[60px] pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-[50px] pointer-events-none"></div>

            <main className="flex-1 p-6 overflow-hidden flex flex-col">
                {/* Header (Always Visible) */}
                <div className="flex items-center gap-3 mb-6">
                    <div className="h-10 w-10 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-center">
                        <Activity size={20} className="text-indigo-600" />
                    </div>
                    <div>
                        <h1 className="text-xl font-black text-slate-900 tracking-tight">Roots & Co.</h1>
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Patient Portal</p>
                    </div>
                </div>

                {/* CONTENT AREA BASED ON TAB (Simulated) */}
                {activeTab === 'HOME' && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
                        {/* Loyalty Card */}
                        <div className="bg-white rounded-[2rem] p-6 shadow-xl border border-slate-100 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full blur-2xl -mr-10 -mt-10 opacity-50"></div>

                            <div className="flex justify-between items-start relative z-10 mb-6">
                                <div>
                                    <div className="px-3 py-1 bg-slate-50 rounded-full inline-block text-[9px] font-black uppercase tracking-widest text-slate-500 mb-2">Gold Tier</div>
                                    <h2 className="text-2xl font-black text-slate-900 leading-none">Sarah J.</h2>
                                </div>
                                <Trophy className="text-amber-400 drop-shadow-sm" size={32} />
                            </div>

                            <div className="flex items-end justify-between relative z-10">
                                <div>
                                    <p className="text-[9px] uppercase font-black text-slate-400 tracking-widest mb-1">Balance</p>
                                    <p className="text-3xl font-black text-slate-900 tracking-tighter">2,450 <span className="text-sm text-slate-400">Pts</span></p>
                                </div>
                                <div className="h-8 w-8 bg-slate-900 rounded-full flex items-center justify-center text-white">
                                    <ChevronRight size={16} />
                                </div>
                            </div>

                            <div className="mt-4 pt-4 border-t border-slate-100 relative z-10">
                                <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                    <div className="h-full bg-indigo-500 w-[70%]"></div>
                                </div>
                                <p className="text-[9px] font-bold text-slate-400 mt-2 text-right">70% to Platinum</p>
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="grid grid-cols-2 gap-3">
                            <div className="bg-slate-900 text-white p-5 rounded-[2rem] flex flex-col items-center gap-2 shadow-lg">
                                <Calendar size={20} />
                                <span className="text-[10px] uppercase font-black tracking-widest">Book Visit</span>
                            </div>
                            <div className="bg-white text-slate-900 border border-slate-100 p-5 rounded-[2rem] flex flex-col items-center gap-2 shadow-sm">
                                <History size={20} className="text-slate-400" />
                                <span className="text-[10px] uppercase font-black tracking-widest">History</span>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'CARE' && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <div className="bg-slate-900 text-white rounded-[2.5rem] p-8 relative overflow-hidden shadow-2xl">
                            <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/20 blur-[60px] rounded-full -mr-10 -mt-10"></div>

                            <div className="relative z-10">
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="h-1.5 w-1.5 bg-emerald-400 rounded-full animate-pulse"></div>
                                    <span className="text-[9px] font-black uppercase tracking-[0.2em] opacity-70">Live Protocol</span>
                                </div>
                                <h2 className="text-3xl font-black tracking-tighter leading-tight mb-8">Invisalign<br />Journey</h2>

                                <div className="space-y-4">
                                    <div className="flex items-center gap-4 bg-white/10 p-4 rounded-2xl backdrop-blur-md border border-white/5">
                                        <div className="h-6 w-6 rounded-full bg-emerald-500 flex items-center justify-center text-white shadow-lg shadow-emerald-500/50">
                                            <CheckCircle size={14} />
                                        </div>
                                        <span className="text-sm font-bold">Morning Aligner Scan</span>
                                    </div>
                                    <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/5 opacity-60">
                                        <div className="h-6 w-6 rounded-full bg-slate-700 flex items-center justify-center"></div>
                                        <span className="text-sm font-bold decoration-slate-400">Evening Floss</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'WALLET' && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <div className="bg-white rounded-[2.5rem] border border-slate-100 p-6 flex items-center gap-4 shadow-sm">
                            <div className="h-12 w-12 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
                                <Activity size={24} />
                            </div>
                            <div className="flex-1">
                                <h4 className="font-black text-sm text-slate-900">Referral Bonus</h4>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Yesterday</p>
                            </div>
                            <span className="font-black text-emerald-600">+500</span>
                        </div>
                        <div className="bg-white rounded-[2.5rem] border border-slate-100 p-6 flex items-center gap-4 shadow-sm opacity-60">
                            <div className="h-12 w-12 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400">
                                <History size={24} />
                            </div>
                            <div className="flex-1">
                                <h4 className="font-black text-sm text-slate-900">Hygiene Visit</h4>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Oct 20</p>
                            </div>
                            <span className="font-black text-emerald-600">+150</span>
                        </div>
                    </div>
                )}
            </main>

            {/* Bottom Nav (Simulated) */}
            <nav className="p-6 pt-0">
                <div className="bg-white rounded-[2rem] p-2 shadow-2xl flex justify-between border border-slate-100">
                    {['HOME', 'WALLET', 'CARE', 'PROFILE'].map(t => (
                        <div key={t} className={`h-14 w-14 rounded-[1.5rem] flex items-center justify-center transition-colors ${activeTab === t ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-300'}`}>
                            {t === 'HOME' && <Home size={20} />}
                            {t === 'WALLET' && <History size={20} />}
                            {t === 'CARE' && <HeartPulse size={20} />}
                            {t === 'PROFILE' && <User size={20} />}
                        </div>
                    ))}
                </div>
            </nav>
        </div>
    );
};
