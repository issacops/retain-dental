import { SEOHead } from '../components/SEO/SEOHead';
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
import ConsolidationSection from '../components/landing/ConsolidationSection'; // ADDED
import Footer from '../components/landing/Footer'; // ADDED
import CaseStudySection from '../components/landing/CaseStudySection'; // ADDED

import SocialStudioSection from '../components/landing/SocialStudioSection'; // ADDED
import ClinicalSpeedSection from '../components/landing/ClinicalSpeedSection'; // ADDED

interface LandingPageProps {
    backend: IBackendService;
}

export const LandingPage: React.FC<LandingPageProps> = ({ backend }) => {
    // ... [State Logic Remains Same] ...
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
            subtitle: 'The Experience Layer',
            description: 'Don’t just give them a toothbrush. Give them a 24/7 digital companion. Whether it’s tracking Invisalign trays or monitoring Implant healing, you own the home screen.',
            features: [
                { icon: <Check />, label: 'Clinical Care Tracks', desc: 'Automated aftercare for Invisalign, Implants, and Veneers. Tracking tray switches and post-op hygiene.' },
                { icon: <ScanFace />, label: 'Biometric Access', desc: 'FaceID login. Zero friction. 50% higher adoption than portal apps.' },
                { icon: <Calendar />, label: 'Real-Time Booking', desc: 'Direct write-back to Dentrix/EagleSoft. No double bookings. No "request mode".' }
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
            description: 'The cockpit for modern DSOs. Centralize operations across 50 locations or run a single private practice with the efficiency of a Fortune 500 company.',
            features: [
                { icon: <Wallet />, label: 'Centralized Billing', desc: 'Collect payments via text/app. Reconcile ledgers across multiple locations in one click.' },
                { icon: <Activity />, label: 'Retention Health', desc: 'Monitor "Active Patient" vs "Recall Due" in real-time. Spot leaky buckets instantly.' },
                { icon: <Bell />, label: 'Automated Reactivation', desc: 'Algorithmically fill your hygiene schedule. Replace your full-time recall coordinator.' }
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
                { icon: <Trophy />, label: 'Status Tiers', desc: 'Drive behavior with Gold & Platinum status. Gamify oral health adherence.' },
                { icon: <Users />, label: 'Household Multiplier', desc: 'Families pool points together. One patient brings three more (Mom, Dad, Kids).' },
                { icon: <Globe />, label: 'Viral Referrals', desc: 'Turn your patient base into your most effective marketing team. $0 CAC.' }
            ],
            visual: (
                <PhoneMockup className="shadow-2xl -rotate-1">
                    <PatientDemo initialTab='WALLET' />
                </PhoneMockup>
            )
        }
    ];

    return (
        <div className="bg-slate-50 min-h-screen font-sans selection:bg-primary-100 selection:text-primary-900 overflow-x-hidden h-screen overflow-y-auto">
            <SEOHead />


            {/* Navbar - Glass Light */}
            <nav className="fixed top-0 w-full z-50 border-b border-white/60 bg-white/80 backdrop-blur-xl shadow-sm">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary-600/20 text-white">
                            <LayoutGrid size={20} />
                        </div>
                        <span className="text-xl font-black text-slate-900 tracking-tighter">Retain<span className="text-primary-600">OS</span></span>
                    </div>

                    <div className="flex items-center gap-4">
                        <a href="/login" className="text-sm font-bold text-slate-600 hover:text-primary-600 transition-colors hidden md:block">
                            Member Login
                        </a>
                        <button onClick={() => setIsWaitlistOpen(true)} className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-full text-xs font-bold uppercase tracking-widest transition-all shadow-md">
                            Get Early Access
                        </button>
                    </div>
                </div>
            </nav>

            {/* 1. HERO (UPDATED COPY) */}
            <HeroSection onJoinWaitlist={() => setIsWaitlistOpen(true)} />

            {/* 1.5 TRUST SIGNALS - Light Theme */}
            <section className="py-10 border-y border-slate-200 bg-white overflow-hidden">
                <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-8">
                    <p className="text-sm font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">Trusted by modern DSOs</p>
                    <div className="flex items-center gap-12 opacity-30 grayscale mix-blend-multiply overflow-x-auto w-full md:w-auto no-scrollbar mask-linear-fade">
                        {['Aspen Dental', 'Pacific Dental', 'Heartland', 'Smile Brands', 'Deca Dental'].map((name, i) => (
                            <span key={i} className="text-xl font-black text-slate-900 whitespace-nowrap">{name}</span>
                        ))}
                    </div>
                </div>
            </section>

            {/* 1.75 THE AGITATE (THE LEAKY BUCKET) - LIGHT THEME */}
            <section className="py-24 px-6 bg-slate-50 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-red-500/5 blur-[120px] rounded-full mix-blend-multiply"></div>
                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="flex flex-col md:flex-row gap-16 items-center">
                        <div className="flex-1 space-y-8">
                            <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter leading-tight">
                                Your clinic has a <br />
                                <span className="text-red-500">Leaky Bucket</span> problem.
                            </h2>
                            <p className="text-xl text-slate-600 leading-relaxed">
                                For every 10 new patients you acquire with expensive ads, <strong>6 will never return</strong> for a second visit.
                                You aren't building a practice. You're running a hamster wheel.
                            </p>
                            <div className="grid grid-cols-2 gap-8 pt-4">
                                <div>
                                    <div className="text-3xl font-black text-slate-900 mb-1">~$50k</div>
                                    <div className="text-sm text-slate-500 font-bold uppercase tracking-wide">Lost Monthly Revenue</div>
                                </div>
                                <div>
                                    <div className="text-3xl font-black text-slate-900 mb-1">45%</div>
                                    <div className="text-sm text-slate-500 font-bold uppercase tracking-wide">Empty Chair Time</div>
                                </div>
                            </div>
                        </div>
                        <div className="flex-1">
                            {/* Visual representation of 'The Old Way' failure */}
                            <div className="p-8 rounded-[2.5rem] bg-white border border-slate-200 shadow-xl shadow-slate-200/50 relative">
                                <div className="space-y-4 opacity-30 grayscale">
                                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-slate-200"></div>
                                            <div className="h-4 w-32 bg-slate-200 rounded-full"></div>
                                        </div>
                                        <div className="h-4 w-12 bg-slate-200 rounded-full opacity-50"></div>
                                    </div>
                                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-slate-200"></div>
                                            <div className="h-4 w-32 bg-slate-200 rounded-full"></div>
                                        </div>
                                        <div className="h-4 w-12 bg-slate-200 rounded-full opacity-50"></div>
                                    </div>
                                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-slate-200"></div>
                                            <div className="h-4 w-32 bg-slate-200 rounded-full"></div>
                                        </div>
                                        <div className="h-4 w-12 bg-slate-200 rounded-full opacity-50"></div>
                                    </div>
                                </div>
                                {/* The Warning */}
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white border border-red-500/20 p-6 rounded-2xl shadow-2xl shadow-red-500/10 text-center w-[80%]">
                                    <div className="w-12 h-12 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-3">
                                        <X size={24} />
                                    </div>
                                    <h4 className="text-slate-900 font-bold text-lg">Recall Failed</h4>
                                    <p className="text-slate-500 text-sm mt-1">Manual SMS ignored. Patient lost to competitor.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 3. ROI CALCULATOR (MOVED UP FOR VISCERAL IMPACT) */}
            <RoiCalculator />

            {/* 2. COMPARISON (THE SHIFT) - MOVED DOWN AFTER ROI */}
            <Comparison />

            {/* NEW: SOCIAL STUDIO SECTION */}
            <SocialStudioSection />

            {/* NEW: CLINICAL SPEED SECTION */}
            <ClinicalSpeedSection />

            {/* 3.5 CONSOLIDATION (THE PLATFORM ARGUMENT) */}
            <ConsolidationSection />

            {/* 4. SCROLLY TELLING (PRODUCT PILLARS) */}
            <ScrollyTell pillars={productPillars} />

            {/* 5. BRAND IDENTITY SHOWCASE (THE CHAMELEON) */}
            <BrandShowcase />

            {/* 5.5 CASE STUDY (SOCIAL PROOF) */}
            <CaseStudySection />

            {/* 6. FAQ (OBJECTION HANDLING) */}
            <FAQSection />

            {/* 5.5 IMPLEMENTATION TIMELINE - NEW SECTION */}
            <section className="py-32 border-t border-slate-200 bg-white">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-20 space-y-4">
                        <span className="text-emerald-600 font-bold tracking-widest uppercase text-sm">Speed to Value</span>
                        <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter">
                            Live in 20 Minutes.
                        </h2>
                        <p className="text-slate-500 max-w-2xl mx-auto text-lg">
                            No downtime. No IT team required. We sync your data while you grab a coffee.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-4 gap-8 relative">
                        {/* Connecting Line */}
                        <div className="hidden md:block absolute top-12 left-0 w-full h-1 bg-gradient-to-r from-emerald-500/0 via-emerald-100 to-emerald-500/0 -z-10"></div>

                        {[
                            { step: "01", title: "Sync", desc: "We connect to your PMS (Dentrix/EagleSoft) via API." },
                            { step: "02", title: "Configure", desc: "We map your appointment types and retention protocols." },
                            { step: "03", title: "Invite", desc: "We send a 'Magic Link' blast to your active patient base." },
                            { step: "04", title: "Revenue", desc: "Patients download the app, book recare, and pay invoices." }
                        ].map((item, i) => (
                            <div key={i} className="relative pt-8 group">
                                <div className="w-8 h-8 rounded-full bg-white border-4 border-slate-100 group-hover:border-emerald-500 transition-colors absolute top-8 left-1/2 -translate-x-1/2 -translate-y-1/2 hidden md:block z-10"></div>
                                <div className="text-center space-y-4 p-6 rounded-3xl bg-slate-50 border border-slate-100 hover:bg-white hover:shadow-lg transition-all">
                                    <div className="text-4xl font-black text-slate-200 group-hover:text-emerald-500 transition-colors">{item.step}</div>
                                    <h3 className="text-xl font-bold text-slate-900">{item.title}</h3>
                                    <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 5. TRUST & SECURITY */}
            <section className="py-24 border-t border-slate-200 bg-slate-50">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <p className="text-slate-400 uppercase tracking-widest text-sm font-bold mb-12">Trusted Enterprise Infrastructure</p>
                    <div className="flex flex-wrap justify-center gap-12 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                        <div className="flex items-center gap-2 text-slate-700 font-bold text-xl"><ShieldCheckIcon /> HIPAA Compliant</div>
                        <div className="flex items-center gap-2 text-slate-700 font-bold text-xl"><ShieldCheckIcon /> SOC2 Ready</div>
                        <div className="flex items-center gap-2 text-slate-700 font-bold text-xl"><ShieldCheckIcon /> 99.9% Uptime</div>
                        <div className="flex items-center gap-2 text-slate-700 font-bold text-xl"><ShieldCheckIcon /> AES-256 Encrypted</div>
                    </div>
                </div>
            </section>

            {/* 6. CTA */}
            <section className="py-32 px-6 relative overflow-hidden bg-primary-900">
                <div className="absolute inset-0 bg-primary-950 opacity-50"></div>
                <div className="max-w-4xl mx-auto text-center relative z-10 space-y-8">
                    <h2 className="text-5xl md:text-7xl font-black text-white tracking-tighter">
                        Scale your retention.
                    </h2>
                    <p className="text-xl text-primary-200 max-w-xl mx-auto">
                        Join the highest-performing dental groups in the world.
                    </p>
                    <button onClick={() => setIsWaitlistOpen(true)} className="px-10 py-5 bg-white text-primary-900 rounded-full font-black text-xl hover:scale-105 transition-transform flex items-center gap-2 mx-auto shadow-2xl">
                        Request Enterprise Demo <ArrowRight />
                    </button>
                </div>
            </section>

            {/* WAITLIST MODAL (Light Theme) */}
            <AnimatePresence>
                {isWaitlistOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center px-4 bg-slate-900/50 backdrop-blur-md"
                    >
                        <motion.div
                            initial={{ scale: 0.95, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.95, y: 20 }}
                            className="bg-white p-8 md:p-12 rounded-[2rem] w-full max-w-lg shadow-2xl relative overflow-hidden"
                        >
                            <button onClick={() => setIsWaitlistOpen(false)} className="absolute top-6 right-6 p-2 bg-slate-100 rounded-full text-slate-400 hover:text-slate-900 transition-colors">
                                <X size={20} />
                            </button>

                            {status === 'SUCCESS' ? (
                                <div className="py-20 text-center space-y-6">
                                    <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Check size={40} />
                                    </div>
                                    <h3 className="text-3xl font-black text-slate-900">Request Received.</h3>
                                    <p className="text-slate-500 font-medium">Our enterprise team will contact you shortly.</p>
                                </div>
                            ) : (
                                <>
                                    <div className="mb-10">
                                        <h3 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Enterprise Access</h3>
                                        <p className="text-slate-500 font-medium">Schedule a demo of the RetainOS platform.</p>
                                    </div>

                                    <form onSubmit={handleJoin} className="space-y-5">
                                        <div>
                                            <input
                                                required
                                                placeholder="Doctor Name"
                                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-4 text-slate-900 placeholder:text-slate-400 focus:border-primary-500 outline-none transition-colors"
                                                value={formData.name}
                                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                            />
                                        </div>
                                        <div>
                                            <input
                                                required
                                                placeholder="Clinic/DSO Name"
                                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-4 text-slate-900 placeholder:text-slate-400 focus:border-primary-500 outline-none transition-colors"
                                                value={formData.clinic}
                                                onChange={e => setFormData({ ...formData, clinic: e.target.value })}
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <input
                                                required
                                                placeholder="Mobile"
                                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-4 text-slate-900 placeholder:text-slate-400 focus:border-primary-500 outline-none transition-colors"
                                                value={formData.mobile}
                                                onChange={e => setFormData({ ...formData, mobile: e.target.value })}
                                            />
                                            <input
                                                required
                                                placeholder="Work Email"
                                                type="email"
                                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-4 text-slate-900 placeholder:text-slate-400 focus:border-primary-500 outline-none transition-colors"
                                                value={formData.email}
                                                onChange={e => setFormData({ ...formData, email: e.target.value })}
                                            />
                                        </div>

                                        <button
                                            disabled={status === 'LOADING'}
                                            type="submit"
                                            className="w-full py-5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-black text-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg"
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

            {/* 7. FOOTER */}
            <Footer />

        </div>
    );
};

const ShieldCheckIcon = () => <Shield className="text-emerald-400" size={20} />;
