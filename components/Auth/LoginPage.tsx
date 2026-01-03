import React from 'react';
import { Globe, Stethoscope, User, ShieldCheck } from 'lucide-react';
import { Role } from '../../types';

interface Props {
    onLogin: (role: Role) => void;
}

const LoginPage: React.FC<Props> = ({ onLogin }) => {
    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 relative overflow-hidden">
            {/* Background Ambience */}
            <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-indigo-500/10 blur-[150px] rounded-full"></div>
            <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-emerald-500/10 blur-[150px] rounded-full"></div>

            <div className="max-w-5xl w-full grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">

                {/* PATIENT LOGIN */}
                <div className="bg-white/[0.02] border border-white/5 p-10 rounded-[40px] flex flex-col items-center text-center hover:bg-white/[0.04] transition-all group">
                    <div className="h-20 w-20 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400 mb-6 group-hover:scale-110 transition-transform">
                        <User size={32} />
                    </div>
                    <h3 className="text-2xl font-black text-white tracking-tight mb-2">Patient Access</h3>
                    <p className="text-sm text-slate-500 mb-8">View your loyalty balance, appointments, and family hub.</p>
                    <button onClick={() => onLogin(Role.PATIENT)} className="w-full py-4 bg-white text-slate-900 rounded-[24px] font-bold flex items-center justify-center gap-3 hover:scale-[1.02] transition-transform">
                        <img src="https://img.icons8.com/color/48/000000/google-logo.png" className="w-5 h-5" alt="Google" />
                        Sign in with Google
                    </button>
                </div>

                {/* DOCTOR LOGIN */}
                <div className="bg-white/[0.02] border border-white/5 p-10 rounded-[40px] flex flex-col items-center text-center hover:bg-white/[0.04] transition-all group">
                    <div className="h-20 w-20 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-400 mb-6 group-hover:scale-110 transition-transform">
                        <Stethoscope size={32} />
                    </div>
                    <h3 className="text-2xl font-black text-white tracking-tight mb-2">Clinic Staff</h3>
                    <p className="text-sm text-slate-500 mb-8">Manage appointments, patient records, and clinic operations.</p>
                    <button onClick={() => onLogin(Role.ADMIN)} className="w-full py-4 bg-indigo-600 text-white rounded-[24px] font-bold flex items-center justify-center gap-3 hover:bg-indigo-500 hover:scale-[1.02] transition-all shadow-lg shadow-indigo-500/20">
                        <img src="https://img.icons8.com/color/48/000000/google-logo.png" className="w-5 h-5 grayscale brightness-200" alt="Google" />
                        Sign in with Google
                    </button>
                </div>

                {/* ADMIN LOGIN */}
                <div className="bg-white/[0.02] border border-white/5 p-10 rounded-[40px] flex flex-col items-center text-center hover:bg-white/[0.04] transition-all group">
                    <div className="h-20 w-20 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 mb-6 group-hover:scale-110 transition-transform">
                        <Globe size={32} />
                    </div>
                    <h3 className="text-2xl font-black text-white tracking-tight mb-2">Platform Master</h3>
                    <p className="text-sm text-slate-500 mb-8">Access global revenue stats, deployments, and configs.</p>
                    <button onClick={() => onLogin(Role.SUPER_ADMIN)} className="w-full py-4 bg-slate-800 text-white rounded-[24px] font-bold flex items-center justify-center gap-3 hover:bg-slate-700 hover:scale-[1.02] transition-all">
                        <ShieldCheck size={18} />
                        <span className="text-sm">Secure Admin Entree</span>
                    </button>
                </div>

            </div>
        </div>
    );
};

export default LoginPage;
