import React from 'react';
import { X, Check } from 'lucide-react';

const Comparison: React.FC = () => {
    return (
        <section className="py-24 px-6 bg-slate-950 relative overflow-hidden">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16 space-y-4">
                    <h2 className="text-3xl md:text-5xl font-black text-white tracking-tighter">
                        The Shift.
                    </h2>
                    <p className="text-slate-400 text-lg">Stop renting your audience. Start owning it.</p>
                </div>

                <div className="grid md:grid-cols-2 gap-8 relative z-10">
                    {/* OLD WAY */}
                    <div className="p-8 md:p-12 rounded-[2.5rem] bg-slate-900/50 border border-slate-800 backdrop-blur-sm relative group overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-red-500/0 to-red-900/0 group-hover:to-red-900/10 transition-all duration-700"></div>
                        <h3 className="text-xl font-bold text-slate-500 mb-8 uppercase tracking-widest flex items-center gap-3 relative z-10">
                            <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-red-500 border border-slate-700">
                                <X size={20} />
                            </div>
                            The Legacy Way
                        </h3>
                        <div className="space-y-6 relative z-10">
                            <ul className="space-y-6 text-slate-400">
                                <li className="flex gap-4 items-start">
                                    <span className="text-red-500/50 font-mono mt-1">01.</span>
                                    <span>Burning money on generic Meta/Google Ads with low conversion.</span>
                                </li>
                                <li className="flex gap-4 items-start">
                                    <span className="text-red-500/50 font-mono mt-1">02.</span>
                                    <span>Patient forgets you 2 days after treatment (no brand stickiness).</span>
                                </li>
                                <li className="flex gap-4 items-start">
                                    <span className="text-red-500/50 font-mono mt-1">03.</span>
                                    <span>Staff wasting 20hrs/week on manual confirmation calls.</span>
                                </li>
                                <li className="flex gap-4 items-start">
                                    <span className="text-red-500/50 font-mono mt-1">04.</span>
                                    <span>Competing purely on price, not value or experience.</span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* NEW WAY */}
                    <div className="p-8 md:p-12 rounded-[2.5rem] bg-gradient-to-b from-indigo-900/80 to-slate-900/90 border border-indigo-500/30 backdrop-blur-md relative overflow-hidden shadow-2xl shadow-indigo-900/20 group">
                        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/20 blur-[120px] rounded-full group-hover:bg-indigo-500/30 transition-all duration-700"></div>

                        <h3 className="text-xl font-bold text-white mb-8 uppercase tracking-widest flex items-center gap-3 relative z-10">
                            <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center text-white border border-indigo-400 shadow-lg shadow-indigo-500/50">
                                <Check size={20} />
                            </div>
                            The RetainOS Way
                        </h3>
                        <div className="space-y-6 relative z-10">
                            <ul className="space-y-6 text-white font-medium">
                                <li className="flex gap-4 items-start">
                                    <span className="text-indigo-300 font-mono mt-1">01.</span>
                                    <span>Direct access via <b>Your Own White-Label App</b>.</span>
                                </li>
                                <li className="flex gap-4 items-start">
                                    <span className="text-indigo-300 font-mono mt-1">02.</span>
                                    <span>Automated weekly engagement loops (Score, Rewards, Tips).</span>
                                </li>
                                <li className="flex gap-4 items-start">
                                    <span className="text-indigo-300 font-mono mt-1">03.</span>
                                    <span>Gamified loyalty that locks families into your clinic.</span>
                                </li>
                                <li className="flex gap-4 items-start">
                                    <span className="text-indigo-300 font-mono mt-1">04.</span>
                                    <span>Zero-touch recalls filled automatically.</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Comparison;
