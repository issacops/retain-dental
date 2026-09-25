
import React, { useMemo, useState } from 'react';
import { Search, DollarSign, Calendar, TrendingUp, Download, Filter, FileText, ArrowUpRight, ArrowDownLeft, CreditCard } from 'lucide-react';
import { Transaction, TransactionType, TransactionCategory, Clinic, Wallet, User } from '../../../types';

interface Props {
    clinic: Clinic;
    transactions: Transaction[];
    wallets: Wallet[];
    allUsers: User[];
}

const FinancialLedger: React.FC<Props> = ({ clinic, transactions, wallets, allUsers }) => {
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

    const handleExportCSV = () => {
        const headers = ['Transaction ID', 'Date', 'Type', 'Category', 'Description', 'Amount', 'Patient'];
        const rows = filteredTransactions.map(t => {
            const wallet = wallets.find(w => w.id === t.walletId);
            const patient = allUsers.find(u => u.id === wallet?.userId);
            return [
                t.id,
                new Date(t.date).toLocaleDateString(),
                t.type,
                t.category,
                `"${t.description}"`,
                t.amountPaid,
                `"${patient?.name || 'Unknown'}"`
            ].join(',');
        });

        const csvContent = [headers.join(','), ...rows].join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `financial_ledger_${clinic.slug}_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    const escapeHtml = (str: string) => (str || '').replace(/[&<>"']/g, (m) => {
        switch (m) {
            case '&': return '&amp;';
            case '<': return '&lt;';
            case '>': return '&gt;';
            case '"': return '&quot;';
            case "'": return '&#39;';
            default: return m;
        }
    });

    const handlePrintReceipt = (transaction: Transaction) => {
        const wallet = wallets.find(w => w.id === transaction.walletId);
        const patient = allUsers.find(u => u.id === wallet?.userId);
        const tax = clinic.settings?.tax;
        const taxEnabled = !!tax?.enabled && (tax?.rate || 0) > 0;
        const rate = tax?.rate || 0;
        const total = transaction.amountPaid;
        const taxAmount = taxEnabled ? Math.round(total * (rate / (100 + rate))) : 0;
        const subtotal = total - taxAmount;
        const money = (n: number) => `\u20b9${n.toLocaleString('en-IN')}`;
        const docTitle = taxEnabled ? 'Tax Invoice' : 'Payment Receipt';

        const receiptWindow = window.open('', '_blank');
        if (receiptWindow) {
            receiptWindow.document.write(`
                <html>
                <head>
                    <title>${escapeHtml(docTitle)} ${escapeHtml(transaction.invoiceNo || ('#' + transaction.id.slice(0, 8)))}</title>
                    <style>
                        * { box-sizing: border-box; }
                        body { font-family: -apple-system, 'Segoe UI', 'Plus Jakarta Sans', sans-serif; padding: 48px; color: #0f172a; max-width: 760px; margin: 0 auto; }
                        .top { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #0f172a; padding-bottom: 24px; }
                        .logo { height: 54px; margin-bottom: 8px; border-radius: 12px; }
                        .clinic-name { font-size: 24px; font-weight: 800; letter-spacing: -0.02em; }
                        .muted { color: #64748b; font-size: 12px; line-height: 1.6; }
                        .doc-type { font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 2px; color: #64748b; text-align: right; }
                        .doc-no { font-size: 20px; font-weight: 800; text-align: right; margin-top: 4px; }
                        .meta { display: flex; justify-content: space-between; margin: 32px 0; }
                        .label { font-weight: 700; text-transform: uppercase; color: #94a3b8; font-size: 10px; letter-spacing: 1.5px; }
                        .value { font-weight: 700; margin-top: 4px; }
                        table { width: 100%; border-collapse: collapse; margin-bottom: 24px; }
                        th { text-align: left; text-transform: uppercase; font-size: 10px; letter-spacing: 1.5px; color: #94a3b8; padding: 12px 0; border-bottom: 1px solid #e2e8f0; }
                        td { padding: 16px 0; border-bottom: 1px solid #f1f5f9; font-weight: 600; }
                        .totals { margin-left: auto; width: 280px; }
                        .row { display: flex; justify-content: space-between; padding: 6px 0; font-size: 14px; }
                        .row.grand { border-top: 2px solid #0f172a; margin-top: 8px; padding-top: 12px; font-size: 20px; font-weight: 800; }
                        .footer { margin-top: 56px; border-top: 1px solid #e2e8f0; padding-top: 20px; text-align: center; font-size: 12px; color: #94a3b8; }
                        .printbar { position: fixed; top: 20px; right: 20px; }
                        .printbar button { font: inherit; font-size: 13px; font-weight: 700; padding: 10px 18px; border-radius: 999px; border: none; background: #0f172a; color: #fff; cursor: pointer; }
                        @media print { body { padding: 24px; } .printbar { display: none; } }
                    </style>
                </head>
                <body>
                    <div class="top">
                        <div>
                            ${clinic.logoUrl ? `<img src="${escapeHtml(clinic.logoUrl)}" class="logo" />` : ''}
                            <div class="clinic-name">${escapeHtml(clinic.name)}</div>
                            <div class="muted">
                                ${clinic.settings?.address ? escapeHtml(clinic.settings.address) + '<br/>' : ''}
                                ${clinic.emergencyPhone ? 'Phone ' + escapeHtml(clinic.emergencyPhone) + '<br/>' : ''}
                                ${clinic.adminEmail ? escapeHtml(clinic.adminEmail) + '<br/>' : ''}
                                ${taxEnabled && tax?.taxId ? escapeHtml(tax.label) + ' ' + escapeHtml(tax.taxId) : ''}
                            </div>
                        </div>
                        <div>
                            <div class="doc-type">${escapeHtml(docTitle)}</div>
                            <div class="doc-no">${escapeHtml(transaction.invoiceNo || ('#' + transaction.id.slice(0, 8).toUpperCase()))}</div>
                            <div class="muted" style="text-align:right;">${new Date(transaction.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
                        </div>
                    </div>

                    <div class="meta">
                        <div>
                            <div class="label">Billed to</div>
                            <div class="value">${escapeHtml(patient?.name || 'Walk-in Patient')}</div>
                            <div class="muted">${escapeHtml(patient?.mobile || '')}</div>
                        </div>
                        <div style="text-align: right;">
                            <div class="label">Payment status</div>
                            <div class="value">${transaction.type === 'EARN' ? 'Paid' : 'Redeemed'}</div>
                        </div>
                    </div>

                    <table>
                        <thead>
                            <tr>
                                <th>Description</th>
                                <th>Category</th>
                                <th style="text-align: right;">Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>${escapeHtml(transaction.description)}</td>
                                <td>${escapeHtml(transaction.category)}</td>
                                <td style="text-align: right;">${money(subtotal)}</td>
                            </tr>
                        </tbody>
                    </table>

                    <div class="totals">
                        <div class="row"><span class="muted">Subtotal</span><span>${money(subtotal)}</span></div>
                        ${taxEnabled ? `<div class="row"><span class="muted">${escapeHtml(tax!.label)} (${rate}%)</span><span>${money(taxAmount)}</span></div>` : ''}
                        <div class="row grand"><span>Total</span><span>${money(total)}</span></div>
                    </div>

                    <div class="footer">
                        ${clinic.settings?.openingHours ? `<p>Open ${escapeHtml(clinic.settings.openingHours)}</p>` : ''}
                        <p>Thank you for choosing ${escapeHtml(clinic.name)}.</p>
                        <p>Issued via Retain Dental \u00b7 ${new Date().toLocaleString('en-IN')}</p>
                    </div>
                    <div class="printbar">
                        <button onclick="window.print()">Print / Save as PDF</button>
                    </div>
                </body>
                </html>
            `);
            receiptWindow.document.close();
        }
    };

    return (
        <div className="h-full flex flex-col p-8 space-y-8 animate-in fade-in duration-700">
            {/* Header Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: 'Total Revenue', value: stats.totalRevenue, icon: <DollarSign size={24} />, color: 'bg-emerald-50 text-emerald-600' },
                    { label: 'This Month', value: stats.monthlyRevenue, icon: <Calendar size={24} />, color: 'bg-teal-50 text-teal-600' },
                    { label: 'Today', value: stats.todayRevenue, icon: <TrendingUp size={24} />, color: 'bg-amber-50 text-amber-600' }
                ].map((stat, i) => (
                    <div key={i} className="glass-panel p-6 flex items-center justify-between border border-white/60 shadow-lg group">
                        <div>
                            <p className="text-xs font-bold text-ink-400 uppercase tracking-widest mb-1">{stat.label}</p>
                            <h3 className="text-4xl font-bold text-ink-800 tracking-tighter">₹{stat.value.toLocaleString()}</h3>
                        </div>
                        <div className={`h-16 w-16 rounded-2xl flex items-center justify-center ${stat.color} shadow-sm group-hover:scale-110 transition-transform`}>
                            {stat.icon}
                        </div>
                    </div>
                ))}
            </div>

            {/* Main Ledger Panel */}
            <div className="flex-1 glass-panel bg-white/60 border border-white/60 shadow-soft rounded-[22px] overflow-hidden flex flex-col">
                {/* Toolbar */}
                <div className="p-8 border-b border-ink-950/[0.07] flex justify-between items-center bg-white/40 backdrop-blur-md">
                    <div className="flex items-center gap-4">
                        <div className="h-12 w-12 bg-ink-950 text-white rounded-xl flex items-center justify-center shadow-lg">
                            <CreditCard size={24} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-ink-900 tracking-tight">Financial Ledger</h2>
                            <p className="text-xs text-ink-400 font-bold uppercase tracking-wider">{filteredTransactions.length} Records Found</p>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <div className="relative group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-400 group-focus-within:text-teal-500 transition-colors" size={18} />
                            <input
                                type="text"
                                placeholder="Search transactions..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-12 pr-6 py-3 bg-white border border-ink-950/10 rounded-xl outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/10 transition-all w-64 text-sm font-bold text-ink-700"
                            />
                        </div>
                        <select
                            className="px-6 py-3 bg-white border border-ink-950/10 rounded-xl outline-none font-bold text-sm text-ink-600 cursor-pointer hover:border-teal-500 transition-colors uppercase tracking-wide appearance-none"
                            value={filterCategory}
                            onChange={(e) => setFilterCategory(e.target.value)}
                        >
                            <option value="ALL">All Categories</option>
                            {Object.values(TransactionCategory).map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                        <button onClick={handleExportCSV} className="px-6 py-3 bg-ink-950 text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-black transition-all shadow-lg flex items-center gap-2 active:scale-95">
                            <Download size={16} /> Export
                        </button>
                    </div>
                </div>

                {/* Table */}
                <div className="flex-1 overflow-auto custom-scrollbar p-2">
                    <table className="w-full text-left border-collapse">
                        <thead className="sticky top-0 bg-white/90 backdrop-blur-xl z-10 shadow-sm">
                            <tr>
                                <th className="p-6 text-[10px] font-bold uppercase text-ink-400 tracking-widest">Transaction ID</th>
                                <th className="p-6 text-[10px] font-bold uppercase text-ink-400 tracking-widest">Details</th>
                                <th className="p-6 text-[10px] font-bold uppercase text-ink-400 tracking-widest text-right">Category</th>
                                <th className="p-6 text-[10px] font-bold uppercase text-ink-400 tracking-widest text-right">Amount</th>
                                <th className="p-6 text-[10px] font-bold uppercase text-ink-400 tracking-widest text-right">Date</th>
                                <th className="p-6 text-[10px] font-bold uppercase text-ink-400 tracking-widest text-center">Invoice</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredTransactions.map(tx => (
                                <tr key={tx.id} className="group hover:bg-teal-50/30 transition-colors">
                                    <td className="p-6 text-xs font-mono font-bold text-ink-400 select-all">{tx.invoiceNo || `#${tx.id.slice(0, 8)}`}</td>
                                    <td className="p-6">
                                        <div className="flex items-center gap-3">
                                            <div className={`h-8 w-8 rounded-full flex items-center justify-center ${tx.type === TransactionType.EARN ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
                                                {tx.type === TransactionType.EARN ? <ArrowDownLeft size={16} /> : <ArrowUpRight size={16} />}
                                            </div>
                                            <span className="font-bold text-sm text-ink-700">{tx.description}</span>
                                        </div>
                                    </td>
                                    <td className="p-6 text-right">
                                        <span className="px-3 py-1 bg-slate-100 text-ink-500 rounded-lg text-[10px] uppercase font-bold tracking-widest border border-ink-950/10">
                                            {tx.category}
                                        </span>
                                    </td>
                                    <td className="p-6 text-right">
                                        <span className={`text-lg font-bold tracking-tight ${tx.type === TransactionType.EARN ? 'text-ink-900' : 'text-rose-500'}`}>
                                            {tx.type === TransactionType.REDEEM && '-'}₹{tx.amountPaid.toLocaleString()}
                                        </span>
                                    </td>
                                    <td className="p-6 text-right text-xs font-bold text-ink-500">
                                        {new Date(tx.date).toLocaleDateString()} <span className="text-ink-300 mx-1">|</span> {new Date(tx.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </td>
                                    <td className="p-6 text-center">
                                        <button onClick={() => handlePrintReceipt(tx)} title="View / print invoice" aria-label="View invoice" className="p-2 hover:bg-slate-100 rounded-lg text-ink-400 hover:text-ink-900 transition-colors">
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
                                <Search size={48} className="text-ink-300" />
                            </div>
                            <p className="text-xl font-bold text-ink-300">No transactions match your query</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FinancialLedger;
