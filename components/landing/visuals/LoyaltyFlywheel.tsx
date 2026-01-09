import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Users, Star, ArrowUp, Repeat } from 'lucide-react';

const LoyaltyFlywheel = () => {
    return (
        <div className="w-full aspect-[4/3] relative flex items-center justify-center overflow-hidden">
            {/* Center Core */}
            <div className="absolute z-20 w-32 h-32 bg-slate-900 rounded-full border-4 border-slate-800 flex flex-col items-center justify-center shadow-2xl">
                <div className="text-lg font-black text-white">LTV</div>
                <div className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Engine</div>
            </div>

            {/* Orbit Path */}
            <div className="absolute w-64 h-64 rounded-full border border-dashed border-white/10 animate-[spin_20s_linear_infinite]"></div>

            {/* Orbiting Planets */}
            <motion.div
                className="absolute w-full h-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
                {/* Planet 1: Treatment */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-6 flex flex-col items-center">
                    <div className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center text-white shadow-lg shadow-indigo-600/50">
                        <Star size={20} fill="currentColor" />
                    </div>
                    <span className="mt-2 text-xs font-bold text-white bg-slate-900 px-2 rounded opacity-0">Start</span>
                </div>

                {/* Planet 2: Status (Right) */}
                <div className="absolute top-1/2 right-0 translate-x-6 -translate-y-1/2 flex flex-col items-center transform rotate-90">
                    <div className="w-12 h-12 bg-amber-500 rounded-full flex items-center justify-center text-black shadow-lg shadow-amber-500/50">
                        <Trophy size={20} />
                    </div>
                </div>

                {/* Planet 3: Referral (Bottom) */}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-6 flex flex-col items-center transform rotate-180">
                    <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center text-white shadow-lg shadow-emerald-500/50">
                        <Users size={20} />
                    </div>
                </div>

                {/* Planet 4: Retention (Left) */}
                <div className="absolute top-1/2 left-0 -translate-x-6 -translate-y-1/2 flex flex-col items-center transform -rotate-90">
                    <div className="w-12 h-12 bg-rose-500 rounded-full flex items-center justify-center text-white shadow-lg shadow-rose-500/50">
                        <Repeat size={20} />
                    </div>
                </div>
            </motion.div>

            {/* Labels (Static Overlays) */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-8 left-1/2 -translate-x-1/2 text-center">
                    <p className="text-indigo-400 text-xs font-bold uppercase tracking-widest">Compliance</p>
                </div>
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center">
                    <p className="text-emerald-400 text-xs font-bold uppercase tracking-widest">Referrals</p>
                </div>
                <div className="absolute left-8 top-1/2 -translate-y-1/2 text-center">
                    <p className="text-rose-400 text-xs font-bold uppercase tracking-widest">Retention</p>
                </div>
                <div className="absolute right-8 top-1/2 -translate-y-1/2 text-center">
                    <p className="text-amber-400 text-xs font-bold uppercase tracking-widest">Status</p>
                </div>
            </div>

            {/* Background glow */}
            <div className="absolute inset-0 bg-indigo-500/10 blur-[80px] rounded-full"></div>
        </div>
    );
};

export default LoyaltyFlywheel;
