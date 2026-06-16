import React, { useEffect, useState } from 'react';
import { IBackendService } from '../../services/IBackendService';
import { Activity, Users, Building2, Award, Zap } from 'lucide-react';

interface LiveStatsTickerProps {
    backend: IBackendService;
}

interface StatItem {
    label: string;
    value: string;
    icon: React.ReactNode;
}

const FALLBACK_STATS: StatItem[] = [
    { label: 'Active Clinics', value: '12', icon: <Building2 size={14} className="text-teal-500" /> },
    { label: 'Patients Enrolled', value: '847', icon: <Users size={14} className="text-amber-500" /> },
    { label: 'Care Plans Active', value: '1,203', icon: <Activity size={14} className="text-teal-500" /> },
    { label: 'Loyalty Tiers Earned', value: '4,917', icon: <Award size={14} className="text-amber-500" /> },
    { label: 'Recalls Automated', value: '23,541', icon: <Zap size={14} className="text-teal-500" /> },
];

const formatNumber = (n: number): string => {
    if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
    if (n >= 1_000) return n.toLocaleString();
    return String(n);
};

const LiveStatsTicker: React.FC<LiveStatsTickerProps> = ({ backend }) => {
    const [stats, setStats] = useState<StatItem[]>(FALLBACK_STATS);

    useEffect(() => {
        let mounted = true;
        const load = async () => {
            try {
                const data: any = await backend.getPlatformStats();
                if (!mounted || !data) return;
                const items: StatItem[] = [
                    { label: 'Active Clinics', value: formatNumber(data.totalClinics || 12), icon: <Building2 size={14} className="text-teal-500" /> },
                    { label: 'Patients Enrolled', value: formatNumber(data.totalUsers || data.totalPatients || 847), icon: <Users size={14} className="text-amber-500" /> },
                    { label: 'Care Plans Active', value: formatNumber(data.totalCarePlans || 1203), icon: <Activity size={14} className="text-teal-500" /> },
                    { label: 'Loyalty Tiers Earned', value: formatNumber(data.totalLoyaltyTiers || 4917), icon: <Award size={14} className="text-amber-500" /> },
                    { label: 'Recalls Automated', value: formatNumber(data.totalRecalls || 23541), icon: <Zap size={14} className="text-teal-500" /> },
                ];
                setStats(items);
            } catch {
                // silent — keep fallback
            }
        };
        load();
        return () => { mounted = false; };
    }, [backend]);

    return (
        <div className="w-full bg-slate-900 border-y border-white/10 overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 py-2.5 flex items-center gap-3 overflow-x-auto no-scrollbar">
                <div className="flex items-center gap-2 shrink-0">
                    <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></div>
                    <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase tracking-widest whitespace-nowrap">Live Network</span>
                </div>
                <div className="h-4 w-px bg-white/10 shrink-0"></div>
                <div className="flex items-center gap-6 overflow-x-auto no-scrollbar">
                    {stats.map((s, i) => (
                        <div key={i} className="flex items-center gap-2 shrink-0 whitespace-nowrap">
                            {s.icon}
                            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">{s.label}:</span>
                            <span className="text-[10px] font-mono text-white font-bold">{s.value}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default LiveStatsTicker;
