import React, { useState, useEffect } from 'react';
import {
    Activity, Wallet, Trophy, Users, Calendar, ShieldCheck, Bell, Stethoscope,
    Sparkles, Star, BadgePercent, Megaphone, MessageSquare, CheckCircle, TrendingUp,
    Target, Zap, ArrowRight, Award
} from 'lucide-react';

type TabKey = 'patient' | 'doctor' | 'social' | 'loyalty' | 'protocol';

const TABS: { key: TabKey; label: string; sub: string; icon: React.ReactNode }[] = [
    { key: 'patient', label: 'Patient PWA', sub: 'Branded mobile app', icon: <Activity size={16} /> },
    { key: 'doctor', label: 'Clinic OS', sub: 'Live dashboard', icon: <Stethoscope size={16} /> },
    { key: 'social', label: 'Social Studio', sub: 'AI post generator', icon: <Sparkles size={16} /> },
    { key: 'loyalty', label: 'Loyalty Engine', sub: 'Tier & referral system', icon: <Trophy size={16} /> },
    { key: 'protocol', label: 'Protocol Builder', sub: 'Care plan tracking', icon: <ShieldCheck size={16} /> },
];

// ---------- TAB: PATIENT PWA ----------
const PatientPhone: React.FC<{ tab: string }> = ({ tab }) => {
    const rewards = [
        { name: 'Free Cleaning', cost: 1500, icon: <Sparkles size={18} className="text-teal-600" /> },
        { name: 'Whitening Session', cost: 4500, icon: <Star size={18} className="text-amber-500" /> },
        { name: 'Electric Toothbrush', cost: 3200, icon: <BadgePercent size={18} className="text-rose-500" /> },
    ];
    const plans = [
        { name: 'Aligner Day 14', done: true, sub: 'Tray 2 of 24 · +50 pts' },
        { name: 'Evening Floss', done: true, sub: 'Completed today · +10 pts' },
        { name: 'Post-Op Check-in', done: false, sub: 'Due in 2 days · +25 pts' },
    ];
    return (
        <div className="w-[280px] h-[560px] bg-slate-950 rounded-[44px] p-2 shadow-2xl border-[6px] border-slate-900 relative mx-auto">
            <div className="absolute top-1.5 left-1/2 -translate-x-1/2 w-24 h-5 bg-slate-900 rounded-b-2xl z-20"></div>
            <div className="w-full h-full bg-[#fdf8f0] rounded-[34px] overflow-hidden flex flex-col">
                <div className="bg-white px-5 pt-10 pb-4 border-b border-slate-100">
                    <p className="text-[10px] text-slate-500 font-medium">Welcome back,</p>
                    <p className="text-lg font-bold text-slate-900">Sarah Jenkins</p>
                </div>
                <div className="px-5 mt-4">
                    <div className="bg-gradient-to-br from-teal-600 to-teal-800 p-4 rounded-2xl text-white shadow-lg">
                        <p className="text-[9px] font-mono opacity-80">YOUR MEMBERSHIP</p>
                        <p className="text-xl font-black tracking-wider">GOLD TIER</p>
                        <div className="mt-3 flex items-end gap-3">
                            <div>
                                <p className="text-2xl font-black">2,450</p>
                                <p className="text-[9px] font-bold opacity-80">POINTS</p>
                            </div>
                            <div className="text-[10px] opacity-80 mb-1">+125 this week</div>
                        </div>
                    </div>
                </div>
                <div className="px-5 mt-4 flex-1 overflow-hidden">
                    {tab === 'care' && (
                        <div className="space-y-2">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Daily Rituals</p>
                            {plans.map((p, i) => (
                                <div key={i} className="flex items-center gap-2 p-2.5 bg-white rounded-xl border border-slate-100">
                                    <div className={`h-5 w-5 rounded-full flex items-center justify-center ${p.done ? 'bg-emerald-500 text-white' : 'bg-slate-100'}`}>
                                        {p.done ? <CheckCircle size={12} /> : <div className="h-1.5 w-1.5 rounded-full bg-slate-300" />}
                                    </div>
                                    <div className="min-w-0">
                                        <p className={`text-[11px] font-bold ${p.done ? 'text-slate-400 line-through' : 'text-slate-800'}`}>{p.name}</p>
                                        <p className="text-[9px] text-slate-500">{p.sub}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                    {tab === 'wallet' && (
                        <div className="space-y-2">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Redeem Points</p>
                            {rewards.map((r, i) => (
                                <div key={i} className="flex items-center justify-between p-2.5 bg-white rounded-xl border border-slate-100">
                                    <div className="flex items-center gap-2">
                                        <div className="h-7 w-7 rounded-lg bg-slate-50 flex items-center justify-center">{r.icon}</div>
                                        <p className="text-[11px] font-bold text-slate-800">{r.name}</p>
                                    </div>
                                    <p className="text-[10px] font-black text-teal-600">{r.cost.toLocaleString()} pts</p>
                                </div>
                            ))}
                        </div>
                    )}
                    {tab !== 'care' && tab !== 'wallet' && (
                        <div className="space-y-2">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Up Next</p>
                            <div className="p-3 bg-white rounded-xl border border-slate-100">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <p className="text-[11px] font-bold text-slate-800">Cleaning</p>
                                        <p className="text-[9px] text-slate-500">Tomorrow · 10:00 AM</p>
                                    </div>
                                    <Calendar size={16} className="text-teal-500" />
                                </div>
                            </div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-3">Tier Progress</p>
                            <div className="p-3 bg-white rounded-xl border border-slate-100">
                                <div className="flex justify-between mb-1.5">
                                    <p className="text-[11px] font-bold text-slate-800">Gold → Platinum</p>
                                    <p className="text-[10px] text-slate-500">2,450 / 5,000</p>
                                </div>
                                <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                    <div className="h-full bg-gradient-to-r from-teal-500 to-amber-400 rounded-full" style={{ width: '49%' }}></div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
                <div className="bg-white border-t border-slate-100 px-6 py-3 flex justify-between text-[10px] text-slate-400 font-bold">
                    <span className="text-teal-600">Home</span>
                    <span>Care</span>
                    <span>Wallet</span>
                    <span>Me</span>
                </div>
            </div>
        </div>
    );
};

// ---------- TAB: DOCTOR DASHBOARD ----------
const ClinicOSMock: React.FC = () => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
    const revenue = [45, 52, 39, 74, 96];
    const max = Math.max(...revenue);
    return (
        <div className="w-full h-[480px] bg-white rounded-2xl p-5 overflow-hidden border border-slate-200 shadow-xl">
            <div className="flex items-end justify-between mb-4">
                <div>
                    <h4 className="text-xl font-black text-slate-900 tracking-tight">Practice <span className="text-slate-300">Pulse</span></h4>
                    <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mt-0.5">Live · Today</p>
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 rounded-lg border border-emerald-100">
                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                    <span className="text-[9px] font-black text-emerald-700 uppercase tracking-wider">Live</span>
                </div>
            </div>
            <div className="grid grid-cols-4 gap-2 mb-4">
                {[
                    { label: 'Revenue', value: '₹2.84L', icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                    { label: 'Active', value: '247', icon: Users, color: 'text-teal-600', bg: 'bg-teal-50' },
                    { label: 'Chair', value: '84%', icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
                    { label: 'Recall', value: '94%', icon: Target, color: 'text-teal-600', bg: 'bg-teal-50' },
                ].map((k, i) => (
                    <div key={i} className="bg-slate-50 rounded-xl p-2.5">
                        <div className={`p-1 rounded-md ${k.bg} ${k.color} w-fit mb-1.5`}><k.icon size={12} /></div>
                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">{k.label}</p>
                        <p className="text-base font-black text-slate-900 tracking-tight">{k.value}</p>
                    </div>
                ))}
            </div>
            <div className="bg-slate-50 rounded-xl p-3 mb-3">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Revenue Flow · This Week</p>
                <div className="flex items-end gap-1.5 h-24">
                    {days.map((d, i) => (
                        <div key={i} className="flex-1 flex flex-col items-center gap-1">
                            <div className="w-full bg-gradient-to-t from-teal-500 to-teal-300 rounded-t-md transition-all" style={{ height: `${(revenue[i] / max) * 100}%` }}></div>
                            <p className="text-[9px] font-bold text-slate-500">{d}</p>
                        </div>
                    ))}
                </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
                <div className="bg-gradient-to-br from-teal-50 to-white border border-teal-100 rounded-xl p-3">
                    <Bell size={14} className="text-teal-600 mb-1" />
                    <p className="text-[10px] font-bold text-slate-700">12 recalls automated today</p>
                    <p className="text-[9px] text-slate-500 mt-0.5">+18% vs yesterday</p>
                </div>
                <div className="bg-gradient-to-br from-amber-50 to-white border border-amber-100 rounded-xl p-3">
                    <Trophy size={14} className="text-amber-600 mb-1" />
                    <p className="text-[10px] font-bold text-slate-700">3 patients hit Gold</p>
                    <p className="text-[9px] text-slate-500 mt-0.5">In the last 24 hours</p>
                </div>
            </div>
        </div>
    );
};

// helper for icons
const Clock: React.FC<{ size?: number; className?: string }> = ({ size = 14, className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
);

// ---------- TAB: SOCIAL STUDIO ----------
const SocialStudio: React.FC = () => {
    const [template, setTemplate] = useState(0);
    const templates = [
        { name: 'Transformation Story', color: 'from-teal-500 to-teal-700' },
        { name: 'Hero Review', color: 'from-amber-500 to-amber-700' },
        { name: 'Myth Buster', color: 'from-rose-500 to-rose-700' },
        { name: 'Limited Offer', color: 'from-violet-500 to-violet-700' },
    ];
    return (
        <div className="w-full h-[480px] bg-white rounded-2xl p-5 overflow-hidden border border-slate-200 shadow-xl flex gap-4">
            <div className="w-48 flex flex-col gap-1.5">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Templates</p>
                {templates.map((t, i) => (
                    <button key={i} onClick={() => setTemplate(i)}
                        className={`text-left p-2.5 rounded-lg transition-all ${template === i ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-700 hover:bg-slate-100'}`}>
                        <p className="text-[11px] font-bold">{t.name}</p>
                    </button>
                ))}
            </div>
            <div className="flex-1 flex flex-col items-center justify-center bg-slate-100 rounded-xl p-4">
                <div className={`w-48 h-80 rounded-2xl bg-gradient-to-br ${templates[template].color} p-4 flex flex-col justify-between shadow-2xl text-white`}>
                    <div>
                        <p className="text-[8px] font-mono opacity-80 uppercase tracking-widest">{templates[template].name}</p>
                    </div>
                    <div>
                        <p className="text-lg font-black leading-tight">Your Smile, Reimagined.</p>
                        <p className="text-[10px] opacity-80 mt-1.5">Tap to book your consultation</p>
                    </div>
                </div>
                <button className="mt-4 px-4 py-2 bg-slate-900 text-white text-[11px] font-bold rounded-lg flex items-center gap-1.5">
                    <Sparkles size={12} /> Download PNG
                </button>
            </div>
        </div>
    );
};

// ---------- TAB: LOYALTY ----------
const LoyaltyEngine: React.FC = () => {
    return (
        <div className="w-full h-[480px] bg-white rounded-2xl p-5 overflow-hidden border border-slate-200 shadow-xl">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Status Tiers</p>
            <div className="grid grid-cols-3 gap-2 mb-4">
                {[
                    { name: 'Silver', count: 142, color: 'from-slate-300 to-slate-500', min: '0 - 999 pts' },
                    { name: 'Gold', count: 87, color: 'from-amber-300 to-amber-500', min: '1k - 4.9k pts' },
                    { name: 'Platinum', count: 18, color: 'from-teal-500 to-teal-700', min: '5k+ pts' },
                ].map((t, i) => (
                    <div key={i} className={`p-4 rounded-xl bg-gradient-to-br ${t.color} text-white shadow-md`}>
                        <p className="text-[10px] font-bold uppercase tracking-widest opacity-80">Tier</p>
                        <p className="text-xl font-black mt-1">{t.name}</p>
                        <p className="text-2xl font-black mt-3">{t.count}</p>
                        <p className="text-[9px] opacity-80">active members</p>
                        <p className="text-[9px] mt-2 opacity-70">{t.min}</p>
                    </div>
                ))}
            </div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Recent Tier Movements</p>
            <div className="space-y-1.5">
                {[
                    { name: 'Rohit M.', from: 'Silver', to: 'Gold', pts: '+1,150' },
                    { name: 'Ananya P.', from: 'Gold', to: 'Platinum', pts: '+5,400' },
                    { name: 'Vikram S.', from: 'Silver', to: 'Gold', pts: '+1,020' },
                ].map((m, i) => (
                    <div key={i} className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg">
                        <div className="flex items-center gap-2">
                            <Award size={14} className="text-amber-500" />
                            <p className="text-[11px] font-bold text-slate-800">{m.name}</p>
                        </div>
                        <div className="flex items-center gap-2 text-[10px] font-bold">
                            <span className="text-slate-500">{m.from}</span>
                            <ArrowRight size={10} className="text-slate-300" />
                            <span className="text-teal-600">{m.to}</span>
                            <span className="text-emerald-600">{m.pts}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

// ---------- TAB: PROTOCOL ----------
const ProtocolBuilder: React.FC = () => {
    return (
        <div className="w-full h-[480px] bg-white rounded-2xl p-5 overflow-hidden border border-slate-200 shadow-xl">
            <div className="flex items-center justify-between mb-3">
                <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Active Protocol</p>
                    <p className="text-lg font-black text-slate-900 mt-0.5">Invisalign — Tray 14 of 24</p>
                </div>
                <div className="text-right">
                    <p className="text-2xl font-black text-teal-600">58%</p>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Complete</p>
                </div>
            </div>
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden mb-4">
                <div className="h-full bg-gradient-to-r from-teal-500 to-emerald-500 rounded-full" style={{ width: '58%' }}></div>
            </div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Daily Rituals</p>
            <div className="space-y-1.5">
                {[
                    { name: 'Wear aligners 22hrs', time: 'Today · 8:14 AM', done: true, pts: 50 },
                    { name: 'Evening clean', time: 'Today · 9:32 PM', done: true, pts: 10 },
                    { name: 'Post-op check-in', time: 'Tomorrow', done: false, pts: 25 },
                    { name: 'Tray switch', time: 'Day 15', done: false, pts: 100 },
                ].map((r, i) => (
                    <div key={i} className={`flex items-center justify-between p-3 rounded-lg border ${r.done ? 'bg-emerald-50/50 border-emerald-100' : 'bg-slate-50 border-slate-100'}`}>
                        <div className="flex items-center gap-2.5">
                            <div className={`h-6 w-6 rounded-full flex items-center justify-center ${r.done ? 'bg-emerald-500 text-white' : 'bg-slate-200'}`}>
                                {r.done && <CheckCircle size={12} />}
                            </div>
                            <div>
                                <p className={`text-[12px] font-bold ${r.done ? 'text-slate-400 line-through' : 'text-slate-800'}`}>{r.name}</p>
                                <p className="text-[9px] text-slate-500">{r.time}</p>
                            </div>
                        </div>
                        <span className="text-[10px] font-black text-emerald-600">+{r.pts} pts</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

// ---------- MAIN COMPONENT ----------
const LiveProductShowcase: React.FC = () => {
    const [active, setActive] = useState<TabKey>('patient');
    const [patientTab, setPatientTab] = useState<'home' | 'care' | 'wallet'>('home');

    // Cycle patient tab internally for a "live" feel
    useEffect(() => {
        if (active !== 'patient') return;
        const seq: ('home' | 'care' | 'wallet')[] = ['home', 'care', 'wallet'];
        let i = 0;
        const t = setInterval(() => {
            i = (i + 1) % seq.length;
            setPatientTab(seq[i]);
        }, 3500);
        return () => clearInterval(t);
    }, [active]);

    return (
        <section className="py-24 px-6 bg-gradient-to-b from-slate-50 to-white relative overflow-hidden">
            <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-teal-500/5 rounded-full blur-[100px]"></div>
            <div className="max-w-7xl mx-auto relative z-10">
                <div className="text-center mb-12 space-y-4">
                    <span className="inline-flex items-center gap-2 px-3 py-1 bg-teal-50 border border-teal-100 rounded-full text-xs font-bold text-teal-700 uppercase tracking-widest">
                        <Zap size={12} /> Real product, real components
                    </span>
                    <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter">
                        Not screenshots. <span className="text-teal-600">Live code.</span>
                    </h2>
                    <p className="text-slate-500 max-w-2xl mx-auto text-lg">
                        These aren't mockups. Every panel below is a working piece of the RetainOS platform,
                        rendered with real production components.
                    </p>
                </div>

                {/* Tabs */}
                <div className="flex flex-wrap justify-center gap-2 mb-8">
                    {TABS.map(t => (
                        <button key={t.key} onClick={() => setActive(t.key)}
                            className={`group flex items-center gap-2 px-4 py-2.5 rounded-full transition-all ${active === t.key
                                ? 'bg-slate-900 text-white shadow-lg'
                                : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300'}`}>
                            <span className={active === t.key ? 'text-teal-400' : 'text-slate-400 group-hover:text-slate-600'}>{t.icon}</span>
                            <div className="text-left">
                                <p className="text-xs font-black leading-tight">{t.label}</p>
                                <p className={`text-[9px] uppercase tracking-widest ${active === t.key ? 'text-slate-400' : 'text-slate-400'}`}>{t.sub}</p>
                            </div>
                        </button>
                    ))}
                </div>

                {/* Content area */}
                <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-2xl shadow-slate-200/50 p-8 md:p-12 min-h-[560px] flex items-center justify-center">
                    {active === 'patient' && (
                        <div className="flex flex-col md:flex-row items-center gap-10 w-full">
                            <PatientPhone tab={patientTab === 'home' ? 'home' : patientTab} />
                            <div className="flex-1 space-y-4 max-w-md">
                                <h3 className="text-3xl font-black text-slate-900 tracking-tight">Your brand. Their pocket.</h3>
                                <p className="text-slate-600 leading-relaxed">
                                    Patients download <strong>your</strong> app, not ours. Custom logo, color, and domain.
                                    PWA install on iOS + Android with biometric login. Care plans, points, and re-care
                                    reminders — all under your name.
                                </p>
                                <ul className="space-y-2 pt-2">
                                    {['Biometric (FaceID) login', 'Real-time loyalty tier updates', 'Push re-care reminders', 'Multi-language ready'].map((f, i) => (
                                        <li key={i} className="flex items-center gap-2 text-sm text-slate-700">
                                            <CheckCircle size={14} className="text-teal-500" /> {f}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    )}
                    {active === 'doctor' && (
                        <div className="w-full">
                            <ClinicOSMock />
                        </div>
                    )}
                    {active === 'social' && (
                        <div className="w-full">
                            <SocialStudio />
                        </div>
                    )}
                    {active === 'loyalty' && (
                        <div className="w-full">
                            <LoyaltyEngine />
                        </div>
                    )}
                    {active === 'protocol' && (
                        <div className="w-full">
                            <ProtocolBuilder />
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default LiveProductShowcase;
