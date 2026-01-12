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
    isCollapsed: boolean;
    onToggleCollapse: () => void;
}

const PatientList: React.FC<Props> = ({
    clinic, users, searchQuery, setSearchQuery, selectedPatient, setSelectedPatient, setIsAddPatientModalOpen, isCollapsed, onToggleCollapse
}) => {
    return (
        <div className={`bg-white border-r border-slate-100 flex flex-col shrink-0 z-20 shadow-[4px_0_24px_rgba(0,0,0,0.02)] transition-all duration-500 ease-in-out ${isCollapsed ? 'w-[88px]' : 'w-[320px]'}`}>
            <div className={`p-6 border-b border-slate-50 ${isCollapsed ? 'px-4' : ''}`}>
                <div className={`flex items-center mb-6 transition-all ${isCollapsed ? 'flex-col gap-4 justify-center' : 'justify-between'}`}>
                    <h2 className={`text-xl font-black tracking-tight text-slate-800 transition-opacity ${isCollapsed ? 'hidden opacity-0' : 'block opacity-100'}`}>Profiles</h2>

                    <div className="flex items-center gap-2">
                        {!isCollapsed && (
                            <button onClick={() => setIsAddPatientModalOpen(true)} className="h-8 w-8 rounded-full bg-slate-900 text-white flex items-center justify-center hover:bg-black transition-all shadow-md active:scale-95 group" title="Add New Patient">
                                <Plus size={16} className="group-hover:rotate-90 transition-transform" />
                            </button>
                        )}
                        {/* Toggle Button */}
                        <button onClick={onToggleCollapse} className={`h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 hover:bg-slate-200 transition-all ${isCollapsed ? 'rotate-180' : ''}`}>
                            <ChevronRight size={14} />
                        </button>
                    </div>
                </div>

                {!isCollapsed ? (
                    <div className="relative group animate-in fade-in">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-800 transition-colors" size={14} />
                        <input type="text" placeholder="Identity Search..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-9 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold placeholder:text-slate-400 focus:bg-white focus:border-slate-300 transition-all outline-none" />
                    </div>
                ) : (
                    <button onClick={() => setIsAddPatientModalOpen(true)} className="w-full h-12 bg-slate-900 text-white rounded-xl flex items-center justify-center transition-all hover:bg-black hover:scale-105 shadow-lg shadow-slate-200/50">
                        <Plus size={20} />
                    </button>
                )}
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
                {users.map(user => (
                    <div key={user.id} onClick={() => setSelectedPatient(user)}
                        className={`rounded-2xl cursor-pointer transition-all border relative overflow-hidden group hover:shadow-lg ${isCollapsed ? 'p-3 aspect-square flex items-center justify-center' : 'p-4'} ${selectedPatient?.id === user.id ? 'bg-slate-900 border-slate-900 text-white shadow-xl scale-[1.02]' : 'bg-white border-transparent hover:bg-slate-50 hover:border-slate-100'}`}>

                        {selectedPatient?.id === user.id && <div className="absolute top-0 right-0 w-full h-full bg-white/5 blur-[20px] rounded-full"></div>}

                        {!isCollapsed ? (
                            <div className="flex justify-between items-center relative z-10 animate-in fade-in">
                                <div className="min-w-0 pr-4">
                                    <h4 className="font-bold text-sm tracking-tight truncate">{user.name}</h4>
                                    <p className={`text-[10px] uppercase font-bold tracking-widest mt-0.5 ${selectedPatient?.id === user.id ? 'text-slate-400' : 'text-slate-400'}`}>{user.currentTier} Identity</p>
                                </div>
                                <ChevronRight size={14} className={`shrink-0 ${selectedPatient?.id === user.id ? 'text-white' : 'text-slate-300'} transition-all group-hover:translate-x-1`} />
                            </div>
                        ) : (
                            <div className="relative z-10 font-black text-lg">
                                {user.name.charAt(0)}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default React.memo(PatientList);
