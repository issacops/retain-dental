import React from 'react';
import { SEOHead } from '../components/SEO/SEOHead';
import Footer from '../components/landing/Footer';
import { Link } from 'react-router-dom';
import { Building2, BarChart3, Users, ShieldCheck, Layers, ArrowRight, Check, MapPin, Activity } from 'lucide-react';

const FEATURES = [
    { icon: <BarChart3 size={20} />, title: 'Centralized dashboard', desc: 'Real-time KPIs across every location. Spot underperformers in seconds, not weeks.' },
    { icon: <Users size={20} />, title: 'Household points pooling', desc: 'Families share loyalty balances across all your clinics — drives 3.2x multi-location enrollments.' },
    { icon: <Layers size={20} />, title: 'Multi-brand support', desc: 'Run sub-brands under one organization. Each clinic gets its own app, color, and domain.' },
    { icon: <MapPin size={20} />, title: 'Location-level analytics', desc: 'Drill from network → region → clinic → provider. Each layer surfaces the right metrics.' },
    { icon: <ShieldCheck size={20} />, title: 'SSO + role-based access', desc: 'SAML, OIDC, custom roles for ops, marketing, billing, and clinical teams.' },
    { icon: <Activity size={20} />, title: 'Cross-clinic recall automation', desc: 'One campaign blasts to 50 locations. Patients get the right clinic\'s content automatically.' },
];

export const DsoPage: React.FC = () => {
    return (
        <div className="bg-slate-50 min-h-screen font-sans selection:bg-teal-100 selection:text-teal-900">
            <SEOHead
                title="RetainOS for DSOs — Multi-Location Dental Practice Management"
                description="RetainOS gives DSOs a single patient engagement layer across every location. Centralized dashboard, multi-brand apps, household points, SSO, and cross-clinic recall automation."
                url="https://app.retaindental.com/dso"
                keywords={['DSO software', 'multi-location dental software', 'DSO patient engagement', 'dental support organization platform', 'dental franchise software']}
                breadcrumbs={[
                    { name: 'Home', url: 'https://app.retaindental.com/' },
                    { name: 'For DSOs', url: 'https://app.retaindental.com/dso' },
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

            <section className="pt-32 pb-16 px-6 bg-gradient-to-b from-slate-900 to-slate-800 text-white">
                <div className="max-w-5xl mx-auto text-center space-y-6">
                    <span className="inline-flex items-center gap-2 px-3 py-1 bg-teal-500/10 border border-teal-400/30 rounded-full text-xs font-bold text-teal-300 uppercase tracking-widest">
                        For DSOs
                    </span>
                    <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-[1.05]">
                        One platform. <br />
                        <span className="text-teal-400">Every location.</span>
                    </h1>
                    <p className="text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
                        Run 50 clinics or 500. RetainOS gives your ops team a single command center
                        while each location keeps its own brand and patient experience.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
                        <Link to="/login" className="px-8 py-4 bg-teal-500 text-white rounded-full font-bold hover:bg-teal-400 transition-all shadow-lg shadow-teal-500/30 flex items-center justify-center gap-2">
                            Request DSO demo <ArrowRight size={18} />
                        </Link>
                        <Link to="/pricing" className="px-8 py-4 bg-white/10 backdrop-blur text-white border border-white/20 rounded-full font-bold hover:bg-white/20 transition-all flex items-center justify-center">
                            See Enterprise pricing
                        </Link>
                    </div>
                </div>
            </section>

            <section className="py-24 px-6 bg-white">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16 space-y-4">
                        <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter">
                            Built for the way <br /><span className="text-teal-600">DSOs actually operate.</span>
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

            <section className="py-20 px-6 bg-slate-50">
                <div className="max-w-4xl mx-auto">
                    <div className="bg-white rounded-3xl p-10 border border-slate-200 shadow-xl">
                        <p className="text-[10px] font-black text-teal-600 uppercase tracking-widest mb-3">By the numbers</p>
                        <h3 className="text-3xl font-black text-slate-900 mb-6">What multi-location operators get with RetainOS.</h3>
                        <div className="grid grid-cols-3 gap-6">
                            {[
                                { val: '50+', label: 'Locations supported per org' },
                                { val: '4 min', label: 'Time to add a new clinic' },
                                { val: '3.2x', label: 'Multi-clinic enrollments vs single-clinic app' },
                            ].map((s, i) => (
                                <div key={i} className="text-center">
                                    <p className="text-4xl font-black text-teal-600 mb-1">{s.val}</p>
                                    <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">{s.label}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-20 px-6 bg-teal-900 text-center">
                <h2 className="text-3xl md:text-5xl font-black text-white tracking-tighter mb-4">Ready to consolidate your stack?</h2>
                <p className="text-teal-200 mb-8 max-w-xl mx-auto">Most DSOs retire 3-4 vendors within 90 days of switching.</p>
                <Link to="/login" className="inline-block px-8 py-4 bg-white text-teal-900 rounded-full font-black text-lg hover:scale-105 transition-transform">
                    Book a DSO demo →
                </Link>
            </section>

            <Footer />
        </div>
    );
};
