import React from 'react';
import { SEOHead } from '../components/SEO/SEOHead';
import Footer from '../components/landing/Footer';
import { Check, X, ArrowRight, Sparkles, Building2, Users, Crown } from 'lucide-react';
import { Link } from 'react-router-dom';

const TIERS = [
    {
        key: 'starter',
        name: 'Starter',
        icon: <Sparkles size={20} />,
        price: '₹4,999',
        period: '/month',
        sub: 'For solo practitioners & single-location practices',
        cta: 'Start free trial',
        highlight: false,
        features: [
            { yes: true, text: 'Up to 500 active patients' },
            { yes: true, text: 'White-label patient PWA (your brand)' },
            { yes: true, text: 'Automated re-care reminders' },
            { yes: true, text: 'Loyalty tier system (Silver / Gold)' },
            { yes: true, text: 'Branded social post generator' },
            { yes: true, text: 'Patient intake forms' },
            { yes: true, text: 'WhatsApp support' },
            { yes: false, text: 'Multi-location dashboard' },
            { yes: false, text: 'Household points pooling' },
            { yes: false, text: 'Custom PMS integration' },
            { yes: false, text: 'Dedicated success manager' },
        ],
    },
    {
        key: 'growth',
        name: 'Growth',
        icon: <Users size={20} />,
        price: '₹14,999',
        period: '/month',
        sub: 'For multi-doctor practices & small groups',
        cta: 'Start free trial',
        highlight: true,
        features: [
            { yes: true, text: 'Up to 5,000 active patients' },
            { yes: true, text: 'Everything in Starter' },
            { yes: true, text: 'Multi-location dashboard (up to 3)' },
            { yes: true, text: 'Household points pooling' },
            { yes: true, text: 'Platinum tier + custom rules' },
            { yes: true, text: 'AI social post studio' },
            { yes: true, text: 'Live protocol monitor' },
            { yes: true, text: 'Standard PMS integration' },
            { yes: true, text: 'Priority email + chat support' },
            { yes: false, text: 'Dedicated success manager' },
            { yes: false, text: 'White-glove onboarding' },
        ],
    },
    {
        key: 'enterprise',
        name: 'Enterprise',
        icon: <Crown size={20} />,
        price: 'Custom',
        period: '',
        sub: 'For DSOs, franchises & 50+ location groups',
        cta: 'Talk to sales',
        highlight: false,
        features: [
            { yes: true, text: 'Unlimited patients' },
            { yes: true, text: 'Everything in Growth' },
            { yes: true, text: 'Unlimited locations' },
            { yes: true, text: 'Custom PMS / EHR integration' },
            { yes: true, text: 'SSO + role-based access' },
            { yes: true, text: 'Custom loyalty programs' },
            { yes: true, text: 'Dedicated success manager' },
            { yes: true, text: 'White-glove onboarding' },
            { yes: true, text: 'SLA-backed 99.9% uptime' },
            { yes: true, text: 'BAA & HIPAA documentation' },
            { yes: true, text: 'Quarterly business reviews' },
        ],
    },
];

const FAQS = [
    { q: 'Can I switch tiers later?', a: 'Yes — upgrade or downgrade anytime. Prorated billing handles the math automatically.' },
    { q: 'Do you offer a free trial?', a: 'Yes, 14 days on Starter and Growth tiers. No credit card required.' },
    { q: 'What if I have more than one practice management system (PMS)?', a: 'Enterprise plans include custom PMS integration. We have readymade connectors for Dentrix, Eaglesoft, and Open Dental.' },
    { q: 'Is there a setup fee?', a: 'No setup fee on Starter and Growth. Enterprise includes white-glove onboarding at no extra cost.' },
    { q: 'How is "active patient" counted?', a: 'Any patient with at least one appointment in the last 18 months. We import your existing data on day 1.' },
    { q: 'Do you handle payments in-app?', a: 'Yes — built on Stripe. Patients pay invoices via the app; funds settle to your bank in T+2.' },
];

export const PricingPage: React.FC = () => {
    return (
        <div className="bg-slate-50 min-h-screen font-sans selection:bg-teal-100 selection:text-teal-900 overflow-x-hidden">
            <SEOHead
                title="RetainOS Pricing — Dental Practice Management Plans"
                description="Transparent pricing for solo practices, multi-location groups, and DSOs. Branded patient app, automated recall, loyalty tiers, and analytics. 14-day free trial."
                url="https://app.retaindental.com/pricing"
                keywords={['dental software pricing', 'dental patient app cost', 'dental CRM pricing', 'dental practice management pricing', 'DSO software pricing']}
                faqs={FAQS}
                breadcrumbs={[
                    { name: 'Home', url: 'https://app.retaindental.com/' },
                    { name: 'Pricing', url: 'https://app.retaindental.com/pricing' },
                ]}
            />

            {/* Nav */}
            <nav className="fixed top-0 w-full z-50 border-b border-slate-100 bg-white/80 backdrop-blur-xl">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-2.5">
                        <div className="w-8 h-8 bg-teal-600 rounded-lg flex items-center justify-center text-white shadow-sm">
                            <Building2 size={16} />
                        </div>
                        <span className="text-lg font-black text-slate-900 tracking-tighter">Retain<span className="text-teal-600">OS</span></span>
                    </Link>
                    <Link to="/" className="text-sm font-semibold text-slate-500 hover:text-teal-600 transition-colors">← Back home</Link>
                </div>
            </nav>

            {/* Hero */}
            <section className="pt-32 pb-16 px-6 bg-white">
                <div className="max-w-4xl mx-auto text-center space-y-6">
                    <span className="inline-flex items-center gap-2 px-3 py-1 bg-teal-50 border border-teal-100 rounded-full text-xs font-bold text-teal-700 uppercase tracking-widest">
                        Transparent pricing
                    </span>
                    <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tighter leading-[1.05]">
                        One platform. <br />
                        <span className="text-teal-600">Three sizes.</span>
                    </h1>
                    <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
                        No setup fees. No per-feature upcharges. Pay for the number of patients
                        you actually have, not a guess from a sales rep.
                    </p>
                </div>
            </section>

            {/* Tiers */}
            <section className="py-12 px-6 bg-white">
                <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-6">
                    {TIERS.map(t => (
                        <div key={t.key} className={`relative rounded-3xl p-8 ${t.highlight ? 'bg-slate-900 text-white shadow-2xl shadow-slate-900/20 ring-2 ring-teal-500' : 'bg-white border border-slate-200 shadow-sm'}`}>
                            {t.highlight && (
                                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-teal-500 text-white text-[10px] font-black uppercase tracking-widest rounded-full">Most Popular</div>
                            )}
                            <div className="flex items-center gap-3 mb-4">
                                <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${t.highlight ? 'bg-teal-500/20 text-teal-400' : 'bg-teal-50 text-teal-600'}`}>
                                    {t.icon}
                                </div>
                                <h2 className="text-2xl font-black tracking-tight">{t.name}</h2>
                            </div>
                            <div className="mb-2">
                                <span className="text-5xl font-black tracking-tighter">{t.price}</span>
                                <span className={`text-sm font-bold ${t.highlight ? 'text-slate-400' : 'text-slate-500'}`}>{t.period}</span>
                            </div>
                            <p className={`text-sm ${t.highlight ? 'text-slate-300' : 'text-slate-500'} mb-6`}>{t.sub}</p>
                            <Link to={t.key === 'enterprise' ? '/contact' : '/login'} className={`block text-center w-full py-3 rounded-full font-bold transition-all ${t.highlight ? 'bg-teal-500 hover:bg-teal-400 text-white' : 'bg-slate-900 hover:bg-slate-800 text-white'}`}>
                                {t.cta} <ArrowRight size={14} className="inline ml-1" />
                            </Link>
                            <ul className="mt-6 space-y-2.5">
                                {t.features.map((f, i) => (
                                    <li key={i} className="flex items-start gap-2 text-sm">
                                        {f.yes
                                            ? <Check size={16} className="text-teal-400 mt-0.5 shrink-0" />
                                            : <X size={16} className={`${t.highlight ? 'text-slate-600' : 'text-slate-300'} mt-0.5 shrink-0`} />}
                                        <span className={f.yes ? (t.highlight ? 'text-slate-200' : 'text-slate-700') : (t.highlight ? 'text-slate-500 line-through' : 'text-slate-400 line-through')}>{f.text}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </section>

            {/* FAQ */}
            <section className="py-20 px-6 bg-slate-50">
                <div className="max-w-3xl mx-auto">
                    <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight text-center mb-10">Frequently asked questions</h2>
                    <div className="space-y-3">
                        {FAQS.map((f, i) => (
                            <details key={i} className="group bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
                                <summary className="cursor-pointer flex items-center justify-between font-bold text-slate-900 list-none">
                                    <span>{f.q}</span>
                                    <span className="text-teal-600 group-open:rotate-45 transition-transform text-xl leading-none">+</span>
                                </summary>
                                <p className="mt-3 text-slate-600 text-sm leading-relaxed">{f.a}</p>
                            </details>
                        ))}
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="py-20 px-6 bg-teal-900 text-center">
                <h2 className="text-3xl md:text-5xl font-black text-white tracking-tighter mb-4">Still deciding?</h2>
                <p className="text-teal-200 mb-8 max-w-xl mx-auto">Talk to a real human. No demo gauntlet, no marketing email drip. Just answers.</p>
                <Link to="/login" className="inline-block px-8 py-4 bg-white text-teal-900 rounded-full font-black text-lg hover:scale-105 transition-transform">
                    Book a 15-min call →
                </Link>
            </section>

            <Footer />
        </div>
    );
};
