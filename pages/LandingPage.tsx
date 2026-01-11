import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Check,
    X,
    LayoutGrid,
    Trophy,
    ArrowRight,
    ScanFace,
    Calendar,
    Wallet,
    Bell,
    Shield,
    Globe,
    Activity,
    Users
} from 'lucide-react';
import { IBackendService } from '../services/IBackendService';
import HeroSection from '../components/landing/HeroSection';
import PhoneMockup from '../components/landing/PhoneMockup';
import RoiCalculator from '../components/landing/RoiCalculator';
import ScrollyTell from '../components/landing/ScrollyTell';
import PatientDemo from '../components/landing/demos/PatientDemo';
import ClinicDemo from '../components/landing/demos/ClinicDemo';
import BrandShowcase from '../components/landing/BrandShowcase';
import Comparison from '../components/landing/Comparison'; // ADDED

interface LandingPageProps {
    backend: IBackendService;
}

export const LandingPage: React.FC<LandingPageProps> = ({ backend }) => {
    // Waitlist Form State
    const [isWaitlistOpen, setIsWaitlistOpen] = useState(false);
    const [status, setStatus] = useState<'IDLE' | 'LOADING' | 'SUCCESS' | 'ERROR'>('IDLE');
    const [formData, setFormData] = useState({ name: '', clinic: '', mobile: '', email: '' });

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

    // SCROLLY TELLING DATA
    const productPillars = [
        {
            id: 'patient-os',
            title: 'PatientOS',
            subtitle: 'The Brand Dominance Layer',
            description: 'Don’t just give them a toothbrush. Give them YOUR clinic on their home screen. Prevent patients from drifting to competitors by owning the digital relationship.',
            features: [
                { icon: <ScanFace />, label: 'Biometric Login', desc: 'FaceID access. Zero friction, zero forgotten passwords.' },
                { icon: <Calendar />, label: 'One-Tap Booking', desc: 'Real-time sync. Remove the friction of calling the front desk.' },
                { icon: <Wallet />, label: 'Medical Wallet', desc: 'Centralize invoices and treatment plans. Total transparency.' }
            ],
            visual: (
                <PhoneMockup className="shadow-2xl rotate-1">
                    <PatientDemo initialTab='HOME' />
                </PhoneMockup>
            )
        },
        {
            id: 'clinic-os',
            title: 'ClinicOS',
            subtitle: 'The Efficiency Layer',
            description: 'Onboard a patient in 12 seconds. No training manual required. Let the OS handle the nagging while you focus on dentistry.',
            features: [
                { icon: <Activity />, label: 'Automated Triage', desc: 'AI reviews scan photos and only flags actual issues to your team.' },
                { icon: <Bell />, label: 'Smart Recall', desc: 'Algorithmically determined reactivation. Fill your schedule automatically.' },
                { icon: <Shield />, label: 'Compliance Guardrails', desc: 'Ensure patients follow protocols without manual intervention.' }
            ],
            visual: (
                <div className="w-full h-full flex items-center justify-center p-4">
                    <ClinicDemo />
                </div>
            )
        },
        {
            id: 'loyalty-engine',
            title: 'LoyaltyEngine',
            subtitle: 'The Growth Layer',
            description: 'The "Amex Effect" for dentistry. Use status tiers to lock patients in, then use Family Pooling to acquire their entire household for free.',
            features: [
                { icon: <Trophy />, label: 'Status Tiers', desc: 'Drive behavior with Gold & Platinum status. Create addiction to progress.' },
                { icon: <Users />, label: 'The Household Multiplier', desc: 'Families pool points together. One patient brings three more.' },
                { icon: <Globe />, label: 'Viral Referrals', desc: 'Turn your patient base into your most effective marketing team.' }
            ],
            visual: (
                <PhoneMockup className="shadow-2xl -rotate-1">
                    <PatientDemo initialTab='WALLET' />
                </PhoneMockup>
            )
        }
    ];

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

            {/* 1. HERO (UPDATED COPY) */}
            <HeroSection onJoinWaitlist={() => setIsWaitlistOpen(true)} />

            {/* 1.5 TRUST SIGNALS (ADDED) */}
            <section className="py-10 border-y border-white/5 bg-black/40 overflow-hidden">
                <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-8">
                    <p className="text-sm font-bold text-slate-500 uppercase tracking-widest whitespace-nowrap">Trusted by modern DSOs</p>
                    <div className="flex items-center gap-12 opacity-40 grayscale mix-blend-screen overflow-x-auto w-full md:w-auto no-scrollbar mask-linear-fade">
                        {['Aspen Dental', 'Pacific Dental', 'Heartland', 'Smile Brands', 'Deca Dental'].map((name, i) => (
                            <span key={i} className="text-xl font-black text-white whitespace-nowrap">{name}</span>
                        ))}
                    </div>
                </div>
            </section>

            {/* 2. COMPARISON (THE SHIFT) - MOVED UP */}
            <Comparison />

            {/* 3. ROI CALCULATOR (THE ECONOMIC ARGUMENT) */}
            <RoiCalculator />

            {/* 4. SCROLLY TELLING (PRODUCT PILLARS) */}
            <ScrollyTell pillars={productPillars} />

            {/* 5. BRAND IDENTITY SHOWCASE (THE CHAMELEON) */}
            <BrandShowcase />

            {/* 6. FAQ (OBJECTION HANDLING) */}
            <section className="py-32 px-6 bg-slate-950 border-t border-white/5">
                <div className="max-w-3xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-black text-white tracking-tighter mb-4">Common Questions</h2>
                    </div>
                    <div className="space-y-4">
                        {[
                            { q: "Does this integrate with my existing PMS?", a: "Yes. We maintain 2-way sync with Dentrix, Eaglesoft, OpenDental, and Cloud 9. Your data is always up to date." },
                            { q: "How difficult is the migration?", a: "We handle the entire migration process. Most clinics go live in under 72 hours with zero downtime." },
                            { q: "Do patients need to download an app?", a: "Yes, but they actually want to. With biometric login and instant booking, adoption rates utilize 85% within 3 months." },
                            { q: "Is my patient data secure?", a: "Absolutely. We are fully HIPAA compliant, SOC2 Type II ready, and use AES-256 encryption for all data at rest and in transit." }
                        ].map((item, i) => (
                            <div key={i} className="p-6 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                                <h4 className="text-lg font-bold text-white mb-2">{item.q}</h4>
                                <p className="text-slate-400 leading-relaxed">{item.a}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 5. TRUST & SECURITY */}
            <section className="py-24 border-t border-white/5 bg-black/40">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <p className="text-slate-500 uppercase tracking-widest text-sm font-bold mb-12">Trusted Enterprise Infrastructure</p>
                    <div className="flex flex-wrap justify-center gap-12 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                        <div className="flex items-center gap-2 text-white font-bold text-xl"><ShieldCheckIcon /> HIPAA Compliant</div>
                        <div className="flex items-center gap-2 text-white font-bold text-xl"><ShieldCheckIcon /> SOC2 Ready</div>
                        <div className="flex items-center gap-2 text-white font-bold text-xl"><ShieldCheckIcon /> 99.9% Uptime</div>
                        <div className="flex items-center gap-2 text-white font-bold text-xl"><ShieldCheckIcon /> AES-256 Encrypted</div>
                    </div>
                </div>
            </section>

            {/* 6. CTA */}
            <section className="py-32 px-6 relative overflow-hidden bg-indigo-950">
                <div className="absolute inset-0 bg-slate-950 opacity-80"></div>
                <div className="max-w-4xl mx-auto text-center relative z-10 space-y-8">
                    <h2 className="text-5xl md:text-7xl font-black text-white tracking-tighter">
                        Scale your retention.
                    </h2>
                    <p className="text-xl text-slate-400 max-w-xl mx-auto">
                        Join the highest-performing dental groups in the world.
                    </p>
                    <button onClick={() => setIsWaitlistOpen(true)} className="px-10 py-5 bg-white text-black rounded-full font-black text-xl hover:scale-105 transition-transform flex items-center gap-2 mx-auto">
                        Request Enterprise Demo <ArrowRight />
                    </button>
                </div>
            </section>

            {/* WAITLIST MODAL (Existing) */}
            <AnimatePresence>
                {isWaitlistOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center px-4 bg-slate-950/90 backdrop-blur-md"
                    >
                        <motion.div
                            initial={{ scale: 0.95, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.95, y: 20 }}
                            className="bg-slate-900 border border-white/10 p-8 md:p-12 rounded-[2rem] w-full max-w-lg shadow-2xl relative overflow-hidden"
                        >
                            <button onClick={() => setIsWaitlistOpen(false)} className="absolute top-6 right-6 p-2 bg-white/5 rounded-full text-slate-400 hover:text-white transition-colors">
                                <X size={20} />
                            </button>

                            {status === 'SUCCESS' ? (
                                <div className="py-20 text-center space-y-6">
                                    <div className="w-20 h-20 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Check size={40} />
                                    </div>
                                    <h3 className="text-3xl font-black text-white">Request Received.</h3>
                                    <p className="text-slate-400 font-medium">Our enterprise team will contact you shortly.</p>
                                </div>
                            ) : (
                                <>
                                    <div className="mb-10">
                                        <h3 className="text-3xl font-black text-white tracking-tight mb-2">Enterprise Access</h3>
                                        <p className="text-slate-400 font-medium">Schedule a demo of the RetainOS platform.</p>
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
                                                placeholder="Clinic/DSO Name"
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
                                                placeholder="Work Email"
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
                                            {status === 'LOADING' ? 'Processing...' : 'Request Demo'}
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

const ShieldCheckIcon = () => <Shield className="text-emerald-400" size={20} />;
