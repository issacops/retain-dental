import React, { useState, useEffect } from 'react';
import { MessageSquare, Calendar, ShoppingBag, Bell, ScanFace, FileText } from 'lucide-react';
import { motion } from 'framer-motion';

const BentoGrid: React.FC = () => {
    const [typing, setTyping] = useState(false);

    // Simple typing simulation loop
    useEffect(() => {
        const interval = setInterval(() => {
            setTyping(true);
            setTimeout(() => setTyping(false), 2000);
        }, 4000);
        return () => clearInterval(interval);
    }, []);

    return (
        <section className="py-24 px-6 bg-slate-50 border-t border-slate-200">
            <div className="max-w-7xl mx-auto">
                <div className="mb-16 max-w-2xl">
                    <h2 className="text-4xl font-black text-slate-900 tracking-tighter mb-4">
                        Everything they need. <br />
                        <span className="text-primary-600">One tap away.</span>
                    </h2>
                    <p className="text-slate-500 text-lg">
                        Replace your disjointed tools with a single, branded ecosystem.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-6 h-[800px] md:h-[600px]">

                    {/* Feature 1: Chat (Large) - Interactive */}
                    <div className="md:col-span-2 md:row-span-2 bg-white border border-slate-200 rounded-3xl p-8 relative overflow-hidden group hover:border-primary-500/50 hover:shadow-2xl transition-all duration-500 shadow-sm">
                        <div className="absolute top-0 right-0 p-12 opacity-5">
                            <MessageSquare size={140} className="text-primary-900" />
                        </div>

                        <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center text-primary-600 mb-6">
                            <MessageSquare size={24} />
                        </div>
                        <h3 className="text-2xl font-bold text-slate-900 mb-2">Secure 2-Way Chat</h3>
                        <p className="text-slate-500 max-w-sm mb-8">Direct, HIPAA-compliant messaging. Replace unsecure texts with a branded professional channel.</p>

                        {/* Chat UI Mock */}
                        <div className="absolute bottom-0 right-0 w-3/4 translate-x-12 translate-y-8 bg-slate-50 rounded-tl-3xl p-6 border border-slate-200 shadow-2xl group-hover:translate-y-4 transition-transform duration-500">
                            <div className="space-y-4">
                                <div className="bg-primary-600 text-white p-4 rounded-2xl rounded-tr-none text-sm ml-auto w-fit max-w-[85%] shadow-md">
                                    Dr. Smith, is my aligner fit okay?
                                </div>
                                <div className="bg-white text-slate-800 border border-slate-100 p-4 rounded-2xl rounded-tl-none text-sm w-fit max-w-[85%] shadow-sm relative">
                                    {typing ? (
                                        <div className="flex gap-1.5 opacity-50">
                                            <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce"></span>
                                            <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce delay-100"></span>
                                            <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce delay-200"></span>
                                        </div>
                                    ) : (
                                        "Looks perfect, Sarah. Keep going! 👍"
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Feature 2: Booking */}
                    <div className="bg-white border border-slate-200 rounded-3xl p-8 relative overflow-hidden hover:border-secondary-500/30 hover:shadow-xl transition-all shadow-sm group">
                        <div className="w-10 h-10 bg-secondary-100 rounded-lg flex items-center justify-center text-secondary-600 mb-4">
                            <Calendar size={20} />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900">Instant Booking</h3>
                        <p className="text-slate-500 text-sm mt-2">Real-time sync logic.</p>
                        <div className="absolute -bottom-4 -right-4 bg-secondary-50 p-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                            <Calendar size={40} className="text-secondary-200" />
                        </div>
                    </div>

                    {/* Feature 3: Shop */}
                    <div className="bg-white border border-slate-200 rounded-3xl p-8 relative overflow-hidden hover:border-emerald-500/30 hover:shadow-xl transition-all shadow-sm">
                        <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center text-emerald-600 mb-4">
                            <ShoppingBag size={20} />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900">Curated Store</h3>
                        <p className="text-slate-500 text-sm mt-2">Sell retainers & whitening.</p>
                    </div>

                    {/* Feature 4: Notifications */}
                    <div className="md:col-span-2 bg-gradient-to-r from-slate-900 to-slate-800 border border-slate-700 rounded-3xl p-8 flex flex-col justify-center relative overflow-hidden shadow-xl text-white">
                        <div className="absolute top-0 right-0 p-8 opacity-10">
                            <Bell size={120} />
                        </div>
                        <div className="relative z-10 flex items-center gap-8">
                            <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-white/10 shrink-0">
                                <Bell size={32} className="text-white" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-white mb-2">Smart Push Notifications</h3>
                                <p className="text-slate-400 text-base">"Time to scan", "Appointment tomorrow", "Happy Birthday". Automated and personalized.</p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default BentoGrid;
