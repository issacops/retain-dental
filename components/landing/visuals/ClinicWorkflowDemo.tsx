import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Star, Zap } from 'lucide-react';

const ClinicWorkflowDemo = () => {
    const [step, setStep] = useState(0);

    // Automation Sequence
    useEffect(() => {
        const sequence = async () => {
            // Reset
            setStep(0);
            await new Promise(r => setTimeout(r, 1000));

            // Step 1: Type Name
            setStep(1);
            await new Promise(r => setTimeout(r, 1500));

            // Step 2: Select Plan
            setStep(2);
            await new Promise(r => setTimeout(r, 1500));

            // Step 3: Success
            setStep(3);
            await new Promise(r => setTimeout(r, 3000));

            // Loop
            setStep(0);
        };
        sequence();

        // Cleanup not strictly necessary for this simple loop logic but good practice
        // simplified intentional loop via recursion/effect deps vs interval for variable timing
        const timer = setInterval(() => {
            // Just a fallback to restart if needed, but the async loop above handles it
        }, 8000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="w-full aspect-[4/3] bg-slate-900 rounded-2xl border border-white/10 relative overflow-hidden flex flex-col shadow-2xl">
            {/* Header Mock */}
            <div className="h-12 border-b border-white/10 bg-slate-900/50 flex items-center px-4 justify-between">
                <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-rose-500/20"></div>
                    <div className="w-3 h-3 rounded-full bg-amber-500/20"></div>
                    <div className="w-3 h-3 rounded-full bg-emerald-500/20"></div>
                </div>
                <div className="text-[10px] text-slate-500 font-mono uppercase">ClinicOS Admin</div>
            </div>

            {/* Main Content */}
            <div className="flex-1 p-6 relative">

                <AnimatePresence mode="wait">
                    {step === 0 && (
                        <motion.div
                            key="step0"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 flex items-center justify-center pointer-events-none"
                        >
                            <div className="bg-indigo-600 text-white px-6 py-3 rounded-full shadow-xl shadow-indigo-600/20 font-bold flex items-center gap-2">
                                <Zap size={18} fill="currentColor" /> Start New Patient
                            </div>
                            <div className="absolute mt-24 text-slate-500 text-xs">Simulating 3-Click Workflow...</div>
                        </motion.div>
                    )}

                    {step >= 1 && step < 3 && (
                        <motion.div
                            key="form"
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="bg-slate-800 rounded-xl border border-white/5 p-4 space-y-4 max-w-sm mx-auto mt-4"
                        >
                            {/* Field 1: Name */}
                            <div className="space-y-1">
                                <label className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Patient Name</label>
                                <div className="h-10 bg-slate-900 rounded-lg border border-white/10 flex items-center px-3 text-white text-sm">
                                    {step === 1 ? (
                                        <Typewriter text="Sarah Jenkins" />
                                    ) : (
                                        "Sarah Jenkins"
                                    )}
                                </div>
                            </div>

                            {/* Field 2: Plan Selection */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: step >= 2 ? 1 : 0.3 }}
                                className="space-y-1"
                            >
                                <label className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Treatment Plan</label>
                                <div className="grid grid-cols-1 gap-2">
                                    <div className={`h-10 rounded-lg border flex items-center px-3 justify-between transition-colors ${step === 2 ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-slate-900 border-white/10 text-slate-500'}`}>
                                        <div className="flex items-center gap-2">
                                            <Star size={14} className={step === 2 ? 'text-amber-300' : ''} fill={step === 2 ? 'currentColor' : 'none'} />
                                            <span className="text-sm font-medium">Invisalign Platinum</span>
                                        </div>
                                        {step === 2 && <Check size={14} />}
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}

                    {step === 3 && (
                        <motion.div
                            key="success"
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-6 text-center max-w-sm mx-auto mt-8 relative overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-emerald-500/10 blur-xl"></div>
                            <div className="relative z-10">
                                <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center text-white mx-auto mb-3 shadow-lg shadow-emerald-500/30">
                                    <Check size={24} strokeWidth={3} />
                                </div>
                                <h3 className="text-white font-bold text-lg">Onboarding Complete</h3>
                                <div className="mt-4 space-y-2">
                                    <div className="flex justify-between text-xs text-emerald-200/80 px-4 py-2 bg-emerald-950/30 rounded-lg">
                                        <span>Treatment Plan</span>
                                        <span className="font-bold text-white">Active</span>
                                    </div>
                                    <div className="flex justify-between text-xs text-emerald-200/80 px-4 py-2 bg-emerald-950/30 rounded-lg">
                                        <span>Loyalty Status</span>
                                        <span className="font-bold text-amber-300 flex items-center gap-1"><Star size={10} fill="currentColor" /> Gold Tier</span>
                                    </div>
                                    <div className="flex justify-between text-xs text-emerald-200/80 px-4 py-2 bg-emerald-950/30 rounded-lg">
                                        <span>Welcome Email</span>
                                        <span className="font-bold text-white">Sent</span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Cursor Simulation */}
                <motion.div
                    className="w-4 h-4 rounded-full bg-white/50 backdrop-blur border border-white absolute z-50 pointer-events-none shadow-xl"
                    animate={{
                        x: step === 0 ? 150 : step === 1 ? 260 : step === 2 ? 180 : 200,
                        y: step === 0 ? 150 : step === 1 ? 120 : step === 2 ? 200 : 250,
                        scale: [1, 0.9, 1]
                    }}
                    transition={{ duration: 1.5, ease: "easeInOut" }}
                />

            </div>
        </div>
    );
};

// Simple Typewriter Effect Component
const Typewriter = ({ text }: { text: string }) => {
    const [displayed, setDisplayed] = useState('');

    useEffect(() => {
        let i = 0;
        const timer = setInterval(() => {
            setDisplayed(text.substring(0, i));
            i++;
            if (i > text.length) clearInterval(timer);
        }, 50);
        return () => clearInterval(timer);
    }, [text]);

    return <span>{displayed}<span className="animate-pulse">|</span></span>;
};

export default ClinicWorkflowDemo;
