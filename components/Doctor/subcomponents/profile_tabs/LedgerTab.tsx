import React, { useState } from 'react';
import { CreditCard, IndianRupee, Layers, Filter, History } from 'lucide-react';
import { User, Clinic, TransactionCategory, TransactionType, Transaction, CarePlan } from '../../../../types';
import { TREATMENT_TEMPLATES } from '../../../../constants';

interface LedgerTabProps {
    clinic: Clinic;
    selectedPatient: User;
    patientTransactions: Transaction[];
    onProcessTransaction: (patientId: string, amount: number, category: TransactionCategory, type: TransactionType, carePlanTemplate?: any) => any;
}

const LedgerTab: React.FC<LedgerTabProps> = ({ clinic, selectedPatient, patientTransactions, onProcessTransaction }) => {
    const [txAmount, setTxAmount] = useState('');
    const [txCategory, setTxCategory] = useState<TransactionCategory>(TransactionCategory.GENERAL);

    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* NEXUS TERMINAL */}
            <div className="relative p-12 rounded-[48px] overflow-hidden group shadow-2xl shadow-slate-200/40 border border-white/60 transition-all duration-500 bg-white/60 backdrop-blur-2xl">
                <div className="absolute inset-0 bg-gradient-to-br from-white/80 via-white/40 to-teal-50/20 opacity-80"></div>
                <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-slate-200 to-transparent"></div>
                <div className="absolute top-0 right-0 p-20 opacity-[0.03] rotate-12 pointer-events-none blur-sm"><IndianRupee size={200} /></div>

                <div className="flex justify-between items-center relative z-10 mb-12">
                    <h3 className="font-black text-3xl tracking-tighter flex items-center gap-5 text-slate-900">
                        <div className="p-3 bg-white rounded-2xl shadow-lg shadow-teal-100 text-teal-600"><CreditCard size={28} /></div>
                        Financial Ledger & Terminal
                    </h3>
                    <div className="flex gap-2 bg-white/50 p-2 rounded-full backdrop-blur-sm border border-white/40">
                        <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
                    </div>
                </div>

                <div className="flex flex-col gap-12 relative z-10">
                    <div className="relative group w-full">
                        <span className="absolute left-0 top-1/2 -translate-y-1/2 text-slate-300/50 text-5xl xl:text-6xl font-black px-6 transition-colors group-focus-within:text-slate-400">₹</span>
                        <input type="number" placeholder="0.00" value={txAmount} onChange={(e) => setTxAmount(e.target.value)}
                            className="w-full text-7xl xl:text-8xl font-black outline-none border-b-[6px] border-slate-100 bg-transparent pb-6 pl-20 xl:pl-32 focus:border-slate-800 transition-all duration-300 placeholder:text-slate-100/50 text-slate-900 tracking-tighter" />
                    </div>

                    <div className="flex flex-col xl:flex-row gap-8 items-end w-full">
                        <div className="space-y-4 flex-1 w-full relative z-20">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-2 flex items-center gap-2"><Layers size={12} /> Classification</label>
                            <div className="relative group/select">
                                <div className="absolute inset-0 bg-gradient-to-br from-teal-500/5 to-purple-500/5 rounded-[28px] opacity-0 group-hover/select:opacity-100 transition-opacity"></div>
                                <select className="w-full p-8 bg-white/50 border border-slate-200/60 rounded-[28px] outline-none font-black text-lg appearance-none cursor-pointer hover:bg-white transition-all text-slate-700 uppercase tracking-widest backdrop-blur-sm"
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
                                className="flex-1 py-8 rounded-[28px] text-white font-black text-xs uppercase tracking-[0.2em] shadow-2xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] relative overflow-hidden group/btn" style={{ backgroundColor: clinic.primaryColor }}>
                                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300 ease-out"></div>
                                <span className="relative z-10">Commit Payment</span>
                            </button>
                            <button onClick={() => { if (!txAmount) return; onProcessTransaction(selectedPatient.id, parseFloat(txAmount), txCategory, TransactionType.REDEEM); setTxAmount(''); }}
                                className="flex-1 py-8 rounded-[28px] bg-slate-900 text-white font-black text-xs uppercase tracking-[0.2em] shadow-2xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]">Redeem Points</button>
                        </div>
                    </div>
                </div>
            </div>

            {/* CLINICAL JOURNAL (TRANSACTION HISTORY) */}
            <div className="glass-panel p-12 rounded-[48px] shadow-sm border border-white/50 space-y-8">
                <div className="flex justify-between items-center">
                    <h3 className="font-black text-xl tracking-tighter flex items-center gap-3 text-slate-800"><History size={24} className="text-teal-500" /> Financial Journal</h3>
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

export default LedgerTab;
