import React from 'react';
import { motion } from 'framer-motion';
import { User, Users, Plus } from 'lucide-react';

const FamilyNetwork = () => {
    return (
        <div className="w-full aspect-[4/3] bg-slate-900 rounded-2xl border border-white/10 relative overflow-hidden flex items-center justify-center">
            {/* Background Grid */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:20px_20px]"></div>

            {/* Central Node (Head of Household) */}
            <div className="relative z-10 flex flex-col items-center">
                <motion.div
                    animate={{ scale: [1, 1.05, 1], boxShadow: ["0 0 20px rgba(99,102,241,0.2)", "0 0 40px rgba(99,102,241,0.5)", "0 0 20px rgba(99,102,241,0.2)"] }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="w-24 h-24 bg-indigo-600 rounded-full flex items-center justify-center text-white border-4 border-slate-900 z-20 relative"
                >
                    <div className="text-center">
                        <User size={32} className="mx-auto mb-1" />
                        <span className="text-[10px] font-bold uppercase">Mom</span>
                    </div>
                    {/* Platinum Badge */}
                    <div className="absolute -top-2 -right-2 bg-amber-400 text-black text-[10px] font-black px-2 py-0.5 rounded-full border border-white">PLATINUM</div>
                </motion.div>

                <motion.div
                    className="mt-4 bg-slate-800 border border-white/10 px-4 py-2 rounded-xl text-center"
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 4, repeat: Infinity }}
                >
                    <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Household Pool</p>
                    <p className="text-xl font-black text-white">14,250 pts</p>
                </motion.div>
            </div>

            {/* Satellite Nodes */}
            {/* Dad */}
            <div className="absolute top-1/4 left-1/4">
                <SatelliteNode label="Dad" delay={0} />
            </div>
            {/* Child 1 */}
            <div className="absolute bottom-1/4 left-1/3">
                <SatelliteNode label="Child 1" delay={1} />
            </div>
            {/* Child 2 */}
            <div className="absolute top-1/3 right-1/4">
                <SatelliteNode label="Child 2" delay={2} />
            </div>

            {/* Connecting Lines & Particles */}
            <ConnectionLine x1="25%" y1="25%" x2="50%" y2="50%" />
            <ConnectionLine x1="33%" y1="75%" x2="50%" y2="50%" />
            <ConnectionLine x1="75%" y1="33%" x2="50%" y2="50%" />

        </div>
    );
};

const SatelliteNode = ({ label, delay }: { label: string, delay: number }) => (
    <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: delay * 0.2 }}
        className="flex flex-col items-center relative z-10"
    >
        <div className="w-12 h-12 bg-slate-800 rounded-full border-2 border-slate-700 flex items-center justify-center text-slate-400">
            <User size={20} />
        </div>
        <span className="mt-2 text-xs font-bold text-slate-500 bg-slate-950/80 px-2 py-1 rounded backdrop-blur-md">{label}</span>
    </motion.div>
);

const ConnectionLine = ({ x1, y1, x2, y2 }: any) => {
    return (
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
            <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(255,255,255,0.1)" strokeWidth="2" strokeDasharray="5,5" />
            <motion.circle
                cx={x1}
                cy={y1}
                r="3"
                fill="#FBBF24"
                animate={{
                    cx: [x1, x2],
                    cy: [y1, y2],
                    opacity: [0, 1, 0]
                }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            />
        </svg>
    )
}

export default FamilyNetwork;
