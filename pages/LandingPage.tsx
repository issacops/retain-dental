import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Check,
    ChevronRight,
    X,
    Globe,
    ShieldCheck,
    LayoutGrid,
    Zap,
    Smartphone,
    Stethoscope,
    Trophy,
    Users,
    Activity,
    ArrowRight
} from 'lucide-react';
import { IBackendService, ServiceResponse } from '../services/IBackendService';
import HeroSection from '../components/landing/HeroSection';
import FeatureSection from '../components/landing/FeatureSection';
import PhoneMockup from '../components/landing/PhoneMockup';
import Comparison from '../components/landing/Comparison';
import BentoGrid from '../components/landing/BentoGrid';
import DeepDive from '../components/landing/DeepDive';

interface LandingPageProps {
    backend: IBackendService;
}

export const LandingPage: React.FC<LandingPageProps> = ({ backend }) => {
    // Waitlist Form State
    const [isWaitlistOpen, setIsWaitlistOpen] = useState(false);
    const [status, setStatus] = useState<'IDLE' | 'LOADING' | 'SUCCESS' | 'ERROR'>('IDLE');
    const [formData, setFormData] = useState({
        name: '',
        clinic: '',
        mobile: '',
        email: ''
    });

    const handleJoin = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('LOADING');
        try {
            const result = await backend.joinWaitlist(formData);
            if (result.success) {
                setStatus('SUCCESS');
                setTimeout(() => {
                    setIsWaitlistOpen(false);
                    setStatus('IDLE');
                    setFormData({ name: '', clinic: '', mobile: '', email: '' });
                }, 3000);
            } else {
                setStatus('ERROR');
            }
        } catch (error) {
            setStatus('ERROR');
        }
    };

    return (
        <div className="bg-slate-950 min-h-screen font-sans selection:bg-indigo-500/30 selection:text-indigo-200 overflow-x-hidden">

            {/* Navbar */}
            <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-slate-950/80 backdrop-blur-xl">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-600/20">
                            <LayoutGrid className="text-white" size={20} />
                        </div>
                        <span className="text-xl font-black text-white tracking-tighter">Retain<span className="text-indigo-500">OS</span></span>
                    </div>
                    <button onClick={() => setIsWaitlistOpen(true)} className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-full text-xs font-bold uppercase tracking-widest transition-all border border-white/5">
                        Get Early Access
                    </button>
                </div>
            </nav>

            {/* HERO SECTION */}
            <HeroSection onJoinWaitlist={() => setIsWaitlistOpen(true)} />

            {/* SOCIAL PROOF TICKER */}
            <div className="w-full border-t border-b border-white/5 bg-black/20 py-8 overflow-hidden">
                <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-8 opacity-40 grayscale hover:grayscale-0 transition-all duration-500">
                    <span className="text-lg font-black text-white">TRUSTED BY MODERN CLINICS</span>
                    <div className="flex gap-12 font-bold text-slate-300 text-xl overflow-x-auto no-scrollbar whitespace-nowrap mask-linear-fade">
                        <span>APEX DENTAL</span>
                        <span>SMILE STUDIO NY</span>
                        <span>ALIGNER CO</span>
                        <span>ELITE ORTHO</span>
                        <span>PURE SMILES</span>
                    </div>
                </div>
            </div>

            {/* PROBLEM / AGITATION */}
            <section className="py-32 px-6">
                <div className="max-w-4xl mx-auto text-center space-y-8">
                    <h3 className="text-indigo-500 font-bold uppercase tracking-widest text-sm">The Retention Crisis</h3>
                    <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter leading-tight">
                        Marketing brings them in. <br />
                        <span className="text-slate-600">Lack of engagement drives them away.</span>
                    </h2>
                    <p className="text-xl text-slate-400 leading-relaxed">
                        The average clinic loses 40% of their patient base every year.
                        You don't need more leads. You need a system that turns
                        one-time visits into lifetime value.
                    </p>
                </div>
            </section>

            {/* FEATURE 1: WHITE LABEL APP */}
            <FeatureSection
                title="Your Clinic. Your App."
                subtitle="Not ours."
                description="Give your patients a dedicated app on their home screen. Fully white-labeled with your logo, colors, and branding. It's the ultimate status symbol for a modern practice."
                badge="Premium Identity"
                align="left"
            >
                <div className="relative">
                    <div className="absolute inset-0 bg-indigo-500/20 blur-[100px] rounded-full"></div>
                    <PhoneMockup>
                        <div className="w-full h-full bg-white flex flex-col items-center justify-center p-8 text-center space-y-6">
                            <div className="w-24 h-24 bg-black rounded-3xl flex items-center justify-center shadow-2xl">
                                <span className="text-white font-black text-4xl">D</span>
                            </div>
                            <div>
                                <h4 className="text-2xl font-black text-slate-900">Dr. Smith's Dental</h4>
                                <p className="text-slate-500 text-sm mt-2">Welcome back, Sarah</p>
                            </div>
                            <div className="w-full space-y-3 pt-8">
                                <div className="h-12 w-full bg-black rounded-xl"></div>
                                <div className="h-12 w-full bg-slate-100 rounded-xl"></div>
                            </div>
                        </div>
                    </PhoneMockup>
                </div>
            </FeatureSection>

            {/* FEATURE 2: AUTOMATED PROTOCOLS */}
            <FeatureSection
                title="Medical-Grade Retention."
                subtitle="Automated Aftercare Protocols."
                description="Forget manual follow-ups. Assign care plans (e.g., 'Invisalign Week 1') and let the OS handle daily check-ins, photo uploads, and compliance tracking automatically."
                badge="Clinical Intelligence"
                align="right"
            >
                <div className="w-full max-w-md bg-slate-900 border border-white/10 rounded-3xl p-8 shadow-2xl relative">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-12 h-12 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400">
                            <Stethoscope size={24} />
                        </div>
                        <div>
                            <p className="font-bold text-white">Active Protocol</p>
                            <p className="text-xs text-slate-400">Aligner Tracking • Day 14</p>
                        </div>
                    </div>
                    <div className="space-y-4">
                        {[
                            { time: '09:00 AM', task: 'Morning Scan Required', status: 'completed' },
                            { time: '02:00 PM', task: 'Wear Time Check-in', status: 'pending' },
                            { time: '08:00 PM', task: 'Evening Routine', status: 'pending' },
                        ].map((item, i) => (
                            <div key={i} className={`flex items-center justify-between p-4 rounded-xl border ${item.status === 'completed' ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-white/5 border-white/5'}`}>
                                <div className="flex items-center gap-4">
                                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${item.status === 'completed' ? 'border-emerald-500 bg-emerald-500 text-black' : 'border-slate-600'}`}>
                                        {item.status === 'completed' && <Check size={12} />}
                                    </div>
                                    <span className={item.status === 'completed' ? 'text-white' : 'text-slate-400'}>{item.task}</span>
                                </div>
                                <span className="text-xs text-slate-500 font-mono">{item.time}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </FeatureSection>

            {/* FEATURE 3: LOYALTY */}
            <FeatureSection
                title="Gamified Loyalty."
                subtitle="Turn Patients into Advocates."
                description="A complete points and rewards ecosystem. Patients earn points for compliance, referrals, and reviews. Tiers (Silver, Gold, Platinum) drive status-seeking behavior."
                badge="Behavioral Economics"
                align="left"
            >
                <div className="grid grid-cols-2 gap-4 max-w-md w-full">
                    <div className="bg-gradient-to-br from-amber-400 to-orange-600 p-6 rounded-[2rem] text-black col-span-2 shadow-[0_0_50px_rgba(251,191,36,0.2)]">
                        <Trophy size={32} className="mb-4 text-black/50" />
                        <h4 className="text-3xl font-black tracking-tighter">PLATINUM</h4>
                        <p className="font-bold opacity-60 text-xs uppercase tracking-widest mt-1">Status Level</p>
                        <div className="mt-8 flex justify-between items-end">
                            <div>
                                <span className="text-4xl font-black">5,000</span>
                                <span className="text-xs font-bold ml-1">PTS</span>
                            </div>
                            <span className="px-3 py-1 bg-black/10 rounded-full text-xs font-bold backdrop-blur-md">Top 1%</span>
                        </div>
                    </div>
                    <div className="bg-white/5 border border-white/10 p-6 rounded-[2rem] backdrop-blur-md">
                        <Users className="text-indigo-400 mb-2" />
                        <p className="text-2xl font-black text-white">+500</p>
                        <p className="text-[10px] text-slate-500 uppercase font-bold">Referral Bonus</p>
                    </div>
                    <div className="bg-white/5 border border-white/10 p-6 rounded-[2rem] backdrop-blur-md">
                        <Zap className="text-emerald-400 mb-2" />
                        <p className="text-2xl font-black text-white">x2</p>
                        <p className="text-[10px] text-slate-500 uppercase font-bold">Multiplier</p>
                    </div>
                </div>
            </FeatureSection>


            {/* CTA SECTION */}
            <section className="py-32 px-6 relative overflow-hidden">
                <div className="absolute inset-0 bg-indigo-600/10"></div>
                <div className="max-w-4xl mx-auto text-center relative z-10 space-y-10">
                    <h2 className="text-5xl md:text-7xl font-black text-white tracking-tighter">
                        Ready to Upgrade?
                    </h2>
                    <p className="text-xl text-slate-400 max-w-xl mx-auto">
                        Join the waitlist today. We are onboarding 5 new clinics per week to ensure white-glove deployment.
                    </p>
                    <button onClick={() => setIsWaitlistOpen(true)} className="px-10 py-5 bg-white text-black rounded-full font-black text-xl hover:scale-105 transition-transform shadow-[0_0_50px_rgba(255,255,255,0.3)]">
                        Request Access
                    </button>
                    <p className="text-xs text-slate-600 font-bold uppercase tracking-widest">No Credit Card Required • Cancel Anytime</p>
                </div>
            </section>

            {/* FOOTER */}
            <footer className="border-t border-white/5 py-12 bg-black">
                <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
                    <div>
                        <div className="flex items-center gap-2 mb-6">
                            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                                <LayoutGrid className="text-white" size={16} />
                            </div>
                            <span className="text-lg font-black text-white">Retain<span className="text-indigo-500">OS</span></span>
                        </div>
                        <p className="text-slate-500 text-sm">
                            The operating system for high-performance dental clinics. Built for retention.
                        </p>
                    </div>
                    {['Product', 'Company', 'Legal'].map(col => (
                        <div key={col} className="space-y-4">
                            <h4 className="text-white font-bold uppercase tracking-widest text-xs">{col}</h4>
                            <ul className="space-y-2 text-slate-500 text-sm">
                                <li className="hover:text-white cursor-pointer transition-colors">About</li>
                                <li className="hover:text-white cursor-pointer transition-colors">Features</li>
                                <li className="hover:text-white cursor-pointer transition-colors">Contact</li>
                            </ul>
                        </div>
                    ))}
                </div>
                <div className="max-w-7xl mx-auto px-6 mt-12 pt-8 border-t border-white/5 text-center text-slate-600 text-xs">
                    © 2024 Retain Dental Inc. All rights reserved.
                </div>
            </footer>

            {/* WAITLIST MODAL */}
            <AnimatePresence>
                {isWaitlistOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center px-4 bg-slate-950/80 backdrop-blur-md"
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            className="bg-slate-900 border border-white/10 p-8 md:p-12 rounded-[2.5rem] w-full max-w-lg shadow-2xl relative overflow-hidden"
                        >
                            <button onClick={() => setIsWaitlistOpen(false)} className="absolute top-6 right-6 p-2 bg-white/5 rounded-full text-slate-400 hover:text-white transition-colors">
                                <X size={20} />
                            </button>

                            {status === 'SUCCESS' ? (
                                <div className="py-20 text-center space-y-6">
                                    <div className="w-20 h-20 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Check size={40} />
                                    </div>
                                    <h3 className="text-3xl font-black text-white">You're on the list.</h3>
                                    <p className="text-slate-400 font-medium">We'll be in touch shortly to schedule your demo.</p>
                                </div>
                            ) : (
                                <>
                                    <div className="mb-10">
                                        <h3 className="text-3xl font-black text-white tracking-tight mb-2">Request Access</h3>
                                        <p className="text-slate-400 font-medium">Join the 4,000+ clinics on the waiting list.</p>
                                    </div>

                                    <form onSubmit={handleJoin} className="space-y-5">
                                        <div>
                                            <input
                                                required
                                                placeholder="Doctor Name"
                                                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-4 text-white placeholder:text-slate-600 focus:border-indigo-500 outline-none transition-colors"
                                                value={formData.name}
                                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                            />
                                        </div>
                                        <div>
                                            <input
                                                required
                                                placeholder="Clinic Name"
                                                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-4 text-white placeholder:text-slate-600 focus:border-indigo-500 outline-none transition-colors"
                                                value={formData.clinic}
                                                onChange={e => setFormData({ ...formData, clinic: e.target.value })}
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <input
                                                required
                                                placeholder="Mobile"
                                                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-4 text-white placeholder:text-slate-600 focus:border-indigo-500 outline-none transition-colors"
                                                value={formData.mobile}
                                                onChange={e => setFormData({ ...formData, mobile: e.target.value })}
                                            />
                                            <input
                                                required
                                                placeholder="Email"
                                                type="email"
                                                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-4 text-white placeholder:text-slate-600 focus:border-indigo-500 outline-none transition-colors"
                                                value={formData.email}
                                                onChange={e => setFormData({ ...formData, email: e.target.value })}
                                            />
                                        </div>

                                        <button
                                            disabled={status === 'LOADING'}
                                            type="submit"
                                            className="w-full py-5 bg-white hover:bg-slate-200 text-black rounded-xl font-black text-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                                        >
                                            {status === 'LOADING' ? 'Processing...' : 'Secure My Spot'}
                                        </button>
                                    </form>
                                </>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default LandingPage;
