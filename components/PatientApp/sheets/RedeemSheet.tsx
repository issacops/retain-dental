import React, { useState } from 'react';
import { Gift, Check, Sparkles } from 'lucide-react';
import { Clinic, TransactionCategory, TransactionType } from '../../../types';
import { cn } from '../../Doctor/ui/primitives';
import { Sheet, SectionLabel, Button, Chip } from '../ui';

interface Props {
  open: boolean;
  onClose: () => void;
  clinic: Clinic;
  patientId: string;
  points: number;
  onRedeem: (patientId: string, amount: number, category: TransactionCategory, type: TransactionType, template?: any) => Promise<any>;
}

const CATALOG = [
  { id: 'r500', name: '₹500 off any treatment', cost: 500, category: TransactionCategory.REWARD },
  { id: 'r1000', name: '₹1,000 off cosmetic care', cost: 1000, category: TransactionCategory.REWARD },
  { id: 'rclean', name: 'Free Scale & Polish', cost: 1200, category: TransactionCategory.REWARD },
  { id: 'rwhite', name: 'Free Whitening session', cost: 5000, category: TransactionCategory.REWARD },
];

const RedeemSheet: React.FC<Props> = ({ open, onClose, clinic, patientId, points, onRedeem }) => {
  const [busy, setBusy] = useState<string | null>(null);
  const [done, setDone] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const redeem = async (item: typeof CATALOG[number]) => {
    setBusy(item.id);
    setError(null);
    const res = await onRedeem(patientId, item.cost, item.category, TransactionType.REDEEM, { name: item.name });
    setBusy(null);
    if (res?.success === false) setError(res.message || 'Could not redeem. Please try again.');
    else setDone(item.name);
  };

  return (
    <Sheet open={open} onClose={() => { onClose(); setTimeout(() => { setDone(null); setError(null); }, 250); }} title="Redeem points">
      {done ? (
        <div className="py-6 text-center">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full" style={{ backgroundColor: `${clinic.primaryColor}18`, color: clinic.primaryColor }}>
            <Check size={26} />
          </span>
          <p className="mt-4 font-display text-lg font-bold text-ink-900">Redeemed</p>
          <p className="mt-1 text-sm text-ink-500">{done} — show this at your next visit.</p>
          <Button accent={clinic.primaryColor} block className="mt-5" onClick={() => { onClose(); setTimeout(() => setDone(null), 250); }}>Done</Button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between rounded-2xl bg-ink-950 p-4 text-cream-50">
            <div>
              <SectionLabel onDark>Available</SectionLabel>
              <p className="font-display text-2xl font-bold tracking-tight">{points.toLocaleString('en-IN')}</p>
            </div>
            <Sparkles size={22} style={{ color: clinic.primaryColor }} />
          </div>

          <div className="space-y-2">
            {CATALOG.map((item) => {
              const affordable = points >= item.cost;
              return (
                <div key={item.id} className={cn('flex items-center gap-3 rounded-2xl border p-3.5', affordable ? 'border-ink-950/[0.07] bg-white' : 'border-ink-950/[0.05] bg-cream-100')}>
                  <span className={cn('flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl', affordable ? 'bg-sun-soft text-sun-deep' : 'bg-ink-950/[0.05] text-ink-300')}>
                    <Gift size={18} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className={cn('truncate text-sm font-bold', affordable ? 'text-ink-800' : 'text-ink-400')}>{item.name}</p>
                    <Chip tone={affordable ? 'leaf' : 'neutral'} className="mt-1">{item.cost.toLocaleString('en-IN')} pts</Chip>
                  </div>
                  <Button variant={affordable ? 'soft' : 'ghost'} disabled={!affordable} loading={busy === item.id}
                    onClick={() => redeem(item)} className="!px-4 !py-2.5 !text-xs">
                    {affordable ? 'Redeem' : 'Short'}
                  </Button>
                </div>
              );
            })}
          </div>

          {error && <p className="rounded-2xl bg-blush-soft p-3 text-xs font-medium text-blush-deep">{error}</p>}
        </div>
      )}
    </Sheet>
  );
};

export default RedeemSheet;
