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
            <div className="glass-panel p-12 rounded-[48px] shadow-sm border border-white/50 space-y-10 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none"><IndianRupee size={120} /></div>
                <div className="flex justify-between items-center relative z-10">
                    <h3 className="font-black text-2xl tracking-tighter flex items-center gap-4 text-slate-800"><CreditCard size={28} style={{ color: clinic.primaryColor }} /> Nexus Terminal</h3>
                    <div className="flex gap-2">
                        <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></div>
                    </div>
                </div>
                <div className="flex flex-col xl:flex-row items-center gap-12 relative z-10">
                    <div className="relative group flex-1 w-full xl:w-auto">
                        <span className="absolute left-0 top-1/2 -translate-y-1/2 text-slate-300 text-5xl font-black px-4">₹</span>
                        <input type="number" placeholder="0.00" value={txAmount} onChange={(e) => setTxAmount(e.target.value)}
                            className="w-full text-8xl font-black outline-none border-b-[6px] border-slate-100 bg-transparent pb-6 pl-16 focus:border-slate-900 transition-all placeholder:text-slate-200 text-slate-900" />
                    </div>
                    <div className="flex flex-1 w-full xl:w-auto gap-6 items-end">
                        <div className="space-y-3 flex-1">
                            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-2">Category Classification</label>
                            <div className="relative">
                                <select className="w-full p-6 bg-slate-50 border border-slate-100 rounded-[24px] outline-none font-bold text-base appearance-none cursor-pointer hover:bg-white transition-all text-slate-700 uppercase tracking-wider"
                                    onChange={(e) => setTxCategory(e.target.value as TransactionCategory)}
                                    value={txCategory}>
                                    {Object.values(TransactionCategory).map(c => (
                                        <option key={c} value={c}>{c}</option>
                                    ))}
                                </select>
                                <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-xs">▼</div>
                            </div>
                        </div>
                        <div className="flex gap-4 flex-1">
                            <button onClick={() => { if (!txAmount) return; onProcessTransaction(selectedPatient.id, parseFloat(txAmount), txCategory, TransactionType.EARN); setTxAmount(''); }}
                                className="flex-1 py-6 rounded-[24px] text-white font-black text-xs uppercase tracking-widest shadow-xl transition-all hover:scale-105 active:scale-95 hover:shadow-2xl" style={{ backgroundColor: clinic.primaryColor }}>Commit Earn</button>
                            <button onClick={() => { if (!txAmount) return; onProcessTransaction(selectedPatient.id, parseFloat(txAmount), txCategory, TransactionType.REDEEM); setTxAmount(''); }}
                                className="flex-1 py-6 rounded-[24px] bg-slate-900 text-white font-black text-xs uppercase tracking-widest shadow-xl transition-all hover:scale-105 active:scale-95 hover:shadow-2xl">Redeem Used</button>
                        </div>
                    </div>
                </div>
            </div>

            {/* 3. ACTIVE MONITOR (FULL WIDTH) */}
            <div className="glass-panel p-12 rounded-[48px] shadow-sm border border-white/50 space-y-8">
                <div className="flex justify-between items-center">
                    <h3 className="font-black text-2xl tracking-tighter flex items-center gap-3 text-slate-800"><ClipboardCheck size={28} className="text-emerald-500" /> Active Monitor</h3>
                    {activeCarePlan && <div className="bg-emerald-50 text-emerald-600 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-100 flex items-center gap-2"><div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" /> Live Protocol</div>}
                </div>

                {activeCarePlan ? (
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-12">
                        <div className="p-10 bg-emerald-50/50 border border-emerald-100/50 rounded-[40px] relative overflow-hidden">
                            <Activity className="absolute right-6 top-6 text-emerald-200 opacity-50" size={80} />
                            <p className="text-[10px] font-black uppercase text-emerald-600 tracking-widest mb-2">Live Treatment</p>
                            <h4 className="text-4xl font-black text-slate-900 tracking-tight">{activeCarePlan.treatmentName}</h4>
                            <div className="mt-8 flex items-end justify-between">
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black uppercase text-slate-400">Adhesion Score</p>
                                    <p className="text-5xl font-black text-emerald-600">98%</p>
                                </div>
                                <div className="w-32 h-3 bg-slate-200 rounded-full overflow-hidden">
                                    <div className="h-full bg-emerald-500 w-[98%]"></div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {activeCarePlan.checklist?.slice(0, 4).map(item => (
                                <div key={item.id} className="flex items-center gap-6 p-6 rounded-[24px] hover:bg-white transition-all cursor-pointer group bg-white/40 border border-white/60">
                                    <div className={`h-8 w-8 rounded-full border-[3px] flex items-center justify-center transition-all ${item.completed ? 'bg-emerald-500 border-emerald-500' : 'border-slate-200 bg-white group-hover:border-slate-300'}`}>
                                        {item.completed && <Check size={18} className="text-white" strokeWidth={4} />}
                                    </div>
                                    <span className={`text-sm font-bold ${item.completed ? 'text-slate-400 line-through' : 'text-slate-700'}`}>{item.task}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="py-20 text-center text-slate-400 border-2 border-dashed border-slate-100 rounded-[40px]">
                        <HeartPulse size={48} className="mx-auto mb-4 text-slate-200" />
                        <p className="font-bold italic text-lg">No active protocols initialized.</p>
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
        </div >
    );
};

export default PatientProfile;
