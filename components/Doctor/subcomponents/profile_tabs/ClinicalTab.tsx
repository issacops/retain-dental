import React, { useState } from 'react';
import { ClipboardCheck, Activity, Check, Sparkles, HeartPulse, ShieldAlert, FileText, X } from 'lucide-react';
import { CarePlan, Clinic, User } from '../../../../types';

interface ClinicalTabProps {
    clinic: Clinic;
    activeCarePlan?: CarePlan;
    patient: User;
    onUpdateCarePlan: (carePlanId: string, updates: Partial<CarePlan>) => Promise<any>;
    onTerminateCarePlan: (carePlanId: string) => Promise<any>;
    onToggleChecklistItem: (carePlanId: string, itemId: string) => Promise<any>;
    onOpenConsole: (plan: CarePlan) => void;
}

const ClinicalTab: React.FC<ClinicalTabProps> = ({ clinic, activeCarePlan, patient, onUpdateCarePlan, onTerminateCarePlan, onToggleChecklistItem, onOpenConsole }) => {
    // Medical alerts are ideally stored in patient.metadata, using mock for now if empty
    const medicalAlerts = patient.metadata?.medicalAlerts || ['Penicillin Allergy', 'Requires Pre-medication'];

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* MEDICAL ALERTS BANNER */}
            {medicalAlerts.length > 0 && (
                <div className="bg-rose-50 border border-rose-100 rounded-[32px] p-6 flex flex-wrap items-center gap-4">
                    <div className="h-10 w-10 bg-rose-100 text-rose-500 rounded-full flex items-center justify-center shrink-0">
                        <ShieldAlert size={20} />
                    </div>
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-rose-400">Medical Alerts</p>
                        <div className="flex flex-wrap gap-2 mt-2">
                            {medicalAlerts.map((alert: string, i: number) => (
                                <span key={i} className="px-3 py-1 bg-white text-rose-600 border border-rose-200 rounded-lg text-xs font-bold shadow-sm">
                                    {alert}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-12 gap-8">
                {/* LEFT: ACTIVE TREATMENTS */}
                <div className="col-span-12 xl:col-span-8 space-y-8">
                    <div className="relative p-10 rounded-[48px] overflow-hidden bg-white shadow-xl shadow-slate-200/50 border border-slate-100/60 transition-all duration-500">
                        <div className="flex justify-between items-center relative z-10 mb-10">
                            <h3 className="font-black text-3xl tracking-tighter flex items-center gap-5 text-slate-900">
                                <div className="p-3 bg-emerald-50 rounded-2xl text-emerald-600 shadow-sm border border-emerald-100"><ClipboardCheck size={28} /></div>
                                Active Pathway
                            </h3>
                            {activeCarePlan && <div className="bg-emerald-500 text-white px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-emerald-200 flex items-center gap-3"><div className="h-2 w-2 rounded-full bg-white animate-pulse" /> Live Treatment</div>}
                        </div>

                        {activeCarePlan ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
                                <div className="p-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-[32px] relative overflow-hidden shadow-2xl shadow-emerald-500/20 text-white group/card">
                                    <div className="absolute right-0 top-0 p-12 opacity-10 scale-150 group-hover/card:scale-125 transition-transform duration-700 ease-out"><Activity size={120} /></div>

                                    <p className="text-[10px] font-black uppercase text-emerald-100 tracking-[0.25em] mb-4">Current Regime</p>
                                    <div className="flex justify-between items-start mb-8 relative z-20">
                                        <h4 className="text-4xl font-black tracking-tighter">{activeCarePlan.treatmentName}</h4>
                                    </div>

                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => onOpenConsole(activeCarePlan)}
                                            className="px-6 py-3 bg-white text-emerald-900 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg hover:scale-105 transition-all cursor-pointer"
                                        >
                                            View Details
                                        </button>
                                    </div>
                                    <div className="mt-8 pt-8 border-t border-white/10 flex items-end justify-between">
                                        <div className="space-y-2">
                                            <p className="text-[9px] font-black uppercase text-emerald-200/80 tracking-widest">Adherence</p>
                                            <div className="flex items-baseline gap-1">
                                                <p className="text-4xl font-black">98</p>
                                                <span className="text-sm font-bold opacity-60">%</span>
                                            </div>
                                        </div>
                                        <div className="flex-1 max-w-[140px] h-3 bg-black/20 rounded-full overflow-hidden backdrop-blur-sm border border-white/10">
                                            <div className="h-full bg-white w-[98%]"></div>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <p className="text-[10px] font-black text-slate-400 border-b border-slate-100 pb-2 mb-4">DAILY CHECKLIST</p>
                                    {activeCarePlan.checklist?.map((item, i) => (
                                        <div key={item.id} onClick={() => onToggleChecklistItem(activeCarePlan.id, item.id)} className="flex items-center gap-4 p-4 rounded-[24px] bg-slate-50 border border-slate-100 hover:shadow-md hover:border-emerald-200 transition-all duration-300 cursor-pointer group/item">
                                            <div className={`h-8 w-8 rounded-xl flex items-center justify-center transition-all ${item.completed ? 'bg-emerald-500 text-white' : 'bg-white text-slate-300'}`}>
                                                {item.completed ? <Check size={16} strokeWidth={4} /> : <span className="text-[10px] font-black">{i + 1}</span>}
                                            </div>
                                            <span className={`text-xs font-bold transition-colors ${item.completed ? 'text-slate-400 line-through decoration-emerald-500/50' : 'text-slate-700'}`}>{item.task}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="py-16 text-center border-2 border-dashed border-slate-200 rounded-[32px] bg-slate-50">
                                <HeartPulse size={40} className="mx-auto text-slate-300 mb-4" />
                                <p className="font-bold text-lg text-slate-400">No active treatments.</p>
                                <p className="text-xs font-medium text-slate-400 mt-2">Open the Command Planner or change tabs to assign a care protocol.</p>
                            </div>
                        )}
                    </div>

                    {/* ODONTOGRAM PLACEHOLDER (To be built further if requested) */}
                    <div className="p-10 rounded-[48px] border border-slate-100 bg-white shadow-xl shadow-slate-200/50 relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/20 to-transparent"></div>
                        <h3 className="font-black text-2xl tracking-tighter text-slate-900 mb-8 relative z-10">Dental Charting & Case Sheet</h3>
                        <div className="h-64 bg-slate-50 rounded-[32px] border border-slate-200 flex flex-col items-center justify-center relative z-10">
                            <FileText size={48} className="text-slate-200 mb-4" />
                            <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Visual Odontogram Render Area</p>
                            <p className="text-slate-400 text-[10px] mt-2">Charting capabilities initialized. Waiting for 3D API hook...</p>
                        </div>
                    </div>
                </div>

                {/* RIGHT: CLINICAL TIMELINE */}
                <div className="col-span-12 xl:col-span-4 space-y-6">
                    <div className="bg-slate-900 rounded-[40px] p-8 text-white relative overflow-hidden shadow-2xl h-full min-h-[500px]">
                        <div className="absolute top-0 right-0 p-8 opacity-5"><Activity size={100} /></div>
                        <h3 className="font-black text-xl mb-8 relative z-10 flex items-center justify-between">
                            Recent Notes
                            <button className="text-[10px] uppercase font-bold text-emerald-400 tracking-widest bg-emerald-400/10 px-3 py-1.5 rounded-lg hover:bg-emerald-400/20 transition-colors">+ Add Note</button>
                        </h3>

                        <div className="space-y-6 relative z-10 border-l-2 border-slate-800 pl-6 ml-2">
                            {/* Mocking Clinical Notes since they aren't fully integrated yet */}
                            <div className="relative">
                                <div className="absolute -left-[31px] top-1 h-4 w-4 rounded-full bg-slate-900 border-2 border-emerald-500"></div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Today, 10:00 AM</p>
                                <p className="text-sm font-medium text-slate-200 leading-relaxed">Patient presented with mild sensitivity in LR6. Recommend using Sensodyne. Continued with alignment tray 4.</p>
                            </div>
                            <div className="relative">
                                <div className="absolute -left-[31px] top-1 h-4 w-4 rounded-full bg-slate-900 border-2 border-slate-700"></div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Oct 14, 2025</p>
                                <p className="text-sm font-medium text-slate-200 leading-relaxed">Comprehensive exam. X-Rays taken. Mild calculus build-up in lingual anteriors. Scheduled hygiene.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ClinicalTab;
