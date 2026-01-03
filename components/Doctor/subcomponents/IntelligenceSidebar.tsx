import React from 'react';
import { Sparkles, Activity, Zap, ShieldCheck, Box } from 'lucide-react';
import { User, Wallet, CarePlan } from '../../../types';

interface Props {
    patient: User;
    wallet: Wallet | undefined;
    carePlan: CarePlan | undefined;
}

const IntelligenceSidebar: React.FC<Props> = ({ patient, wallet, carePlan }) => (
    <div className="w-80 border-l border-white/20 bg-white/40 backdrop-blur-xl p-8 space-y-8 animate-in slide-in-from-right-4 duration-500 overflow-y-auto custom-scrollbar">
        <div className="flex items-center justify-between">
            <h4 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Intelligence</h4>
            <Sparkles size={16} className="text-amber-400" />
        </div>

        {/* Live Compliance Monitor */}
        {carePlan && (
            <div className="space-y-4">
                <div className="p-6 rounded-[32px] bg-dark-900 text-white space-y-4 relative overflow-hidden group shadow-xl">
                    <div className="flex items-center justify-between relative z-10">
                        <div>
                            <p className="text-[8px] font-black uppercase text-slate-500 tracking-widest">Live Aftercare</p>
                            <h5 className="font-bold text-sm tracking-tight">{carePlan.treatmentName}</h5>
                        </div>
                        <Activity size={16} className="text-emerald-400 animate-pulse" />
                    </div>

                    <div className="space-y-2 relative z-10">
                        {carePlan.checklist?.slice(0, 3).map((item) => (
                            <div key={item.id} className="flex items-center gap-2">
                                <div className={`h-1.5 w-1.5 rounded-full ${item.completed ? 'bg-emerald-500' : 'bg-slate-700'}`}></div>
                                <p className={`text-[10px] truncate ${item.completed ? 'text-slate-300' : 'text-slate-500'}`}>{item.task}</p>
                            </div>
                        ))}
                    </div>

                    <div className="pt-2 border-t border-white/5 flex justify-between items-center relative z-10">
                        <span className="text-[9px] font-black text-slate-500 uppercase">Sync Status</span>
                        <span className="text-[9px] font-black text-emerald-400 uppercase">100% Verified</span>
                    </div>
                </div>
            </div>
        )}

        <div className="space-y-4">
            <div className="glass-card p-6 rounded-[32px] bg-indigo-50/50 border border-indigo-100/50 space-y-4 group">
                <div className="flex items-center gap-3">
                    <Zap size={18} className="text-indigo-600" />
                    <p className="text-[10px] font-black uppercase text-indigo-900">Next Best Action</p>
                </div>
                <p className="text-xs font-bold text-indigo-900 leading-relaxed">
                    {patient.currentTier === 'MEMBER'
                        ? "Subject is ₹10,000 away from GOLD level. Propose Hygiene bundle to unlock 5% yield."
                        : "High Loyalty Surplus. Trigger a 30% credit-burn offer for Cosmetic Enhancements."}
                </p>
                <button className="w-full py-3 bg-white rounded-2xl text-[10px] font-black text-indigo-600 uppercase tracking-widest shadow-sm group-hover:shadow-md transition-all">Project Quote</button>
            </div>

            <div className="glass-card p-6 rounded-[32px] bg-emerald-50/50 border border-emerald-100/50 space-y-4">
                <div className="flex items-center gap-3">
                    <ShieldCheck size={18} className="text-emerald-600" />
                    <p className="text-[10px] font-black uppercase text-emerald-900">Health Compliance</p>
                </div>
                <div className="flex items-end justify-between">
                    <h5 className="text-3xl font-black text-emerald-900">{carePlan ? '94%' : 'N/A'}</h5>
                    <span className="text-[9px] font-bold text-emerald-600 uppercase tracking-widest">Bio-Metric Lock</span>
                </div>
            </div>
        </div>

        <div className="space-y-4 pt-4 border-t border-slate-200/50">
            <h5 className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Inventory Ledger</h5>
            <div className="glass-card p-5 rounded-[24px] border border-white/50 flex items-center gap-4 group hover:bg-white transition-all cursor-help">
                <Box size={20} className="text-slate-400 group-hover:text-indigo-500 transition-colors" />
                <div>
                    <p className="text-xs font-bold text-slate-800">Aligner Shipped</p>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">In Transit // Node Mumbai</p>
                </div>
            </div>
        </div>
    </div>
);

export default IntelligenceSidebar;
