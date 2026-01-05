import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { SupabaseService } from '../services/SupabaseService'; // Add Import
import { ArrowRight, Smartphone, Lock, Activity, Command, Loader2 } from 'lucide-react';
import { Clinic } from '../types';

interface LoginPageProps {
    clinics?: Clinic[];
    activeClinic?: Clinic; // New Prop
}

export const LoginPage: React.FC<LoginPageProps> = ({ clinics = [], activeClinic }) => {
    const { slug } = useParams();
    const navigate = useNavigate();
    const [mode, setMode] = useState<'CHOICE' | 'PATIENT' | 'DOCTOR'>('CHOICE');
    // ... (keep state)

    // ...

    const handlePatientLogin = async () => {
        if (!mobile || !pin) return;
        setLoading(true);

        // If branded, we might want to prioritize that clinic, but for auth we check global user
        const email = `${mobile}@retain.dental`;
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password: pin
        });

        if (error) {
            alert("Invalid Credentials or Network Error");
            setLoading(false);
        } else {
            // Success! The AuthHandler in App.tsx might redirect, but we force it here for clarity.
            // Also, we might want to check if they belong to this clinic?
            // For now, let generic auth succeed.
            navigate('/patient');
        }
    };
    const [loading, setLoading] = useState(false);
    const [mobile, setMobile] = useState('');
    const [pin, setPin] = useState('');

    // EMAIL AUTH STATE
    const [authEmail, setAuthEmail] = useState('');
    const [authPassword, setAuthPassword] = useState('');
    const [isSignUp, setIsSignUp] = useState(false);

    // BRANDING LOGIC
    // If slug exists, find specific clinic. If not, use activeClinic (subdomain/context).
    const slugClinic = slug ? clinics.find(c => c.slug === slug) : undefined;
    const targetClinic = slugClinic || activeClinic;

    // If we are effectively "Platform" or no context, we show Default.
    const isBranded = !!targetClinic && targetClinic.id !== 'platform';
    const brandColor = targetClinic?.primaryColor || '#6366f1'; // Default Indigo
    const brandName = targetClinic?.name || 'Retain.OS';
    const brandSubtitle = isBranded ? 'Patient Portal & Staff Login' : 'Dental Operating System';

    const handleEmailAuth = async () => {
        if (!authEmail || !authPassword) {
            alert("Please enter both email and password");
            return;
        }
        setLoading(true);

        try {
            if (isSignUp) {
                // REGISTER: Create Auth User
                const { data, error } = await supabase.auth.signUp({
                    email: authEmail,
                    password: authPassword,
                });
                if (error) throw error;

                if (data.session && data.user) {
                    // NEW: Explicitly provision user profile (No Triggers!)
                    const svc = SupabaseService.getInstance();
                    const res = await svc.provisionOnboardedUser(
                        data.user.id,
                        authEmail,
                        targetClinic?.slug // Pass the current clinic slug (e.g. 'apex')
                    );

                    if (res.success) {
                        alert(`Account Created for ${targetClinic?.slug ? targetClinic.name : 'Platform'}! Please wait for Admin Approval.`);
                    } else {
                        alert("Account created, but profile failed: " + res.message);
                    }
                } else {
                    // Confirmation flow
                    alert("Verification email sent! Please verify to complete setup.");
                }
            } else {
                // LOGIN
                const { data, error } = await supabase.auth.signInWithPassword({
                    email: authEmail,
                    password: authPassword
                });
                if (error) throw error;
            }
        } catch (e: any) {
            alert(e.message || "Authentication Failed");
        } finally {
            setLoading(false);
        }
    };



    return (
        <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden font-sans text-slate-200 transition-colors duration-1000"
            style={{ backgroundColor: isBranded ? '#0f172a' : '#020617' }}>

            {/* Ambient Background - Dynamic Color */}
            <div className="absolute top-[-50%] left-[-20%] w-[1000px] h-[1000px] rounded-full blur-[150px] animate-pulse-slow transition-colors duration-1000"
                style={{ backgroundColor: `${brandColor}20` }}></div>
            <div className="absolute bottom-[-50%] right-[-20%] w-[800px] h-[800px] bg-sky-500/10 rounded-full blur-[150px] animate-pulse-slow delay-1000"></div>

            <div className="w-full max-w-md relative z-10 glass-panel border border-white/10 p-12 rounded-[40px] shadow-2xl backdrop-blur-xl bg-slate-900/60 transition-all duration-500">

                {/* Header */}
                <div className="text-center mb-12">
                    <div className="inline-flex p-4 rounded-3xl shadow-lg mb-6 transition-all duration-500"
                        style={{
                            background: isBranded ? brandColor : 'linear-gradient(135deg, #6366f1 0%, #0ea5e9 100%)',
                            boxShadow: `0 10px 30px -10px ${brandColor}60`
                        }}>
                        <Activity size={32} className="text-white" />
                    </div>
                    <h1 className="text-3xl font-black tracking-tighter text-white mb-2">{brandName}</h1>
                    <p className="text-slate-400 font-medium text-sm uppercase tracking-widest">{brandSubtitle}</p>
                </div>

                {/* MODE: CHOICE */}
                {mode === 'CHOICE' && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <button onClick={() => setMode('PATIENT')}
                            className="w-full p-6 bg-slate-800/50 hover:bg-slate-800 border border-slate-700 hover:border-slate-600 rounded-[24px] text-left transition-all group hover:scale-[1.02] active:scale-[0.98]">
                            <div className="flex justify-between items-center mb-2">
                                <span className="p-2 rounded-xl bg-white/10" style={{ color: brandColor }}><Smartphone size={20} /></span>
                                <ArrowRight size={16} className="text-slate-500 group-hover:text-white transition-colors" />
                            </div>
                            <h3 className="font-bold text-lg text-white">Patient Access</h3>
                            <p className="text-xs text-slate-500 font-medium mt-1">Check appointments & rewards</p>
                        </button>

                        <button onClick={() => setMode('DOCTOR')}
                            className="w-full p-6 bg-slate-800/50 hover:bg-slate-800 border border-slate-700 hover:border-slate-600 rounded-[24px] text-left transition-all group hover:scale-[1.02] active:scale-[0.98]">
                            <div className="flex justify-between items-center mb-2">
                                <span className="p-2 rounded-xl bg-white/10" style={{ color: brandColor }}><Command size={20} /></span>
                                <ArrowRight size={16} className="text-slate-500 group-hover:text-white transition-colors" />
                            </div>
                            <h3 className="font-bold text-lg text-white">Clinic Workspace</h3>
                            <p className="text-xs text-slate-500 font-medium mt-1">For Doctors & Staff</p>
                        </button>
                    </div>
                )}

                {/* MODE: DOCTOR (Email/Pass) */}
                {mode === 'DOCTOR' && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-500">
                        <div className="space-y-4">
                            <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700/50 flex items-center gap-3 focus-within:border-indigo-400 transition-colors">
                                <Command size={18} className="text-slate-400" />
                                <input type="email" placeholder={isSignUp ? "Email (Must match Admin Invite)" : "Official Email ID"}
                                    value={authEmail} onChange={e => setAuthEmail(e.target.value)}
                                    className="bg-transparent w-full outline-none text-white font-bold placeholder:text-slate-600" />
                            </div>
                            <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700/50 flex items-center gap-3 focus-within:border-indigo-400 transition-colors">
                                <Lock size={18} className="text-slate-400" />
                                <input type="password" placeholder={isSignUp ? "Create a Secure Password" : "Password"}
                                    value={authPassword} onChange={e => setAuthPassword(e.target.value)}
                                    className="bg-transparent w-full outline-none text-white font-bold placeholder:text-slate-600" />
                            </div>
                        </div>

                        {isSignUp && (
                            <p className="text-[10px] text-amber-500 font-bold text-center bg-amber-500/10 p-2 rounded-lg border border-amber-500/20">
                                Important: You must use the EXACT email address provided to the Super Admin.
                            </p>
                        )}

                        <button onClick={handleEmailAuth} disabled={loading}
                            className="w-full py-4 text-white rounded-[20px] font-black text-sm uppercase tracking-widest transition-all flex items-center justify-center gap-3 shadow-lg hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
                            style={{ backgroundColor: isSignUp ? '#10b981' : (brandColor || '#6366f1') }}>
                            {loading ? <Loader2 className="animate-spin" /> : (isSignUp ? 'Activate Account' : 'Secure Login')}
                        </button>

                        <div className="text-center space-y-3">
                            <button onClick={() => setIsSignUp(!isSignUp)} className="text-xs font-bold text-slate-500 hover:text-white uppercase tracking-widest transition-colors">
                                {isSignUp ? 'Already have an ID? Login' : 'First time? Activate Account'}
                            </button>
                            <div className="pt-2 border-t border-white/5">
                                <button onClick={() => setMode('CHOICE')} className="text-xs font-medium text-slate-600 hover:text-slate-400 transition-colors">Cancel Access</button>
                            </div>
                        </div>
                    </div>
                )}

                {/* MODE: PATIENT (Mobile + PIN) */}
                {mode === 'PATIENT' && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-500">
                        <div className="space-y-4">
                            <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700/50 flex items-center gap-3 focus-within:border-white/20 transition-colors">
                                <Smartphone size={18} className="text-slate-400" />
                                <input type="number" placeholder="Mobile Number"
                                    value={mobile} onChange={e => setMobile(e.target.value)}
                                    className="bg-transparent w-full outline-none text-white font-bold placeholder:text-slate-600" />
                            </div>
                            <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700/50 flex items-center gap-3 focus-within:border-white/20 transition-colors">
                                <Lock size={18} className="text-slate-400" />
                                <input type="password" placeholder="Health Key (PIN)"
                                    value={pin} onChange={e => setPin(e.target.value)}
                                    className="bg-transparent w-full outline-none text-white font-bold placeholder:text-slate-600" />
                            </div>
                        </div>

                        <button onClick={handlePatientLogin} disabled={loading || !mobile || !pin}
                            className="w-full py-4 text-white rounded-[20px] font-black text-sm uppercase tracking-widest transition-all flex items-center justify-center gap-3 shadow-lg hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none"
                            style={{ backgroundColor: brandColor, boxShadow: `0 10px 20px -5px ${brandColor}40` }}>
                            {loading ? <Loader2 className="animate-spin" /> : 'Access Vault'}
                        </button>

                        <button onClick={() => setMode('CHOICE')} className="block w-full text-center hover:text-white text-xs font-medium mt-4 transition-colors" style={{ color: brandColor }}>Back</button>
                    </div>
                )}
            </div>
        </div>
    );
};
