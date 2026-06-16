import React from 'react';

const ClinicDemo: React.FC = () => {
    return (
        <div className="w-full h-full bg-slate-900 rounded-2xl overflow-hidden relative border border-slate-800 shadow-2xl group cursor-default">
            {/* Background Ambience */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-teal-500/20 rounded-full blur-[120px] pointer-events-none"></div>

            {/* The Real Screenshot */}
            <div className="absolute inset-2 md:inset-4 rounded-xl overflow-hidden border border-white/10 shadow-2xl bg-slate-950">
                <img
                    src="/assets/screens/doctor-dashboard.png"
                    alt="RetainOS Doctor Dashboard"
                    className="w-full h-full object-cover object-left-top hover:scale-[1.02] transition-transform duration-700 ease-out"
                />
            </div>

            {/* Feature Highlight Overlay (Optional - adds depth) */}
            <div className="absolute bottom-6 left-6 right-6 hidden md:flex gap-4">
                <div className="bg-white/10 backdrop-blur-md border border-white/10 p-3 rounded-xl flex items-center gap-3 shadow-xl">
                    <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></div>
                    <span className="text-white text-xs font-bold tracking-wide">Live Practice Pulse</span>
                </div>
            </div>
        </div>
    );
};

export default ClinicDemo;
