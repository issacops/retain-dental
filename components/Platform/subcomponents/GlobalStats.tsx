import React from 'react';
import { Building2, Users, TrendingUp, DollarSign } from 'lucide-react';

interface Props {
    stats: {
        totalClinics: number;
        totalPatients: number;
        totalSystemRevenue: number;
        mrr: number;
    };
    formatCurrency: (val: number) => string;
}

const GlobalStats: React.FC<Props> = ({ stats, formatCurrency }) => (
    <div className="grid grid-cols-4 gap-6">
        {[
            { label: 'Network Nodes', val: stats.totalClinics, icon: <Building2 />, color: 'text-indigo-400', suffix: 'Active' },
            { label: 'Total Patients', val: stats.totalPatients.toLocaleString(), icon: <Users />, color: 'text-blue-400', suffix: 'Identities' },
            { label: 'Gross GTV', val: formatCurrency(stats.totalSystemRevenue), icon: <TrendingUp />, color: 'text-emerald-400', suffix: '+12% m/m' },
            { label: 'Platform MRR', val: formatCurrency(stats.mrr), icon: <DollarSign />, color: 'text-amber-400', suffix: 'Recurring' },
        ].map((s, idx) => (
            <div key={idx} className="bg-white/[0.03] border border-white/5 p-8 rounded-[40px] hover:bg-white/[0.05] transition-all group">
                <div className={`p-4 w-fit rounded-2xl bg-white/5 ${s.color} mb-6 transition-transform group-hover:scale-110 group-hover:bg-white/10`}>{s.icon}</div>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-1">{s.label}</p>
                <h3 className="text-3xl font-black text-white">{s.val}</h3>
                <p className="text-[10px] font-bold text-slate-600 mt-2 uppercase">{s.suffix}</p>
            </div>
        ))}
    </div>
);

export default GlobalStats;
