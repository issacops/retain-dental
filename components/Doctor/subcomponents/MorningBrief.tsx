import React from 'react';
import { Zap, Users, Target } from 'lucide-react';
import { Clinic } from '../../../types';

interface Props {
    clinic: Clinic;
    stats: any;
}

const MorningBriefTicker: React.FC<Props> = ({ clinic, stats }) => (
    <div className="h-10 bg-slate-900 backdrop-blur-md border-b border-white/10 flex items-center px-8 gap-12 overflow-hidden whitespace-nowrap z-40 shadow-md">
        <div className="flex items-center gap-2">
            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
            <span className="text-[10px] font-mono text-white font-bold uppercase tracking-widest">System Online: {clinic.name}</span>
        </div>
        <div className="flex items-center gap-6">
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest flex items-center gap-2">
                <Zap size={12} className="text-amber-400" /> Today's GTV: <span className="text-white">₹{(stats?.totalRevenue || 0).toLocaleString()}</span>
            </span>
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest flex items-center gap-2">
                <Users size={12} className="text-indigo-400" /> Active Chair Time: <span className="text-white">84%</span>
            </span>
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest flex items-center gap-2">
                <Target size={12} className="text-rose-400" /> Redemption Rate: <span className="text-white">12.4%</span>
            </span>
        </div>
        <div className="flex-1 text-right">
            <span className="text-[9px] font-mono text-slate-600 uppercase">PRIME_OS v3.4.2 // MASTER_NODE_{clinic.id.toUpperCase()}</span>
        </div>
    </div>
);

export default MorningBriefTicker;
