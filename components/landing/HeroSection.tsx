import React from 'react';
import { BadgeCheck, ArrowRight, TrendingUp, ShieldCheck } from 'lucide-react';
import PhoneMockup from './PhoneMockup';

interface HeroSectionProps {
    onJoinWaitlist: () => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ onJoinWaitlist }) => {
    return (
        <section className="relative min-h-[90vh] flex items-center pt-24 overflow-hidden bg-white">
            <div className="absolute inset-0 bg-white">
                <div className="absolute top-[-20%] left-[-10%] w-[70vw] h-[70vw] bg-teal-500/5 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-[-20%] right-[-10%] w-[60vw] h-[60vw] bg-amber-500/5 rounded-full blur-[100px]"></div>
            </div>

            <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center relative z-10">

                <div className="space-y-8">
                    <div className="flex items-center gap-3 px-4 py-2 bg-teal-50 border border-teal-100 rounded-full w-fit">
                        <TrendingUp size={16} className="text-teal-600" />
                        <span className="text-xs font-bold text-teal-700 uppercase tracking-widest">The Operating System for Growth</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tighter leading-[1.1]">
                        Your Brand. <span className="text-teal-600">Your App.</span> <br />
                        <span className="text-slate-900">Powered by RetainOS.</span>
                    </h1>

                    <p className="text-xl text-slate-600 leading-relaxed max-w-xl">
                        Stop renting your audience on Instagram. Launch your own <strong>Custom Loyalty App</strong> in 20 minutes. Automate recall, aftercare, and payments.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-3 pt-4">
                        <button onClick={onJoinWaitlist} className="px-8 py-4 bg-teal-600 text-white rounded-full font-bold text-lg hover:scale-105 hover:bg-teal-700 transition-all shadow-xl shadow-teal-600/20 flex items-center justify-center gap-2">
                            Launch My App <ArrowRight size={20} />
                        </button>
                        <a href="/login" className="px-8 py-4 bg-white text-slate-700 border border-slate-200 rounded-full font-bold text-lg hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm flex items-center justify-center">
                            Start free trial
                        </a>
                    </div>

                    <div className="flex items-center gap-6 pt-6">
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-teal-50 border border-teal-100 rounded-full">
                            <span className="h-2 w-2 rounded-full bg-teal-500 animate-pulse"></span>
                            <span className="text-xs font-black text-teal-700 uppercase tracking-widest">Beta Launch · 12 Pilot Clinics</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2 text-slate-500 text-sm">
                            <ShieldCheck size={16} className="text-teal-500" />
                            HIPAA-ready architecture
                        </div>
                        <div className="flex items-center gap-2 text-slate-500 text-sm">
                            <ShieldCheck size={16} className="text-teal-500" />
                            SOC 2 in progress
                        </div>
                    </div>

                    <div className="pt-6 border-t border-slate-100 w-full max-w-md">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Built on</p>
                        <div className="flex gap-8 opacity-50">
                            <span className="text-sm font-black text-slate-600">Cloudflare</span>
                            <span className="text-sm font-black text-slate-600">Supabase</span>
                            <span className="text-sm font-black text-slate-600">Stripe</span>
                        </div>
                    </div>
                </div>

                <div className="relative">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-tr from-teal-100/30 to-transparent rounded-full blur-3xl -z-10"></div>

                    <PhoneMockup className="rotate-[-6deg] hover:rotate-0 transition-transform duration-700 shadow-2xl shadow-teal-900/20 border-8 border-slate-900 bg-slate-900">
                        <div className="w-full h-full bg-white flex flex-col relative overflow-hidden">
                            <div className="p-6 pt-16 flex justify-between items-center bg-white border-b border-slate-100">
                                <div>
                                    <p className="text-xs text-slate-500 font-medium">Welcome back,</p>
                                    <p className="text-xl font-bold text-slate-900">Sarah Jenkins</p>
                                </div>
                                <div className="w-10 h-10 rounded-full bg-teal-50 flex items-center justify-center text-teal-600">
                                    <BadgeCheck size={20} />
                                </div>
                            </div>

                            <div className="px-6 mt-6">
                                <div className="bg-gradient-to-br from-teal-600 to-teal-800 p-6 rounded-3xl text-white shadow-xl shadow-teal-900/10 relative overflow-hidden">
                                    <div className="relative z-10">
                                        <p className="text-xs font-mono opacity-80 mb-1">YOUR MEMBERSHIP</p>
                                        <p className="text-2xl font-black tracking-widest">GOLD TIER</p>
                                        <div className="mt-6 flex justify-between items-end">
                                            <div>
                                                <p className="text-3xl font-black">2,450</p>
                                                <p className="text-[10px] font-bold opacity-80">POINTS AVAILABLE</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
                                </div>
                            </div>

                            <div className="px-6 mt-8 space-y-4">
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Your Care Plan</p>
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
                                        <div className="w-10 h-10 rounded-xl bg-teal-100 flex items-center justify-center text-teal-600">
                                            <BadgeCheck size={18} />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-slate-800">Aligner Check-in</p>
                                            <p className="text-[10px] text-slate-500">Completed today &bull; +50 pts</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </PhoneMockup>

                    <div className="absolute -bottom-8 -left-8 bg-white/80 backdrop-blur-xl border border-white/50 p-6 rounded-3xl shadow-xl animate-bounce duration-[3000ms]">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center text-teal-600">
                                <TrendingUp size={24} />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-slate-400 uppercase">Retention Rate</p>
                                <p className="text-2xl font-black text-slate-900">98.4%</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;
