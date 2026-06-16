import React from 'react';
import { X, Check, DollarSign, Clock, XCircle, Tag } from 'lucide-react';

const Comparison: React.FC = () => {
    return (
        <section className="py-24 px-6 bg-[#fdf8f0] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-teal-500/5 rounded-full blur-[100px]"></div>
            <div className="max-w-7xl mx-auto relative z-10">
                <div className="text-center mb-16 space-y-4">
                    <span className="inline-flex items-center gap-2 px-3 py-1 bg-teal-50 border border-teal-100 rounded-full text-xs font-bold text-teal-700 uppercase tracking-widest">
                        The Shift
                    </span>
                    <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter">
                        Stop renting your audience. <br />
                        <span className="text-teal-600">Start owning it.</span>
                    </h2>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    {/* OLD WAY */}
                    <div className="p-8 md:p-10 rounded-[2.5rem] bg-white border border-rose-200/60 shadow-lg shadow-rose-100/40 relative group overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-rose-100/30 rounded-full blur-[80px]"></div>
                        <h3 className="text-lg font-black text-rose-600 mb-8 uppercase tracking-widest flex items-center gap-3 relative z-10">
                            <div className="w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center text-rose-600 border border-rose-100">
                                <X size={20} />
                            </div>
                            The "Ad Spend" Trap
                        </h3>
                        <ul className="space-y-5 relative z-10">
                            <li className="flex gap-4 items-start">
                                <div className="p-1.5 bg-rose-50 rounded-lg text-rose-500 mt-0.5 shrink-0">
                                    <DollarSign size={14} />
                                </div>
                                <span className="text-slate-700 leading-relaxed">Burning ₹50k/mo on Meta Ads to fill the bucket you are leaking.</span>
                            </li>
                            <li className="flex gap-4 items-start">
                                <div className="p-1.5 bg-rose-50 rounded-lg text-rose-500 mt-0.5 shrink-0">
                                    <XCircle size={14} />
                                </div>
                                <span className="text-slate-700 leading-relaxed">Transactional patients who forget you 48 hours after treatment.</span>
                            </li>
                            <li className="flex gap-4 items-start">
                                <div className="p-1.5 bg-rose-50 rounded-lg text-rose-500 mt-0.5 shrink-0">
                                    <Clock size={14} />
                                </div>
                                <span className="text-slate-700 leading-relaxed">Staff wasting 20hrs/week chasing recalls that never answer.</span>
                            </li>
                            <li className="flex gap-4 items-start">
                                <div className="p-1.5 bg-rose-50 rounded-lg text-rose-500 mt-0.5 shrink-0">
                                    <Tag size={14} />
                                </div>
                                <span className="text-slate-700 leading-relaxed">Competing on price (Groupon/Offers) instead of brand loyalty.</span>
                            </li>
                        </ul>
                    </div>

                    {/* NEW WAY */}
                    <div className="p-8 md:p-10 rounded-[2.5rem] bg-gradient-to-br from-teal-600 to-teal-800 text-white shadow-2xl shadow-teal-900/30 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-72 h-72 bg-teal-400/30 blur-[100px] rounded-full"></div>
                        <h3 className="text-lg font-black text-white mb-8 uppercase tracking-widest flex items-center gap-3 relative z-10">
                            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-teal-600 shadow-lg">
                                <Check size={20} />
                            </div>
                            The RetainOS Way
                        </h3>
                        <ul className="space-y-5 relative z-10">
                            <li className="flex gap-4 items-start">
                                <span className="text-teal-200 font-mono font-black mt-0.5 text-sm">01.</span>
                                <span className="text-white leading-relaxed">Direct access via <strong>your custom branded app</strong>.</span>
                            </li>
                            <li className="flex gap-4 items-start">
                                <span className="text-teal-200 font-mono font-black mt-0.5 text-sm">02.</span>
                                <span className="text-white leading-relaxed">Automated weekly engagement loops (score, rewards, tips).</span>
                            </li>
                            <li className="flex gap-4 items-start">
                                <span className="text-teal-200 font-mono font-black mt-0.5 text-sm">03.</span>
                                <span className="text-white leading-relaxed">Gamified loyalty that locks families into your clinic.</span>
                            </li>
                            <li className="flex gap-4 items-start">
                                <span className="text-teal-200 font-mono font-black mt-0.5 text-sm">04.</span>
                                <span className="text-white leading-relaxed">Zero-touch recalls filled automatically.</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Comparison;
