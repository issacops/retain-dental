import React from 'react';
import { Search, Plus, ChevronRight } from 'lucide-react';
import { User, Clinic } from '../../../types';
import { Avatar, Pill, Empty, cn } from '../ui/primitives';

interface Props {
  clinic: Clinic;
  users: User[];
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedPatient: User | null;
  setSelectedPatient: (u: User) => void;
  onAddPatient: () => void;
}

const TIER_TONE: Record<string, 'leaf' | 'sun' | 'mist'> = { PLATINUM: 'leaf', GOLD: 'sun', MEMBER: 'mist' };

const PatientList: React.FC<Props> = ({ clinic, users, searchQuery, setSearchQuery, selectedPatient, setSelectedPatient, onAddPatient }) => (
  <div className="flex w-[300px] shrink-0 flex-col border-r border-ink-950/5 bg-white">
    <div className="flex items-center justify-between p-5">
      <div>
        <h2 className="font-display text-lg font-bold tracking-tight text-ink-900">Patients</h2>
        <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-500">{users.length} records</p>
      </div>
      <button
        onClick={onAddPatient}
        title="Add patient"
        className="flex h-9 w-9 items-center justify-center rounded-full bg-ink-950 text-cream-50 transition-colors hover:bg-ink-800"
      >
        <Plus size={16} />
      </button>
    </div>

    <div className="px-5 pb-4">
      <div className="relative">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" />
        <input
          type="text"
          placeholder="Search patients"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-full border border-ink-950/10 bg-cream-50 py-2.5 pl-9 pr-4 text-xs font-semibold text-ink-900 outline-none transition-colors placeholder:text-ink-400 focus:border-ink-950/30"
        />
      </div>
    </div>

    <div className="flex-1 space-y-1 overflow-y-auto px-3 pb-4 custom-scrollbar">
      {users.length === 0 ? (
        <Empty title="No patients found" hint="Try another name or add a patient." />
      ) : (
        users.map((u) => {
          const active = selectedPatient?.id === u.id;
          return (
            <button
              key={u.id}
              onClick={() => setSelectedPatient(u)}
              className={cn(
                'flex w-full items-center gap-3 rounded-[16px] px-3 py-2.5 text-left transition-colors',
                active ? 'bg-ink-950 text-cream-50' : 'hover:bg-cream-100',
              )}
            >
              <Avatar name={u.name} tone={active ? 'dark' : 'neutral'} className={active ? 'border-white/20' : ''} />
              <div className="min-w-0 flex-1">
                <p className={cn('truncate text-sm font-semibold', active ? 'text-cream-50' : 'text-ink-900')}>{u.name}</p>
                <p className={cn('truncate font-mono text-[10px] uppercase tracking-[0.12em]', active ? 'text-cream-50/50' : 'text-ink-500')}>
                  {u.mobile}
                </p>
              </div>
              {!active && <Pill tone={TIER_TONE[u.currentTier] || 'neutral'}>{u.currentTier.toLowerCase()}</Pill>}
              <ChevronRight size={14} className={active ? 'text-cream-50/50' : 'text-ink-300'} />
            </button>
          );
        })
      )}
    </div>
  </div>
);

export default React.memo(PatientList);
