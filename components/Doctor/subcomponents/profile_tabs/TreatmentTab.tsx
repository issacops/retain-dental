import React, { useState, useEffect } from 'react';
import { Microscope, Sparkles, User as UserIcon, X } from 'lucide-react';
import { Clinic, User } from '../../../../types';
import { TREATMENT_TEMPLATES } from '../../../../constants';

interface TreatmentTabProps {
    clinic: Clinic;
    patient: User;
    onAssignPlan: (clinicId: string, patientId: string, template: any) => Promise<any>;
}

const TreatmentTab: React.FC<TreatmentTabProps> = ({ clinic, patient, onAssignPlan }) => {
    const [selectedTemplateName, setSelectedTemplateName] = useState<string>('');
    const [customValues, setCustomValues] = useState<Record<string, any>>({});
    const [instructions, setInstructions] = useState<string[]>([]);

    useEffect(() => {
        if (selectedTemplateName) {
            const template = TREATMENT_TEMPLATES.find(t => t.name === selectedTemplateName);
            if (template) {
                const defaults: Record<string, any> = {};
                template.customFields?.forEach(f => defaults[f.key] = f.defaultValue);
                setCustomValues(defaults);
                // Deep copy instructions for editing
                setInstructions([...template.instructions]);
            }
        } else {
            setCustomValues({});
            setInstructions([]);
        }
    }, [selectedTemplateName]);

    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* PROTOCOL SELECTOR */}
            <div className="bg-white p-12 rounded-[48px] shadow-sm border border-slate-100 flex flex-col xl:flex-row gap-12 items-start relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-2 h-full" style={{ backgroundColor: clinic.primaryColor }}></div>

                <div className="flex-1 w-full space-y-6">
                    <div className="flex items-center gap-4 text-slate-400 font-black uppercase tracking-[0.2em] text-[10px] mb-4">
                        <Microscope size={14} /> Step 1: Protocol Selection
                    </div>
                    <h3 className="text-4xl font-black text-slate-900 tracking-tighter">Clinical Procedure</h3>
                    <p className="text-slate-500 font-medium">Select the primary treatment to generate the AI-assisted timeline and patient aftercare instructions.</p>

                    <div className="relative group/select mt-8 w-full xl:w-2/3">
                        <div className="absolute inset-0 bg-gradient-to-br from-teal-500/5 to-purple-500/5 rounded-[28px] opacity-0 group-hover/select:opacity-100 transition-opacity"></div>
                        <select className="w-full p-8 bg-slate-50 border border-slate-200/60 rounded-[28px] outline-none font-black text-xl appearance-none cursor-pointer hover:bg-white hover:shadow-xl hover:-translate-y-1 transition-all duration-300 text-slate-800 focus:border-teal-500 shadow-sm"
                            onChange={(e) => setSelectedTemplateName(e.target.value)}
                            value={selectedTemplateName}>
                            <option value="">-- Choose Procedure --</option>
                            {TREATMENT_TEMPLATES.map(t => (
                                <option key={t.name} value={t.name}>{t.name} ({t.category})</option>
                            ))}
                        </select>
                        <div className="absolute right-8 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">▼</div>
                    </div>
                </div>

                {/* Empty State visual */}
                {!selectedTemplateName && (
                    <div className="flex-1 w-full h-full min-h-[250px] bg-slate-50 rounded-[32px] border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-center p-8">
                        <Microscope size={48} className="text-slate-200 mb-4" />
                        <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Awaiting Selection</p>
                        <p className="text-slate-400 font-medium text-sm mt-2 max-w-xs">The Smart Case Presentation will generate automatically upon selection.</p>
                    </div>
                )}
            </div>

            {/* SMART CASE PRESENTATION (Only visible when active) */}
            {selectedTemplateName && (
                <div className="animate-in fade-in slide-in-from-top-8 duration-700 bg-slate-900 rounded-[48px] p-12 text-white relative overflow-hidden shadow-2xl">
                    <div className="absolute top-0 right-0 p-12 opacity-5 scale-150"><Sparkles size={200} /></div>

                    <div className="flex justify-between items-start mb-12 relative z-10">
                        <div>
                            <div className="flex items-center gap-3 text-emerald-400 mb-4">
                                <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.8)]"></div>
                                <h4 className="font-black text-xs uppercase tracking-[0.2em]">Smart Case Engine Active</h4>
                            </div>
                            <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-white">{selectedTemplateName}</h2>
                        </div>
                        <button onClick={() => {
                            const template = TREATMENT_TEMPLATES.find(t => t.name === selectedTemplateName);
                            if (template) {
                                // IMPORTANT: pass the highly customized instructions payload instead of default
                                onAssignPlan(clinic.id, patient.id, { ...template, customValues, instructions });
                                setSelectedTemplateName('');
                                setCustomValues({});
                                setInstructions([]);
                            }
                        }} className="px-8 py-5 bg-white text-slate-900 rounded-2xl shadow-xl shadow-white/10 font-black text-xs uppercase tracking-widest hover:bg-slate-100 transition-all hover:scale-105 active:scale-95 flex items-center gap-3">
                            <Sparkles size={16} className="text-teal-600" /> Dispatch to Patient PWA
                        </button>
                    </div>

                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-12 relative z-10">
                        {/* LEFT: CLINICAL PARAMS */}
                        <div className="space-y-6">
                            <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] border-b border-slate-800 pb-4">Procedure Parameters</h3>
                            <div className="grid grid-cols-2 gap-4">
                                {TREATMENT_TEMPLATES.find(t => t.name === selectedTemplateName)?.customFields?.map(field => (
                                    <div key={field.key} className="space-y-2 group/input">
                                        <label className="text-[9px] font-black text-slate-500 uppercase tracking-wider block ml-2">{field.label}</label>
                                        <input
                                            type={field.type}
                                            value={customValues[field.key] || ''}
                                            onChange={(e) => setCustomValues(prev => ({ ...prev, [field.key]: e.target.value }))}
                                            className="w-full px-5 py-4 bg-white/5 rounded-2xl border border-white/10 text-white font-bold text-sm outline-none focus:border-teal-400 focus:bg-white/10 focus:shadow-lg transition-all"
                                        />
                                    </div>
                                ))}
                            </div>

                            <div className="mt-8 bg-teal-500/10 border border-teal-500/30 rounded-3xl p-6">
                                <h4 className="flex items-center gap-2 text-teal-300 font-bold text-xs uppercase tracking-widest mb-2"><UserIcon size={14} /> Patient Notification</h4>
                                <p className="text-sm font-medium text-teal-100 leading-relaxed">
                                    Dispatching this plan will instantly push the daily habit tracker to <strong>{patient.name}'s</strong> digital wallet, earning them points for compliance.
                                </p>
                            </div>
                        </div>

                        {/* RIGHT: CUSTOMIZABLE AFTERCARE */}
                        <div className="bg-black/40 rounded-[32px] p-8 border border-white/5 flex flex-col h-full">
                            <div className="flex justify-between items-center border-b border-white/10 pb-4 mb-6">
                                <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">Daily Aftercare Protocol</h3>
                                <button
                                    onClick={() => setInstructions([...instructions, ""])}
                                    className="bg-white/10 text-white hover:bg-white/20 px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all focus:outline-none flex items-center gap-1">
                                    <Plus size={12} /> Add Rule
                                </button>
                            </div>

                            <div className="space-y-3 overflow-y-auto max-h-[300px] custom-scrollbar pr-2 flex-1">
                                {instructions.map((inst, idx) => (
                                    <div key={idx} className="flex gap-3 group/rule relative">
                                        <span className="text-slate-600 font-mono text-xs font-bold pt-3 select-none w-4">{idx + 1}.</span>
                                        <input
                                            value={inst}
                                            onChange={e => {
                                                const newInst = [...instructions];
                                                newInst[idx] = e.target.value;
                                                setInstructions(newInst);
                                            }}
                                            className="flex-1 bg-transparent border-b border-white/10 focus:border-emerald-400 px-3 py-3 text-sm font-medium text-white outline-none transition-colors"
                                            placeholder={`Instruction ${idx + 1}`}
                                        />
                                        <button
                                            onClick={() => {
                                                const newInst = [...instructions];
                                                newInst.splice(idx, 1);
                                                setInstructions(newInst);
                                            }}
                                            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-rose-500/20 text-rose-300 rounded-lg hover:bg-rose-500 hover:text-white opacity-0 group-hover/rule:opacity-100 transition-all">
                                            <X size={12} />
                                        </button>
                                    </div>
                                ))}
                                {instructions.length === 0 && (
                                    <p className="text-slate-500 font-bold italic text-sm text-center py-8">No instructions. Add one to start.</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TreatmentTab;
