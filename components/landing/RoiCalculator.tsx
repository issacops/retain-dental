import React, { useState, useEffect } from 'react';
import { TrendingUp, Users, DollarSign, Activity } from 'lucide-react';

const RoiCalculator: React.FC = () => {
    const [patients, setPatients] = useState(2000);
    const [ltv, setLtv] = useState(1500);
    const [churnRate, setChurnRate] = useState(15);

    const [lostRevenue, setLostRevenue] = useState(0);
    const [retainedRevenue, setRetainedRevenue] = useState(0);

    useEffect(() => {
        const annualLoss = patients * (churnRate / 100) * ltv;
        const recovered = annualLoss * 0.60;
        setLostRevenue(annualLoss);
        setRetainedRevenue(recovered);
    }, [patients, ltv, churnRate]);

    return (
        <section className="py-24 px-6 bg-white relative overflow-hidden">
            <div className="absolute inset-0 bg-[linear-gradient(rgba(13,148,136,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(13,148,136,0.04)_1px,transparent_1px)] bg-[size:40px_40px]"></div>

            <div className="max-w-7xl mx-auto relative z-10">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <span className="inline-flex items-center gap-2 px-3 py-1 bg-teal-50 border border-teal-100 rounded-full text-xs font-bold text-teal-700 uppercase tracking-widest mb-4">
                        ROI Calculator
                    </span>
                    <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter mb-4">
                        The economy of <span className="text-teal-600">retention.</span>
                    </h2>
                    <p className="text-xl text-slate-600">
                        Most clinics lose <span className="text-rose-600 font-bold">15-20%</span> of patients annually.
                        Plug the leak — your valuation doubles.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 bg-white border border-slate-200 rounded-[2.5rem] p-8 md:p-12 shadow-xl shadow-slate-200/50">

                    <div className="space-y-10">
                        <div>
                            <div className="flex justify-between items-center mb-3">
                                <label className="text-slate-700 font-bold flex items-center gap-2 text-sm">
                                    <Users size={16} className="text-teal-600" /> Active Patients
                                </label>
                                <span className="text-xl font-mono text-slate-900 font-bold">{patients.toLocaleString()}</span>
                            </div>
                            <input
                                type="range" min="500" max="10000" step="100"
                                value={patients} onChange={e => setPatients(Number(e.target.value))}
                                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-teal-500"
                            />
                        </div>

                        <div>
                            <div className="flex justify-between items-center mb-3">
                                <label className="text-slate-700 font-bold flex items-center gap-2 text-sm">
                                    <DollarSign size={16} className="text-emerald-600" /> Avg Case Value (LTV)
                                </label>
                                <span className="text-xl font-mono text-slate-900 font-bold">${ltv.toLocaleString()}</span>
                            </div>
                            <input
                                type="range" min="500" max="5000" step="100"
                                value={ltv} onChange={e => setLtv(Number(e.target.value))}
                                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                            />
                        </div>

                        <div>
                            <div className="flex justify-between items-center mb-3">
                                <label className="text-slate-700 font-bold flex items-center gap-2 text-sm">
                                    <Activity size={16} className="text-rose-600" /> Current Churn Rate
                                </label>
                                <span className="text-xl font-mono text-slate-900 font-bold">{churnRate}%</span>
                            </div>
                            <input
                                type="range" min="5" max="30" step="1"
                                value={churnRate} onChange={e => setChurnRate(Number(e.target.value))}
                                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-rose-500"
                            />
                            <p className="text-xs text-slate-400 mt-2">Industry average: 17%</p>
                        </div>
                    </div>

                    <div className="flex flex-col justify-center space-y-6 relative">
                        <div className="absolute left-0 top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-slate-200 to-transparent hidden lg:block"></div>

                        <div className="pl-0 lg:pl-10">
                            <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] mb-2">Annual Revenue at Risk</p>
                            <h3 className="text-5xl font-black text-rose-600 tracking-tighter">
                                -${Math.floor(lostRevenue).toLocaleString()}
                            </h3>
                            <p className="text-slate-500 text-sm mt-2">Revenue disappearing into thin air every year.</p>
                        </div>

                        <div className="pl-0 lg:pl-10 pt-2 border-t border-slate-100">
                            <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] mb-2 mt-4">Recoverable with RetainOS</p>
                            <h3 className="text-5xl font-black text-teal-600 tracking-tighter">
                                +${Math.floor(retainedRevenue).toLocaleString()}
                            </h3>
                            <p className="text-slate-600 text-sm mt-2">
                                Based on a conservative 60% recovery rate via automated recall protocols.
                            </p>
                        </div>

                        <div className="pl-0 lg:pl-10 pt-4">
                            <a href="#case-study" className="inline-flex items-center gap-2 text-teal-600 font-bold border-b border-teal-500 pb-1 hover:text-teal-700 transition-colors">
                                See the case study <TrendingUp size={16} />
                            </a>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default RoiCalculator;
