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
import FAQSection from '../components/landing/FAQSection'; // ADDED

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
            description: 'Don’t just give them a toothbrush. Give them a 24/7 digital companion. From automated aftercare checklists to instant biometric login, you own the home screen.',
            features: [
                { icon: <Check />, label: 'Automated Aftercare', desc: 'Daily interactive checklists for Aligners, Implants, and more. Zero nagging required.' },
                { icon: <ScanFace />, label: 'Biometric Access', desc: 'FaceID login. Zero friction, zero forgotten passwords.' },
                { icon: <Calendar />, label: 'One-Tap Booking', desc: 'Real-time sync. Remove the friction of calling the front desk.' }
            ],
            visual: (
                <PhoneMockup className="shadow-2xl rotate-1">
                    <PatientDemo initialTab='CARE' />
                </PhoneMockup>
            )
        },
        {
            id: 'clinic-os',
            title: 'ClinicOS',
            subtitle: 'The "Million Dollar" Dashboard',
            description: 'The cockpit for modern dental entrepreneurs. Process payments, track retention health, and monitor patient adherence in real-time.',
            features: [
                { icon: <Wallet />, label: 'Integrated Billing', desc: 'Collect payments directly from the dashboard. One-click receipts and ledger tracking.' },
                { icon: <Activity />, label: 'Adherence Monitoring', desc: 'See exactly who is wearing their aligners and who is falling behind.' },
                { icon: <Bell />, label: 'Smart Recall', desc: 'Algorithmically determined reactivation. Fill your schedule automatically.' }
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
        <div className="bg-slate-950 min-h-screen font-sans selection:bg-indigo-500/30 selection:text-indigo-200 overflow-x-hidden h-screen overflow-y-auto">

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

            {/* 1.5 TRUST SIGNALS */}
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

            {/* 1.75 THE AGITATE (THE LEAKY BUCKET) - NEW SECTION */}
            <section className="py-24 px-6 bg-slate-950 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-red-500/5 blur-[120px] rounded-full"></div>
                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="flex flex-col md:flex-row gap-16 items-center">
                        <div className="flex-1 space-y-8">
                            <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter leading-tight">
                                Your clinic has a <br />
                                <span className="text-red-500">Leaky Bucket</span> problem.
                            </h2>
                            <p className="text-xl text-slate-400 leading-relaxed">
                                For every 10 new patients you acquire with expensive ads, <strong>6 will never return</strong> for a second visit.
                                You aren't building a practice. You're running a hamster wheel.
                            </p>
                            <div className="grid grid-cols-2 gap-8 pt-4">
                                <div>
                                    <div className="text-3xl font-black text-white mb-1">~$50k</div>
                                    <div className="text-sm text-slate-500 font-bold uppercase tracking-wide">Lost Monthly Revenue</div>
                                </div>
                                <div>
                                    <div className="text-3xl font-black text-white mb-1">45%</div>
                                    <div className="text-sm text-slate-500 font-bold uppercase tracking-wide">Empty Chair Time</div>
                                </div>
                            </div>
                        </div>
                        <div className="flex-1">
                            {/* Visual representation of 'The Old Way' failure */}
                            <div className="p-8 rounded-[2.5rem] bg-slate-900 border border-slate-800 relative">
                                <div className="space-y-4 opacity-50 grayscale">
                                    <div className="flex items-center justify-between p-4 bg-slate-800 rounded-xl border border-slate-700">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-slate-700"></div>
                                            <div className="h-4 w-32 bg-slate-700 rounded-full"></div>
                                        </div>
                                        <div className="h-4 w-12 bg-slate-700 rounded-full opacity-50"></div>
                                    </div>
                                    <div className="flex items-center justify-between p-4 bg-slate-800 rounded-xl border border-slate-700">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-slate-700"></div>
                                            <div className="h-4 w-32 bg-slate-700 rounded-full"></div>
                                        </div>
                                        <div className="h-4 w-12 bg-slate-700 rounded-full opacity-50"></div>
                                    </div>
                                    <div className="flex items-center justify-between p-4 bg-slate-800 rounded-xl border border-slate-700">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-slate-700"></div>
                                            <div className="h-4 w-32 bg-slate-700 rounded-full"></div>
                                        </div>
                                        <div className="h-4 w-12 bg-slate-700 rounded-full opacity-50"></div>
                                    </div>
                                </div>
                                {/* The Warning */}
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-slate-950 border border-red-500/30 p-6 rounded-2xl shadow-2xl text-center w-[80%]">
                                    <div className="w-12 h-12 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mx-auto mb-3">
                                        <X size={24} />
                                    </div>
                                    <h4 className="text-white font-bold text-lg">Recall Failed</h4>
                                    <p className="text-slate-400 text-sm mt-1">Manual SMS ignored. Patient lost to competitor.</p>
                                </div>
                            </div>
                        </div>
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
            <FAQSection />

            {/* 5.5 IMPLEMENTATION TIMELINE - NEW SECTION */}
            <section className="py-32 border-t border-white/5 bg-slate-950">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-20 space-y-4">
                        <span className="text-emerald-500 font-bold tracking-widest uppercase text-sm">Speed to Value</span>
                        <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter">
                            Live in 72 Hours.
                        </h2>
                        <p className="text-slate-400 max-w-2xl mx-auto text-lg">
                            We don't disrupt your workflow. We simply turn on the revenue engine.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-4 gap-8 relative">
                        {/* Connecting Line */}
                        <div className="hidden md:block absolute top-12 left-0 w-full h-1 bg-gradient-to-r from-emerald-500/0 via-emerald-500/20 to-emerald-500/0 -z-10"></div>

                        {[
                            { step: "01", title: "Sync", desc: "We connect to your PMS (Dentrix/EagleSoft) via API." },
                            { step: "02", title: "Configure", desc: "We map your appointment types and retention protocols." },
                            { step: "03", title: "Invite", desc: "We send a 'Magic Link' blast to your active patient base." },
                            { step: "04", title: "Revenue", desc: "Patients download the app, book recare, and pay invoices." }
                        ].map((item, i) => (
                            <div key={i} className="relative pt-8 group">
                                <div className="w-8 h-8 rounded-full bg-slate-900 border-4 border-slate-800 group-hover:border-emerald-500 transition-colors absolute top-8 left-1/2 -translate-x-1/2 -translate-y-1/2 hidden md:block"></div>
                                <div className="text-center space-y-4 p-6 rounded-3xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all">
                                    <div className="text-4xl font-black text-slate-700 group-hover:text-emerald-500/50 transition-colors">{item.step}</div>
                                    <h3 className="text-xl font-bold text-white">{item.title}</h3>
                                    <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
                                </div>
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
