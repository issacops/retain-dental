import React from 'react';
import { BadgeCheck, ArrowRight, TrendingUp, ShieldCheck } from 'lucide-react';
import PhoneMockup from './PhoneMockup';

interface HeroSectionProps {
    onJoinWaitlist: () => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ onJoinWaitlist }) => {
    return (
        <section className="relative min-h-[90vh] flex items-center pt-24 overflow-hidden bg-slate-50">
            {/* Background Texture & Light Mesh Gradients */}
            <div className="absolute inset-0 bg-slate-50">
                <div className="absolute inset-0 bg-noise opacity-[0.03]"></div>
                {/* Medical Clean Mesh Gradients */}
                <div className="absolute top-[-20%] left-[-10%] w-[70vw] h-[70vw] bg-primary-100/50 rounded-full blur-[120px] mix-blend-multiply animate-blob filter"></div>
                <div className="absolute bottom-[-20%] right-[-10%] w-[60vw] h-[60vw] bg-secondary-100/40 rounded-full blur-[100px] mix-blend-multiply animate-blob" style={{ animationDelay: '-5s' }}></div>
            </div>

            <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center relative z-10">

                {/* Copy Side */}
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
                    <div className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-full w-fit shadow-sm">
                        <TrendingUp size={16} className="text-secondary-500" />
                        <span className="text-xs font-bold text-slate-600 uppercase tracking-widest">#1 Patient Retention Platform</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tighter leading-[1.1]">
                        Stop <span className="text-secondary-500">Revenue Leakage</span> in Your  Practice.
                    </h1>

                    <p className="text-xl text-slate-600 font-medium leading-relaxed max-w-xl">
                        Acquiring patients is expensive. Keeping them shouldn't be.
                        <br />
                        Automate your <strong>Recall, Aftercare, and Loyalty</strong> with the first Operating System designed for modern DSOs.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 pt-4">
                        <button onClick={onJoinWaitlist} className="px-8 py-4 bg-primary-600 text-white rounded-full font-bold text-lg hover:scale-105 hover:bg-primary-700 transition-all shadow-xl shadow-primary-600/20 flex items-center justify-center gap-2">
                            Request Enterprise Demo <ArrowRight size={20} />
                        </button>
                        <button className="px-8 py-4 bg-white text-slate-700 border border-slate-200 rounded-full font-bold text-lg hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm">
                            Calculated ROI
                        </button>
                    </div>

                    <div className="flex items-center gap-8 pt-8 opacity-80">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-emerald-100 rounded-full text-emerald-700">
                                <ShieldCheck size={20} />
                            </div>
                            <div className="text-left">
                                <p className="text-sm font-bold text-slate-900">HIPAA Compliant</p>
                                <p className="text-xs text-slate-500">SOC2 Ready Infrastructure</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Visual Side - Phone Mockup */}
                <div className="relative animate-in fade-in scale-95 duration-1000 delay-300">
                    {/* Abstract Shapes behind phone */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-tr from-primary-100 to-transparent rounded-full blur-3xl -z-10"></div>

                    <PhoneMockup className="rotate-[-6deg] hover:rotate-0 transition-transform duration-700 shadow-2xl shadow-primary-900/20 border-8 border-slate-900 bg-slate-900">
                        {/* Mock App Screen Content - Light Mode inside App too for contrast with dark phone frame */}
                        <div className="w-full h-full bg-slate-50 flex flex-col relative overflow-hidden">
                            {/* Mock Header */}
                            <div className="p-6 pt-16 flex justify-between items-center bg-white border-b border-slate-100">
                                <div>
                                    <p className="text-xs text-slate-500 font-medium">Welcome back,</p>
                                    <p className="text-xl font-bold text-slate-900">Sarah Jenkins</p>
                                </div>
                                <div className="w-10 h-10 rounded-full bg-primary-50 flex items-center justify-center text-primary-600">
                                    <BadgeCheck size={20} />
                                </div>
                            </div>

                            {/* Mock Card */}
                            <div className="px-6 mt-6">
                                <div className="bg-gradient-to-br from-primary-600 to-primary-800 p-6 rounded-3xl text-white shadow-xl shadow-primary-900/10 relative overflow-hidden">
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
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Your Care Plan</p>
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
                                        <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600">
                                            <BadgeCheck size={18} />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-slate-800">Aligner Check-in</p>
                                            <p className="text-[10px] text-slate-500">Completed today • +50 pts</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </PhoneMockup>

                    {/* Floating Badge */}
                    <div className="absolute -bottom-8 -left-8 bg-white/80 backdrop-blur-xl border border-white/50 p-6 rounded-3xl shadow-xl animate-bounce duration-[3000ms]">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-secondary-100 rounded-full flex items-center justify-center text-secondary-600">
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
