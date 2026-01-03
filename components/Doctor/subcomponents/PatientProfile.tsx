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
        <div className="max-w-5xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">

            {/* PATIENT HEADER BENTO */}
            <div className="grid grid-cols-5 gap-6">
                <div className="col-span-3 bg-white p-8 rounded-[32px] shadow-sm border border-slate-100 flex flex-col justify-between group">
                    <div>
                        <div className="flex items-center gap-3 mb-4">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">Active Lifecycle</span>
                        </div>
                        <h1 className="text-4xl font-black tracking-tight text-slate-900 leading-none">{selectedPatient.name}</h1>
                        <p className="text-sm font-bold text-slate-400 mt-2 tracking-tight">Identity Bound: <span className="text-slate-700 font-mono">{selectedPatient.mobile}</span></p>
                    </div>
                    <div className="flex gap-3 mt-8">
                        <button className="flex-1 py-3 bg-slate-900 text-white rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-black transition-all shadow-lg shadow-slate-200">Health Record Key</button>
                        <button className="flex-1 py-3 bg-white border border-slate-200 text-slate-500 rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-slate-50 hover:text-slate-800 transition-all">Profile Vault</button>
                    </div>
                </div>
                <div className="col-span-2 space-y-6">
                    <div className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-100 text-center relative overflow-hidden group h-full flex flex-col justify-center items-center">
                        <div className="absolute top-0 left-0 w-full h-1" style={{ backgroundColor: clinic.primaryColor }}></div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Smile Credits</p>
                        <h2 className="text-7xl font-black tracking-tighter" style={{ color: clinic.primaryColor }}>
                            {wallets.find(w => w.userId === selectedPatient.id)?.balance || 0}
                        </h2>
                    </div>
                    <FamilyEquityVisualizer patient={selectedPatient} allUsers={allUsers} familyGroups={familyGroups} primaryColor={clinic.primaryColor} />
                </div>
            </div>

            {/* PATIENT DNA & SPEND ANALYSIS */}
            <div className="grid grid-cols-12 gap-8">
                <div className="col-span-4 glass-panel p-10 rounded-[48px] border border-white/50 shadow-sm space-y-8">
                    <div className="flex items-center justify-between">
                        <h4 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2"><Microscope size={14} /> Clinical DNA</h4>
                        <BarChart size={14} className="text-indigo-400" />
                    </div>
                    <div className="space-y-6">
                        <div className="flex justify-between items-end">
                            <div>
                                <p className="text-[10px] font-black uppercase text-slate-400 mb-1">Loyalty Tier Shift</p>
                                <p className="text-2xl font-black text-slate-900">84%</p>
                            </div>
                            <div className="h-10 w-24">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={[{ v: 10 }, { v: 30 }, { v: 25 }, { v: 60 }, { v: 84 }]}>
                                        <Line type="monotone" dataKey="v" stroke={clinic.primaryColor} strokeWidth={3} dot={false} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                        <div className="pt-6 border-t border-slate-100 space-y-4">
                            <div className="flex justify-between items-center text-[10px] font-bold text-slate-500 uppercase">
                                <span>Tier Velocity</span>
                                <span className="text-emerald-500">+12% / mo</span>
                            </div>
                            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                <div className="h-full bg-indigo-500" style={{ width: '84%' }}></div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-span-8 glass-panel p-10 rounded-[48px] border border-white/50 shadow-sm space-y-8">
                    <div className="flex items-center justify-between px-2">
                        <h4 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2"><GraduationCap size={16} /> Revenue Trajectory</h4>
                        <span className="text-[9px] font-black text-indigo-400 uppercase tracking-widest bg-indigo-50 px-3 py-1 rounded-full">Last 5 Transactions</span>
                    </div>
                    <div className="h-[140px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <ReBarChart data={spendHistoryData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f8fafc" />
                                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#cbd5e1', fontSize: 9, fontWeight: 900 }} />
                                <Tooltip cursor={{ fill: '#f1f5f9' }} contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', fontSize: '10px', fontWeight: '900' }} />
                                <Bar dataKey="amount" radius={[8, 8, 0, 0]} barSize={40}>
                                    {spendHistoryData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={index === spendHistoryData.length - 1 ? clinic.primaryColor : '#e2e8f0'} />
                                    ))}
                                </Bar>
                            </ReBarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* TREATMENT & JOURNEY GRID */}
            <div className="grid grid-cols-12 gap-8">

                {/* LIVE AFTERCARE MODULE */}
                <div className="col-span-12 glass-panel p-12 rounded-[56px] shadow-sm border border-white/50 space-y-12 overflow-hidden relative group">
                    <div className="flex justify-between items-center relative z-10">
                        <h3 className="font-black text-2xl tracking-tighter flex items-center gap-4"><ClipboardCheck size={28} className="text-emerald-500" /> Active Protocol Monitor</h3>
                        <div className="flex items-center gap-4">
                            <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-black transition-colors"><Bell size={14} /> Alert Staff</button>
                            <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest bg-slate-50 px-4 py-2 rounded-full">Secure Bio-Sync</span>
                        </div>
                    </div>

                    {activeCarePlan ? (
                        <div className="grid grid-cols-12 gap-12 relative z-10">
                            <div className="col-span-4 space-y-6">
                                <div className="p-8 bg-slate-50/50 rounded-[40px] border border-slate-100 space-y-6">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Active Treatment</p>
                                            <h4 className="text-2xl font-black tracking-tight">{activeCarePlan.treatmentName}</h4>
                                        </div>
                                        <div className="h-10 w-10 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-emerald-500 shadow-sm"><Activity size={20} /></div>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-end">
                                            <p className="text-[9px] font-black uppercase text-slate-500">Patient Compliance</p>
                                            <span className="text-3xl font-black text-emerald-500">92.4%</span>
                                        </div>
                                        <div className="h-3 w-full bg-slate-200 rounded-full overflow-hidden shadow-inner">
                                            <div className="h-full bg-emerald-500 transition-all duration-1000 ease-out" style={{ width: '92.4%' }}></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-span-8 grid grid-cols-2 gap-4">
                                {activeCarePlan.checklist?.map((item) => (
                                    <div key={item.id} className={`p-6 rounded-[32px] border transition-all flex items-center gap-5 ${item.completed ? 'bg-emerald-50/50 border-emerald-100 shadow-sm' : 'bg-white/50 border-slate-100 opacity-60'}`}>
                                        <div className={`h-8 w-8 rounded-full flex items-center justify-center border-2 transition-all ${item.completed ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-200 bg-white'}`}>
                                            {item.completed && <Check size={16} strokeWidth={4} />}
                                        </div>
                                        <span className={`text-sm font-bold tracking-tight ${item.completed ? 'text-emerald-900' : 'text-slate-400'}`}>{item.task}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="p-20 text-center bg-slate-50/50 rounded-[48px] border border-dashed border-slate-200">
                            <HeartPulse size={48} className="mx-auto mb-6 text-slate-200" />
                            <p className="text-lg font-bold text-slate-300 italic tracking-tight">No active clinical protocols detected for this identity.</p>
                        </div>
                    )}
                </div>

                {/* TREATMENT HISTORY LEDGER */}
                <div className="col-span-12 glass-panel p-12 rounded-[56px] shadow-sm border border-white/50 space-y-12">
                    <div className="flex justify-between items-center">
                        <h3 className="font-black text-2xl tracking-tighter flex items-center gap-4"><History size={28} className="text-indigo-500" /> Clinical Journal Timeline</h3>
                        <div className="flex gap-2">
                            <button className="p-4 bg-slate-50/50 text-slate-400 rounded-2xl hover:bg-slate-100 transition-all flex items-center gap-2 text-[10px] font-black uppercase tracking-widest"><Filter size={16} /> Filter Log</button>
                            <button className="p-4 bg-slate-50/50 text-slate-400 rounded-2xl hover:bg-slate-100 transition-all"><Share2 size={16} /></button>
                        </div>
                    </div>

                    <div className="overflow-hidden rounded-[32px] border border-slate-100/50">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50/50">
                                    <th className="px-8 py-6 text-[10px] font-black uppercase text-slate-400 tracking-widest">Protocol Index</th>
                                    <th className="px-8 py-6 text-[10px] font-black uppercase text-slate-400 tracking-widest">Procedural Detail</th>
                                    <th className="px-8 py-6 text-[10px] font-black uppercase text-slate-400 tracking-widest">Timestamp</th>
                                    <th className="px-8 py-6 text-[10px] font-black uppercase text-slate-400 tracking-widest">GTV Value</th>
                                    <th className="px-8 py-6 text-[10px] font-black uppercase text-slate-400 tracking-widest text-right">Loyalty Delta</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50/50">
                                {patientTransactions.length > 0 ? patientTransactions.map((tx) => (
                                    <tr key={tx.id} className="hover:bg-slate-50/50 transition-colors group cursor-default">
                                        <td className="px-8 py-8 font-mono text-[10px] text-slate-400">P_ID::{tx.id.split('-').pop()?.toUpperCase()}</td>
                                        <td className="px-8 py-8">
                                            <div className="flex items-center gap-4">
                                                <div className={`h-3 w-3 rounded-full ${tx.category === 'COSMETIC' ? 'bg-amber-400 ring-4 ring-amber-400/10' : tx.category === 'HYGIENE' ? 'bg-emerald-400 ring-4 ring-emerald-400/10' : 'bg-indigo-400 ring-4 ring-indigo-400/10'}`}></div>
                                                <div>
                                                    <span className="font-black text-base text-slate-800 tracking-tight">{tx.description}</span>
                                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-0.5">{tx.category} Protocol</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-8 text-xs font-bold text-slate-500">{new Date(tx.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                                        <td className="px-8 py-8">
                                            <span className="text-base font-black text-slate-900">₹{tx.amountPaid.toLocaleString()}</span>
                                        </td>
                                        <td className="px-8 py-8 text-right">
                                            <span className={`text-base font-black ${tx.pointsEarned > 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                                                {tx.pointsEarned > 0 ? '+' : ''}{tx.pointsEarned} <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest ml-1">Credits</span>
                                            </span>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={5} className="px-8 py-24 text-center text-slate-200 font-bold italic tracking-tight">Timeline is currently inert. Initialize clinical procedures to track journey.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* TRANSACTION TERMINAL */}
                <div className="col-span-7 glass-panel p-12 rounded-[56px] shadow-sm border border-white/50 space-y-12">
                    <div className="flex justify-between items-center">
                        <h3 className="font-black text-2xl tracking-tighter flex items-center gap-4"><CreditCard size={28} style={{ color: clinic.primaryColor }} /> Nexus Terminal</h3>
                        <div className="flex gap-2">
                            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></div>
                            <div className="h-2 w-2 rounded-full bg-emerald-200"></div>
                        </div>
                    </div>
                    <div className="space-y-10">
                        <div className="relative group">
                            <IndianRupee className="absolute left-0 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-black transition-all" size={48} />
                            <input type="number" placeholder="0.00" value={txAmount} onChange={(e) => setTxAmount(e.target.value)}
                                className="w-full text-7xl font-black outline-none border-b-8 border-slate-100 bg-transparent pb-10 pl-16 focus:border-black transition-all placeholder:text-slate-100" />
                        </div>
                        <div className="space-y-4">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-3">Protocol Pattern</label>
                            <div className="relative">
                                <select className="w-full p-8 glass-input rounded-[32px] outline-none font-black text-lg appearance-none cursor-pointer hover:bg-slate-50 transition-all"
                                    onChange={(e) => setSelectedTemplate(TREATMENT_TEMPLATES.find(t => t.name === e.target.value) || null)}
                                    value={selectedTemplate?.name || ''}>
                                    <option value="">-- Manual Journal Entry --</option>
                                    {TREATMENT_TEMPLATES.map(t => <option key={t.name} value={t.name}>{t.name}</option>)}
                                </select>
                                <div className="absolute right-8 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">▼</div>
                            </div>
                        </div>
                        <div className="flex gap-6">
                            <button onClick={() => { if (!txAmount) return; onProcessTransaction(selectedPatient.id, parseFloat(txAmount), txCategory, TransactionType.EARN, selectedTemplate ? { name: selectedTemplate.name, instructions: selectedTemplate.instructions, metadata: customMetadata } : undefined); setTxAmount(''); setSelectedTemplate(null); }}
                                className="flex-1 py-8 rounded-[32px] text-white font-black text-sm uppercase tracking-widest shadow-2xl transition-all hover:scale-[1.03] active:scale-95 shadow-indigo-500/20" style={{ backgroundColor: clinic.primaryColor }}>Commit Earn</button>
                            <button onClick={() => { if (!txAmount) return; onProcessTransaction(selectedPatient.id, parseFloat(txAmount), txCategory, TransactionType.REDEEM); setTxAmount(''); }}
                                className="flex-1 py-8 rounded-[32px] bg-dark-900 text-white font-black text-sm uppercase tracking-widest shadow-2xl transition-all hover:scale-[1.03] active:scale-95">Redeem Credit</button>
                        </div>
                    </div>
                </div>

                {/* PROTOCOL CONFIG */}
                <div className="col-span-5 glass-panel p-12 rounded-[56px] shadow-sm border border-white/50 space-y-12">
                    <h3 className="font-black text-2xl tracking-tighter flex items-center gap-4"><Layers size={28} className="text-rose-500" /> Layer Parameters</h3>
                    {selectedTemplate ? (
                        <div className="space-y-10">
                            {selectedTemplate.customFields?.map(field => (
                                <div key={field.key} className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">{field.label}</label>
                                    <input
                                        type={field.type}
                                        value={customMetadata[field.key] || ''}
                                        onChange={(e) => setCustomMetadata({ ...customMetadata, [field.key]: e.target.value })}
                                        className="glass-input w-full px-8 py-6 rounded-[24px] text-lg font-black"
                                    />
                                </div>
                            ))}
                            <div className="space-y-4">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Compliance Notes</label>
                                <div className="p-8 bg-slate-50/50 rounded-[32px] border border-slate-100 max-h-56 overflow-y-auto custom-scrollbar">
                                    {selectedTemplate.instructions.map((ins, i) => <p key={i} className="text-sm font-bold text-slate-600 mb-4 leading-relaxed">• {ins}</p>)}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-center px-10">
                            <Sparkles size={48} className="text-slate-100 mb-6" />
                            <p className="text-lg font-bold text-slate-200 tracking-tight italic">Awaiting protocol selection for layer injection...</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PatientProfile;
