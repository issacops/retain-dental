import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Trash2, TrendingUp, CheckCircle2 } from 'lucide-react';

const ConsolidationSection: React.FC = () => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    const oldStack = [
        { name: "Weave/Swell", price: 499, label: "Phones & Reviews" },
        { name: "RevenueWell", price: 349, label: "Patient Communication" },
        { name: "Kleer/BoomCloud", price: 199, label: "Membership Plans" },
        { name: "Modento/Yapi", price: 299, label: "Forms & Intake" },
        { name: "Consultants", price: 1500, label: "Recall Training" }
    ];

    return (
        <section className="py-32 px-6 bg-slate-950 relative overflow-hidden">
            {/* Background Texture */}
            <div className="absolute inset-0 bg-noise opacity-[0.03] pointer-events-none"></div>

            <div className="max-w-7xl mx-auto relative z-10">
                <div className="text-center mb-20 space-y-6">
                    <span className="text-red-500 font-bold tracking-widest uppercase text-sm">Stop the Bleeding</span>
                    <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter">
                        Simplify your stack.<br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-red-600">Multiply your profit.</span>
                    </h2>
                    <p className="text-xl text-slate-400 max-w-2xl mx-auto">
                        You are paying $2,500+ monthly for disconnected tools that don't talk to each other.
                        Consolidate everything into one operating system.
                    </p>
                </div>

                <div ref={ref} className="grid lg:grid-cols-2 gap-12 items-center">

                    {/* LEFT: THE OLD STACK */}
                    <div className="relative">
                        <div className="space-y-4">
                            {oldStack.map((item, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: -50 }}
                                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                                    transition={{ delay: i * 0.1, duration: 0.5 }}
                                    className="flex items-center justify-between p-6 rounded-2xl bg-white/5 border border-white/5 grayscale opacity-60 hover:opacity-100 hover:bg-red-950/20 hover:border-red-500/30 transition-all group"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center text-slate-500 group-hover:text-red-500 transition-colors">
                                            <Trash2 size={18} />
                                        </div>
                                        <div>
                                            <h4 className="text-white font-bold text-lg strike-through decoration-red-500">{item.name}</h4>
                                            <p className="text-slate-500 text-sm">{item.label}</p>
                                        </div>
                                    </div>
                                    <span className="text-xl font-mono text-slate-400 group-hover:text-red-400 transition-colors">${item.price}</span>
                                </motion.div>
                            ))}
                        </div>

                        {/* Total Line */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={isInView ? { opacity: 1 } : {}}
                            transition={{ delay: 1 }}
                            className="mt-8 pt-8 border-t border-white/10 flex justify-between items-center px-6"
                        >
                            <span className="text-slate-400 font-bold uppercase tracking-widest">Monthly Burn</span>
                            <span className="text-4xl font-black text-red-500">~$2,846/mo</span>
                        </motion.div>
                    </div>

                    {/* RIGHT: THE RETAIN OS SOLUTION */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={isInView ? { opacity: 1, scale: 1 } : {}}
                        transition={{ delay: 0.5, duration: 0.8 }}
                        className="relative"
                    >
                        <div className="absolute inset-0 bg-indigo-500/20 blur-[100px] rounded-full"></div>

                        <div className="relative z-10 p-10 rounded-[2.5rem] bg-gradient-to-b from-indigo-900/40 to-slate-900/90 border border-indigo-500/30 backdrop-blur-xl shadow-2xl">
                            <div className="flex items-start justify-between mb-12">
                                <div>
                                    <h3 className="text-3xl font-black text-white">RetainOS</h3>
                                    <p className="text-indigo-400 font-medium">Enterprise Edition</p>
                                </div>
                                <div className="w-16 h-16 rounded-2xl bg-indigo-500 flex items-center justify-center shadow-lg shadow-indigo-500/40">
                                    <TrendingUp size={32} className="text-white" />
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="flex items-center gap-4">
                                    <CheckCircle2 className="text-emerald-400 shrink-0" size={24} />
                                    <span className="text-xl text-white font-medium">Unlimited Patient Communications</span>
                                </div>
                                <div className="flex items-center gap-4">
                                    <CheckCircle2 className="text-emerald-400 shrink-0" size={24} />
                                    <span className="text-xl text-white font-medium">Reputation Management</span>
                                </div>
                                <div className="flex items-center gap-4">
                                    <CheckCircle2 className="text-emerald-400 shrink-0" size={24} />
                                    <span className="text-xl text-white font-medium">Payments & Invoicing</span>
                                </div>
                                <div className="flex items-center gap-4">
                                    <CheckCircle2 className="text-emerald-400 shrink-0" size={24} />
                                    <span className="text-xl text-white font-medium">Digital Forms & Intake</span>
                                </div>
                                <div className="flex items-center gap-4">
                                    <CheckCircle2 className="text-emerald-400 shrink-0" size={24} />
                                    <span className="text-xl text-white font-medium">Family Membership Plans</span>
                                </div>
                            </div>

                            <div className="mt-12 pt-12 border-t border-white/10">
                                <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">Net Value Created</p>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-5xl font-black text-white">Infinite</span>
                                    <span className="text-slate-500">ROI</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                </div>
            </div>
        </section>
    );
};

export default ConsolidationSection;
