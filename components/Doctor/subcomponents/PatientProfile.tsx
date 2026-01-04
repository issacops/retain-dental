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

                    {/* LEFT: IDENTITY */}
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

            {/* 2. NEXUS TERMINAL (FULL WIDTH) */}
            <div className="relative p-12 rounded-[48px] overflow-hidden group shadow-2xl shadow-slate-200/40 border border-white/60 transition-all duration-500 hover:shadow-3xl hover:shadow-indigo-500/10 bg-white/60 backdrop-blur-2xl">
                <div className="absolute inset-0 bg-gradient-to-br from-white/80 via-white/40 to-indigo-50/20 opacity-80"></div>
                <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-slate-200 to-transparent"></div>
                <div className="absolute top-0 right-0 p-20 opacity-[0.03] rotate-12 pointer-events-none blur-sm"><IndianRupee size={200} /></div>

                <div className="flex justify-between items-center relative z-10 mb-12">
                    <h3 className="font-black text-3xl tracking-tighter flex items-center gap-5 text-slate-900">
                        <div className="p-3 bg-white rounded-2xl shadow-lg shadow-indigo-100 text-indigo-600"><CreditCard size={28} /></div>
                        Nexus Terminal
                    </h3>
                    <div className="flex gap-2 bg-white/50 p-2 rounded-full backdrop-blur-sm border border-white/40">
                        <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
                    </div>
                </div>

                <div className="flex flex-col xl:flex-row items-center gap-16 relative z-10">
                    <div className="relative group flex-1 w-full xl:w-auto">
                        <span className="absolute left-0 top-1/2 -translate-y-1/2 text-slate-300/50 text-5xl xl:text-6xl font-black px-6 transition-colors group-focus-within:text-slate-400">₹</span>
                        <input type="number" placeholder="0.00" value={txAmount} onChange={(e) => setTxAmount(e.target.value)}
                            className="w-full text-6xl xl:text-8xl font-black outline-none border-b-[8px] border-slate-100 bg-transparent pb-8 pl-16 xl:pl-24 focus:border-slate-800 transition-all duration-300 placeholder:text-slate-100 text-slate-900 tracking-tighter" />
                    </div>
                    <div className="flex flex-col md:flex-row flex-1 w-full xl:w-auto gap-8 items-end">
                        <div className="space-y-4 flex-1 w-full">
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
                        <div className="flex gap-4 flex-1 w-full">
                            <button onClick={() => { if (!txAmount) return; onProcessTransaction(selectedPatient.id, parseFloat(txAmount), txCategory, TransactionType.EARN); setTxAmount(''); }}
                                className="flex-1 py-8 rounded-[28px] text-white font-black text-xs uppercase tracking-[0.2em] shadow-2xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] hover:shadow-3xl relative overflow-hidden group/btn" style={{ backgroundColor: clinic.primaryColor }}>
                                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300 ease-out"></div>
                                <span className="relative z-10">Commit Earn</span>
                            </button>
                            <button onClick={() => { if (!txAmount) return; onProcessTransaction(selectedPatient.id, parseFloat(txAmount), txCategory, TransactionType.REDEEM); setTxAmount(''); }}
                                className="flex-1 py-8 rounded-[28px] bg-slate-900 text-white font-black text-xs uppercase tracking-[0.2em] shadow-2xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] hover:bg-black hover:shadow-3xl">Redeem</button>
                        </div>
                    </div>
                </div>
            </div>

            {/* 3. ACTIVE MONITOR (FULL WIDTH) */}
            <div className="relative p-12 rounded-[48px] overflow-hidden bg-white shadow-xl shadow-slate-200/50 border border-slate-100/60 group hover:shadow-2xl transition-all duration-500">
                <div className="absolute inset-0 opacity-[0.4] bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:24px_24px]"></div>

                <div className="flex justify-between items-center relative z-10 mb-10">
                    <h3 className="font-black text-3xl tracking-tighter flex items-center gap-5 text-slate-900">
                        <div className="p-3 bg-emerald-50 rounded-2xl text-emerald-600 shadow-sm border border-emerald-100"><ClipboardCheck size={28} /></div>
                        Waitlist & Monitoring
                    </h3>
                    {activeCarePlan && <div className="bg-emerald-500 text-white px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-emerald-200 flex items-center gap-3"><div className="h-2 w-2 rounded-full bg-white animate-pulse" /> Live Protocol</div>}
                </div>

                {activeCarePlan ? (
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-12 relative z-10">
                        <div className="p-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-[40px] relative overflow-hidden shadow-2xl shadow-emerald-500/20 text-white group/card">
                            <div className="absolute right-0 top-0 p-12 opacity-10 scale-150 group-hover/card:scale-125 transition-transform duration-700 ease-out"><Activity size={120} /></div>

                            <p className="text-[10px] font-black uppercase text-emerald-100 tracking-[0.25em] mb-4">Active Treatment</p>
                            <h4 className="text-5xl font-black tracking-tighter mb-12">{activeCarePlan.treatmentName}</h4>

                            <div className="flex items-end justify-between">
                                <div className="space-y-2">
                                    <p className="text-[9px] font-black uppercase text-emerald-200/80 tracking-widest">Adhesion Score</p>
                                    <div className="flex items-baseline gap-1">
                                        <p className="text-6xl font-black">98</p>
                                        <span className="text-xl font-bold opacity-60">%</span>
                                    </div>
                                </div>
                                <div className="flex-1 max-w-[140px] h-4 bg-black/20 rounded-full overflow-hidden backdrop-blur-sm border border-white/10">
                                    <div className="h-full bg-white w-[98%] shadow-[0_0_20px_rgba(255,255,255,0.5)]"></div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {activeCarePlan.checklist?.slice(0, 4).map((item, i) => (
                                <div key={item.id} className="flex items-center gap-6 p-6 rounded-[28px] bg-white border border-slate-100 shadow-sm hover:shadow-xl hover:scale-[1.01] hover:border-emerald-100 transition-all duration-300 group/item cursor-pointer">
                                    <div className={`h-10 w-10 rounded-2xl flex items-center justify-center transition-all duration-300 ${item.completed ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30 rotate-0' : 'bg-slate-50 text-slate-300 rotate-12 group-hover/item:rotate-0'}`}>
                                        {item.completed ? <Check size={20} strokeWidth={4} /> : <span className="text-xs font-black">{i + 1}</span>}
                                    </div>
                                    <span className={`text-sm font-bold tracking-tight transition-colors ${item.completed ? 'text-slate-400 line-through decoration-emerald-500/50' : 'text-slate-700 group-hover/item:text-slate-900'}`}>{item.task}</span>
                                    <div className="ml-auto opacity-0 group-hover/item:opacity-100 transition-all text-slate-300"><Sparkles size={16} /></div>
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
