import React from 'react';
import { Quote } from 'lucide-react';

const CaseStudySection: React.FC = () => {
    return (
        <section className="py-24 bg-white relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">

                {/* Visual Side */}
                <div className="relative">
                    <div className="absolute inset-0 bg-indigo-600/10 blur-[100px] rounded-full"></div>
                    <div className="relative z-10 rounded-[2.5rem] overflow-hidden shadow-2xl bg-indigo-900 aspect-square md:aspect-[4/5] relative group">
                        {/* Placeholder for Doctor Image - using a gradient/abstract for now if no image available */}
                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-indigo-900 mix-blend-overlay opacity-60"></div>
                        <img
                            src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=2070&auto=format&fit=crop"
                            alt="Dr. Sarah Chen"
                            className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700"
                        />

                        <div className="absolute bottom-0 left-0 w-full p-8 bg-gradient-to-t from-black/80 to-transparent">
                            <p className="text-white font-bold text-xl">Dr. Sarah Chen, DDS</p>
                            <p className="text-indigo-200 text-sm">Founder, Mint Dental Group (5 Locations)</p>
                        </div>
                    </div>
                </div>

                {/* Content Side */}
                <div className="space-y-10">
                    <div className="flex items-center gap-4">
                        <span className="w-12 h-[1px] bg-slate-200"></span>
                        <span className="text-indigo-600 font-bold tracking-widest uppercase text-sm">Case Study</span>
                    </div>

                    <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
                        "We stopped bleeding patients and added <span className="text-indigo-600">$1.2M in annual recurring revenue.</span>"
                    </h2>

                    <div className="relative">
                        <Quote className="absolute -top-4 -left-6 text-indigo-100 transform -scale-x-100" size={64} />
                        <p className="text-xl text-slate-600 leading-relaxed relative z-10 italic font-medium">
                            Before RetainOS, our recall system was broken. We were burning cash on Google Ads just to replace the patients walking out the back door.
                            Switching to this platform gave us our retention back on autopilot.
                        </p>
                    </div>

                    <div className="grid grid-cols-3 gap-8 pt-6 border-t border-slate-100">
                        <div>
                            <p className="text-4xl font-black text-slate-900 mb-1">+22%</p>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">Retention Rate</p>
                        </div>
                        <div>
                            <p className="text-4xl font-black text-slate-900 mb-1">0</p>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">No-Shows</p>
                        </div>
                        <div>
                            <p className="text-4xl font-black text-slate-900 mb-1">3x</p>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">Google Reviews</p>
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
};

export default CaseStudySection;
