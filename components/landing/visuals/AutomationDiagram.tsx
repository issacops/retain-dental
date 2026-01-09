import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ScanFace, Activity, Check, Zap, Server, Database, Smartphone, Stethoscope } from 'lucide-react';

const AutomationDiagram = () => {
    const [step, setStep] = useState(0);

    // Loop the animation
    useEffect(() => {
        const timer = setInterval(() => {
            setStep((prev) => (prev + 1) % 4);
        }, 2500);
        return () => clearInterval(timer);
    }, []);

    // Steps: 0: Patient Scan -> 1: Cloud AI -> 2: Doctor Dashboard -> 3: Auto-Notification

    return (
        <div className="w-full aspect-[4/3] bg-slate-950 rounded-2xl border border-white/10 p-8 relative overflow-hidden flex items-center justify-center">
            {/* Background Grid */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px]"></div>

            {/* Connection Lines (SVG) */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
                {/* Line 1: Phone to Server */}
                <motion.path
                    d="M 120 200 L 240 200"
                    className="stroke-indigo-500/30 stroke-2 fill-none"
                />
                <motion.circle cx="120" cy="200" r="4" className="fill-indigo-500" animate={{ x: [0, 120] }} transition={{ duration: 1, repeat: Infinity, ease: 'linear', repeatDelay: 1.5 }} />

                {/* Line 2: Server to Dashboard */}
                <motion.path
                    d="M 320 200 L 440 100"
                    className="stroke-indigo-500/30 stroke-2 fill-none"
                />
                <motion.circle cx="320" cy="200" r="4" className="fill-indigo-500" animate={{ cx: [320, 440], cy: [200, 100], opacity: step >= 1 ? 1 : 0 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear', repeatDelay: 1.5 }} />


                {/* Line 3: Server to Phone (Feedback) */}
                <motion.path
                    d="M 320 200 L 440 300"
                    className="stroke-emerald-500/30 stroke-2 fill-none"
                />
                <motion.circle cx="320" cy="200" r="4" className="fill-emerald-500" animate={{ cx: [320, 440], cy: [200, 300], opacity: step >= 1 ? 1 : 0 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear', repeatDelay: 1.5 }} />

            </svg>

            {/* Nodes Layout */}
            <div className="relative z-10 grid grid-cols-3 w-full h-full items-center">

                {/* Node 1: Patient (Input) */}
                <div className="flex flex-col items-center gap-4">
                    <motion.div
                        animate={{ scale: step === 0 ? 1.1 : 1, borderColor: step === 0 ? 'rgba(99,102,241,0.8)' : 'rgba(255,255,255,0.1)' }}
                        className="w-20 h-20 bg-slate-900 border rounded-2xl flex items-center justify-center shadow-xl relative"
                    >
                        <Smartphone className="text-white" size={32} />
                        {step === 0 && (
                            <motion.div
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1.2, opacity: 0 }}
                                transition={{ duration: 1, repeat: Infinity }}
                                className="absolute inset-0 border-2 border-indigo-500 rounded-2xl"
                            />
                        )}
                    </motion.div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest text-center">Patient<br />Scan</p>
                </div>

                {/* Node 2: The OS (Processing) */}
                <div className="flex flex-col items-center gap-4">
                    <motion.div
                        animate={{ scale: step === 1 ? 1.1 : 1, borderColor: step === 1 ? 'rgba(99,102,241,0.8)' : 'rgba(255,255,255,0.1)' }}
                        className="w-24 h-24 bg-indigo-900/20 border border-indigo-500/30 backdrop-blur-md rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(99,102,241,0.2)] relative"
                    >
                        <Database className="text-indigo-400" size={36} />
                        {step === 1 && <span className="absolute top-0 right-0 w-3 h-3 bg-indigo-500 rounded-full animate-ping"></span>}
                    </motion.div>
                    <p className="text-xs font-bold text-indigo-400 uppercase tracking-widest text-center">AI Analysis<br />Engine</p>
                </div>

                {/* Node 3: Outputs (Split) */}
                <div className="flex flex-col h-full justify-between py-10">
                    {/* 3a: Doctor Dashboard */}
                    <motion.div
                        animate={{ x: step === 2 ? 0 : 20, opacity: step === 2 ? 1 : 0.4 }}
                        className="flex items-center gap-3 p-3 rounded-xl bg-slate-900 border border-white/10"
                    >
                        <div className="w-10 h-10 bg-rose-500/10 rounded-lg flex items-center justify-center text-rose-500">
                            <Stethoscope size={20} />
                        </div>
                        <div>
                            <p className="text-white text-xs font-bold">Clinical Alert</p>
                            <p className="text-[10px] text-slate-500">"Gm Recession"</p>
                        </div>
                    </motion.div>

                    {/* 3b: Automated Notification */}
                    <motion.div
                        animate={{ x: step === 3 ? 0 : 20, opacity: step === 3 ? 1 : 0.4 }}
                        className="flex items-center gap-3 p-3 rounded-xl bg-emerald-900/20 border border-emerald-500/20"
                    >
                        <div className="w-10 h-10 bg-emerald-500/10 rounded-lg flex items-center justify-center text-emerald-500">
                            <Check size={20} />
                        </div>
                        <div>
                            <p className="text-white text-xs font-bold">Auto-Feedback</p>
                            <p className="text-[10px] text-slate-500">"Scan Approved"</p>
                        </div>
                    </motion.div>
                </div>

            </div>

            {/* Status Badge */}
            <div className="absolute top-6 left-6 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                <span className="text-[10px] font-mono text-emerald-500 uppercase">System Active • 14ms</span>
            </div>
        </div>
    );
};

export default AutomationDiagram;
