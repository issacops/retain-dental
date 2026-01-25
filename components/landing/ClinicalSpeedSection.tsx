import React from 'react';
import { motion } from 'framer-motion';
import { Clock, Zap, FileText, CheckCircle2 } from 'lucide-react';

const ClinicalSpeedSection: React.FC = () => {
    return (
        <section className="py-24 px-6 bg-slate-50 overflow-hidden border-y border-slate-200">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16 space-y-4">
                    <span className="text-blue-600 font-bold tracking-widest uppercase text-sm">Clinical Intelligence</span>
                    <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter">
                        Don't start from scratch.<br />
                        <span className="text-blue-600">Clone success in seconds.</span>
                    </h2>
                    <p className="text-slate-600 max-w-2xl mx-auto text-lg">
                        Use our library of battle-tested Retention Protocols. Invisalign, Implants, Whitening—deployed to your practice in one click.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {[
                        { title: "Invisalign Track", items: ["2-Day Check-in", "Tray Switch Reminders", "Chewie Ordering Link"], color: "bg-blue-500" },
                        { title: "Implant Recovery", items: ["Pain Mgmt Tips", "Soft Food Recipes", "Warning Sign Alerts"], color: "bg-emerald-500" },
                        { title: "Whitening Boost", items: ["Sensitivity Check", "Shade Comparison", "Refill Promotion"], color: "bg-purple-500" }
                    ].map((template, i) => (
                        <div key={i} className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50 hover:-translate-y-2 transition-transform duration-300 group">
                            <div className={`w-12 h-12 rounded-xl ${template.color} text-white flex items-center justify-center mb-6`}>
                                <FileText size={24} />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-4">{template.title}</h3>
                            <ul className="space-y-3 mb-6">
                                {template.items.map((item, j) => (
                                    <li key={j} className="flex items-center gap-3 text-sm text-slate-500">
                                        <CheckCircle2 size={16} className="text-slate-300 group-hover:text-blue-500 transition-colors" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                            <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
                                <span className="text-xs font-bold text-slate-400 uppercase">Automation</span>
                                <span className="text-xs font-black bg-slate-900 text-white px-2 py-1 rounded">Active</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ClinicalSpeedSection;
