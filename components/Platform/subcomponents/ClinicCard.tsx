import React from 'react';
import { Monitor, Terminal } from 'lucide-react';

interface ClinicMetric {
    id: string;
    name: string;
    revenue: number;
    patients: number;
    rpp: number;
    tier: string;
    color: string;
    logo?: string;
    createdAt: string;
    slug: string;
}

interface Props {
    clinic: ClinicMetric;
    onEnterClinic: (id: string) => void;
    onSelectForManifest: (clinic: ClinicMetric) => void;
    formatCurrency: (val: number) => string;
}

const ClinicCard: React.FC<Props> = ({ clinic, onEnterClinic, onSelectForManifest, formatCurrency }) => (
    <div className="bg-[#0a0c10] border border-white/5 p-8 rounded-[40px] group relative overflow-hidden transition-all hover:border-indigo-500/30 hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)]">
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 blur-[50px] rounded-full group-hover:bg-indigo-500/10 transition-all"></div>
        <div className="flex justify-between items-start mb-8 relative z-10">
            <div className="flex items-center gap-5">
                <div className="h-16 w-16 rounded-[24px] flex items-center justify-center font-black text-2xl text-white shadow-xl transition-transform group-hover:scale-110" style={{ backgroundColor: clinic.color }}>
                    {clinic.logo ? <img src={clinic.logo} className="w-full h-full object-cover rounded-[24px]" alt={clinic.name} /> : clinic.name.charAt(0)}
                </div>
                <div>
                    <h5 className="text-xl font-black text-white leading-none tracking-tight">{clinic.name}</h5>
                    <div className="flex items-center gap-2 mt-2">
                        <span className="text-[9px] font-black uppercase text-slate-500 px-2 py-0.5 border border-white/10 rounded-full">{clinic.tier}</span>
                        <span className="h-1 w-1 rounded-full bg-emerald-500"></span>
                        <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">Active</span>
                    </div>
                </div>
            </div>
        </div>
        <div className="grid grid-cols-2 gap-4 pt-6 border-t border-white/5 relative z-10">
            <div>
                <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-1">Total Revenue</p>
                <p className="text-xl font-black text-white">{formatCurrency(clinic.revenue)}</p>
            </div>
            <div className="text-right">
                <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-1">Growth Index</p>
                <p className="text-xl font-black text-emerald-400">+{(clinic.revenue / 10000).toFixed(1)}%</p>
            </div>
        </div>
        <div className="mt-8 flex gap-3 relative z-10">
            <button onClick={() => onEnterClinic(clinic.id)} className="flex-1 py-4 bg-white/5 hover:bg-white text-slate-400 hover:text-black rounded-2xl font-black text-[10px] uppercase transition-all flex items-center justify-center gap-2">
                <Monitor size={14} /> Control Portal
            </button>
            <button onClick={() => onSelectForManifest(clinic)} className="p-4 bg-white/5 hover:bg-indigo-600 text-slate-400 hover:text-white rounded-2xl transition-all">
                <Terminal size={16} />
            </button>
        </div>
    </div>
);

export default ClinicCard;
