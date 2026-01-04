import React, { useMemo, useState, useEffect } from 'react';
import { Share2, Microscope, BarChart, GraduationCap, ClipboardCheck, Bell, Activity, Check, HeartPulse, History, Filter, CreditCard, Layers, IndianRupee, Sparkles } from 'lucide-react';
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
}

const PatientProfile: React.FC<Props> = ({
    selectedPatient, clinic, wallets, carePlans, transactions, allUsers, familyGroups, onProcessTransaction
}) => {
    const [txAmount, setTxAmount] = useState('');
    const [txCategory, setTxCategory] = useState<TransactionCategory>(TransactionCategory.GENERAL);
    const [selectedTemplate, setSelectedTemplate] = useState<TreatmentTemplate | null>(null);
    const [customMetadata, setCustomMetadata] = useState<Record<string, any>>({});

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

    useEffect(() => {
        if (selectedTemplate) {
            const initialMeta: Record<string, any> = {};
            selectedTemplate.customFields?.forEach(f => { initialMeta[f.key] = f.defaultValue; });
            setCustomMetadata(initialMeta);
            setTxCategory(selectedTemplate.category);
        }
    }, [selectedTemplate]);

    return (
        <div className="w-full max-w-[1800px] mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20 px-8">

            {/* HEADER: IDENTITY & KEY STATS */}
            <div className="flex gap-6 items-stretch">
                <div className="flex-1 bg-white p-8 rounded-[32px] shadow-sm border border-slate-100 flex justify-between items-center relative overflow-hidden">
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-2">
                            <div className={`h-2 w-2 rounded-full ${selectedPatient.currentTier === 'GOLD' ? 'bg-amber-400' : 'bg-emerald-400'} animate-pulse`}></div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{selectedPatient.currentTier} Member</span>
                        </div>
                        <h1 className="text-4xl font-black tracking-tight text-slate-900 leading-none">{selectedPatient.name}</h1>
                        <p className="text-sm font-bold text-slate-400 mt-2 font-mono">{selectedPatient.mobile}</p>
                    </div>
                    <div className="text-right relative z-10">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Smile Credits</p>
                        <h2 className="text-6xl font-black tracking-tighter" style={{ color: clinic.primaryColor }}>
                            {wallets.find(w => w.userId === selectedPatient.id)?.balance || 0}
                        </h2>
                    </div>
                    <div className="absolute right-0 top-0 w-64 h-full bg-gradient-to-l from-white via-white/0 to-transparent pointer-events-none"></div>
                    <div className="absolute right-[-20px] top-[-20px] text-slate-50 opacity-10 rotate-12 pointer-events-none">
                        <Sparkles size={200} />
                    </div>
                </div>
            </div>

            {/* ACTION COMMAND CENTER */}
            <div className="bg-slate-900 p-8 rounded-[32px] text-white shadow-2xl shadow-slate-200/50 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-5"><Activity size={120} /></div>
                <div className="relative z-10 flex items-center gap-8">

                    {/* TREATMENT SELECTOR */}
                    <div className="flex-1 space-y-2">
                        <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest pl-2">Clinical Protocol</label>
                        <div className="relative">
                            <select className="w-full bg-slate-800 text-white p-4 rounded-2xl outline-none font-bold text-lg appearance-none cursor-pointer hover:bg-slate-700 transition-colors border border-slate-700"
                                onChange={(e) => setSelectedTemplate(TREATMENT_TEMPLATES.find(t => t.name === e.target.value) || null)}
                                value={selectedTemplate?.name || ''}>
                                <option value="">-- Select Protocol --</option>
                                {TREATMENT_TEMPLATES.map(t => <option key={t.name} value={t.name}>{t.name}</option>)}
                            </select>
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">▼</div>
                        </div>
                    </div>

                    {/* AMOUNT INPUT */}
                    <div className="w-48 space-y-2">
                        <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest pl-2">Transaction Value</label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-bold">₹</span>
                            <input type="number" placeholder="0" value={txAmount} onChange={(e) => setTxAmount(e.target.value)}
                                className="w-full bg-slate-800 text-white p-4 pl-8 rounded-2xl outline-none font-black text-xl placeholder:text-slate-600 border border-slate-700 focus:border-indigo-500 transition-all" />
                        </div>
                    </div>

                    {/* ACTIONS */}
                    <div className="flex gap-4 pt-6">
                        <button onClick={() => { if (!txAmount) return; onProcessTransaction(selectedPatient.id, parseFloat(txAmount), txCategory, TransactionType.EARN, selectedTemplate ? { name: selectedTemplate.name, instructions: selectedTemplate.instructions, metadata: customMetadata } : undefined); setTxAmount(''); setSelectedTemplate(null); }}
                            className="px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-white rounded-2xl font-black uppercase tracking-widest text-xs transition-transform hover:scale-105 active:scale-95 shadow-lg shadow-emerald-500/20">
                            Commit Entry
                        </button>
                        <button onClick={() => { if (!txAmount) return; onProcessTransaction(selectedPatient.id, parseFloat(txAmount), txCategory, TransactionType.REDEEM); setTxAmount(''); }}
                            className="px-8 py-4 bg-slate-700 hover:bg-slate-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs transition-transform hover:scale-105 active:scale-95">
                            Reedem
                        </button>
                    </div>
                </div>

                {/* DYNAMIC FORM FIELDS (If Template Selected) */}
                {selectedTemplate && (
                    <div className="mt-8 pt-8 border-t border-slate-800 grid grid-cols-3 gap-6 animate-in slide-in-from-top-2">
                        {selectedTemplate.customFields?.map(field => (
                            <div key={field.key} className="space-y-2">
                                <label className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">{field.label}</label>
                                <input
                                    type={field.type}
                                    value={customMetadata[field.key] || ''}
                                    placeholder={field.label}
                                    onChange={(e) => setCustomMetadata({ ...customMetadata, [field.key]: e.target.value })}
                                    className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-2 text-sm font-bold text-white focus:border-indigo-500 outline-none"
                                />
                            </div>
                        ))}
                        <div className="col-span-3">
                            <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-2">Protocol Notes</p>
                            <div className="flex flex-wrap gap-2">
                                {selectedTemplate.instructions.map((ins, i) => (
                                    <span key={i} className="px-3 py-1 bg-slate-800 rounded-lg text-xs font-medium text-slate-300 border border-slate-700">{ins}</span>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* MAIN CONTENT GRID */}
            <div className="grid grid-cols-12 gap-8 items-start">

                {/* LEFT COLUMN: HISTORY & FINANCE (7 Spans) */}
                <div className="col-span-12 lg:col-span-8 space-y-8">
                    {/* TRANSACTION HISTORY */}
                    <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
                        <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
                            <h3 className="font-black text-lg text-slate-800 flex items-center gap-3"><History size={18} className="text-slate-400" /> Clinical Ledger</h3>
                            <button className="text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-indigo-500 transition-colors">Export Data</button>
                        </div>
                        <div className="max-h-[500px] overflow-y-auto custom-scrollbar">
                            <table className="w-full text-left">
                                <thead className="bg-slate-50 sticky top-0 z-10">
                                    <tr>
                                        <th className="px-8 py-4 text-[9px] font-black uppercase text-slate-400 tracking-widest">Date</th>
                                        <th className="px-8 py-4 text-[9px] font-black uppercase text-slate-400 tracking-widest">Procedure</th>
                                        <th className="px-8 py-4 text-[9px] font-black uppercase text-slate-400 tracking-widest">Value</th>
                                        <th className="px-8 py-4 text-[9px] font-black uppercase text-slate-400 tracking-widest text-right">Points</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {patientTransactions.length > 0 ? patientTransactions.map((tx) => (
                                        <tr key={tx.id} className="hover:bg-slate-50/50 transition-colors group">
                                            <td className="px-8 py-5 text-xs font-bold text-slate-500">{new Date(tx.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}</td>
                                            <td className="px-8 py-5">
                                                <div className="font-bold text-sm text-slate-800">{tx.description}</div>
                                                <div className="text-[9px] font-bold uppercase text-slate-400 mt-0.5">{tx.category}</div>
                                            </td>
                                            <td className="px-8 py-5 text-sm font-black text-slate-900">₹{tx.amountPaid.toLocaleString()}</td>
                                            <td className={`px-8 py-5 text-sm font-black text-right ${tx.pointsEarned > 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                                                {tx.pointsEarned > 0 ? '+' : ''}{tx.pointsEarned}
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr><td colSpan={4} className="p-12 text-center text-slate-300 font-bold italic">No history available</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* RIGHT COLUMN: ACTIVE CLINICAL & CHARTS (5 Spans) */}
                <div className="col-span-12 lg:col-span-4 space-y-8">

                    {/* ACTIVE TREATMENT CARD */}
                    <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm relative overflow-hidden group">
                        <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500"></div>
                        <div className="flex justify-between items-center mb-6">
                            <h4 className="text-sm font-black uppercase tracking-widest text-slate-500">Active Protocol</h4>
                            {activeCarePlan && <span className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-100">Live</span>}
                        </div>

                        {activeCarePlan ? (
                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-2xl font-black text-slate-900 leading-tight">{activeCarePlan.treatmentName}</h3>
                                    <p className="text-xs font-bold text-slate-400 mt-1">Started {new Date(activeCarePlan.assignedAt).toLocaleDateString()}</p>
                                </div>

                                <div className="space-y-3">
                                    {activeCarePlan.checklist?.slice(0, 4).map(item => (
                                        <div key={item.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer border border-transparent hover:border-slate-100">
                                            <div className={`h-5 w-5 rounded-full border-2 flex items-center justify-center transition-all ${item.completed ? 'bg-emerald-500 border-emerald-500' : 'border-slate-300'}`}>
                                                {item.completed && <Check size={12} className="text-white" strokeWidth={4} />}
                                            </div>
                                            <span className={`text-xs font-bold ${item.completed ? 'text-slate-400 line-through' : 'text-slate-700'}`}>{item.task}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="py-12 text-center">
                                <ClipboardCheck size={48} className="mx-auto text-slate-200 mb-4" />
                                <p className="text-sm font-bold text-slate-400">No active treatment plan.</p>
                                <button className="mt-4 text-xs font-black text-emerald-500 uppercase tracking-widest hover:text-emerald-600">Start New Protocol</button>
                            </div>
                        )}
                    </div>

                    {/* CHART CARD */}
                    <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm">
                        <div className="flex justify-between items-center mb-6">
                            <h4 className="text-sm font-black uppercase tracking-widest text-slate-500">Spend Trajectory</h4>
                            <BarChart size={16} className="text-slate-400" />
                        </div>
                        <div className="h-40">
                            <ResponsiveContainer width="100%" height="100%">
                                <ReBarChart data={spendHistoryData}>
                                    <Bar dataKey="amount" radius={[4, 4, 0, 0]} fill={clinic.primaryColor} />
                                </ReBarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                </div>
            </div>
        </div >
    );
};

export default PatientProfile;
