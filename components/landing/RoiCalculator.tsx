import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Users, DollarSign, Activity } from 'lucide-react';

const RoiCalculator: React.FC = () => {
    const [patients, setPatients] = useState(2000);
    const [ltv, setLtv] = useState(1500);
    const [churnRate, setChurnRate] = useState(15); // 15% annual churn

    const [lostRevenue, setLostRevenue] = useState(0);
    const [retainedRevenue, setRetainedRevenue] = useState(0);

    // Recalculate ROI
    useEffect(() => {
        const annualLoss = patients * (churnRate / 100) * ltv;
        // RetainOS claims to reduce churn by ~60%
        const recovered = annualLoss * 0.60;

        setLostRevenue(annualLoss);
        setRetainedRevenue(recovered);
    }, [patients, ltv, churnRate]);

    return (
        <section className="py-32 px-6 bg-slate-950 border-t border-b border-white/5 relative overflow-hidden">
            {/* Background Grid */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px]"></div>

            <div className="max-w-7xl mx-auto relative z-10">
                <div className="text-center max-w-3xl mx-auto mb-20">
                    <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter mb-6">
                        The Economy of Retention
                    </h2>
                    <p className="text-xl text-slate-400">
                        Most clinics bleed <span className="text-rose-500 font-bold">15-20%</span> of their patient base annually.
                        Plug the leak, and your valuation doubles.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-8 md:p-12 shadow-2xl">

                    {/* INPUTS */}
                    <div className="space-y-12">
                        <div>
                            <div className="flex justify-between items-center mb-4">
                                <label className="text-white font-bold flex items-center gap-2">
                                    <Users size={18} className="text-indigo-400" /> Active Patients
                                </label>
                                <span className="text-2xl font-mono text-white">{patients.toLocaleString()}</span>
                            </div>
                            <input
                                type="range" min="500" max="10000" step="100"
                                value={patients} onChange={e => setPatients(Number(e.target.value))}
                                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                            />
                        </div>

                        <div>
                            <div className="flex justify-between items-center mb-4">
                                <label className="text-white font-bold flex items-center gap-2">
                                    <DollarSign size={18} className="text-emerald-400" /> Avg Case Value (LTV)
                                </label>
                                <span className="text-2xl font-mono text-white">${ltv.toLocaleString()}</span>
                            </div>
                            <input
                                type="range" min="500" max="5000" step="100"
                                value={ltv} onChange={e => setLtv(Number(e.target.value))}
                                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                            />
                        </div>

                        <div>
                            <div className="flex justify-between items-center mb-4">
                                <label className="text-white font-bold flex items-center gap-2">
                                    <Activity size={18} className="text-rose-400" /> Current Churn Rate
                                </label>
                                <span className="text-2xl font-mono text-white">{churnRate}%</span>
                            </div>
                            <input
                                type="range" min="5" max="30" step="1"
                                value={churnRate} onChange={e => setChurnRate(Number(e.target.value))}
                                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-rose-500"
                            />
                            <p className="text-xs text-slate-500 mt-2">Industry Average: 17%</p>
                        </div>
                    </div>

                    {/* OUTPUTS */}
                    <div className="flex flex-col justify-center space-y-8 relative">
                        {/* Divider Line */}
                        <div className="absolute left-0 top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-white/10 to-transparent hidden lg:block"></div>

                        <div className="pl-0 lg:pl-12">
                            <p className="text-slate-400 font-bold uppercase tracking-widest text-xs mb-2">Annual Revenue at Risk</p>
                            <div className="flex items-baseline gap-2">
                                <h3 className="text-5xl font-black text-rose-500 tracking-tighter">
                                    -${Math.floor(lostRevenue).toLocaleString()}
                                </h3>
                            </div>
                            <p className="text-slate-500 text-sm mt-2">Revenue disappearing into thin air every year.</p>
                        </div>

                        <div className="pl-0 lg:pl-12">
                            <p className="text-slate-400 font-bold uppercase tracking-widest text-xs mb-2">Recoverable with RetainOS</p>
                            <div className="flex items-baseline gap-2">
                                <h3 className="text-5xl font-black text-emerald-400 tracking-tighter">
                                    +${Math.floor(retainedRevenue).toLocaleString()}
                                </h3>
                            </div>
                            <p className="text-slate-500 text-sm mt-2">
                                Based on a conservative 60% recovery rate via automated recall protocols.
                            </p>
                        </div>

                        <div className="pl-0 lg:pl-12 pt-8">
                            <a href="#" className="inline-flex items-center gap-2 text-white font-bold border-b border-indigo-500 pb-1 hover:text-indigo-400 transition-colors">
                                See the Case Study <TrendingUp size={16} />
                            </a>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default RoiCalculator;
