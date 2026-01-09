import React from 'react';
import { BadgeCheck, ArrowRight } from 'lucide-react';
import PhoneMockup from './PhoneMockup';

interface HeroSectionProps {
    onJoinWaitlist: () => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ onJoinWaitlist }) => {
    return (
        <section className="relative min-h-[90vh] flex items-center justify-center pt-32 pb-20 overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
                <div className="absolute top-[-10%] right-[-10%] w-[800px] h-[800px] bg-indigo-600/20 rounded-full blur-[120px] mix-blend-screen opacity-50 animate-blob"></div>
                <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-violet-600/20 rounded-full blur-[120px] mix-blend-screen opacity-50 animate-blob animation-delay-2000"></div>
            </div>

            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">

                {/* Copy Side */}
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
                    <div className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full w-fit backdrop-blur-md">
                        <BadgeCheck size={16} className="text-amber-400" />
                        <span className="text-xs font-bold text-slate-300 uppercase tracking-widest">The Operating System for Modern Clinics</span>
                    </div>

                    <h1 className="text-6xl md:text-7xl font-black text-white tracking-tighter leading-[1.1]">
                        Stop Chasing.<br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-400">Start Retaining.</span>
                    </h1>

                    <p className="text-xl text-slate-400 font-medium leading-relaxed max-w-xl">
                        Your existing patients are your biggest asset. <br />
                        Turn them into lifetime advocates with your own
                        <span className="text-white font-bold"> White-Label Clinic App</span>, automated aftercare, and a loyalty system that actually works.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 pt-4">
                        <button onClick={onJoinWaitlist} className="px-8 py-4 bg-white text-black rounded-full font-black text-lg hover:scale-105 transition-transform flex items-center justify-center gap-2">
                            Request Access <ArrowRight size={20} />
                        </button>
                        <button className="px-8 py-4 bg-white/5 text-white border border-white/10 rounded-full font-bold text-lg hover:bg-white/10 transition-colors">
                            View Demo
                        </button>
                    </div>

                    <div className="flex items-center gap-8 pt-8 opacity-60">
                        <div className="text-center">
                            <p className="text-3xl font-black text-white">90%</p>
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Revenue from Retention</p>
                        </div>
                        <div className="w-[1px] h-10 bg-white/10"></div>
                        <div className="text-center">
                            <p className="text-3xl font-black text-white">3.5x</p>
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Lifetime Value</p>
                        </div>
                    </div>
                </div>

                {/* Visual Side */}
                <div className="relative animate-in fade-in scale-95 duration-1000 delay-300">
                    <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/20 to-transparent rounded-[3rem] blur-3xl -z-10"></div>
                    <PhoneMockup className="rotate-[-6deg] hover:rotate-0 transition-transform duration-700">
                        {/* Mock App Screen Content */}
                        <div className="w-full h-full bg-slate-950 flex flex-col relative overflow-hidden">
                            {/* Mock Header */}
                            <div className="p-6 pt-16 flex justify-between items-center">
                                <div>
                                    <p className="text-xs text-slate-400 font-medium">Good Morning,</p>
                                    <p className="text-xl font-bold text-white">Sarah Jenkins</p>
                                </div>
                                <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400">
                                    <BadgeCheck size={20} />
                                </div>
                            </div>

                            {/* Mock Card */}
                            <div className="px-6">
                                <div className="bg-gradient-to-br from-indigo-600 to-violet-700 p-6 rounded-3xl text-white shadow-2xl relative overflow-hidden">
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

                            {/* Mock List */}
                            <div className="px-6 mt-8 space-y-4">
                                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Your Care Plan</p>
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/5">
                                        <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                                            <BadgeCheck size={18} />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-white">Daily Aligner Check</p>
                                            <p className="text-[10px] text-slate-400">Completed today • +50 pts</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </PhoneMockup>

                    {/* Floating Badge */}
                    <div className="absolute -bottom-8 -left-8 bg-slate-900/90 backdrop-blur-xl border border-white/10 p-6 rounded-3xl shadow-2xl animate-bounce duration-[3000ms]">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-amber-500/20 rounded-full flex items-center justify-center text-amber-500">
                                <BadgeCheck size={24} />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-slate-400 uppercase">Retention Score</p>
                                <p className="text-2xl font-black text-white">98.4%</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;
