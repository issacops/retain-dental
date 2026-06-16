import React from 'react';
import { SEOHead } from '../components/SEO/SEOHead';
import Footer from '../components/landing/Footer';
import { Link } from 'react-router-dom';
import { Building2, Check, X, ArrowRight, Sparkles } from 'lucide-react';

const ROWS = [
    { feature: 'White-label patient app (your brand, your domain)', retain: true, yapi: false, solutionreach: false },
    { feature: 'Branded social post generator', retain: true, yapi: false, solutionreach: false },
    { feature: 'Loyalty tier system (Silver / Gold / Platinum)', retain: true, yapi: false, solutionreach: false },
    { feature: 'Household points pooling', retain: true, yapi: false, solutionreach: false },
    { feature: 'Live protocol monitor (Invisalign, implants)', retain: true, yapi: false, solutionreach: false },
    { feature: 'Multi-location dashboard', retain: true, yapi: true, solutionreach: true },
    { feature: 'Automated re-care recall', retain: true, yapi: true, solutionreach: true },
    { feature: 'Two-way texting', retain: true, yapi: true, solutionreach: true },
    { feature: 'Patient intake forms', retain: true, yapi: true, solutionreach: true },
    { feature: 'In-app invoice payment (Stripe)', retain: true, yapi: false, solutionreach: true },
    { feature: 'Insurance verification', retain: false, yapi: true, solutionreach: true },
    { feature: 'Native iOS + Android app', retain: true, yapi: false, solutionreach: true },
    { feature: 'Transparent self-serve pricing', retain: true, yapi: false, solutionreach: false },
    { feature: 'Time to live', retain: '20 min', yapi: '1-2 weeks', solutionreach: '1-2 weeks' },
] as const;

const Cell: React.FC<{ v: any }> = ({ v }) => {
    if (v === true) return <Check size={18} className="text-teal-500 mx-auto" />;
    if (v === false) return <X size={18} className="text-slate-300 mx-auto" />;
    return <span className="text-xs font-bold text-slate-700">{v}</span>;
};

export const VsYapiPage: React.FC = () => {
    return (
        <div className="bg-slate-50 min-h-screen font-sans selection:bg-teal-100 selection:text-teal-900">
            <SEOHead
                title="RetainOS vs Yapi — Patient Engagement Comparison"
                description="RetainOS vs Yapi: feature-by-feature comparison for dental patient engagement. Branded app, loyalty tiers, and social studio — features Yapi doesn't ship."
                url="https://app.retaindental.com/vs-yapi"
                keywords={['RetainOS vs Yapi', 'Yapi alternative', 'dental patient engagement Yapi', 'Yapi dental comparison']}
                breadcrumbs={[
                    { name: 'Home', url: 'https://app.retaindental.com/' },
                    { name: 'Vs Yapi', url: 'https://app.retaindental.com/vs-yapi' },
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

            <section className="pt-32 pb-12 px-6 bg-white">
                <div className="max-w-4xl mx-auto text-center space-y-5">
                    <span className="inline-flex items-center gap-2 px-3 py-1 bg-teal-50 border border-teal-100 rounded-full text-xs font-bold text-teal-700 uppercase tracking-widest">
                        Comparison
                    </span>
                    <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter leading-[1.05]">
                        RetainOS vs <span className="text-teal-600">Yapi</span>
                    </h1>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                        Yapi is the workhorse of dental patient communication. RetainOS is what you put
                        on top — the brand, the loyalty, and the patient app.
                    </p>
                </div>
            </section>

            <section className="py-12 px-6 bg-white">
                <div className="max-w-6xl mx-auto">
                    <div className="overflow-x-auto bg-white rounded-3xl border border-slate-200 shadow-sm">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-slate-200">
                                    <th className="text-left p-5 font-black text-slate-700 w-2/5">Feature</th>
                                    <th className="p-5 font-black text-teal-600 bg-teal-50/50 w-1/5">RetainOS</th>
                                    <th className="p-5 font-black text-slate-600 w-1/5">Yapi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {ROWS.map((r, i) => (
                                    <tr key={i} className="border-b border-slate-100 last:border-0">
                                        <td className="p-4 text-slate-700">{r.feature}</td>
                                        <td className="p-4 text-center bg-teal-50/30"><Cell v={r.retain} /></td>
                                        <td className="p-4 text-center"><Cell v={r.yapi} /></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>

            <section className="py-20 px-6 bg-slate-50">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight text-center mb-10">Where Yapi wins</h2>
                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="bg-white rounded-2xl p-6 border border-slate-200">
                            <Sparkles size={20} className="text-slate-400 mb-3" />
                            <h3 className="font-black text-slate-900 mb-1">Insurance verification</h3>
                            <p className="text-sm text-slate-600">Yapi has a 200+ insurance database integrated. RetainOS doesn't touch insurance workflows yet.</p>
                        </div>
                        <div className="bg-white rounded-2xl p-6 border border-slate-200">
                            <Sparkles size={20} className="text-slate-400 mb-3" />
                            <h3 className="font-black text-slate-900 mb-1">Intra-office chat</h3>
                            <p className="text-sm text-slate-600">Yapi's team chat is solid. RetainOS focuses on the patient-facing experience.</p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-20 px-6 bg-teal-900 text-center">
                <h2 className="text-3xl md:text-5xl font-black text-white tracking-tighter mb-4">Try RetainOS for 14 days.</h2>
                <p className="text-teal-200 mb-8 max-w-xl mx-auto">Layer it on top of your existing stack. Or replace what you have. Either way, 14 days free.</p>
                <Link to="/login" className="inline-block px-8 py-4 bg-white text-teal-900 rounded-full font-black text-lg hover:scale-105 transition-transform">
                    Start free trial →
                </Link>
            </section>

            <Footer />
        </div>
    );
};
