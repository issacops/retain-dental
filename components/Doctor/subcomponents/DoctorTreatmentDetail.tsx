import React, { useState } from 'react';
import { CarePlan, Clinic, User } from '../../../types';
import { Activity, Calendar, CheckCircle, Clock, FileText, ChevronRight, PlayCircle, AlertCircle, TrendingUp, ShieldCheck } from 'lucide-react';

interface Props {
    plan: CarePlan;
    patient: User;
    clinic: Clinic;
    onClose: () => void;
    onUpdatePlan: (planId: string, updates: Partial<CarePlan>) => Promise<any>;
}

const DoctorTreatmentDetail: React.FC<Props> = ({ plan, patient, clinic, onClose, onUpdatePlan }) => {
    const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'JOURNEY' | 'MEDIA'>('OVERVIEW');

    const progress = (plan.checklist?.filter(i => i.completed).length || 0) / (plan.checklist?.length || 1) * 100;

    return (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xl flex items-center justify-center p-8 animate-in fade-in duration-300">
            <div className="bg-white w-full max-w-6xl h-full max-h-[90vh] rounded-[48px] shadow-2xl relative overflow-hidden flex flex-col">

                {/* Header */}
                <div className="p-10 border-b border-slate-100 flex justify-between items-center bg-white relative z-10">
                    <div className="flex items-center gap-6">
                        <button onClick={onClose} className="p-4 rounded-2xl bg-slate-50 hover:bg-slate-100 transition-colors">
                            <ChevronRight size={24} className="rotate-180 text-slate-400" />
                        </button>
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-100">Active Protocol</span>
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Started {new Date(plan.assignedAt).toLocaleDateString()}</span>
                            </div>
                            <h2 className="text-4xl font-black text-slate-900 tracking-tighter">{plan.treatmentName}</h2>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <div className="text-right mr-4">
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Patient Adherence</p>
                            <p className="text-3xl font-black text-slate-900">{Math.round(progress)}%</p>
                        </div>
                        <div className="h-16 w-16 rounded-full border-[6px] border-slate-100 relative flex items-center justify-center">
                            <svg className="absolute inset-0 w-full h-full -rotate-90">
                                <circle cx="32" cy="32" r="28" stroke={clinic.primaryColor} strokeWidth="6" fill="transparent" strokeDasharray={175} strokeDashoffset={175 - (175 * progress) / 100} strokeLinecap="round" />
                            </svg>
                            <Activity size={24} style={{ color: clinic.primaryColor }} />
                        </div>
                    </div>
                </div>

                <div className="flex flex-1 overflow-hidden">
                    {/* Sidebar Nav */}
                    <div className="w-80 bg-slate-50 p-6 flex flex-col gap-2 border-r border-slate-100">
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

                        <div className="mt-auto bg-indigo-50 p-6 rounded-3xl border border-indigo-100">
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
                                            <h4 className="text-2xl font-black text-slate-900">12 Days</h4>
                                        </div>
                                    </div>
                                    <div className="p-6 rounded-[32px] bg-white border border-slate-100 shadow-xl shadow-slate-100 flex items-center gap-5">
                                        <div className="h-14 w-14 rounded-2xl bg-purple-50 text-purple-500 flex items-center justify-center"><ShieldCheck size={28} /></div>
                                        <div>
                                            <p className="text-[10px] uppercase font-black tracking-widest text-slate-400">Current Phase</p>
                                            <h4 className="text-2xl font-black text-slate-900">{plan.metadata?.phase || 'Active Therapy'}</h4>
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

                                {/* Specific Modules based on Category */}
                                {plan.treatmentName.includes('Invisalign') && (
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

                                <div className="space-y-6">
                                    <h3 className="text-xl font-black text-slate-900">Monitoring Checklist</h3>
                                    <div className="grid grid-cols-1 gap-3">
                                        {plan.checklist?.map((item, i) => (
                                            <div key={item.id} className={`p-4 rounded-2xl border flex items-center justify-between ${item.completed ? 'bg-emerald-50/50 border-emerald-100' : 'bg-white border-slate-100'}`}>
                                                <div className="flex items-center gap-4">
                                                    <div className={`h-8 w-8 rounded-lg flex items-center justify-center text-xs font-black ${item.completed ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-400'}`}>
                                                        {item.completed ? <CheckCircle size={16} /> : i + 1}
                                                    </div>
                                                    <span className={`font-bold ${item.completed ? 'text-slate-500' : 'text-slate-800'}`}>{item.task}</span>
                                                </div>
                                                {item.completed && <span className="text-[10px] font-black uppercase text-emerald-600 bg-emerald-100 px-3 py-1 rounded-full">Verified</span>}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'JOURNEY' && (
                            <div className="py-10 text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <div className="inline-flex p-8 bg-indigo-50 rounded-full mb-6 text-indigo-500"><TrendingUp size={48} /></div>
                                <h3 className="text-2xl font-black text-slate-800">Journey Map</h3>
                                <p className="text-slate-400 font-bold mt-2">Visual timeline of patient progress would appear here.</p>
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default DoctorTreatmentDetail;
