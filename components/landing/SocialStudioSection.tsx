import React from 'react';
import { motion } from 'framer-motion';
import { Share2, Sparkles, TrendingUp, Users } from 'lucide-react';

const SocialStudioSection: React.FC = () => {
    return (
        <section className="py-24 px-6 bg-white overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-50 via-white to-white z-0"></div>

            <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center relative z-10">
                <div className="space-y-8">
                    <span className="text-indigo-600 font-bold tracking-widest uppercase text-sm flex items-center gap-2">
                        <Sparkles size={16} />
                        Social Studio
                    </span>
                    <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter leading-tight">
                        Fire your <br />
                        <span className="text-indigo-600">Digital Marketer.</span>
                    </h2>
                    <p className="text-xl text-slate-600 leading-relaxed">
                        Stop paying agencies $2,000/mo to post stock photos. RetainOS turns your actual patient success stories into viral localized content.
                    </p>

                    <div className="space-y-6 pt-4">
                        <div className="flex gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0">
                                <Share2 size={24} />
                            </div>
                            <div>
                                <h4 className="text-lg font-bold text-slate-900">Auto-Generated Content</h4>
                                <p className="text-slate-500">System automatically creates "Before & After" posts when cases are completed.</p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0">
                                <Users size={24} />
                            </div>
                            <div>
                                <h4 className="text-lg font-bold text-slate-900">Patient Ambassador Program</h4>
                                <p className="text-slate-500">Incentivize patients to share their smile on Instagram/TikTok for 500 points.</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="relative">
                    {/* Floating Cards UI Mock */}
                    <div className="relative z-10 bg-white border border-slate-200 rounded-3xl p-6 shadow-2xl shadow-indigo-900/10 rotate-3 transition-transform hover:rotate-0 duration-500">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white">
                                <Share2 size={20} />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-slate-400 uppercase">Instagram Story</p>
                                <p className="text-sm font-bold text-slate-900">Auto-Draft Created</p>
                            </div>
                            <span className="ml-auto text-xs font-bold text-white bg-indigo-600 px-2 py-1 rounded-md">Ready</span>
                        </div>
                        <div className="aspect-square bg-slate-100 rounded-2xl overflow-hidden relative mb-4 group">
                            <div className="absolute inset-0 flex items-center justify-center text-slate-300 font-bold bg-slate-50">
                                CASE #2982
                            </div>
                            {/* Overlay */}
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <button className="bg-white text-slate-900 px-4 py-2 rounded-full font-bold text-sm">Post Now</button>
                            </div>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-slate-500 font-medium">Est. Reach: <span className="text-slate-900 font-bold">4.2k locals</span></span>
                            <div className="flex items-center gap-1 text-emerald-600 font-bold">
                                <TrendingUp size={16} /> +12 Requests
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default SocialStudioSection;
