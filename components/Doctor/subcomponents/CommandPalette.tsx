import React, { useState, useEffect, useRef } from 'react';
import { Search, User, Grid, Zap, X, CreditCard, Calendar } from 'lucide-react';
import { User as UserModel } from '../../../types';

interface CommandPaletteProps {
    patients: UserModel[];
    onSelectPatient: (patient: UserModel) => void;
    onNavigate: (section: string) => void;
    onQuickAction: (action: string) => void;
}

const CommandPalette: React.FC<CommandPaletteProps> = ({ patients, onSelectPatient, onNavigate, onQuickAction }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState('');
    const [selectedIndex, setSelectedIndex] = useState(0);
    const inputRef = useRef<HTMLInputElement>(null);

    // Global keyboard listener for Cmd+K / Ctrl+K
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                setIsOpen(view => !view);
                setQuery('');
            }
            if (e.key === 'Escape') {
                setIsOpen(false);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    // Focus input when modal opens
    useEffect(() => {
        if (isOpen && inputRef.current) {
            setTimeout(() => inputRef.current?.focus(), 50);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    // Filter logic
    const filteredPatients = patients.filter(p => p.name.toLowerCase().includes(query.toLowerCase()) || p.mobile.includes(query));

    // Quick Actions
    const quickActions = [
        { id: 'ADD_PATIENT', label: 'Add New Patient', icon: <User size={14} />, type: 'ACTION' },
        { id: 'NEW_APPT', label: 'Schedule Appointment', icon: <Calendar size={14} />, type: 'ACTION' },
        { id: 'NAV_HUB', label: 'Go to Operational Hub', icon: <Grid size={14} />, type: 'NAV', section: 'Operational Hub' },
        { id: 'NAV_FINANCE', label: 'Go to Financial Ledger', icon: <CreditCard size={14} />, type: 'NAV', section: 'Financial Ledger' },
        { id: 'NAV_SETTINGS', label: 'Go to Settings', icon: <Zap size={14} />, type: 'NAV', section: 'Settings' },
    ].filter(a => a.label.toLowerCase().includes(query.toLowerCase()));

    // Total items for arrow navigation
    const allItems = [
        ...filteredPatients.map(p => ({ ...p, _type: 'PATIENT' })),
        ...quickActions.map(a => ({ ...a, _type: 'GLOBAL' }))
    ];

    // Handle keyboard navigation inside the modal
    const handleModalKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setSelectedIndex(prev => (prev + 1) % allItems.length);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setSelectedIndex(prev => (prev - 1 + allItems.length) % allItems.length);
        } else if (e.key === 'Enter') {
            e.preventDefault();
            if (allItems.length > 0) {
                const item = allItems[selectedIndex];
                executeItem(item);
            }
        }
    };

    const executeItem = (item: any) => {
        if (item._type === 'PATIENT') {
            onSelectPatient(item as UserModel);
            onNavigate('Patient Records');
        } else if (item._type === 'GLOBAL') {
            if (item.type === 'NAV') {
                onNavigate(item.section);
            } else if (item.type === 'ACTION') {
                onQuickAction(item.id);
            }
        }
        setIsOpen(false);
    };

    return (
        <div className="fixed inset-0 z-[200] flex items-start justify-center pt-32 bg-slate-900/60 backdrop-blur-md p-4 animate-in fade-in duration-200" onClick={() => setIsOpen(false)}>
            <div
                className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 border border-slate-100"
                onClick={e => e.stopPropagation()}
            >
                {/* Search Header */}
                <div className="flex items-center gap-4 px-6 py-4 border-b border-slate-100 bg-slate-50/50">
                    <Search className="text-slate-400" size={24} />
                    <input
                        ref={inputRef}
                        type="text"
                        value={query}
                        onChange={(e) => {
                            setQuery(e.target.value);
                            setSelectedIndex(0); // Reset selection
                        }}
                        onKeyDown={handleModalKeyDown}
                        placeholder="Search patients, leap to pages, or execute actions..."
                        className="flex-1 bg-transparent text-xl font-bold text-slate-800 outline-none placeholder:text-slate-300 placeholder:font-medium"
                    />
                    <div className="flex items-center gap-1 text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-100 px-2 py-1 rounded-md">
                        <span>ESC</span> to close
                    </div>
                </div>

                {/* Results List */}
                <div className="max-h-[400px] overflow-y-auto custom-scrollbar p-2">
                    {allItems.length === 0 ? (
                        <div className="p-12 text-center text-slate-400 font-bold">
                            No matching items found.
                        </div>
                    ) : (
                        <>
                            {filteredPatients.length > 0 && (
                                <div className="mb-4">
                                    <div className="px-4 py-2 text-[10px] font-black uppercase tracking-widest text-slate-400">Patients</div>
                                    {filteredPatients.map((p, idx) => {
                                        const globalIdx = idx;
                                        const isSelected = selectedIndex === globalIdx;
                                        return (
                                            <div
                                                key={p.id}
                                                onMouseEnter={() => setSelectedIndex(globalIdx)}
                                                onClick={() => executeItem({ ...p, _type: 'PATIENT' })}
                                                className={`flex items-center gap-4 px-4 py-3 rounded-xl cursor-pointer transition-colors ${isSelected ? 'bg-teal-50 text-teal-900' : 'hover:bg-slate-50 text-slate-700'}`}
                                            >
                                                <div className={`h-8 w-8 rounded-full flex items-center justify-center font-black text-xs ${isSelected ? 'bg-teal-200' : 'bg-slate-100'}`}>
                                                    <User size={14} />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-sm tracking-tight">{p.name}</p>
                                                    <p className="text-[10px] font-bold opacity-60 font-mono">{p.mobile}</p>
                                                </div>
                                                {isSelected && <span className="ml-auto text-[10px] tracking-widest uppercase font-black text-teal-400">Jump</span>}
                                            </div>
                                        )
                                    })}
                                </div>
                            )}

                            {quickActions.length > 0 && (
                                <div>
                                    <div className="px-4 py-2 text-[10px] font-black uppercase tracking-widest text-slate-400">Global Actions</div>
                                    {quickActions.map((a, idx) => {
                                        const globalIdx = filteredPatients.length + idx;
                                        const isSelected = selectedIndex === globalIdx;
                                        return (
                                            <div
                                                key={a.id}
                                                onMouseEnter={() => setSelectedIndex(globalIdx)}
                                                onClick={() => executeItem({ ...a, _type: 'GLOBAL' })}
                                                className={`flex items-center gap-4 px-4 py-3 rounded-xl cursor-pointer transition-colors ${isSelected ? 'bg-emerald-50 text-emerald-900' : 'hover:bg-slate-50 text-slate-700'}`}
                                            >
                                                <div className={`h-8 w-8 rounded-full flex items-center justify-center font-black text-xs ${isSelected ? 'bg-emerald-200' : 'bg-slate-100'}`}>
                                                    {a.icon}
                                                </div>
                                                <p className="font-bold text-sm tracking-tight flex-1">{a.label}</p>
                                                {isSelected && <span className="text-[10px] tracking-widest uppercase font-black text-emerald-400">Execute</span>}
                                            </div>
                                        )
                                    })}
                                </div>
                            )}
                        </>
                    )}
                </div>

                {/* Footer status */}
                <div className="bg-slate-50 px-6 py-3 border-t border-slate-100 flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    <span className="flex items-center gap-2"><Zap size={12} className="text-amber-500" /> Premium CMS Command Deck</span>
                    <span className="flex items-center gap-2">Use <kbd className="bg-slate-200 px-1 py-0.5 rounded text-slate-500">↑</kbd> <kbd className="bg-slate-200 px-1 py-0.5 rounded text-slate-500">↓</kbd> to navigate</span>
                </div>
            </div>
        </div>
    );
};

export default CommandPalette;
