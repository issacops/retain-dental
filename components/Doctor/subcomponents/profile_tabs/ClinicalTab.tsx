import React, { useState, useEffect } from 'react';
import { ClipboardCheck, Activity, Check, Sparkles, HeartPulse, ShieldAlert, FileText, X, Plus, Save, CheckCircle2 } from 'lucide-react';
import { CarePlan, Clinic, User } from '../../../../types';
import { IBackendService } from '../../../../services/IBackendService';

interface ClinicalTabProps {
    clinic: Clinic;
    activeCarePlan?: CarePlan;
    patient: User;
    backendService: IBackendService;
    onUpdateCarePlan: (carePlanId: string, updates: Partial<CarePlan>) => Promise<any>;
    onTerminateCarePlan: (carePlanId: string) => Promise<any>;
    onToggleChecklistItem: (carePlanId: string, itemId: string) => Promise<any>;
    onOpenConsole: (plan: CarePlan) => void;
    onRefreshData?: () => void;
}

// Standard FDI dental notation
const UPPER_TEETH = [18, 17, 16, 15, 14, 13, 12, 11, 21, 22, 23, 24, 25, 26, 27, 28];
const LOWER_TEETH = [48, 47, 46, 45, 44, 43, 42, 41, 31, 32, 33, 34, 35, 36, 37, 38];

const TOOTH_CONDITIONS: Record<string, { label: string; color: string }> = {
    healthy: { label: 'Healthy', color: '#10b981' },
    cavity: { label: 'Cavity', color: '#ef4444' },
    filling: { label: 'Filling', color: '#6366f1' },
    crown: { label: 'Crown', color: '#f59e0b' },
    missing: { label: 'Missing', color: '#94a3b8' },
    rct: { label: 'RCT', color: '#8b5cf6' },
    implant: { label: 'Implant', color: '#06b6d4' },
};

type ClinicalNote = { text: string; date: string };

const ClinicalTab: React.FC<ClinicalTabProps> = ({ clinic, activeCarePlan, patient, backendService, onUpdateCarePlan, onTerminateCarePlan, onToggleChecklistItem, onOpenConsole, onRefreshData }) => {
    const medicalAlerts = patient.metadata?.medicalAlerts || ['Penicillin Allergy', 'Requires Pre-medication'];

    // ==========================================
    // LOCAL STATE — initialized from props, updated optimistically
    // ==========================================
    const [notes, setNotes] = useState<ClinicalNote[]>(() => {
        return patient.metadata?.clinicalNotes || [];
    });
    const [dentalChart, setDentalChart] = useState<Record<number, string>>(() => {
        return patient.metadata?.dentalChart || {};
    });

    // Sync from props when patient changes (e.g. switching patients)
    useEffect(() => {
        setNotes(patient.metadata?.clinicalNotes || []);
        setDentalChart(patient.metadata?.dentalChart || {});
    }, [patient.id]);

    // UI state
    const [showNoteModal, setShowNoteModal] = useState(false);
    const [noteText, setNoteText] = useState('');
    const [savingNote, setSavingNote] = useState(false);
    const [noteSaved, setNoteSaved] = useState(false);

    const [selectedCondition, setSelectedCondition] = useState('cavity');
    const [savingChart, setSavingChart] = useState(false);
    const [chartSaved, setChartSaved] = useState(false);
    const [chartDirty, setChartDirty] = useState(false);

    // ==========================================
    // HANDLERS
    // ==========================================

    const handleAddNote = async () => {
        if (!noteText.trim()) return;
        setSavingNote(true);

        const newNote: ClinicalNote = {
            text: noteText.trim(),
            date: new Date().toISOString()
        };

        // 1. Optimistic update — show it immediately
        const updatedNotes = [newNote, ...notes];
        setNotes(updatedNotes);
        setNoteText('');
        setShowNoteModal(false);

        // 2. Persist to database
        const result = await backendService.updatePatientMetadata(patient.id, { clinicalNotes: updatedNotes });

        if (result.success) {
            setNoteSaved(true);
            setTimeout(() => setNoteSaved(false), 3000);
            onRefreshData?.();
        } else {
            // Rollback on failure
            setNotes(notes);
            console.error('Failed to save note:', result.message);
        }

        setSavingNote(false);
    };

    const handleDeleteNote = async (index: number) => {
        const updatedNotes = notes.filter((_, i) => i !== index);
        setNotes(updatedNotes);
        await backendService.updatePatientMetadata(patient.id, { clinicalNotes: updatedNotes });
        onRefreshData?.();
    };

    const handleToothClick = (tooth: number) => {
        const current = dentalChart[tooth];
        const newChart = { ...dentalChart };
        if (current === selectedCondition) {
            delete newChart[tooth];
        } else {
            newChart[tooth] = selectedCondition;
        }
        setDentalChart(newChart);
        setChartDirty(true);
    };

    const handleSaveChart = async () => {
        setSavingChart(true);

        const result = await backendService.updatePatientMetadata(patient.id, { dentalChart });

        if (result.success) {
            setChartDirty(false);
            setChartSaved(true);
            setTimeout(() => setChartSaved(false), 3000);
            onRefreshData?.();
        } else {
            console.error('Failed to save chart:', result.message);
        }

        setSavingChart(false);
    };

    const formatDate = (iso: string) => {
        try {
            const d = new Date(iso);
            return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
        } catch {
            return iso;
        }
    };

    const renderTooth = (num: number) => {
        const condition = dentalChart[num];
        const condInfo = condition ? TOOTH_CONDITIONS[condition] : null;
        const isSelected = !!condition;
        return (
            <div
                key={num}
                onClick={() => handleToothClick(num)}
                className="flex flex-col items-center cursor-pointer group"
                title={condInfo ? `${num}: ${condInfo.label}` : `Tooth ${num}: Click to mark`}
            >
                <div
                    className={`w-8 h-10 rounded-lg border-2 flex items-center justify-center text-[9px] font-black transition-all duration-200 hover:scale-110 ${isSelected
                            ? 'shadow-lg scale-105'
                            : 'border-slate-200 bg-white text-slate-400 hover:border-slate-400'
                        }`}
                    style={isSelected ? { borderColor: condInfo!.color, backgroundColor: condInfo!.color + '20', color: condInfo!.color } : {}}
                >
                    {condition === 'missing' ? '✕' : num}
                </div>
                {isSelected && (
                    <div className="text-[7px] font-bold mt-0.5 uppercase tracking-wider" style={{ color: condInfo!.color }}>
                        {condInfo!.label}
                    </div>
                )}
            </div>
        );
    };

    // Determine if we should show default placeholder notes
    const hasRealNotes = notes.length > 0;

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
                {/* LEFT: ACTIVE TREATMENTS + ODONTOGRAM */}
                <div className="col-span-12 xl:col-span-8 space-y-8">
                    {/* ACTIVE PATHWAY */}
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
                                    <h4 className="text-4xl font-black tracking-tighter mb-8">{activeCarePlan.treatmentName}</h4>
                                    <button onClick={() => onOpenConsole(activeCarePlan)} className="px-6 py-3 bg-white text-emerald-900 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg hover:scale-105 transition-all cursor-pointer">
                                        View Details
                                    </button>
                                    <div className="mt-8 pt-8 border-t border-white/10 flex items-end justify-between">
                                        <div className="space-y-2">
                                            <p className="text-[9px] font-black uppercase text-emerald-200/80 tracking-widest">Adherence</p>
                                            <p className="text-4xl font-black">98<span className="text-sm font-bold opacity-60">%</span></p>
                                        </div>
                                        <div className="flex-1 max-w-[140px] h-3 bg-black/20 rounded-full overflow-hidden backdrop-blur-sm border border-white/10">
                                            <div className="h-full bg-white w-[98%]"></div>
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <p className="text-[10px] font-black text-slate-400 border-b border-slate-100 pb-2 mb-4">DAILY CHECKLIST</p>
                                    {activeCarePlan.checklist?.map((item, i) => (
                                        <div key={item.id} onClick={() => onToggleChecklistItem(activeCarePlan.id, item.id)} className={`flex items-center gap-4 p-4 rounded-[24px] bg-slate-50 border border-slate-100 hover:shadow-md hover:border-emerald-200 transition-all duration-300 cursor-pointer`}>
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

                    {/* INTERACTIVE ODONTOGRAM */}
                    <div className="p-10 rounded-[48px] border border-slate-100 bg-white shadow-xl shadow-slate-200/50 relative overflow-hidden">
                        <div className="flex justify-between items-center mb-8">
                            <h3 className="font-black text-2xl tracking-tighter text-slate-900">Dental Charting & Case Sheet</h3>
                            <div className="flex items-center gap-3">
                                {chartSaved && (
                                    <div className="flex items-center gap-2 text-emerald-600 text-[10px] font-black uppercase tracking-widest animate-in fade-in slide-in-from-right-4 duration-300">
                                        <CheckCircle2 size={16} />
                                        Chart Saved
                                    </div>
                                )}
                                {chartDirty && (
                                    <button
                                        onClick={handleSaveChart}
                                        disabled={savingChart}
                                        className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-700 transition-all disabled:opacity-50 shadow-lg shadow-indigo-200"
                                    >
                                        <Save size={14} />
                                        {savingChart ? 'Saving...' : 'Save Chart'}
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Condition Selector */}
                        <div className="flex flex-wrap gap-2 mb-6">
                            {Object.entries(TOOTH_CONDITIONS).map(([key, { label, color }]) => (
                                <button
                                    key={key}
                                    onClick={() => setSelectedCondition(key)}
                                    className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all border-2 ${selectedCondition === key ? 'scale-105 shadow-md' : 'opacity-60 hover:opacity-100'
                                        }`}
                                    style={{
                                        borderColor: color,
                                        backgroundColor: selectedCondition === key ? color + '20' : 'transparent',
                                        color: color,
                                    }}
                                >
                                    {label}
                                </button>
                            ))}
                        </div>

                        {/* Upper Jaw */}
                        <div className="mb-2">
                            <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-2 text-center">Upper Jaw</p>
                            <div className="flex justify-center gap-1.5 flex-wrap">
                                {UPPER_TEETH.map(t => renderTooth(t))}
                            </div>
                        </div>

                        <div className="h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent my-4" />

                        {/* Lower Jaw */}
                        <div>
                            <div className="flex justify-center gap-1.5 flex-wrap">
                                {LOWER_TEETH.map(t => renderTooth(t))}
                            </div>
                            <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mt-2 text-center">Lower Jaw</p>
                        </div>

                        {/* Legend counts */}
                        <div className="mt-6 flex flex-wrap gap-3">
                            {Object.entries(TOOTH_CONDITIONS).map(([key, { label, color }]) => {
                                const count = Object.values(dentalChart).filter(v => v === key).length;
                                if (count === 0) return null;
                                return (
                                    <div key={key} className="flex items-center gap-1.5 text-[10px] font-bold" style={{ color }}>
                                        <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: color }} />
                                        {label}: {count}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* RIGHT: CLINICAL NOTES TIMELINE */}
                <div className="col-span-12 xl:col-span-4 space-y-6">
                    <div className="bg-slate-900 rounded-[40px] p-8 text-white relative overflow-hidden shadow-2xl h-full min-h-[500px]">
                        <div className="absolute top-0 right-0 p-8 opacity-5"><Activity size={100} /></div>
                        <div className="flex items-center justify-between mb-2 relative z-10">
                            <h3 className="font-black text-xl">Recent Notes</h3>
                            <button
                                onClick={() => setShowNoteModal(true)}
                                className="text-[10px] uppercase font-bold text-emerald-400 tracking-widest bg-emerald-400/10 px-3 py-1.5 rounded-lg hover:bg-emerald-400/20 transition-colors cursor-pointer"
                            >
                                + Add Note
                            </button>
                        </div>

                        {/* Saved confirmation */}
                        {noteSaved && (
                            <div className="mb-4 flex items-center gap-2 text-emerald-400 text-[10px] font-black uppercase tracking-widest animate-in fade-in slide-in-from-top-2 duration-300 relative z-10">
                                <CheckCircle2 size={14} />
                                Note Saved Successfully
                            </div>
                        )}

                        {/* Add Note Modal */}
                        {showNoteModal && (
                            <div className="relative z-20 mb-6 bg-slate-800 rounded-2xl p-5 border border-slate-700 animate-in fade-in slide-in-from-top-2 duration-300">
                                <div className="flex justify-between items-center mb-3">
                                    <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">New Clinical Note</p>
                                    <button onClick={() => setShowNoteModal(false)} className="text-slate-500 hover:text-white transition-colors"><X size={16} /></button>
                                </div>
                                <textarea
                                    value={noteText}
                                    onChange={(e) => setNoteText(e.target.value)}
                                    placeholder="Patient presented with..."
                                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-4 text-sm text-white placeholder-slate-600 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 transition-all resize-none"
                                    rows={4}
                                    autoFocus
                                />
                                <button
                                    onClick={handleAddNote}
                                    disabled={savingNote || !noteText.trim()}
                                    className="mt-3 w-full py-3 bg-emerald-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-600 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    <Save size={14} />
                                    {savingNote ? 'Saving...' : 'Save Note'}
                                </button>
                            </div>
                        )}

                        {/* Notes Timeline */}
                        <div className="space-y-6 relative z-10 border-l-2 border-slate-800 pl-6 ml-2 mt-6">
                            {hasRealNotes ? (
                                notes.map((note, i) => (
                                    <div key={`${note.date}-${i}`} className="relative group/note">
                                        <div className="absolute -left-[31px] top-1 h-4 w-4 rounded-full bg-slate-900 border-2 border-emerald-500"></div>
                                        <div className="flex justify-between items-start">
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{formatDate(note.date)}</p>
                                            <button
                                                onClick={() => handleDeleteNote(i)}
                                                className="opacity-0 group-hover/note:opacity-100 text-slate-600 hover:text-rose-400 transition-all p-1"
                                                title="Delete note"
                                            >
                                                <X size={12} />
                                            </button>
                                        </div>
                                        <p className="text-sm font-medium text-slate-200 leading-relaxed">{note.text}</p>
                                    </div>
                                ))
                            ) : (
                                <div className="py-10 text-center">
                                    <FileText size={32} className="mx-auto text-slate-700 mb-3" />
                                    <p className="text-slate-500 font-bold text-sm">No clinical notes yet</p>
                                    <p className="text-slate-600 text-xs mt-1">Click "+ Add Note" to create the first entry</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ClinicalTab;
