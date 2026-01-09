import React from 'react';
import { MessageSquare, Calendar, ShoppingBag, Bell, ScanFace, FileText } from 'lucide-react';

const BentoGrid: React.FC = () => {
    return (
        <section className="py-24 px-6 bg-slate-950">
            <div className="max-w-7xl mx-auto">
                <div className="mb-16 max-w-2xl">
                    <h2 className="text-4xl font-black text-white tracking-tighter mb-4">
                        Everything they need. <br />
                        <span className="text-indigo-500">One tap away.</span>
                    </h2>
                    <p className="text-slate-400 text-lg">
                        Replace your disjointed tools with a single, branded ecosystem.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-4 h-[800px] md:h-[600px]">

                    {/* Feature 1: Chat (Large) */}
                    <div className="md:col-span-2 md:row-span-2 bg-slate-900/50 border border-white/5 rounded-3xl p-8 relative overflow-hidden group hover:border-indigo-500/30 transition-colors">
                        <MessageSquare className="text-white mb-4" size={32} />
                        <h3 className="text-2xl font-bold text-white mb-2">Secure Chat</h3>
                        <p className="text-slate-400 max-w-sm mb-8">Direct, HIPAA-compliant messaging between doctor and patient. No more mixed WhatsApp chats.</p>

                        {/* Chat UI Mock */}
                        <div className="absolute bottom-0 right-0 w-3/4 translate-x-12 translate-y-12 bg-slate-800 rounded-tl-2xl p-4 border border-white/5 shadow-2xl group-hover:translate-y-8 transition-transform">
                            <div className="space-y-3">
                                <div className="bg-indigo-600 text-white p-3 rounded-2xl rounded-tr-none text-xs ml-auto w-fit max-w-[80%]">
                                    Dr. Smith, is my aligner fit okay?
                                </div>
                                <div className="bg-slate-700 text-white p-3 rounded-2xl rounded-tl-none text-xs w-fit max-w-[80%]">
                                    Looks perfect, Sarah. Keep going!
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Feature 2: Booking */}
                    <div className="bg-slate-900/50 border border-white/5 rounded-3xl p-6 relative overflow-hiddenhover:border-indigo-500/30 transition-colors">
                        <Calendar className="text-amber-400 mb-3" size={24} />
                        <h3 className="text-lg font-bold text-white">Instant Booking</h3>
                        <p className="text-slate-400 text-xs mt-2">Real-time slot availability sync.</p>
                    </div>

                    {/* Feature 3: Shop */}
                    <div className="bg-slate-900/50 border border-white/5 rounded-3xl p-6 relative overflow-hidden hover:border-indigo-500/30 transition-colors">
                        <ShoppingBag className="text-emerald-400 mb-3" size={24} />
                        <h3 className="text-lg font-bold text-white">Curated Store</h3>
                        <p className="text-slate-400 text-xs mt-2">Sell retainers & whitening kits.</p>
                    </div>

                    {/* Feature 4: Notifications */}
                    <div className="md:col-span-2 bg-gradient-to-r from-indigo-900/20 to-slate-900/50 border border-white/5 rounded-3xl p-6 flex flex-col justify-center relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 opacity-10">
                            <Bell size={120} />
                        </div>
                        <div className="relative z-10">
                            <h3 className="text-xl font-bold text-white mb-1">Smart Push Notifications</h3>
                            <p className="text-slate-400 text-sm">"Time to scan", "Appointment tomorrow", "Happy Birthday".</p>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default BentoGrid;
