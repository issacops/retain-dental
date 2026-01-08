
import React, { useMemo, useState } from 'react';
import { Search, DollarSign, Calendar, TrendingUp, Download, Filter, FileText, ArrowUpRight, ArrowDownLeft, CreditCard } from 'lucide-react';
import { Transaction, TransactionType, TransactionCategory, Clinic } from '../../../types';

interface Props {
    clinic: Clinic;
    transactions: Transaction[];
}

const FinancialLedger: React.FC<Props> = ({ clinic, transactions }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [filterCategory, setFilterCategory] = useState<string>('ALL');

    // Filter Transactions
    const filteredTransactions = useMemo(() => {
        return transactions
            .filter(t => t.clinicId === clinic.id)
            .filter(t => {
                const matchesSearch = t.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    String(t.amountPaid).includes(searchQuery);
                const matchesCategory = filterCategory === 'ALL' || t.category === filterCategory;
                return matchesSearch && matchesCategory;
            })
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }, [transactions, clinic.id, searchQuery, filterCategory]);

    // Calculate Stats
    const stats = useMemo(() => {
        const totalRevenue = filteredTransactions
            .filter(t => t.type === TransactionType.EARN)
            .reduce((acc, curr) => acc + curr.amountPaid, 0);

        const todayRevenue = filteredTransactions
            .filter(t => t.type === TransactionType.EARN && new Date(t.date).toDateString() === new Date().toDateString())
            .reduce((acc, curr) => acc + curr.amountPaid, 0);

        const monthlyRevenue = filteredTransactions
            .filter(t => t.type === TransactionType.EARN && new Date(t.date).getMonth() === new Date().getMonth())
            .reduce((acc, curr) => acc + curr.amountPaid, 0);

        return { totalRevenue, todayRevenue, monthlyRevenue };
    }, [filteredTransactions]);

    return (
        <div className="h-full flex flex-col p-8 space-y-8 animate-in fade-in duration-700">
            {/* Header Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: 'Total Revenue', value: stats.totalRevenue, icon: <DollarSign size={24} />, color: 'bg-emerald-50 text-emerald-600' },
                    { label: 'This Month', value: stats.monthlyRevenue, icon: <Calendar size={24} />, color: 'bg-indigo-50 text-indigo-600' },
                    { label: 'Today', value: stats.todayRevenue, icon: <TrendingUp size={24} />, color: 'bg-amber-50 text-amber-600' }
                ].map((stat, i) => (
                    <div key={i} className="glass-panel p-6 flex items-center justify-between border border-white/60 shadow-lg group">
                        <div>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
                            <h3 className="text-4xl font-black text-slate-800 tracking-tighter">₹{stat.value.toLocaleString()}</h3>
                        </div>
                        <div className={`h-16 w-16 rounded-2xl flex items-center justify-center ${stat.color} shadow-sm group-hover:scale-110 transition-transform`}>
                            {stat.icon}
                        </div>
                    </div>
                ))}
            </div>

            {/* Main Ledger Panel */}
            <div className="flex-1 glass-panel bg-white/60 border border-white/60 shadow-xl rounded-[32px] overflow-hidden flex flex-col">
                {/* Toolbar */}
                <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-white/40 backdrop-blur-md">
                    <div className="flex items-center gap-4">
                        <div className="h-12 w-12 bg-slate-900 text-white rounded-xl flex items-center justify-center shadow-lg">
                            <CreditCard size={24} />
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-slate-900 tracking-tight">Financial Ledger</h2>
                            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">{filteredTransactions.length} Records Found</p>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <div className="relative group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
                            <input
                                type="text"
                                placeholder="Search transactions..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-12 pr-6 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 transition-all w-64 text-sm font-bold text-slate-700"
                            />
                        </div>
                        <select
                            className="px-6 py-3 bg-white border border-slate-200 rounded-xl outline-none font-bold text-sm text-slate-600 cursor-pointer hover:border-indigo-500 transition-colors uppercase tracking-wide appearance-none"
                            value={filterCategory}
                            onChange={(e) => setFilterCategory(e.target.value)}
                        >
                            <option value="ALL">All Categories</option>
                            {Object.values(TransactionCategory).map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                        <button className="px-6 py-3 bg-slate-900 text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-black transition-all shadow-lg flex items-center gap-2">
                            <Download size={16} /> Export
                        </button>
                    </div>
                </div>

                {/* Table */}
                <div className="flex-1 overflow-auto custom-scrollbar p-2">
                    <table className="w-full text-left border-collapse">
                        <thead className="sticky top-0 bg-white/90 backdrop-blur-xl z-10 shadow-sm">
                            <tr>
                                <th className="p-6 text-[10px] font-black uppercase text-slate-400 tracking-widest">Transaction ID</th>
                                <th className="p-6 text-[10px] font-black uppercase text-slate-400 tracking-widest">Details</th>
                                <th className="p-6 text-[10px] font-black uppercase text-slate-400 tracking-widest text-right">Category</th>
                                <th className="p-6 text-[10px] font-black uppercase text-slate-400 tracking-widest text-right">Amount</th>
                                <th className="p-6 text-[10px] font-black uppercase text-slate-400 tracking-widest text-right">Date</th>
                                <th className="p-6 text-[10px] font-black uppercase text-slate-400 tracking-widest text-center">Receipt</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredTransactions.map(tx => (
                                <tr key={tx.id} className="group hover:bg-indigo-50/30 transition-colors">
                                    <td className="p-6 text-xs font-mono font-bold text-slate-400 select-all">#{tx.id.slice(0, 8)}</td>
                                    <td className="p-6">
                                        <div className="flex items-center gap-3">
                                            <div className={`h-8 w-8 rounded-full flex items-center justify-center ${tx.type === TransactionType.EARN ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
                                                {tx.type === TransactionType.EARN ? <ArrowDownLeft size={16} /> : <ArrowUpRight size={16} />}
                                            </div>
                                            <span className="font-bold text-sm text-slate-700">{tx.description}</span>
                                        </div>
                                    </td>
                                    <td className="p-6 text-right">
                                        <span className="px-3 py-1 bg-slate-100 text-slate-500 rounded-lg text-[10px] uppercase font-black tracking-widest border border-slate-200">
                                            {tx.category}
                                        </span>
                                    </td>
                                    <td className="p-6 text-right">
                                        <span className={`text-lg font-black tracking-tight ${tx.type === TransactionType.EARN ? 'text-slate-900' : 'text-rose-500'}`}>
                                            {tx.type === TransactionType.REDEEM && '-'}₹{tx.amountPaid.toLocaleString()}
                                        </span>
                                    </td>
                                    <td className="p-6 text-right text-xs font-bold text-slate-500">
                                        {new Date(tx.date).toLocaleDateString()} <span className="text-slate-300 mx-1">|</span> {new Date(tx.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </td>
                                    <td className="p-6 text-center">
                                        <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-900 transition-colors">
                                            <FileText size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {filteredTransactions.length === 0 && (
                        <div className="text-center py-20 opacity-50">
                            <div className="inline-flex p-6 bg-slate-100 rounded-full mb-4">
                                <Search size={48} className="text-slate-300" />
                            </div>
                            <p className="text-xl font-bold text-slate-300">No transactions match your query</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FinancialLedger;
