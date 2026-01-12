import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { CarePlan, Clinic, User } from '../../../types';
import { Activity, Calendar, CheckCircle, Clock, FileText, ChevronRight, PlayCircle, AlertCircle, TrendingUp, ShieldCheck, Flag, X } from 'lucide-react';

interface Props {
    plan: CarePlan;
    patient: User;
    clinic: Clinic;
    onClose: () => void;
    onUpdatePlan: (planId: string, updates: Partial<CarePlan>) => Promise<any>;
}

const DoctorTreatmentDetail: React.FC<Props> = ({ plan, patient, clinic, onClose, onUpdatePlan }) => {
    const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'JOURNEY' | 'MEDIA'>('OVERVIEW');
    const [mounted, setMounted] = useState(false);
    const [newItemText, setNewItemText] = useState('');

    useEffect(() => {
        setMounted(true);
        return () => setMounted(false);
    }, []);

    // DAILY CHECKLIST RESET LOGIC (Doctor Side)
    useEffect(() => {
        const today = new Date();
        const localDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

        const lastReset = plan.lastChecklistReset;
        if (plan.checklist && lastReset && lastReset !== localDate) {
            console.log(`Daily Reset Triggered (Doctor View) for ${plan.treatmentName}`);

            // Calculate History
            const totalItems = plan.checklist.length;
            const completedItems = plan.checklist.filter(i => i.completed).length;
            const score = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;

            const resetChecklist = plan.checklist.map(item => ({ ...item, completed: false }));

            onUpdatePlan(plan.id, {
                checklist: resetChecklist,
                lastChecklistReset: localDate,
                adherenceRecord: {
                    ...(plan.adherenceRecord || {}),
                    [lastReset]: score
                }
            });
        }
    }, [plan.id, plan.checklist, plan.lastChecklistReset, plan.treatmentName, onUpdatePlan]);

    if (!mounted || typeof document === 'undefined') return null;

    const progress = (plan.checklist?.filter(i => i.completed).length || 0) / (plan.checklist?.length || 1) * 100;

    // Journey Calculations
    const startDate = new Date(plan.assignedAt);
    const daysElapsed = Math.floor((new Date().getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    const duration = plan.metadata?.duration || 30; // Default duration if not set
    const remaining = Math.max(0, duration - daysElapsed);

    const progressPercent = Math.min(100, (daysElapsed / duration) * 100);



    const handleAddItem = async () => {
        if (!newItemText.trim()) return;
        const newItem = { id: crypto.randomUUID(), task: newItemText, completed: false };
        const updatedList = [...(plan.checklist || []), newItem];
        await onUpdatePlan(plan.id, { checklist: updatedList });
        setNewItemText('');
    };

    const handleDeleteItem = async (itemId: string) => {
        const updatedList = plan.checklist?.filter(i => i.id !== itemId) || [];
        await onUpdatePlan(plan.id, { checklist: updatedList });
    };

    // Calculate Average Adherence
    const history: number[] = Object.values(plan.adherenceRecord || {});
    const avgAdherence = history.length > 0 ? Math.round(history.reduce((a, b) => a + b, 0) / history.length) : Math.round(progress);

    return createPortal(
        <div className="fixed inset-0 z-[9999] bg-slate-900/80 backdrop-blur-xl flex items-center justify-center p-8 animate-in fade-in duration-300">
            <div className="bg-white w-full max-w-6xl h-full max-h-[90dvh] rounded-[48px] shadow-2xl relative overflow-hidden flex flex-col">

                {/* Header */}
                <div className="p-10 border-b border-slate-100 flex justify-between items-center bg-white relative z-10">
                    <div className="flex items-center gap-6">
                        <button onClick={onClose} className="p-4 rounded-2xl bg-slate-50 hover:bg-slate-100 transition-colors">
                            <ChevronRight size={24} className="rotate-180 text-slate-400" />
                        </button>
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-100">Active Protocol</span>
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Started {startDate.toLocaleDateString()}</span>
                            </div>
                            <h2 className="text-4xl font-black text-slate-900 tracking-tighter">{plan.treatmentName}</h2>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <div className="text-right mr-4">
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Patient Adherence</p>
                            <p className="text-3xl font-black text-slate-900">{avgAdherence}%</p>
                        </div>
                        <div className="h-16 w-16 rounded-full border-[6px] border-slate-100 relative flex items-center justify-center">
                            <svg className="absolute inset-0 w-full h-full -rotate-90">
                                <circle cx="32" cy="32" r="28" stroke={clinic.primaryColor} strokeWidth="6" fill="transparent" strokeDasharray={175} strokeDashoffset={175 - (175 * avgAdherence) / 100} strokeLinecap="round" />
                            </svg>
                            <Activity size={24} style={{ color: clinic.primaryColor }} />
                        </div>
                    </div>
                </div>

                <div className="flex flex-1 overflow-hidden">
                    {/* Sidebar Nav */}
                    <div className="w-80 bg-slate-50 p-6 flex flex-col gap-2 border-r border-slate-100 overflow-y-auto custom-scrollbar">
                        {[
                            { id: 'OVERVIEW', label: 'Clinical Overview', icon: <Activity size={18} /> },
                            { id: 'JOURNEY', label: 'Patient Journey', icon: <TrendingUp size={18} /> },
                            { id: 'MEDIA', label: 'Education & Media', icon: <PlayCircle size={18} /> },
                        ].map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as any)}
                                className={`p-5 rounded-2xl flex items-center gap-4 text-sm font-bold transition-all text-left ${activeTab === tab.id ? 'bg-white shadow-lg text-slate-900' : 'text-slate-400 hover:bg-white/50 hover:text-slate-600'}`}
                            >
                                {tab.icon} {tab.label}
                            </button>
                        ))}

                        <div className="mt-auto bg-indigo-50 p-6 rounded-3xl border border-indigo-100 shrink-0">
                            <h4 className="font-black text-indigo-900 text-lg mb-2">Doctor Notes</h4>
                            <textarea
                                className="w-full bg-white border border-indigo-100 rounded-xl p-3 text-xs font-medium text-slate-600 outline-none focus:ring-2 ring-indigo-200"
                                rows={4}
                                placeholder="Add clinical observations..."
                            ></textarea>
                        </div>
                    </div>

                    {/* Main Canvas */}
                    <div className="flex-1 p-10 overflow-y-auto bg-white relative">
                        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-slate-50 rounded-full blur-[100px] -z-10 pointer-events-none"></div>

                        {activeTab === 'OVERVIEW' && (
                            <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <div className="grid grid-cols-3 gap-6">
                                    {/* Quick Stats */}
                                    <div className="p-6 rounded-[32px] bg-white border border-slate-100 shadow-xl shadow-slate-100 flex items-center gap-5">
                                        <div className="h-14 w-14 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center"><Clock size={28} /></div>
                                        <div>
                                            <p className="text-[10px] uppercase font-black tracking-widest text-slate-400">Time Elapsed</p>
                                            <h4 className="text-2xl font-black text-slate-900">{daysElapsed} Days</h4>
                                        </div>
                                    </div>
                                    <div className="p-6 rounded-[32px] bg-white border border-slate-100 shadow-xl shadow-slate-100 flex items-center gap-5">
                                        <div className="h-14 w-14 rounded-2xl bg-purple-50 text-purple-500 flex items-center justify-center"><ShieldCheck size={28} /></div>
                                        <div>
                                            <p className="text-[10px] uppercase font-black tracking-widest text-slate-400">Est. Remaining</p>
                                            <h4 className="text-2xl font-black text-slate-900">{remaining} Days</h4>
                                        </div>
                                    </div>
                                    <div className="p-6 rounded-[32px] bg-white border border-slate-100 shadow-xl shadow-slate-100 flex items-center gap-5">
                                        <div className="h-14 w-14 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center"><AlertCircle size={28} /></div>
                                        <div>
                                            <p className="text-[10px] uppercase font-black tracking-widest text-slate-400">Alerts</p>
                                            <h4 className="text-2xl font-black text-slate-900">None</h4>
                                        </div>
                                    </div>
                                </div>

                                {/* Adherence History */}
                                <div>
                                    <h3 className="text-xl font-black text-slate-900 mb-6">Recent Adherence</h3>
                                    <div className="flex gap-2 overflow-x-auto pb-4">
                                        {Object.entries((plan.adherenceRecord || {}) as Record<string, number>).sort((a, b) => b[0].localeCompare(a[0])).slice(0, 7).map(([date, score]) => (
                                            <div key={date} className="flex-1 min-w-[100px] bg-slate-50 p-4 rounded-2xl border border-slate-100 text-center">
                                                <p className="text-[10px] font-bold text-slate-400 mb-1">{new Date(date).toLocaleDateString(undefined, { weekday: 'short' })}</p>
                                                <div className={`text-2xl font-black ${score >= 90 ? 'text-emerald-500' : score >= 50 ? 'text-amber-500' : 'text-rose-500'}`}>{score}%</div>
                                            </div>
                                        ))}
                                        {(!plan.adherenceRecord || Object.keys(plan.adherenceRecord).length === 0) && (
                                            <div className="w-full p-6 text-center text-slate-400 italic bg-slate-50 rounded-2xl">No history recorded yet.</div>
                                        )}
                                    </div>
                                </div>

                                {/* Specific Modules based on Category */}
                                {(plan.treatmentName || '').includes('Invisalign') && (
                                    <div className="bg-slate-900 text-white p-8 rounded-[40px] relative overflow-hidden">
                                        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-[80px]"></div>
                                        <h3 className="text-2xl font-black mb-6 relative z-10">Aligner Tracking</h3>
                                        <div className="flex items-center gap-8 relative z-10">
                                            <div className="text-center">
                                                <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">Current Tray</p>
                                                <div className="text-7xl font-black">{plan.metadata?.currentTray || 1}</div>
                                            </div>
                                            <div className="h-20 w-px bg-white/10"></div>
                                            <div className="flex-1 space-y-4">
                                                <div className="flex justify-between text-sm font-bold">
                                                    <span>Wear Time (Avg)</span>
                                                    <span className="text-emerald-400">22.5 hrs/day</span>
                                                </div>
                                                <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                                                    <div className="h-full bg-emerald-500 w-[94%]"></div>
                                                </div>
                                                <p className="text-xs text-slate-400">Patient is changing trays every {plan.metadata?.changeInterval || 10} days.</p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div className="grid grid-cols-2 gap-8">
                                    <div className="space-y-6">
                                        <div className="flex justify-between items-end">
                                            <h3 className="text-xl font-black text-slate-900">Aftercare Checklist</h3>
                                            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Editable</span>
                                        </div>
                                        <div className="grid grid-cols-1 gap-3">
                                            {plan.checklist?.map((item, i) => (
                                                <div key={item.id} className={`p-4 rounded-2xl border flex items-center justify-between group/item ${item.completed ? 'bg-emerald-50/50 border-emerald-100' : 'bg-white border-slate-100'}`}>
                                                    <div className="flex items-center gap-4">
                                                        <div className={`h-8 w-8 rounded-lg flex items-center justify-center text-xs font-black ${item.completed ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-400'}`}>
                                                            {item.completed ? <CheckCircle size={16} /> : i + 1}
                                                        </div>
                                                        <span className={`font-bold ${item.completed ? 'text-slate-500' : 'text-slate-800'}`}>{item.task}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        {item.completed && <span className="text-[10px] font-black uppercase text-emerald-600 bg-emerald-100 px-3 py-1 rounded-full">Verified</span>}
                                                        <button onClick={() => handleDeleteItem(item.id)} className="p-2 text-slate-300 hover:text-rose-500 opacity-0 group-hover/item:opacity-100 transition-all">
                                                            <X size={14} />
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}

                                            {/* Add Item Input */}
                                            <div className="flex gap-2 mt-2">
                                                <input
                                                    type="text"
                                                    value={newItemText}
                                                    onChange={(e) => setNewItemText(e.target.value)}
                                                    onKeyDown={(e) => e.key === 'Enter' && handleAddItem()}
                                                    placeholder="Add new daily task..."
                                                    className="flex-1 px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold focus:bg-white focus:border-indigo-200 outline-none transition-all"
                                                />
                                                <button onClick={handleAddItem} className="px-4 py-2 bg-slate-900 text-white rounded-xl font-bold text-xs hover:bg-black transition-colors">Add</button>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-6">
                                        <h3 className="text-xl font-black text-slate-900">Protocol Instructions</h3>
                                        <div className="bg-slate-50 p-6 rounded-[32px] border border-slate-100 h-full">
                                            <ul className="space-y-4">
                                                {plan.instructions?.map((inst, i) => (
                                                    <li key={i} className="flex gap-4 items-start">
                                                        <span className="flex-shrink-0 h-6 w-6 rounded-full bg-white border border-slate-200 flex items-center justify-center text-[10px] font-black text-slate-400 shadow-sm">{i + 1}</span>
                                                        <p className="text-sm font-medium text-slate-600 leading-relaxed">{inst}</p>
                                                    </li>
                                                ))}
                                                {(!plan.instructions || plan.instructions.length === 0) && (
                                                    <li className="text-slate-400 italic text-sm">No specific instructions defined for this protocol.</li>
                                                )}
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'JOURNEY' && (
                            <div className="py-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <div className="text-center mb-12">
                                    <h3 className="text-3xl font-black text-slate-900">Treatment Timeline</h3>
                                    <p className="text-slate-400 font-bold mt-2">Tracking {daysElapsed} days of {duration} day protocol</p>
                                </div>

                                <div className="max-w-3xl mx-auto relative px-8">
                                    {/* Timeline Line */}
                                    <div className="absolute left-8 top-0 bottom-0 w-1 bg-slate-100 ml-[27px]"></div>

                                    <div className="space-y-12 relative z-10">
                                        {/* Start Node */}
                                        <div className="flex gap-8">
                                            <div className="h-14 w-14 rounded-full bg-emerald-500 border-4 border-white shadow-xl flex items-center justify-center text-white shrink-0">
                                                <Flag size={24} fill="currentColor" />
                                            </div>
                                            <div className="pt-2">
                                                <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-lg text-[10px] font-black uppercase tracking-widest mb-2 inline-block">Day 0</span>
                                                <h4 className="text-xl font-black text-slate-800">Treatment Started</h4>
                                                <p className="text-slate-500 text-sm mt-1">{startDate.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                                            </div>
                                        </div>

                                        {/* Current Node */}
                                        <div className="flex gap-8">
                                            <div className="h-14 w-14 rounded-full bg-indigo-500 border-4 border-white shadow-xl flex items-center justify-center text-white shrink-0 animate-pulse">
                                                <Clock size={24} />
                                            </div>
                                            <div className="pt-2">
                                                <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-lg text-[10px] font-black uppercase tracking-widest mb-2 inline-block">Day {daysElapsed}</span>
                                                <h4 className="text-xl font-black text-slate-800">Current Progress</h4>
                                                <p className="text-slate-500 text-sm mt-1">Patient is {Math.round(progressPercent)}% through the initial phase.</p>

                                                <div className="mt-4 h-4 bg-slate-100 rounded-full overflow-hidden w-64">
                                                    <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${progressPercent}%` }}></div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Future Node */}
                                        <div className="flex gap-8 opacity-50">
                                            <div className="h-14 w-14 rounded-full bg-white border-4 border-slate-200 shadow-sm flex items-center justify-center text-slate-300 shrink-0">
                                                <CheckCircle size={24} />
                                            </div>
                                            <div className="pt-2">
                                                <span className="px-3 py-1 bg-slate-100 text-slate-400 rounded-lg text-[10px] font-black uppercase tracking-widest mb-2 inline-block">Day {duration}</span>
                                                <h4 className="text-xl font-black text-slate-800">Projected Completion</h4>
                                                <p className="text-slate-500 text-sm mt-1">Review scheduled for completion.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'MEDIA' && (
                            <div className="py-20 text-center text-slate-400">
                                <PlayCircle size={64} className="mx-auto mb-6 opacity-20" />
                                <h3 className="text-xl font-bold">Media Library Empty</h3>
                                <p className="text-sm mt-2">Upload treatment videos or scans here.</p>
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </div>,
        document.body
    );
};


export default DoctorTreatmentDetail;
