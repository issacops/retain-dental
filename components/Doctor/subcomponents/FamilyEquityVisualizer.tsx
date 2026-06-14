import React from 'react';
import { Users } from 'lucide-react';
import { User, FamilyGroup } from '../../../types';

interface Props {
    patient: User;
    allUsers: User[];
    familyGroups: FamilyGroup[];
    primaryColor: string;
}

const FamilyEquityVisualizer: React.FC<Props> = ({ patient, allUsers, familyGroups, primaryColor }) => {
    const family = familyGroups.find(f => f.id === patient.familyGroupId);
    if (!family) return null;

    const members = allUsers.filter(u => u.familyGroupId === family.id);

    return (
        <div className="p-8 bg-dark-900 rounded-[40px] text-white space-y-8 relative overflow-hidden glass-panel border-0">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 blur-[50px] rounded-full"></div>
            <div className="flex justify-between items-center relative z-10">
                <div>
                    <h4 className="text-xl font-black tracking-tight">{family.familyName}</h4>
                    <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest mt-1">Shared Household Equity</p>
                </div>
                <Users size={24} className="text-slate-600" />
            </div>
            <div className="flex flex-wrap gap-4 relative z-10">
                {members.map(m => (
                    <div key={m.id} className={`flex items-center gap-3 px-5 py-3 rounded-2xl border transition-all ${m.id === patient.id ? 'bg-white text-black border-white' : 'bg-white/5 border-white/10'}`}>
                        <div className={`h-2 w-2 rounded-full ${m.role === 'ADMIN' ? 'bg-amber-400' : 'bg-emerald-400'}`}></div>
                        <span className="text-xs font-bold uppercase tracking-tight">{m.name.split(' ')[0]}</span>
                    </div>
                ))}
            </div>
            <div className="pt-6 border-t border-white/10 relative z-10">
                <div className="flex justify-between items-end">
                    <div>
                        <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Total Pool Strength</p>
                        <h5 className="text-3xl font-black">₹{members.reduce((a, b) => a + b.lifetimeSpend, 0).toLocaleString()}</h5>
                    </div>
                    <div className="text-right">
                        <span className="text-[9px] font-black uppercase bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-full border border-emerald-500/20">Sync Active</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FamilyEquityVisualizer;
