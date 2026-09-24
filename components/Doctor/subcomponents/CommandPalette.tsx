import React, { useState, useEffect, useRef } from 'react';
import { Search, User, CreditCard, Calendar, LayoutGrid, TrendingUp, Users, Settings, Sparkles, QrCode, UserPlus, MessageSquare } from 'lucide-react';
import { User as UserModel } from '../../../types';

interface CommandPaletteProps {
    patients: UserModel[];
    onSelectPatient: (patient: UserModel) => void;
    onNavigate: (section: string) => void;
    onQuickAction: (action: string) => void;
}

interface NavItem { id: string; label: string; icon: React.ReactNode; section: string; }
interface ActionItem { id: string; label: string; icon: React.ReactNode; }

const NAV_ITEMS: NavItem[] = [
    { id: 'Today', label: 'Go to Today', icon: <LayoutGrid size={15} />, section: 'Today' },
    { id: 'Schedule', label: 'Go to Schedule', icon: <Calendar size={15} />, section: 'Schedule' },
    { id: 'Patients', label: 'Go to Patients', icon: <Users size={15} />, section: 'Patients' },
    { id: 'Messages', label: 'Go to Messages', icon: <MessageSquare size={15} />, section: 'Messages' },
    { id: 'Retention', label: 'Go to Retention', icon: <TrendingUp size={15} />, section: 'Retention' },
    { id: 'Payments', label: 'Go to Payments', icon: <CreditCard size={15} />, section: 'Payments' },
    { id: 'Settings', label: 'Go to Settings', icon: <Settings size={15} />, section: 'Settings' },
];

const ACTIONS: ActionItem[] = [
    { id: 'add-patient', label: 'Add a patient', icon: <UserPlus size={15} /> },
    { id: 'social', label: 'Open Social Studio', icon: <Sparkles size={15} /> },
    { id: 'qr', label: 'Show check-in QR', icon: <QrCode size={15} /> },
];

const CommandPalette: React.FC<CommandPaletteProps> = ({ patients, onSelectPatient, onNavigate, onQuickAction }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState('');
    const [selectedIndex, setSelectedIndex] = useState(0);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
                e.preventDefault();
                setIsOpen((view) => !view);
                setQuery('');
                setSelectedIndex(0);
            }
            if (e.key === 'Escape') setIsOpen(false);
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    useEffect(() => {
        if (isOpen && inputRef.current) setTimeout(() => inputRef.current?.focus(), 50);
    }, [isOpen]);

    if (!isOpen) return null;

    const q = query.trim().toLowerCase();
    const filteredPatients = q
        ? patients.filter((p) => p.name.toLowerCase().includes(q) || (p.mobile || '').includes(q)).slice(0, 6)
        : patients.slice(0, 5);
    const filteredNav = NAV_ITEMS.filter((n) => !q || n.label.toLowerCase().includes(q) || n.section.toLowerCase().includes(q));
    const filteredActions = ACTIONS.filter((a) => !q || a.label.toLowerCase().includes(q));

    type Row =
        | { kind: 'patient'; key: string; patient: UserModel }
        | { kind: 'nav'; key: string; nav: NavItem }
        | { kind: 'action'; key: string; action: ActionItem };

    const rows: Row[] = [
        ...filteredPatients.map((p) => ({ kind: 'patient' as const, key: `p-${p.id}`, patient: p })),
        ...filteredNav.map((n) => ({ kind: 'nav' as const, key: `n-${n.id}`, nav: n })),
        ...filteredActions.map((a) => ({ kind: 'action' as const, key: `a-${a.id}`, action: a })),
    ];

    const safeIndex = rows.length ? Math.min(selectedIndex, rows.length - 1) : 0;

    const run = (row: Row) => {
        if (row.kind === 'patient') onSelectPatient(row.patient);
        else if (row.kind === 'nav') onNavigate(row.nav.section);
        else onQuickAction(row.action.id);
        setIsOpen(false);
        setQuery('');
    };

    const handleModalKeyDown = (e: React.KeyboardEvent) => {
        if (!rows.length) return;
        if (e.key === 'ArrowDown') { e.preventDefault(); setSelectedIndex((prev) => (prev + 1) % rows.length); }
        else if (e.key === 'ArrowUp') { e.preventDefault(); setSelectedIndex((prev) => (prev - 1 + rows.length) % rows.length); }
        else if (e.key === 'Enter') { e.preventDefault(); run(rows[safeIndex]); }
    };

    const RowShell: React.FC<{ active: boolean; onHover: () => void; onClick: () => void; icon: React.ReactNode; title: string; sub?: string; tag: string }> = ({ active, onHover, onClick, icon, title, sub, tag }) => (
        <div
            onMouseEnter={onHover}
            onClick={onClick}
            className={`flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 transition-colors ${active ? 'bg-primary/10 text-ink-900' : 'text-ink-600 hover:bg-cream-100'}`}
        >
            <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${active ? 'bg-primary/20 text-primary' : 'bg-ink-950/5 text-ink-400'}`}>{icon}</span>
            <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-bold tracking-tight text-ink-800">{title}</span>
                {sub && <span className="block truncate font-mono text-[10px] text-ink-400">{sub}</span>}
            </span>
            {active && <span className="shrink-0 font-mono text-[10px] font-bold uppercase tracking-widest text-primary">{tag}</span>}
        </div>
    );

    return (
        <div className="fixed inset-0 z-[200] flex items-start justify-center bg-ink-950/50 p-4 pt-28 backdrop-blur-md" onClick={() => setIsOpen(false)}>
            <div
                className="w-full max-w-xl overflow-hidden rounded-[20px] border border-ink-950/[0.07] bg-white shadow-lift"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center gap-3 border-b border-ink-950/[0.07] bg-cream-100/60 px-5 py-4">
                    <Search className="text-ink-400" size={20} />
                    <input
                        ref={inputRef}
                        type="text"
                        value={query}
                        onChange={(e) => { setQuery(e.target.value); setSelectedIndex(0); }}
                        onKeyDown={handleModalKeyDown}
                        placeholder="Search patients, jump to a page, or run an action"
                        className="flex-1 bg-transparent text-base font-bold text-ink-800 outline-none placeholder:font-medium placeholder:text-ink-300"
                    />
                    <kbd className="rounded-md bg-white px-2 py-1 font-mono text-[10px] font-bold uppercase tracking-widest text-ink-400 ring-1 ring-ink-950/10">Esc</kbd>
                </div>

                <div className="custom-scrollbar max-h-[380px] overflow-y-auto p-2">
                    {rows.length === 0 ? (
                        <div className="p-10 text-center text-sm font-bold text-ink-400">No matching items found.</div>
                    ) : (
                        <>
                            {filteredPatients.length > 0 && (
                                <div className="mb-2">
                                    <div className="px-3 py-2 font-mono text-[10px] font-bold uppercase tracking-widest text-ink-400">Patients</div>
                                    {filteredPatients.map((p) => {
                                        const idx = rows.findIndex((r) => r.kind === 'patient' && r.patient.id === p.id);
                                        return (
                                            <RowShell
                                                key={p.id}
                                                active={safeIndex === idx}
                                                onHover={() => setSelectedIndex(idx)}
                                                onClick={() => run({ kind: 'patient', key: `p-${p.id}`, patient: p })}
                                                icon={<User size={14} />}
                                                title={p.name}
                                                sub={p.mobile}
                                                tag="Open"
                                            />
                                        );
                                    })}
                                </div>
                            )}

                            {filteredNav.length > 0 && (
                                <div className="mb-2">
                                    <div className="px-3 py-2 font-mono text-[10px] font-bold uppercase tracking-widest text-ink-400">Go to</div>
                                    {filteredNav.map((n) => {
                                        const idx = rows.findIndex((r) => r.kind === 'nav' && r.nav.id === n.id);
                                        return (
                                            <RowShell
                                                key={n.id}
                                                active={safeIndex === idx}
                                                onHover={() => setSelectedIndex(idx)}
                                                onClick={() => run({ kind: 'nav', key: `n-${n.id}`, nav: n })}
                                                icon={n.icon}
                                                title={n.label}
                                                tag="Go"
                                            />
                                        );
                                    })}
                                </div>
                            )}

                            {filteredActions.length > 0 && (
                                <div>
                                    <div className="px-3 py-2 font-mono text-[10px] font-bold uppercase tracking-widest text-ink-400">Actions</div>
                                    {filteredActions.map((a) => {
                                        const idx = rows.findIndex((r) => r.kind === 'action' && r.action.id === a.id);
                                        return (
                                            <RowShell
                                                key={a.id}
                                                active={safeIndex === idx}
                                                onHover={() => setSelectedIndex(idx)}
                                                onClick={() => run({ kind: 'action', key: `a-${a.id}`, action: a })}
                                                icon={a.icon}
                                                title={a.label}
                                                tag="Run"
                                            />
                                        );
                                    })}
                                </div>
                            )}
                        </>
                    )}
                </div>

                <div className="flex items-center justify-between border-t border-ink-950/[0.07] bg-cream-100 px-5 py-2.5 font-mono text-[10px] font-bold uppercase tracking-widest text-ink-400">
                    <span className="flex items-center gap-2"><Sparkles size={12} className="text-primary" /> Quick actions &amp; navigation</span>
                    <span className="flex items-center gap-1.5">
                        <kbd className="rounded bg-white px-1.5 py-0.5 ring-1 ring-ink-950/10">↑</kbd>
                        <kbd className="rounded bg-white px-1.5 py-0.5 ring-1 ring-ink-950/10">↓</kbd>
                        <span>to navigate</span>
                    </span>
                </div>
            </div>
        </div>
    );
};

export default CommandPalette;
