import React, { useState } from 'react';
import { Activity, ClipboardCheck, Edit3, Save, X, Sparkles, TrendingUp } from 'lucide-react';
import { CarePlan, User, Clinic } from '../../../types';

interface Props {
    carePlans: CarePlan[];
    users: User[];
    clinic: Clinic;
    onUpdateCarePlan: (carePlanId: string, updates: Partial<CarePlan>) => Promise<any>;
}

const LiveProtocolMonitor: React.FC<Props> = ({ carePlans, users, clinic, onUpdateCarePlan }) => {
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editValues, setEditValues] = useState<Partial<CarePlan>>({});

    const activePlans = carePlans.filter(cp => cp.isActive && cp.clinicId === clinic.id);

    const handleEdit = (plan: CarePlan) => {
        setEditValues(plan);
        setEditingId(plan.id);
    };

    const handleSave = async (id: string) => {
        await onUpdateCarePlan(id, editValues);
        setEditingId(null);
    };

    return (
        <div className="bg-white/60 backdrop-blur-xl rounded-[32px] p-8 border border-white/60 shadow-xl relative overflow-hidden h-full">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h3 className="text-xl font-black text-slate-800 flex items-center gap-3">
                        <Activity size={24} className="text-emerald-500" />
                        Live Protocol Monitor
                    </h3>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mt-1">Active Treatment Streams</p>
                </div>
                <div className="px-4 py-2 bg-emerald-50 rounded-xl border border-emerald-100 flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></div>
                    <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">{activePlans.length} Active</span>
                </div>
            </div>

            <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                {activePlans.length === 0 ? (
                    <div className="py-12 text-center border-2 border-dashed border-slate-100 rounded-3xl">
                        <ClipboardCheck size={40} className="mx-auto text-slate-200 mb-4" />
                        <p className="text-sm font-bold text-slate-300 italic">No active protocols detected.</p>
                    </div>
                ) : (
                    activePlans.map(plan => {
                        const user = users.find(u => u.id === plan.userId);
                        const isEditing = editingId === plan.id;
                        const progress = plan.checklist ? Math.round((plan.checklist.filter(i => i.completed).length / plan.checklist.length) * 100) : 0;

                        return (
                            <div key={plan.id} className="p-6 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl transition-all group relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity rotate-12 -translate-y-2 translate-x-2">
                                    <TrendingUp size={64} />
                                </div>

                                {isEditing ? (
                                    <div className="space-y-4 relative z-10 animate-in slide-in-from-top-2 duration-300">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className="text-[9px] font-black uppercase text-slate-400 ml-2">Protocol Name</label>
                                                <input
                                                    value={editValues.treatmentName || ''}
                                                    onChange={e => setEditValues(v => ({ ...v, treatmentName: e.target.value }))}
                                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-800 focus:border-indigo-500 outline-none"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[9px] font-black uppercase text-slate-400 ml-2">Investment (₹)</label>
                                                <input
                                                    type="number"
                                                    value={editValues.cost || 0}
                                                    onChange={e => setEditValues(v => ({ ...v, cost: Number(e.target.value) }))}
                                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-800 focus:border-indigo-500 outline-none"
                                                />
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <button onClick={() => handleSave(plan.id)} className="flex-1 py-3 bg-slate-900 text-white rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-black transition-all">
                                                <Save size={14} /> Update
                                            </button>
                                            <button onClick={() => setEditingId(null)} className="px-4 py-3 bg-slate-100 text-slate-400 rounded-xl font-black hover:text-slate-600 transition-all">
                                                <X size={14} />
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="relative z-10 flex items-start justify-between gap-4">
                                        <div className="flex-1 space-y-4">
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="text-[10px] font-black uppercase text-indigo-500 tracking-[0.2em]">{user?.name || 'Unknown Patient'}</span>
                                                    <div className="h-1 w-1 rounded-full bg-slate-300"></div>
                                                    <span className="text-[9px] font-bold text-slate-400 italic">Live Sync</span>
                                                </div>
                                                <h4 className="text-xl font-black text-slate-900 tracking-tighter leading-tight group-hover:text-indigo-600 transition-colors">{plan.treatmentName}</h4>
                                            </div>

                                            <div className="flex items-end justify-between">
                                                <div className="space-y-2">
                                                    <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest">Protocol Adherence</p>
                                                    <div className="flex items-baseline gap-1">
                                                        <p className="text-3xl font-black text-slate-800">{progress}</p>
                                                        <span className="text-sm font-bold text-slate-400">%</span>
                                                    </div>
                                                </div>
                                                <div className="flex-1 max-w-[100px] h-2 bg-slate-100 rounded-full overflow-hidden ml-4 mb-2">
                                                    <div className="h-full bg-emerald-500 transition-all duration-1000" style={{ width: `${progress}%` }}></div>
                                                </div>
                                            </div>
                                        </div>
                                        <button onClick={() => handleEdit(plan)} className="p-3 bg-slate-50 text-slate-400 rounded-xl hover:bg-indigo-50 hover:text-indigo-600 transition-all group/edit">
                                            <Edit3 size={18} className="translate-y-0.5 group-hover/edit:scale-110 transition-transform" />
                                        </button>
                                    </div>
                                )}
                            </div>
                        );
                    })
                )}
            </div>

            <button className="w-full mt-6 py-4 border-2 border-dashed border-slate-200 rounded-2xl text-[10px] font-black text-slate-400 uppercase tracking-widest hover:border-indigo-200 hover:text-indigo-500 hover:bg-indigo-50/50 transition-all">
                Access Clinical Archive
            </button>
        </div>
    );
};

export default LiveProtocolMonitor;
