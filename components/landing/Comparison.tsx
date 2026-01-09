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
                    <div className="p-8 rounded-[2rem] bg-slate-900/50 border border-slate-800 backdrop-blur-sm grayscale opacity-70 hover:opacity-100 transition-opacity">
                        <h3 className="text-xl font-bold text-slate-500 mb-6 uppercase tracking-widest flex items-center gap-2">
                            <X className="text-red-500" /> The Old Way
                        </h3>
                        <div className="space-y-6">
                            <ul className="space-y-4 text-slate-400">
                                <li className="flex gap-4">
                                    <span className="text-slate-600">01.</span>
                                    <span>Burning money on Meta/Google Ads.</span>
                                </li>
                                <li className="flex gap-4">
                                    <span className="text-slate-600">02.</span>
                                    <span>Patient forgets you after treatment.</span>
                                </li>
                                <li className="flex gap-4">
                                    <span className="text-slate-600">03.</span>
                                    <span>Manual follow-ups via WhatsApp/SMS.</span>
                                </li>
                                <li className="flex gap-4">
                                    <span className="text-slate-600">04.</span>
                                    <span>Competing on price, not value.</span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* NEW WAY */}
                    <div className="p-8 rounded-[2rem] bg-gradient-to-b from-indigo-900/20 to-slate-900/50 border border-indigo-500/30 backdrop-blur-md relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 blur-[100px] rounded-full"></div>
                        <h3 className="text-xl font-bold text-white mb-6 uppercase tracking-widest flex items-center gap-2">
                            <Check className="text-emerald-400" /> The RetainOS Way
                        </h3>
                        <div className="space-y-6">
                            <ul className="space-y-4 text-slate-200 font-medium">
                                <li className="flex gap-4 items-center">
                                    <span className="text-indigo-500">01.</span>
                                    <span>Direct access via <b>Your Own App</b>.</span>
                                </li>
                                <li className="flex gap-4 items-center">
                                    <span className="text-indigo-500">02.</span>
                                    <span>Automated weekly engagement loops.</span>
                                </li>
                                <li className="flex gap-4 items-center">
                                    <span className="text-indigo-500">03.</span>
                                    <span>Gamified loyalty (Points & Rewards).</span>
                                </li>
                                <li className="flex gap-4 items-center">
                                    <span className="text-indigo-500">04.</span>
                                    <span>Premium "Member" experience.</span>
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
