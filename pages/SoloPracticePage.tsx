import React from 'react';
import { SEOHead } from '../components/SEO/SEOHead';
import Footer from '../components/landing/Footer';
import { Link } from 'react-router-dom';
import { Building2, Smartphone, Sparkles, Calendar, Wallet, Trophy, ArrowRight, Check } from 'lucide-react';

const FEATURES = [
    { icon: <Smartphone size={20} />, title: 'Your brand in their pocket', desc: 'Custom logo, color, and domain. Patients download YOUR app, not "yet another portal".' },
    { icon: <Calendar size={20} />, title: 'Fill empty chairs', desc: 'Automated re-care + recall + birthday campaigns. No-shows drop. Schedules fill.' },
    { icon: <Wallet size={20} />, title: 'Get paid faster', desc: 'In-app invoice pay via Stripe. Patients settle balances in two taps. No more chasing checks.' },
    { icon: <Trophy size={20} />, title: 'Loyalty on autopilot', desc: 'Silver / Gold / Platinum tiers. Patients earn on visits, redeem on whitening, cleanings, and more.' },
    { icon: <Sparkles size={20} />, title: 'Social posts in 30 seconds', desc: 'Pick a template, add a photo, post to Instagram. No designer needed.' },
    { icon: <Check size={20} />, title: 'Up and running in 20 minutes', desc: 'No IT team. No code. We sync with your existing PMS in under an hour.' },
];

export const SoloPracticePage: React.FC = () => {
    return (
        <div className="bg-slate-50 min-h-screen font-sans selection:bg-teal-100 selection:text-teal-900">
            <SEOHead
                title="RetainOS for Solo Practices — Affordable Dental Patient App"
                description="RetainOS Starter is the affordable patient engagement platform for solo dental practices. Launch your branded app in 20 minutes. Automated recall, loyalty tiers, and in-app payments from ₹4,999/mo."
                url="https://app.retaindental.com/solo-practice"
                keywords={['solo dental practice software', 'dental software for small practice', 'affordable dental CRM', 'dental patient app for solo practice', 'dental recall software for solo dentist']}
                breadcrumbs={[
                    { name: 'Home', url: 'https://app.retaindental.com/' },
                    { name: 'For Solo Practices', url: 'https://app.retaindental.com/solo-practice' },
                ]}
            />

            <nav className="fixed top-0 w-full z-50 border-b border-slate-100 bg-white/80 backdrop-blur-xl">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-2.5">
                        <div className="w-8 h-8 bg-teal-600 rounded-lg flex items-center justify-center text-white shadow-sm">
                            <Building2 size={16} />
                        </div>
                        <span className="text-lg font-black text-slate-900 tracking-tighter">Retain<span className="text-teal-600">OS</span></span>
                    </Link>
                    <Link to="/" className="text-sm font-semibold text-slate-500 hover:text-teal-600">← Back home</Link>
                </div>
            </nav>

            <section className="pt-32 pb-16 px-6 bg-gradient-to-b from-[#fdf8f0] to-white">
                <div className="max-w-5xl mx-auto text-center space-y-6">
                    <span className="inline-flex items-center gap-2 px-3 py-1 bg-teal-50 border border-teal-100 rounded-full text-xs font-bold text-teal-700 uppercase tracking-widest">
                        For Solo Practices
                    </span>
                    <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tighter leading-[1.05]">
                        Run your practice <br />
                        <span className="text-teal-600">like a brand.</span>
                    </h1>
                    <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
                        You don't need a marketing team or a 20-location DSO to compete.
                        You need a brand patients actually open on their phone.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
                        <Link to="/login" className="px-8 py-4 bg-teal-600 text-white rounded-full font-bold hover:bg-teal-700 transition-all shadow-lg shadow-teal-600/20 flex items-center justify-center gap-2">
                            Start 14-day free trial <ArrowRight size={18} />
                        </Link>
                        <Link to="/pricing" className="px-8 py-4 bg-white text-slate-700 border border-slate-200 rounded-full font-bold hover:bg-slate-50 transition-all flex items-center justify-center">
                            See pricing
                        </Link>
                    </div>
                </div>
            </section>

            <section className="py-24 px-6 bg-white">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16 space-y-4">
                        <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter">
                            Everything a solo practice needs. <br />
                            <span className="text-teal-600">Nothing it doesn't.</span>
                        </h2>
                    </div>
                    <div className="grid md:grid-cols-3 gap-6">
                        {FEATURES.map((f, i) => (
                            <div key={i} className="bg-slate-50 rounded-3xl p-6 border border-slate-100 hover:shadow-lg transition-all">
                                <div className="h-10 w-10 bg-teal-50 text-teal-600 rounded-xl flex items-center justify-center mb-4">{f.icon}</div>
                                <h3 className="text-lg font-black text-slate-900 mb-2">{f.title}</h3>
                                <p className="text-sm text-slate-600 leading-relaxed">{f.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-16 px-6 bg-slate-50">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
                        <p className="text-[10px] font-black text-teal-600 uppercase tracking-widest mb-3">A 14-day trial. No credit card.</p>
                        <h3 className="text-3xl font-black text-slate-900 mb-2">Try it on your real patients.</h3>
                        <p className="text-slate-600 mb-6">If you don't see a measurable retention lift in 30 days, we'll help you offboard.</p>
                        <Link to="/login" className="inline-block px-8 py-4 bg-teal-600 text-white rounded-full font-bold hover:bg-teal-700 transition-all">
                            Get started free →
                        </Link>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};
