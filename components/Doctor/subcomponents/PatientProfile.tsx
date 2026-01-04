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
        <div className="w-full max-w-[1600px] mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20 px-8">

            {/* HEADER: IDENTITY & EQUITY */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white p-8 rounded-[40px] shadow-sm border border-slate-100 flex flex-col justify-between group min-h-[260px] relative overflow-hidden">
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-4">
                            <div className={`h-2 w-2 rounded-full ${selectedPatient.currentTier === 'GOLD' ? 'bg-amber-400' : 'bg-emerald-400'} animate-pulse`}></div>
                            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100">Status: Active</span>
                        </div>
                        <h1 className="text-5xl font-black tracking-tight text-slate-900 leading-none mb-2">{selectedPatient.name}</h1>
                        <p className="text-sm font-bold text-slate-400 tracking-tight font-mono">{selectedPatient.mobile}</p>
                    </div>
                    <div className="flex gap-4 mt-8 relative z-10 w-3/4">
                        <button className="flex-1 py-4 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-slate-200 hover:scale-105 active:scale-95">Health Key</button>
                        <button className="flex-1 py-4 bg-white border border-slate-200 text-slate-500 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-50 hover:text-slate-800 transition-all">Vault</button>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-8">
                    <div className="bg-white p-8 rounded-[40px] shadow-sm border border-slate-100 text-center relative overflow-hidden group h-full flex flex-col justify-center items-center">
                        <div className="absolute top-0 left-0 w-full h-1.5" style={{ backgroundColor: clinic.primaryColor }}></div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Smile Credits</p>
                        <h2 className="text-7xl font-black tracking-tighter" style={{ color: clinic.primaryColor }}>
                            {wallets.find(w => w.userId === selectedPatient.id)?.balance || 0}
                        </h2>
                    </div>
                    <div className="h-full rounded-[40px] overflow-hidden border border-slate-100 shadow-sm">
                        <FamilyEquityVisualizer patient={selectedPatient} allUsers={allUsers} familyGroups={familyGroups} primaryColor={clinic.primaryColor} />
                    </div>
                </div>
            </div>

            {/* ACTION LAYER: TRANSACTION & PROTOCOL */}
            <div className="grid grid-cols-12 gap-8">
                {/* TRANSACTION TERMINAL */}
                <div className="col-span-12 lg:col-span-7 glass-panel p-12 rounded-[48px] shadow-sm border border-white/50 space-y-10 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none"><IndianRupee size={120} /></div>
                    <div className="flex justify-between items-center relative z-10">
                        <h3 className="font-black text-2xl tracking-tighter flex items-center gap-4 text-slate-800"><CreditCard size={24} style={{ color: clinic.primaryColor }} /> Nexus Terminal</h3>
                        <div className="flex gap-2">
                            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></div>
                        </div>
                    </div>
                    <div className="space-y-8 relative z-10">
                        <div className="relative group">
                            <span className="absolute left-0 top-1/2 -translate-y-1/2 text-slate-300 text-4xl font-black px-4">₹</span>
                            <input type="number" placeholder="0.00" value={txAmount} onChange={(e) => setTxAmount(e.target.value)}
                                className="w-full text-7xl font-black outline-none border-b-[6px] border-slate-100 bg-transparent pb-6 pl-12 focus:border-slate-900 transition-all placeholder:text-slate-200 text-slate-900" />
                        </div>
                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-3">
                                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-2">Protocol Link</label>
                                <div className="relative">
                                    <select className="w-full p-5 bg-slate-50 border border-slate-100 rounded-[24px] outline-none font-bold text-sm appearance-none cursor-pointer hover:bg-white transition-all text-slate-700"
                                        onChange={(e) => setSelectedTemplate(TREATMENT_TEMPLATES.find(t => t.name === e.target.value) || null)}
                                        value={selectedTemplate?.name || ''}>
                                        <option value="">-- Manual Journal Entry --</option>
                                        {TREATMENT_TEMPLATES.map(t => <option key={t.name} value={t.name}>{t.name}</option>)}
                                    </select>
                                    <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-xs">▼</div>
                                </div>
                            </div>
                            <div className="flex items-end gap-4">
                                <button onClick={() => { if (!txAmount) return; onProcessTransaction(selectedPatient.id, parseFloat(txAmount), txCategory, TransactionType.EARN, selectedTemplate ? { name: selectedTemplate.name, instructions: selectedTemplate.instructions, metadata: customMetadata } : undefined); setTxAmount(''); setSelectedTemplate(null); }}
                                    className="flex-1 py-5 rounded-[24px] text-white font-black text-[10px] uppercase tracking-widest shadow-xl transition-all hover:scale-105 active:scale-95 hover:shadow-2xl" style={{ backgroundColor: clinic.primaryColor }}>Commit Earn</button>
                                <button onClick={() => { if (!txAmount) return; onProcessTransaction(selectedPatient.id, parseFloat(txAmount), txCategory, TransactionType.REDEEM); setTxAmount(''); }}
                                    className="flex-1 py-5 rounded-[24px] bg-slate-900 text-white font-black text-[10px] uppercase tracking-widest shadow-xl transition-all hover:scale-105 active:scale-95 hover:shadow-2xl">Redeem Used</button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* PROTOCOL CONFIG */}
                <div className="col-span-12 lg:col-span-5 glass-panel p-10 rounded-[48px] shadow-sm border border-white/50 space-y-8 relative">
                    <h3 className="font-black text-xl tracking-tighter flex items-center gap-4 text-slate-800"><Layers size={24} className="text-rose-500" /> Protocol Layer</h3>
                    {selectedTemplate ? (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                            {selectedTemplate.customFields?.map(field => (
                                <div key={field.key} className="space-y-2">
                                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">{field.label}</label>
                                    <input
                                        type={field.type}
                                        value={customMetadata[field.key] || ''}
                                        onChange={(e) => setCustomMetadata({ ...customMetadata, [field.key]: e.target.value })}
                                        className="w-full px-6 py-4 bg-white border border-slate-100 rounded-[20px] text-sm font-bold outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50 transition-all"
                                    />
                                </div>
                            ))}
                            <div className="p-6 bg-slate-50 rounded-[28px] border border-slate-100">
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3">Compliance Regimen</p>
                                <div className="space-y-2">
                                    {selectedTemplate.instructions.slice(0, 3).map((ins, i) => <p key={i} className="text-xs font-bold text-slate-600 flex items-start gap-2"><span className="text-emerald-500">•</span> {ins}</p>)}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="h-[200px] flex flex-col items-center justify-center text-center opacity-50">
                            <Sparkles size={40} className="text-slate-300 mb-4" />
                            <p className="text-sm font-bold text-slate-400 max-w-[200px]">Select a protocol pattern to configure parameters.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* STATUS & HISTORY */}
            <div className="grid grid-cols-12 gap-8">

                {/* ACTIVE PROTOCOL MONITOR */}
                <div className="col-span-12 lg:col-span-5 glass-panel p-10 rounded-[48px] shadow-sm border border-white/50 space-y-8">
                    <div className="flex justify-between items-center">
                        <h3 className="font-black text-xl tracking-tighter flex items-center gap-3 text-slate-800"><ClipboardCheck size={24} className="text-emerald-500" /> Active Monitor</h3>
                        {activeCarePlan && <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />}
                    </div>

                    {activeCarePlan ? (
                        <div className="space-y-8">
                            <div className="p-8 bg-emerald-50/50 border border-emerald-100/50 rounded-[32px] relative overflow-hidden">
                                <Activity className="absolute right-4 top-4 text-emerald-200 opacity-50" size={60} />
                                <p className="text-[9px] font-black uppercase text-emerald-600 tracking-widest mb-1">Live Treatment</p>
                                <h4 className="text-2xl font-black text-slate-900 tracking-tight">{activeCarePlan.treatmentName}</h4>
                                <div className="mt-6 flex items-end justify-between">
                                    <div className="space-y-1">
                                        <p className="text-[9px] font-black uppercase text-slate-400">Adhesion Score</p>
                                        <p className="text-3xl font-black text-emerald-600">98%</p>
                                    </div>
                                    <div className="w-24 h-2 bg-slate-200 rounded-full overflow-hidden">
                                        <div className="h-full bg-emerald-500 w-[98%]"></div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-3">
                                {activeCarePlan.checklist?.slice(0, 5).map(item => (
                                    <div key={item.id} className="flex items-center gap-4 p-4 rounded-2xl hover:bg-white transition-all cursor-pointer group">
                                        <div className={`h-6 w-6 rounded-full border-2 flex items-center justify-center transition-all ${item.completed ? 'bg-emerald-500 border-emerald-500' : 'border-slate-200 bg-white group-hover:border-slate-300'}`}>
                                            {item.completed && <Check size={14} className="text-white" strokeWidth={3} />}
                                        </div>
                                        <span className={`text-xs font-bold ${item.completed ? 'text-slate-400 line-through' : 'text-slate-600'}`}>{item.task}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="py-12 text-center text-slate-400">
                            <p className="font-bold italic">No active protocols.</p>
                        </div>
                    )}
                </div>

                {/* CLINICAL JOURNAL (HISTORY) */}
                <div className="col-span-12 lg:col-span-7 glass-panel p-10 rounded-[48px] shadow-sm border border-white/50 space-y-8">
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
        </div >
    );
};

export default PatientProfile;
