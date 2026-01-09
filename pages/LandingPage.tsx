
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, Shield, Zap, CheckCircle, ChevronRight, Lock } from 'lucide-react';
import { getBackendService } from '../services/BackendFactory';

export const LandingPage = () => {
    const navigate = useNavigate();
    const backend = getBackendService();

    const [formData, setFormData] = useState({
        name: '',
        clinic: '',
        mobile: '',
        email: ''
    });
    const [status, setStatus] = useState<'IDLE' | 'LOADING' | 'SUCCESS' | 'ERROR'>('IDLE');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('LOADING');

        try {
            const result = await backend.joinWaitlist(formData);

            if (result.success) {
                setStatus('SUCCESS');
                setMessage(result.message);
            } else {
                setStatus('ERROR');
                setMessage(result.message);
            }
        } catch (err) {
            setStatus('ERROR');
            setMessage('Something went wrong. Please try again.');
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 text-white selection:bg-indigo-500/30 font-sans overflow-x-hidden">

            {/* --- NAV --- */}
            <nav className="fixed top-0 left-0 w-full z-50 border-b border-white/5 bg-slate-950/80 backdrop-blur-md">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
                            <Activity className="text-white" size={24} />
                        </div>
                        <span className="text-xl font-bold tracking-tight">Retain<span className="text-indigo-400">.OS</span></span>
                    </div>
                    <button
                        onClick={() => navigate('/login')}
                        className="px-5 py-2 text-sm font-medium text-slate-400 hover:text-white transition-colors flex items-center gap-2"
                    >
                        <Lock size={14} />
                        Platform Login
                    </button>
                </div>
            </nav>

            {/* --- HERO --- */}
            <div className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 px-6">

                {/* Background Blobs */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl overflow-hidden pointer-events-none z-0">
                    <div className="absolute top-[-10%] left-[20%] w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[100px] animate-pulse"></div>
                    <div className="absolute bottom-[10%] right-[10%] w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-[80px]"></div>
                </div>

                <div className="relative z-10 max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">

                    {/* LEFT COPY */}
                    <div className="space-y-8">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold tracking-wide uppercase">
                            <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse"></span>
                            Private Beta Access
                        </div>

                        <h1 className="text-5xl lg:text-7xl font-bold tracking-tight leading-[1.1]">
                            The Operating System for <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Modern Dental</span>.
                        </h1>

                        <p className="text-lg text-slate-400 leading-relaxed max-w-xl">
                            Stop using 10 different tools. Retain OS unifies your practice management, patient loyalty, and financial ledger into one stunning, white-labeled platform.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 pt-4">
                            <div className="flex items-center gap-6 text-sm text-slate-400">
                                <div className="flex items-center gap-2">
                                    <CheckCircle size={16} className="text-emerald-500" />
                                    <span>White-labeled PWA</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <CheckCircle size={16} className="text-emerald-500" />
                                    <span>Clinical Protocols</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT FORM */}
                    <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-3xl blur-2xl opacity-20"></div>
                        <div className="relative bg-slate-900/50 border border-white/10 backdrop-blur-xl rounded-3xl p-8 shadow-2xl">

                            {status === 'SUCCESS' ? (
                                <div className="text-center py-12 space-y-4">
                                    <div className="w-16 h-16 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <CheckCircle size={32} />
                                    </div>
                                    <h3 className="text-2xl font-bold text-white">Request Received</h3>
                                    <p className="text-slate-400">Dr. {formData.name}, we have added {formData.clinic} to our priority queue.</p>
                                    <p className="text-slate-500 text-sm">We will contact you via WhatsApp shortly.</p>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-5">
                                    <div className="space-y-2">
                                        <h3 className="text-2xl font-bold text-white">Join the Waitlist</h3>
                                        <p className="text-slate-400 text-sm">Limited spots available for the Pilot Program.</p>
                                    </div>

                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-xs font-medium text-slate-400 mb-1 ml-1">YOUR NAME</label>
                                            <input
                                                required
                                                type="text"
                                                placeholder="Dr. Sarah Smith"
                                                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                                                value={formData.name}
                                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-xs font-medium text-slate-400 mb-1 ml-1">CLINIC NAME</label>
                                            <input
                                                required
                                                type="text"
                                                placeholder="City Dental Care"
                                                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                                                value={formData.clinic}
                                                onChange={e => setFormData({ ...formData, clinic: e.target.value })}
                                            />
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-xs font-medium text-slate-400 mb-1 ml-1">MOBILE</label>
                                                <input
                                                    required
                                                    type="tel"
                                                    placeholder="+91..."
                                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                                                    value={formData.mobile}
                                                    onChange={e => setFormData({ ...formData, mobile: e.target.value })}
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-medium text-slate-400 mb-1 ml-1">EMAIL</label>
                                                <input
                                                    required
                                                    type="email"
                                                    placeholder="doc@example.com"
                                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                                                    value={formData.email}
                                                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <button
                                        disabled={status === 'LOADING'}
                                        type="submit"
                                        className="w-full bg-white text-slate-950 hover:bg-indigo-50 font-bold text-lg py-4 rounded-xl shadow-xl shadow-white/5 transition-all flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed"
                                    >
                                        {status === 'LOADING' ? (
                                            <Activity className="animate-spin" />
                                        ) : (
                                            <>
                                                Request Access
                                                <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform text-indigo-600" />
                                            </>
                                        )}
                                    </button>

                                    {status === 'ERROR' && (
                                        <p className="text-red-400 text-sm text-center">{message}</p>
                                    )}
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* --- FEATURES GRID --- */}
            <div className="border-t border-white/5 bg-slate-900/30">
                <div className="max-w-7xl mx-auto px-6 py-24">
                    <div className="grid md:grid-cols-3 gap-8">
                        <FeatureCard
                            icon={<Shield className="text-indigo-400" />}
                            title="Enterprise-Grade"
                            desc="Bank-level security with complete data isolation for every clinic."
                        />
                        <FeatureCard
                            icon={<Zap className="text-amber-400" />}
                            title="Instant Deployment"
                            desc="Launch your own white-labeled clinic app in less than 60 seconds."
                        />
                        <FeatureCard
                            icon={<Activity className="text-emerald-400" />}
                            title="Clinical Intelligence"
                            desc="Automated treatment protocols that improve patient adherence."
                        />
                    </div>
                </div>
            </div>

            {/* --- FOOTER --- */}
            <div className="border-t border-white/5 py-12 text-center text-slate-500 text-sm">
                <p>&copy; {new Date().getFullYear()} Retain OS. All rights reserved.</p>
            </div>
        </div>
    );
}

const FeatureCard = ({ icon, title, desc }: any) => (
    <div className="p-6 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors">
        <div className="w-12 h-12 bg-slate-900 rounded-lg flex items-center justify-center mb-4">
            {icon}
        </div>
        <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
        <p className="text-slate-400 leading-relaxed">{desc}</p>
    </div>
);
