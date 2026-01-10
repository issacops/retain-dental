import React from 'react';
import { Search, Plus, ChevronRight } from 'lucide-react';
import { User, Clinic } from '../../../types';

interface Props {
    clinic: Clinic;
    users: User[];
    searchQuery: string;
    setSearchQuery: (q: string) => void;
    selectedPatient: User | null;
    setSelectedPatient: (u: User) => void;
    setIsAddPatientModalOpen: (open: boolean) => void;
}

const PatientList: React.FC<Props> = ({
    clinic, users, searchQuery, setSearchQuery, selectedPatient, setSelectedPatient, setIsAddPatientModalOpen
}) => {
    return (
        <div className="w-[320px] bg-white border-r border-slate-100 flex flex-col shrink-0 z-20 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
            <div className="p-6 border-b border-slate-50">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-black tracking-tight text-slate-800">Profiles</h2>
                    <button onClick={() => setIsAddPatientModalOpen(true)} className="h-10 w-10 bg-slate-900 text-white rounded-xl flex items-center justify-center transition-all hover:bg-black active:scale-95 shadow-lg shadow-slate-200/50">
                        <Plus size={18} />
                    </button>
                </div>
                <div className="relative group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-800 transition-colors" size={14} />
                    <input type="text" placeholder="Identity Search..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-9 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold placeholder:text-slate-400 focus:bg-white focus:border-slate-300 transition-all outline-none" />
                </div>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
                {users.map(user => (
                    <div key={user.id} onClick={() => setSelectedPatient(user)}
                        className={`p-4 rounded-2xl cursor-pointer transition-all border relative overflow-hidden group ${selectedPatient?.id === user.id ? 'bg-slate-900 border-slate-900 text-white shadow-xl scale-[1.02]' : 'bg-white border-transparent hover:bg-slate-50 hover:border-slate-100'}`}>
                        {selectedPatient?.id === user.id && <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 blur-[30px] rounded-full"></div>}
                        <div className="flex justify-between items-center relative z-10">
                            <div className="min-w-0 pr-4">
                                <h4 className="font-bold text-sm tracking-tight truncate">{user.name}</h4>
                                <p className={`text-[10px] uppercase font-bold tracking-widest mt-0.5 ${selectedPatient?.id === user.id ? 'text-slate-400' : 'text-slate-400'}`}>{user.currentTier} Identity</p>
                            </div>
                            <ChevronRight size={14} className={`shrink-0 ${selectedPatient?.id === user.id ? 'text-white' : 'text-slate-300'} transition-all group-hover:translate-x-1`} />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default React.memo(PatientList);
