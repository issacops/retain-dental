import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { SupabaseService } from '../services/SupabaseService';
import { ArrowRight, Smartphone, Lock, Activity, Command, Loader2, Sparkles, Shield } from 'lucide-react';
import { Clinic } from '../types';

interface LoginPageProps {
    clinics?: Clinic[];
    activeClinic?: Clinic;
}

export const LoginPage: React.FC<LoginPageProps> = ({ clinics = [], activeClinic }) => {
    const { slug } = useParams();
    const navigate = useNavigate();
    const [mode, setMode] = useState<'CHOICE' | 'PATIENT' | 'DOCTOR'>('CHOICE');
    const [loading, setLoading] = useState(false);
    const [mobile, setMobile] = useState('');
    const [pin, setPin] = useState('');
    const [authEmail, setAuthEmail] = useState('');
    const [authPassword, setAuthPassword] = useState('');
    const [isSignUp, setIsSignUp] = useState(false);

    const querySubdomain = new URLSearchParams(window.location.search).get('subdomain');
    const slugClinic = slug ? clinics.find(c => c.slug === slug) : (querySubdomain ? clinics.find(c => c.slug === querySubdomain) : undefined);
    const targetClinic = slugClinic || activeClinic;
    const isBranded = !!targetClinic && targetClinic.id !== 'platform';
    const brandColor = targetClinic?.primaryColor || '#0d9488';
    const brandName = targetClinic?.name || 'Retain.OS';
    const brandSubtitle = isBranded ? 'Patient Portal & Staff Login' : 'Dental Operating System';

    const handlePatientLogin = async () => {
        if (!mobile || !pin) return;
        const cleanMobile = mobile.toString().replace(/\D/g, '');
        if (cleanMobile.length < 10) {
            alert("Please enter a valid 10-digit mobile number");
            return;
        }
        setLoading(true);
        const email = `${cleanMobile}@retain.dental`;
        const { error } = await supabase.auth.signInWithPassword({ email, password: pin });
        if (!error) { navigate('/patient'); return; }
        // Fallback: create mock patient session for demo
        try {
            const { data: signUpData, error: signUpError } = await supabase.auth.signUp({ email, password: pin, options: { emailRedirectTo: undefined } });
            if (!signUpError && signUpData.user) {
                const svc = SupabaseService.getInstance();
                await svc.provisionOnboardedUser(signUpData.user.id, email, undefined);
                const { error: secondAttempt } = await supabase.auth.signInWithPassword({ email, password: pin });
                if (!secondAttempt) { navigate('/patient'); setLoading(false); return; }
            }
        } catch (_) { /* fall through to mock */ }
        if (import.meta.env.DEV) {
            localStorage.setItem('retain_demo_patient', JSON.stringify({ mobile: cleanMobile, pin }));
            navigate('/patient');
        }
        setLoading(false);
    };

    const handleEmailAuth = async () => {
        if (!authEmail || !authPassword) { alert("Please enter both email and password"); return; }
        setLoading(true);
        try {
            if (isSignUp) {
                const { data, error } = await supabase.auth.signUp({ email: authEmail, password: authPassword });
                if (error) throw error;
                if (data.session && data.user) {
                    const svc = SupabaseService.getInstance();
                    const res = await svc.provisionOnboardedUser(data.user.id, authEmail, targetClinic?.slug);
                    if (res.success) alert(`Account Created for ${targetClinic?.slug ? targetClinic.name : 'Platform'}! Wait for Admin Approval.`);
                    else alert("Account created, but profile failed: " + res.message);
                } else alert("Verification email sent! Please verify to complete setup.");
            } else {
                const { data, error } = await supabase.auth.signInWithPassword({ email: authEmail, password: authPassword });
                if (error) throw error;
            }
        } catch (e: any) { alert(e.message || "Authentication Failed"); }
        finally { setLoading(false); }
    };

    return (
        <div className="h-screen w-full overflow-y-auto overflow-x-hidden font-sans transition-colors duration-1000 relative"
            style={{ backgroundColor: '#fdf8f0' }}>

            {/* Subtle organic background pattern */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-20%] left-[-10%] w-[800px] h-[800px] rounded-full opacity-[0.06]"
                    style={{ background: `radial-gradient(circle, ${brandColor}, transparent)`, filter: 'blur(80px)' }}></div>
                <div className="absolute bottom-[-30%] right-[-10%] w-[700px] h-[700px] rounded-full opacity-[0.04]"
                    style={{ background: `radial-gradient(circle, #0d9488, transparent)`, filter: 'blur(100px)' }}></div>
                <div className="absolute top-[40%] left-[60%] w-[500px] h-[500px] rounded-full opacity-[0.03]"
                    style={{ background: `radial-gradient(circle, #f59e0b, transparent)`, filter: 'blur(80px)' }}></div>

                {/* Decorative floating shapes */}
                <div className="absolute top-[15%] right-[8%] w-16 h-16 rounded-full opacity-[0.08]"
                    style={{ backgroundColor: brandColor, animation: 'float 8s ease-in-out infinite' }}></div>
                <div className="absolute bottom-[20%] left-[5%] w-10 h-10 rounded-lg opacity-[0.06]"
                    style={{ backgroundColor: brandColor, animation: 'float 12s ease-in-out infinite reverse' }}></div>
            </div>

            {/* Scrollable Content Wrapper */}
            <div className="min-h-screen w-full flex items-center justify-center p-6 relative z-10">
                <div className="w-full max-w-md relative">

                    {/* Main Card with skeuomorphic depth */}
                    <div className="bg-white/90 backdrop-blur-xl p-12 rounded-[48px] shadow-[0_2px_4px_rgba(0,0,0,0.02),0_8px_24px_rgba(0,0,0,0.04),0_16px_48px_rgba(0,0,0,0.04),0_24px_80px_rgba(0,0,0,0.04)] border border-white/60 transition-all duration-500">

                        {/* Header */}
                        <div className="text-center mb-12">
                            {targetClinic?.logoUrl ? (
                                <div className="inline-flex p-5 rounded-[24px] mb-6 shadow-[0_4px_12px_rgba(0,0,0,0.04)] border border-gray-100 bg-white">
                                    <img src={targetClinic.logoUrl} alt="Clinic Logo" className="h-20 w-20 object-contain" />
                                </div>
                            ) : (
                                <div className="inline-flex p-5 rounded-[24px] mb-6 shadow-[0_4px_20px_rgba(13,148,136,0.15)]"
                                    style={{
                                        background: `linear-gradient(135deg, ${brandColor}, #0f766e)`,
                                        boxShadow: `0 8px 32px -8px ${brandColor}60`
                                    }}>
                                    <Activity size={36} className="text-white drop-shadow-sm" />
                                </div>
                            )}
                            <h1 className="text-3xl font-black tracking-tight text-gray-900 mb-2">{brandName}</h1>
                            <p className="text-gray-400 font-semibold text-xs uppercase tracking-[0.2em]">{brandSubtitle}</p>
                        </div>

                        {/* MODE: CHOICE */}
                        {mode === 'CHOICE' && (
                            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <button onClick={() => setMode('PATIENT')}
                                    className="w-full p-6 bg-gray-50 hover:bg-white border border-gray-100 hover:border-gray-200 rounded-[24px] text-left transition-all group hover:scale-[1.01] active:scale-[0.99] shadow-[0_1px_3px_rgba(0,0,0,0.02)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.06)]">
                                    <div className="flex justify-between items-center mb-3">
                                        <span className="p-2.5 rounded-xl"
                                            style={{ backgroundColor: `${brandColor}12`, color: brandColor }}>
                                            <Smartphone size={20} />
                                        </span>
                                        <ArrowRight size={16} className="text-gray-300 group-hover:text-gray-500 transition-colors" />
                                    </div>
                                    <h3 className="font-bold text-lg text-gray-900">Patient Access</h3>
                                    <p className="text-xs text-gray-400 font-medium mt-1">Check appointments & rewards</p>
                                </button>

                                <button onClick={() => setMode('DOCTOR')}
                                    className="w-full p-6 bg-gray-50 hover:bg-white border border-gray-100 hover:border-gray-200 rounded-[24px] text-left transition-all group hover:scale-[1.01] active:scale-[0.99] shadow-[0_1px_3px_rgba(0,0,0,0.02)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.06)]">
                                    <div className="flex justify-between items-center mb-3">
                                        <span className="p-2.5 rounded-xl"
                                            style={{ backgroundColor: `${brandColor}12`, color: brandColor }}>
                                            <Command size={20} />
                                        </span>
                                        <ArrowRight size={16} className="text-gray-300 group-hover:text-gray-500 transition-colors" />
                                    </div>
                                    <h3 className="font-bold text-lg text-gray-900">Clinic Workspace</h3>
                                    <p className="text-xs text-gray-400 font-medium mt-1">For Doctors & Staff</p>
                                </button>

                                <div className="pt-4 text-center">
                                    <p className="text-[10px] font-bold text-gray-300 uppercase tracking-[0.2em] select-none">
                                        Powered by <span className="text-gray-400">Retain</span>
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* MODE: DOCTOR (Email/Pass) */}
                        {mode === 'DOCTOR' && (
                            <div className="space-y-5 animate-in fade-in slide-in-from-right-8 duration-500">
                                <div className="space-y-3">
                                    <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 flex items-center gap-3 focus-within:border-teal-300 focus-within:bg-white transition-all shadow-[inset_0_1px_2px_rgba(0,0,0,0.02)]">
                                        <Command size={18} className="text-gray-300" />
                                        <input type="email" placeholder={isSignUp ? "Email (Must match Admin Invite)" : "Official Email ID"}
                                            value={authEmail} onChange={e => setAuthEmail(e.target.value)}
                                            className="bg-transparent w-full outline-none text-gray-800 font-bold placeholder:text-gray-300" />
                                    </div>
                                    <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 flex items-center gap-3 focus-within:border-teal-300 focus-within:bg-white transition-all shadow-[inset_0_1px_2px_rgba(0,0,0,0.02)]">
                                        <Lock size={18} className="text-gray-300" />
                                        <input type="password" placeholder={isSignUp ? "Create a Secure Password" : "Password"}
                                            value={authPassword} onChange={e => setAuthPassword(e.target.value)}
                                            className="bg-transparent w-full outline-none text-gray-800 font-bold placeholder:text-gray-300" />
                                    </div>
                                </div>

                                {isSignUp && (
                                    <p className="text-[10px] text-amber-600 font-bold text-center bg-amber-50 p-3 rounded-xl border border-amber-200">
                                        <Sparkles size={12} className="inline mr-1" />
                                        Use the EXACT email provided to the Super Admin.
                                    </p>
                                )}

                                <button onClick={handleEmailAuth} disabled={loading}
                                    className="w-full py-4 text-white rounded-[20px] font-black text-sm uppercase tracking-widest transition-all flex items-center justify-center gap-3 shadow-[0_4px_16px_rgba(13,148,136,0.25)] hover:shadow-[0_8px_24px_rgba(13,148,136,0.35)] hover:scale-[1.01] active:scale-[0.98] disabled:opacity-50"
                                    style={{ backgroundColor: isSignUp ? '#10b981' : brandColor }}>
                                    {loading ? <Loader2 className="animate-spin" /> : (isSignUp ? 'Activate Account' : 'Secure Login')}
                                </button>

                                <div className="text-center space-y-3">
                                    <button onClick={() => setIsSignUp(!isSignUp)}
                                        className="text-xs font-bold text-gray-400 hover:text-gray-600 uppercase tracking-widest transition-colors">
                                        {isSignUp ? 'Already have an ID? Login' : 'First time? Activate Account'}
                                    </button>
                                    <div className="pt-2 border-t border-gray-50">
                                        <button onClick={() => setMode('CHOICE')}
                                            className="text-xs font-medium text-gray-400 hover:text-gray-600 transition-colors">Cancel Access</button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* MODE: PATIENT (Mobile + PIN) */}
                        {mode === 'PATIENT' && (
                            <div className="space-y-5 animate-in fade-in slide-in-from-right-8 duration-500">
                                <div className="space-y-3">
                                    <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 flex items-center gap-3 focus-within:border-teal-300 focus-within:bg-white transition-all shadow-[inset_0_1px_2px_rgba(0,0,0,0.02)]">
                                        <Smartphone size={18} className="text-gray-300" />
                                        <input type="number" placeholder="Mobile Number"
                                            value={mobile} onChange={e => setMobile(e.target.value)}
                                            className="bg-transparent w-full outline-none text-gray-800 font-bold placeholder:text-gray-300" />
                                    </div>
                                    <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 flex items-center gap-3 focus-within:border-teal-300 focus-within:bg-white transition-all shadow-[inset_0_1px_2px_rgba(0,0,0,0.02)]">
                                        <Lock size={18} className="text-gray-300" />
                                        <input type="password" placeholder="Health Key (PIN)"
                                            value={pin} onChange={e => setPin(e.target.value)}
                                            className="bg-transparent w-full outline-none text-gray-800 font-bold placeholder:text-gray-300" />
                                    </div>
                                </div>

                                <button onClick={handlePatientLogin} disabled={loading || !mobile || !pin}
                                    className="w-full py-4 text-white rounded-[20px] font-black text-sm uppercase tracking-widest transition-all flex items-center justify-center gap-3 shadow-[0_4px_16px_rgba(13,148,136,0.25)] hover:shadow-[0_8px_24px_rgba(13,148,136,0.35)] hover:scale-[1.01] active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none"
                                    style={{ backgroundColor: brandColor, boxShadow: `0 4px 16px ${brandColor}40` }}>
                                    {loading ? <Loader2 className="animate-spin" /> : 'Access Vault'}
                                </button>

                                <button onClick={() => setMode('CHOICE')}
                                    className="block w-full text-center text-xs font-medium mt-4 transition-colors text-gray-400 hover:text-gray-600">Back</button>
                            </div>
                        )}
                    </div>

                    {/* Subtle footer */}
                    <p className="text-center mt-8 text-[9px] font-bold text-gray-300 uppercase tracking-[0.3em] select-none">
                        Secure · HIPAA Compliant · v3.2
                    </p>
                </div>
            </div>
        </div>
    );
};
