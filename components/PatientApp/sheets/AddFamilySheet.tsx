import React, { useState } from 'react';
import { Users, Check, Link2, UserPlus } from 'lucide-react';
import { Clinic, User } from '../../../types';
import { cn } from '../../Doctor/ui/primitives';
import { haptic } from '../../../lib/haptics';
import { Sheet, SectionLabel, Button, Avatar } from '../ui';

interface Props {
  open: boolean;
  onClose: () => void;
  clinic: Clinic;
  currentUser: User;
  household: User[];
  onAddFamilyMember: (mainUserId: string, name: string, relationship: string, age: string) => Promise<any>;
  onLinkFamily: (headUserId: string, memberMobile: string) => Promise<any>;
}

const RELATIONS = ['Spouse', 'Child', 'Parent', 'Sibling', 'Other'];

const AddFamilySheet: React.FC<Props> = ({ open, onClose, clinic, currentUser, household, onAddFamilyMember, onLinkFamily }) => {
  const [mode, setMode] = useState<'NEW' | 'LINK'>('NEW');
  const [name, setName] = useState('');
  const [relation, setRelation] = useState('Spouse');
  const [age, setAge] = useState('');
  const [mobile, setMobile] = useState('');
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const reset = () => { setDone(null); setName(''); setAge(''); setMobile(''); setRelation('Spouse'); setError(null); setMode('NEW'); };

  const submit = async () => {
    setError(null);
    setBusy(true);
    try {
      const res = mode === 'NEW'
        ? await onAddFamilyMember(currentUser.id, name.trim(), relation, age.trim())
        : await onLinkFamily(currentUser.id, mobile.trim());
      if (res && res.success === false) {
        haptic('error');
        setError(res.message || 'Could not add this person.');
      } else {
        haptic('success');
        setDone(mode === 'NEW' ? name.trim() : mobile.trim());
      }
    } catch (e: any) {
      setError(e?.message || 'Something went wrong.');
    } finally {
      setBusy(false);
    }
  };

  const valid = mode === 'NEW' ? name.trim().length >= 2 : mobile.replace(/\D/g, '').length >= 6;

  return (
    <Sheet open={open} onClose={() => { onClose(); setTimeout(reset, 250); }} title="Family">
      {done ? (
        <div className="py-6 text-center">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full" style={{ backgroundColor: `${clinic.primaryColor}18`, color: clinic.primaryColor }}>
            <Check size={26} />
          </span>
          <p className="mt-4 font-display text-lg font-bold text-ink-900">Added to your family</p>
          <p className="mt-1 text-sm text-ink-500">You can switch to their profile from the Family card.</p>
          <Button accent={clinic.primaryColor} block className="mt-5" onClick={() => { onClose(); setTimeout(reset, 250); }}>Done</Button>
        </div>
      ) : (
        <div className="space-y-5">
          {household.length > 1 && (
            <div>
              <SectionLabel>Current family</SectionLabel>
              <div className="mt-2 flex flex-wrap gap-2">
                {household.map((m) => (
                  <div key={m.id} className="flex items-center gap-2 rounded-full border border-ink-950/[0.07] bg-white py-1.5 pl-1.5 pr-3">
                    <Avatar name={m.name} accent={m.id === currentUser.id ? clinic.primaryColor : '#A3A3A3'} size={26} />
                    <span className="text-xs font-semibold text-ink-700">{m.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-2 rounded-full bg-ink-950/[0.05] p-1">
            {([
              { key: 'NEW' as const, label: 'New', icon: <UserPlus size={14} /> },
              { key: 'LINK' as const, label: 'Link existing', icon: <Link2 size={14} /> },
            ]).map((m) => (
              <button key={m.key} onClick={() => setMode(m.key)}
                className={cn('flex flex-1 items-center justify-center gap-1.5 rounded-full py-2 text-xs font-bold transition-colors', mode === m.key ? 'bg-white text-ink-900 shadow-sm' : 'text-ink-500')}>
                {m.icon} {m.label}
              </button>
            ))}
          </div>

          {mode === 'NEW' ? (
            <div className="space-y-4">
              <div>
                <SectionLabel>Full name</SectionLabel>
                <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Anita Sharma"
                  className="mt-2 w-full rounded-2xl border border-ink-950/10 bg-white p-3.5 text-sm outline-none focus:border-ink-950/30" />
              </div>
              <div>
                <SectionLabel>Relationship</SectionLabel>
                <div className="mt-2 flex flex-wrap gap-2">
                  {RELATIONS.map((r) => (
                    <button key={r} onClick={() => setRelation(r)}
                      className={cn('rounded-full border px-3.5 py-2 text-xs font-bold transition-colors', relation === r ? 'border-transparent text-white' : 'border-ink-950/10 bg-white text-ink-600')}
                      style={relation === r ? { backgroundColor: clinic.primaryColor } : undefined}>{r}</button>
                  ))}
                </div>
              </div>
              <div>
                <SectionLabel>Age (optional)</SectionLabel>
                <input value={age} onChange={(e) => setAge(e.target.value.replace(/\D/g, ''))} inputMode="numeric" placeholder="e.g. 8"
                  className="mt-2 w-full rounded-2xl border border-ink-950/10 bg-white p-3.5 text-sm outline-none focus:border-ink-950/30" />
              </div>
            </div>
          ) : (
            <div>
              <SectionLabel>Their mobile number</SectionLabel>
              <input value={mobile} onChange={(e) => setMobile(e.target.value)} inputMode="tel" placeholder="+91 00000 00000"
                className="mt-2 w-full rounded-2xl border border-ink-950/10 bg-white p-3.5 text-sm outline-none focus:border-ink-950/30" />
              <p className="mt-2 text-xs text-ink-400">They must already be a patient at {clinic.name}.</p>
            </div>
          )}

          {error && <p className="rounded-2xl bg-blush-soft p-3 text-xs font-medium text-blush-deep">{error}</p>}

          <Button accent={clinic.primaryColor} block loading={busy} disabled={!valid} onClick={submit}>
            <Users size={16} /> {mode === 'NEW' ? 'Add family member' : 'Link family member'}
          </Button>
        </div>
      )}
    </Sheet>
  );
};

export default AddFamilySheet;
