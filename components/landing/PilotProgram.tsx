import React from 'react';
import { Quote, MapPin, Star } from 'lucide-react';

const PILOTS = [
    {
        quote: 'We replaced our SMS recall vendor in week 2. The branded app gets us in front of patients daily without a single ad dollar.',
        name: 'Dr. Anya P.',
        role: 'Orthodontist · Mumbai',
        metric: '247 active patients in 3 weeks',
    },
    {
        quote: 'Front desk call volume dropped 41% in the first month. Patients self-serve re-care, bill pay, and check-ins through the app.',
        name: 'R. Kapoor',
        role: 'Practice Manager · Delhi',
        metric: '41% reduction in recall no-shows',
    },
    {
        quote: 'The household points feature is a sleeper hit. Families pool balances together — kids\' cleanings ride on the parents\' tier status.',
        name: 'Dr. James L.',
        role: 'Family Dentist · Bengaluru',
        metric: '3.2x increase in family enrollments',
    },
];

const PilotProgram: React.FC = () => {
    return (
        <section className="py-24 px-6 bg-[#fdf8f0] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-teal-500/5 rounded-full blur-[100px]"></div>
            <div className="max-w-7xl mx-auto relative z-10">
                <div className="text-center mb-16 space-y-4">
                    <span className="inline-flex items-center gap-2 px-3 py-1 bg-teal-50 border border-teal-100 rounded-full text-xs font-bold text-teal-700 uppercase tracking-widest">
                        <Star size={12} className="fill-teal-700" /> Beta Pilot
                    </span>
                    <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter">
                        Built with the practices <br />
                        <span className="text-teal-600">that use it.</span>
                    </h2>
                    <p className="text-slate-500 max-w-2xl mx-auto text-lg">
                        Twelve clinics across India are piloting RetainOS in production.
                        Their feedback ships every week.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                    {PILOTS.map((p, i) => (
                        <div key={i} className="bg-white rounded-3xl p-7 border border-slate-200 shadow-lg shadow-slate-200/40 relative flex flex-col">
                            <Quote className="text-teal-500 mb-3" size={28} />
                            <p className="text-slate-700 leading-relaxed flex-1 mb-5">"{p.quote}"</p>
                            <div className="border-t border-slate-100 pt-4">
                                <p className="text-sm font-black text-slate-900">{p.name}</p>
                                <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                                    <MapPin size={10} /> {p.role}
                                </p>
                                <div className="mt-3 inline-flex items-center gap-1.5 px-2.5 py-1 bg-teal-50 border border-teal-100 rounded-lg">
                                    <span className="h-1.5 w-1.5 rounded-full bg-teal-500"></span>
                                    <p className="text-[10px] font-black text-teal-700 uppercase tracking-widest">{p.metric}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-12 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-full shadow-sm">
                        <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></div>
                        <p className="text-xs font-bold text-slate-600">
                            <span className="text-slate-900">12 of 50</span> pilot slots filled
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default PilotProgram;
