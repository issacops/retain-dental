import React, { useMemo, useState, useEffect } from 'react';
import { Share2, Microscope, BarChart, GraduationCap, ClipboardCheck, Bell, Activity, Check, HeartPulse, History, Filter, CreditCard, Layers, IndianRupee, Sparkles, X, Save } from 'lucide-react';
import { ResponsiveContainer, BarChart as ReBarChart, Bar, Cell, CartesianGrid, XAxis, Tooltip, LineChart, Line } from 'recharts';
import { User, Wallet, Transaction, CarePlan, Clinic, FamilyGroup, TransactionCategory, TransactionType } from '../../../types';
import { TREATMENT_TEMPLATES, TreatmentTemplate } from '../../../constants';
import FamilyEquityVisualizer from './FamilyEquityVisualizer';

interface Props {
    selectedPatient: User;
    clinic: Clinic;
    wallets: Wallet[];
    carePlans: CarePlan[];
    transactions: Transaction[];
    allUsers: User[];
    familyGroups: FamilyGroup[];
    onProcessTransaction: (patientId: string, amount: number, category: TransactionCategory, type: TransactionType, carePlanTemplate?: any) => any;
    onAssignPlan: (clinicId: string, patientId: string, template: any) => Promise<any>;
    onTerminateCarePlan: (carePlanId: string) => Promise<any>;
    onToggleChecklistItem: (carePlanId: string, itemId: string) => Promise<any>;
    onUpdateCarePlan: (carePlanId: string, updates: Partial<CarePlan>) => Promise<any>;
}

const PatientProfile: React.FC<Props> = ({
    selectedPatient, clinic, wallets, carePlans, transactions, allUsers, familyGroups, onProcessTransaction, onAssignPlan, onTerminateCarePlan, onToggleChecklistItem, onUpdateCarePlan
}) => {
    const [txAmount, setTxAmount] = useState('');
    const [txCategory, setTxCategory] = useState<TransactionCategory>(TransactionCategory.GENERAL);
    const [selectedTemplateName, setSelectedTemplateName] = useState<string>('');
    const [customValues, setCustomValues] = useState<Record<string, any>>({});
    const [isEditingPlan, setIsEditingPlan] = useState(false);
    const [editValues, setEditValues] = useState<Partial<CarePlan>>({});

    // Auto-set category and defaults based on selected protocol
    useEffect(() => {
        if (selectedTemplateName) {
            const template = TREATMENT_TEMPLATES.find(t => t.name === selectedTemplateName);
            if (template) {
                setTxCategory(template.category);
                const defaults: Record<string, any> = {};
                template.customFields?.forEach(f => defaults[f.key] = f.defaultValue);
                setCustomValues(defaults);
            }
        } else {
            setCustomValues({});
        }
    }, [selectedTemplateName]);

    // Computed data
    const activeCarePlan = useMemo(() => {
        return carePlans.find(cp => cp.userId === selectedPatient?.id && cp.isActive && cp.clinicId === clinic.id);
    }, [carePlans, selectedPatient, clinic.id]);

    const patientTransactions = useMemo(() => {
        const wallet = wallets.find(w => w.userId === selectedPatient.id);
        return transactions
            .filter(t => t.walletId === wallet?.id && t.clinicId === clinic.id)
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }, [selectedPatient, transactions, wallets, clinic.id]);

    const spendHistoryData = useMemo(() => {
        return patientTransactions
            .filter(t => t.type === TransactionType.EARN)
            .slice(0, 5)
            .reverse()
            .map(t => ({
                date: new Date(t.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }),
                amount: t.amountPaid
            }));
    }, [patientTransactions]);


    return (
        <div className="w-full max-w-[1600px] mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20 px-8">

            {/* 1. UNIFIED HEADER: IDENTITY & FINANCE */}
            <div className="bg-white p-10 rounded-[48px] shadow-sm border border-slate-100 relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-full h-2" style={{ backgroundColor: clinic.primaryColor }}></div>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 relative z-10">
                    {/* LEFT: IDENTITY & HEADER CONTENT */}
                    <div className="flex-1 space-y-6">
                        <div className="flex items-center gap-4">
                            <div className={`h-3 w-3 rounded-full ${selectedPatient.currentTier === 'GOLD' ? 'bg-amber-400' : 'bg-emerald-400'} animate-pulse`}></div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 bg-slate-50 px-4 py-2 rounded-full border border-slate-100">Status: Active</span>
                        </div>
                        <div>
                            <h1 className="text-6xl font-black tracking-tighter text-slate-900 leading-none mb-3">{selectedPatient.name}</h1>
                            <p className="text-lg font-bold text-slate-400 tracking-tight font-mono">{selectedPatient.mobile}</p>
                        </div>
                        <div className="flex gap-4 pt-2">
                            <button className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-slate-200 hover:scale-105 active:scale-95">Health Key</button>
                            <button className="px-8 py-4 bg-white border border-slate-200 text-slate-500 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-50 hover:text-slate-800 transition-all">Vault</button>
                        </div>
                    </div>
                    {/* RIGHT: SMILE CREDITS */}
                    <div className="p-8 bg-slate-50 rounded-[32px] border border-slate-100 min-w-[300px] text-center">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Smile Credits Available</p>
                        <h2 className="text-7xl font-black tracking-tighter" style={{ color: clinic.primaryColor }}>
                            {wallets.find(w => w.userId === selectedPatient.id)?.balance || 0}
                        </h2>
                    </div>
                </div>
            </div>

            {/* 2. LIVE CLINICAL PROTOCOL (FULL WIDTH) */}
            <div className="relative p-12 rounded-[48px] overflow-hidden bg-white shadow-xl shadow-slate-200/50 border border-slate-100/60 group hover:shadow-2xl transition-all duration-500">
                <div className="absolute inset-0 opacity-[0.4] bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:24px_24px]"></div>

                <div className="flex justify-between items-center relative z-10 mb-10">
                    <h3 className="font-black text-3xl tracking-tighter flex items-center gap-5 text-slate-900">
                        <div className="p-3 bg-emerald-50 rounded-2xl text-emerald-600 shadow-sm border border-emerald-100"><ClipboardCheck size={28} /></div>
                        Active Clinical Protocol
                    </h3>
                    {activeCarePlan && <div className="bg-emerald-500 text-white px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-emerald-200 flex items-center gap-3"><div className="h-2 w-2 rounded-full bg-white animate-pulse" /> Live Treatment</div>}
                </div>

                {activeCarePlan ? (
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-12 relative z-10">
                        <div className="p-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-[40px] relative overflow-hidden shadow-2xl shadow-emerald-500/20 text-white group/card">
                            <div className="absolute right-0 top-0 p-12 opacity-10 scale-150 group-hover/card:scale-125 transition-transform duration-700 ease-out"><Activity size={120} /></div>

                            <p className="text-[10px] font-black uppercase text-emerald-100 tracking-[0.25em] mb-4">Patient Regime</p>
                            <div className="flex justify-between items-start mb-12">
                                <h4 className="text-5xl font-black tracking-tighter">{activeCarePlan.treatmentName}</h4>
                                <button
                                    onClick={() => { setEditValues(activeCarePlan); setIsEditingPlan(true); }}
                                    className="px-6 py-3 bg-white/20 hover:bg-white/30 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all"
                                >
                                    Edit Protocol
                                </button>
                            </div>

                            {isEditingPlan ? (
                                <div className="space-y-6 animate-in slide-in-from-top-4 duration-300">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-[9px] font-black uppercase text-emerald-100">Treatment Name</label>
                                            <input
                                                value={editValues.treatmentName || ''}
                                                onChange={e => setEditValues(prev => ({ ...prev, treatmentName: e.target.value }))}
                                                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-sm font-bold text-white outline-none focus:bg-white/20"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[9px] font-black uppercase text-emerald-100">Investment (₹)</label>
                                            <input
                                                type="number"
                                                value={editValues.cost || 0}
                                                onChange={e => setEditValues(prev => ({ ...prev, cost: Number(e.target.value) }))}
                                                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-sm font-bold text-white outline-none focus:bg-white/20"
                                            />
                                        </div>
                                        <div className="space-y-4">
                                            <div className="flex justify-between items-end">
                                                <label className="text-[9px] font-black uppercase text-emerald-100">Aftercare Guidelines</label>
                                                <button
                                                    onClick={() => setEditValues(prev => ({ ...prev, instructions: [...(prev.instructions || []), ""] }))}
                                                    className="text-[8px] font-black uppercase bg-white/10 px-3 py-1 rounded-lg hover:bg-white/20"
                                                >
                                                    + Add Rule
                                                </button>
                                            </div>
                                            <div className="space-y-2 max-h-40 overflow-y-auto custom-scrollbar pr-2">
                                                {(editValues.instructions || []).map((inst: string, idx: number) => (
                                                    <div key={idx} className="flex gap-2">
                                                        <input
                                                            value={inst}
                                                            onChange={e => {
                                                                const newInst = [...(editValues.instructions || [])];
                                                                newInst[idx] = e.target.value;
                                                                setEditValues(prev => ({ ...prev, instructions: newInst }));
                                                            }}
                                                            className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs font-medium text-white outline-none focus:bg-white/15"
                                                            placeholder={`Instruction ${idx + 1}`}
                                                        />
                                                        <button
                                                            onClick={() => {
                                                                const newInst = [...(editValues.instructions || [])];
                                                                newInst.splice(idx, 1);
                                                                setEditValues(prev => ({ ...prev, instructions: newInst }));
                                                            }}
                                                            className="p-2 text-rose-300 hover:text-rose-100"
                                                        >
                                                            <X size={14} />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex gap-3 pt-6">
                                        <button
                                            onClick={async () => {
                                                await onUpdateCarePlan(activeCarePlan.id, editValues);
                                                setIsEditingPlan(false);
                                            }}
                                            className="flex-1 py-4 bg-white text-emerald-600 rounded-[20px] text-[10px] font-black uppercase tracking-widest shadow-xl shadow-emerald-900/20 active:scale-95 transition-all flex items-center justify-center gap-2"
                                        >
                                            <Save size={14} /> Update Protocol
                                        </button>
                                        <button
                                            onClick={() => setIsEditingPlan(false)}
                                            className="px-8 py-4 bg-emerald-700/50 hover:bg-emerald-700 rounded-[20px] text-[10px] font-black uppercase tracking-widest text-white/70 hover:text-white transition-all"
                                        >
                                            Cancel
                                        </button>
                                    </div>

                                    <div className="pt-6 mt-6 border-t border-white/10">
                                        <button
                                            onClick={async () => {
                                                if (confirm("Are you sure you want to terminate this active clinical protocol? This will remove it from the patient's dashboard.")) {
                                                    await onTerminateCarePlan(activeCarePlan.id);
                                                    setIsEditingPlan(false);
                                                }
                                            }}
                                            className="w-full py-4 bg-rose-500/20 hover:bg-rose-500 text-rose-100 rounded-[20px] text-[10px] font-black uppercase tracking-widest border border-rose-500/30 transition-all flex items-center justify-center gap-2"
                                        >
                                            Terminate Treatment
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex items-end justify-between">
                                    <div className="space-y-2">
                                        <p className="text-[9px] font-black uppercase text-emerald-200/80 tracking-widest">Protocol Adherence</p>
                                        <div className="flex items-baseline gap-1">
                                            <p className="text-6xl font-black">98</p>
                                            <span className="text-xl font-bold opacity-60">%</span>
                                        </div>
                                    </div>
                                    <div className="flex-1 max-w-[140px] h-4 bg-black/20 rounded-full overflow-hidden backdrop-blur-sm border border-white/10">
                                        <div className="h-full bg-white w-[98%] shadow-[0_0_20px_rgba(255,255,255,0.5)]"></div>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="space-y-4">
                            {activeCarePlan.checklist?.map((item, i) => (
                                <div key={item.id} onClick={() => onToggleChecklistItem && onToggleChecklistItem(activeCarePlan.id, item.id)} className="flex items-center gap-6 p-6 rounded-[28px] bg-white border border-slate-100 shadow-sm hover:shadow-xl hover:scale-[1.01] hover:border-emerald-100 transition-all duration-300 group/item cursor-pointer">
                                    <div className={`h-10 w-10 rounded-2xl flex items-center justify-center transition-all duration-300 ${item.completed ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30 rotate-0' : 'bg-slate-50 text-slate-300 rotate-12 group-hover/item:rotate-0'}`}>
                                        {item.completed ? <Check size={20} strokeWidth={4} /> : <span className="text-xs font-black">{i + 1}</span>}
                                    </div>
                                    <span className={`text-sm font-bold tracking-tight transition-colors ${item.completed ? 'text-slate-400 line-through decoration-emerald-500/50' : 'text-slate-700 group-hover/item:text-slate-900'}`}>{item.task}</span>
                                    <div className="ml-auto opacity-0 group-hover/item:opacity-100 transition-all text-emerald-500 font-bold text-[10px] uppercase tracking-widest flex items-center gap-2">
                                        <Sparkles size={16} /> Mark {item.completed ? 'Pending' : 'Done'}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="py-24 text-center border-2 border-dashed border-slate-200 rounded-[40px] group/empty hover:border-slate-300 transition-colors">
                        <div className="inline-flex p-6 bg-slate-50 rounded-full mb-6 group-hover/empty:scale-110 transition-transform duration-300"><HeartPulse size={48} className="text-slate-200 group-hover/empty:text-slate-300 transition-colors" /></div>
                        <p className="font-bold text-xl text-slate-300 italic tracking-tight">No active protocols initialized.</p>
                    </div>
                )}
            </div>

            {/* 3. NEXUS TERMINAL (FULL WIDTH) */}
            <div className="relative p-12 rounded-[48px] overflow-hidden group shadow-2xl shadow-slate-200/40 border border-white/60 transition-all duration-500 hover:shadow-3xl hover:shadow-indigo-500/10 bg-white/60 backdrop-blur-2xl">
                {/* ... (Terminal visuals) ... */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/80 via-white/40 to-indigo-50/20 opacity-80"></div>
                <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-slate-200 to-transparent"></div>
                <div className="absolute top-0 right-0 p-20 opacity-[0.03] rotate-12 pointer-events-none blur-sm"><IndianRupee size={200} /></div>

                <div className="flex justify-between items-center relative z-10 mb-12">
                    <h3 className="font-black text-3xl tracking-tighter flex items-center gap-5 text-slate-900">
                        <div className="p-3 bg-white rounded-2xl shadow-lg shadow-indigo-100 text-indigo-600"><CreditCard size={28} /></div>
                        Nexus Terminal
                    </h3>
                    {/* Status Dot */}
                    <div className="flex gap-2 bg-white/50 p-2 rounded-full backdrop-blur-sm border border-white/40">
                        <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
                    </div>
                </div>

                <div className="flex flex-col gap-12 relative z-10">
                    {/* INPUTS AND CONTROLS */}
                    {/* ... (Amount Input remains same) ... */}
                    <div className="relative group w-full">
                        <span className="absolute left-0 top-1/2 -translate-y-1/2 text-slate-300/50 text-5xl xl:text-6xl font-black px-6 transition-colors group-focus-within:text-slate-400">₹</span>
                        <input type="number" placeholder="0.00" value={txAmount} onChange={(e) => setTxAmount(e.target.value)}
                            className="w-full text-7xl xl:text-8xl font-black outline-none border-b-[6px] border-slate-100 bg-transparent pb-6 pl-20 xl:pl-32 focus:border-slate-800 transition-all duration-300 placeholder:text-slate-100/50 text-slate-900 tracking-tighter" />
                    </div>

                    <div className="space-y-8 w-full">
                        {/* ROW 1... */}
                        <div className="flex flex-col xl:flex-row gap-8 items-end w-full">
                            {/* CLASSIFICATION */}
                            <div className="space-y-4 flex-1 w-full relative z-20">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-2 flex items-center gap-2"><Layers size={12} /> Classification</label>
                                <div className="relative group/select">
                                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 rounded-[28px] opacity-0 group-hover/select:opacity-100 transition-opacity"></div>
                                    <select className="w-full p-8 bg-white/50 border border-slate-200/60 rounded-[28px] outline-none font-black text-lg appearance-none cursor-pointer hover:bg-white hover:shadow-xl hover:shadow-slate-200/50 hover:-translate-y-0.5 transition-all duration-300 text-slate-700 uppercase tracking-widest backdrop-blur-sm"
                                        onChange={(e) => setTxCategory(e.target.value as TransactionCategory)}
                                        value={txCategory}>
                                        {Object.values(TransactionCategory).map(c => (
                                            <option key={c} value={c}>{c}</option>
                                        ))}
                                    </select>
                                    <div className="absolute right-8 top-1/2 -translate-y-1/2 pointer-events-none text-slate-300">▼</div>
                                </div>
                            </div>

                            {/* ACTIONS */}
                            <div className="flex gap-4 flex-1 w-full">
                                <button onClick={() => { if (!txAmount) return; onProcessTransaction(selectedPatient.id, parseFloat(txAmount), txCategory, TransactionType.EARN, selectedTemplateName ? { ...TREATMENT_TEMPLATES.find(t => t.name === selectedTemplateName), customValues } : undefined); setTxAmount(''); }}
                                    className="flex-1 py-8 rounded-[28px] text-white font-black text-xs uppercase tracking-[0.2em] shadow-2xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] hover:shadow-3xl relative overflow-hidden group/btn" style={{ backgroundColor: clinic.primaryColor }}>
                                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300 ease-out"></div>
                                    <span className="relative z-10">Commit Earn</span>
                                </button>
                                <button onClick={() => { if (!txAmount) return; onProcessTransaction(selectedPatient.id, parseFloat(txAmount), txCategory, TransactionType.REDEEM); setTxAmount(''); }}
                                    className="flex-1 py-8 rounded-[28px] bg-slate-900 text-white font-black text-xs uppercase tracking-[0.2em] shadow-2xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] hover:bg-black hover:shadow-3xl">Redeem</button>
                            </div>
                        </div>

                        {/* ROW 2: PROTOCOL SELECTOR */}
                        <div className="space-y-4 w-full relative z-10">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-2 flex items-center gap-2"><Microscope size={12} /> Clinical Protocol</label>
                            {/* ... Select ... */}
                            <div className="relative group/select">
                                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 rounded-[28px] opacity-0 group-hover/select:opacity-100 transition-opacity"></div>
                                <select className="w-full p-8 bg-white/50 border border-slate-200/60 rounded-[28px] outline-none font-black text-lg appearance-none cursor-pointer hover:bg-white hover:shadow-xl hover:shadow-slate-200/50 hover:-translate-y-0.5 transition-all duration-300 text-slate-700 uppercase tracking-widest backdrop-blur-sm truncate"
                                    onChange={(e) => setSelectedTemplateName(e.target.value)}
                                    value={selectedTemplateName}>
                                    <option value="">Custom / No Protocol</option>
                                    {TREATMENT_TEMPLATES.map(t => (
                                        <option key={t.name} value={t.name}>{t.name}</option>
                                    ))}
                                </select>
                                <div className="absolute right-8 top-1/2 -translate-y-1/2 pointer-events-none text-slate-300">▼</div>
                            </div>
                        </div>

                        {/* ROW 3: REAL-TIME PROTOCOL STATUS & CONFIGURATION */}
                        {selectedTemplateName && (
                            <div className="bg-white/40 backdrop-blur-xl border border-white/60 p-8 rounded-[36px] shadow-xl animate-in fade-in slide-in-from-top-4 space-y-8">
                                <div className="flex items-center justify-between gap-4 mb-2">
                                    <div className="flex items-center gap-4 text-emerald-600">
                                        <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></div>
                                        <h4 className="font-black text-xs uppercase tracking-widest">Live Protocol Configuration</h4>
                                    </div>
                                    <button onClick={() => {
                                        const template = TREATMENT_TEMPLATES.find(t => t.name === selectedTemplateName);
                                        if (template) {
                                            onAssignPlan(clinic.id, selectedPatient.id, { ...template, customValues });
                                            setSelectedTemplateName(''); // Reset after assign
                                            setCustomValues({});
                                        }
                                    }} className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl shadow-lg shadow-indigo-200 font-bold text-[10px] uppercase tracking-widest hover:bg-indigo-700 transition-all hover:scale-105 active:scale-95 flex items-center gap-2">
                                        <Sparkles size={14} /> Start Treatment
                                    </button>
                                </div>

                                {/* Custom Fields Input Grid */}
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                                    {TREATMENT_TEMPLATES.find(t => t.name === selectedTemplateName)?.customFields?.map(field => (
                                        <div key={field.key} className="space-y-2 group/input">
                                            <label className="text-[9px] font-black text-slate-400 uppercase tracking-wider block ml-2 group-focus-within/input:text-indigo-500 transition-colors">{field.label}</label>
                                            <div className="relative">
                                                <input
                                                    type={field.type}
                                                    value={customValues[field.key] || ''}
                                                    onChange={(e) => setCustomValues(prev => ({ ...prev, [field.key]: e.target.value }))}
                                                    className="w-full px-5 py-4 bg-white/50 rounded-2xl border border-slate-200 text-slate-800 font-bold text-sm outline-none focus:border-indigo-500 focus:bg-white focus:shadow-lg transition-all"
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Real-time Preview Window */}
                                <div className="bg-slate-900 rounded-[24px] p-6 text-slate-300 shadow-2xl relative overflow-hidden group/console">
                                    <div className="absolute top-0 right-0 p-4 opacity-20"><Activity size={32} /></div>
                                    <div className="font-mono text-[10px] space-y-2 relative z-10">
                                        <p className="text-emerald-400 font-bold mb-4 flex items-center gap-2"><Sparkles size={10} /> AFTERCARE_PROTOCOL_V1.0 initialized...</p>
                                        {TREATMENT_TEMPLATES.find(t => t.name === selectedTemplateName)?.instructions.map((inst, i) => (
                                            <div key={i} className="flex gap-3 opacity-80 group-hover/console:opacity-100 transition-opacity">
                                                <span className="text-slate-600 select-none">0{i + 1}</span>
                                                <p>{inst}</p>
                                            </div>
                                        ))}
                                        {Object.entries(customValues).length > 0 && (
                                            <div className="pt-4 border-t border-slate-800 mt-4">
                                                <p className="text-purple-400 font-bold mb-2">CUSTOM_PARAMETERS:</p>
                                                {Object.entries(customValues).map(([k, v]) => (
                                                    <p key={k} className="text-indigo-300"><span className="text-slate-500">{k}:</span> {v}</p>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* 4. CLINICAL JOURNAL (FULL WIDTH) */}
            <div className="glass-panel p-12 rounded-[48px] shadow-sm border border-white/50 space-y-8">
                <div className="flex justify-between items-center">
                    <h3 className="font-black text-xl tracking-tighter flex items-center gap-3 text-slate-800"><History size={24} className="text-indigo-500" /> Clinical Journal</h3>
                    <button className="p-3 bg-slate-50 rounded-xl text-slate-400 hover:text-slate-600 transition-colors"><Filter size={16} /></button>
                </div>

                <div className="overflow-y-auto max-h-[400px] custom-scrollbar pr-2">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-slate-100">
                                <th className="py-4 text-[9px] font-black uppercase text-slate-400 tracking-widest">Detail</th>
                                <th className="py-4 text-[9px] font-black uppercase text-slate-400 tracking-widest text-right">Value</th>
                                <th className="py-4 text-[9px] font-black uppercase text-slate-400 tracking-widest text-right">Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {patientTransactions.map(tx => (
                                <tr key={tx.id} className="group hover:bg-slate-50/50 transition-colors">
                                    <td className="py-4">
                                        <div className="flex items-center gap-3">
                                            <div className={`h-2 w-2 rounded-full ${tx.pointsEarned > 0 ? 'bg-emerald-400' : 'bg-rose-400'}`}></div>
                                            <div>
                                                <p className="text-sm font-bold text-slate-700">{tx.description}</p>
                                                <p className="text-[9px] font-bold uppercase text-slate-400">{tx.category}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-4 text-right">
                                        <p className="text-sm font-black text-slate-900">₹{tx.amountPaid.toLocaleString()}</p>
                                        {tx.pointsEarned !== 0 && <p className={`text-[9px] font-bold ${tx.pointsEarned > 0 ? 'text-emerald-500' : 'text-rose-500'}`}>{tx.pointsEarned > 0 ? '+' : ''}{tx.pointsEarned} CR</p>}
                                    </td>
                                    <td className="py-4 text-right text-xs font-bold text-slate-400">
                                        {new Date(tx.date).toLocaleDateString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {patientTransactions.length === 0 && <p className="text-center py-10 text-slate-300 font-bold italic">No history logged.</p>}
                </div>
            </div>
        </div>
    );
};

export default PatientProfile;
