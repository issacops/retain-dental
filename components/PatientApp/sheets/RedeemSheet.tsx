import React, { useState } from 'react';
import { Gift, Check, Sparkles, ArrowRight } from 'lucide-react';
import { Clinic, TransactionCategory, TransactionType } from '../../../types';
import { cn } from '../../Doctor/ui/primitives';
import { Surface, Sheet, SectionLabel, Button, Chip, CountUp } from '../ui';
import { haptic } from '../../../lib/haptics';

interface Props {
  open: boolean;
  onClose: () => void;
  clinic: Clinic;
  patientId: string;
  points: number;
  initialRewardId?: string;
  onRedeem: (patientId: string, amount: number, category: TransactionCategory, type: TransactionType, template?: any) => Promise<any>;
}

const CATALOG = [
  { id: 'r500', name: '₹500 off any treatment', cost: 500, gradient: 'linear-gradient(150deg,#3B82F6,#0B2447)' },
  { id: 'r1000', name: '₹1,000 off cosmetic care', cost: 1000, gradient: 'linear-gradient(150deg,#8B5CF6,#3B0764)' },
  { id: 'rclean', name: 'Free Scale & Polish', cost: 1200, gradient: 'linear-gradient(150deg,#22C55E,#052E16)' },
  { id: 'rwhite', name: 'Free Whitening session', cost: 5000, gradient: 'linear-gradient(150deg,#F5A524,#4A2200)' },
];

const RedeemSheet: React.FC<Props> = ({ open, onClose, clinic, patientId, points, initialRewardId, onRedeem }) => {
  const [busy, setBusy] = useState<string | null>(null);
  const [done, setDone] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const redeem = async (item: typeof CATALOG[number]) => {
    haptic('medium');
    setBusy(item.id);
    setError(null);
    const res = await onRedeem(patientId, item.cost, TransactionCategory.REWARD, TransactionType.REDEEM, { name: item.name });
    setBusy(null);
    if (res?.success === false) { haptic('error'); setError(res.message || 'Could not redeem. Please try again.'); }
    else { haptic('success'); setDone(item.name); }
  };

  const reset = () => { setDone(null); setError(null); };

  return (
    <Sheet open={open} onClose={() => { onClose(); setTimeout(reset, 250); }} title="Redeem points">
      {done ? (
        <div className="py-6 text-center">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full" style={{ backgroundImage: `linear-gradient(140deg, ${clinic.primaryColor}, ${clinic.primaryColor}bb)`, color: '#fff' }}>
            <Check size={26} />
          </span>
          <p className="mt-4 font-display text-lg font-bold text-ink-900">Redeemed</p>
          <p className="mt-1 text-sm text-ink-500">{done} — show this at your next visit.</p>
          <Button accent={clinic.primaryColor} block className="mt-5" onClick={() => { onClose(); setTimeout(reset, 250); }}>Done</Button>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Available */}
          <Surface tone="white" className="flex items-center gap-4 p-4">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl text-white" style={{ backgroundImage: 'linear-gradient(140deg,#F5A524,#8A4B00)' }}>
              <Sparkles size={20} />
            </span>
            <div>
              <SectionLabel>Available balance</SectionLabel>
              <p className="font-display text-3xl font-bold leading-none tracking-tight text-ink-900"><CountUp value={points} /> <span className="text-base font-semibold text-ink-400">pts</span></p>
            </div>
          </Surface>

          <div className="space-y-2">
            {CATALOG.map((item) => {
              const gap = item.cost - points;
              const affordable = gap <= 0;
              const highlighted = initialRewardId === item.id;
              return (
                <div key={item.id} className={cn('flex items-center gap-3 rounded-[24px] border p-3.5 transition-colors',
                  highlighted ? 'border-transparent ring-2' : 'border-ink-950/[0.05] bg-white')}
                  style={highlighted ? { boxShadow: `0 0 0 2px ${clinic.primaryColor}55`, backgroundColor: '#fff' } : undefined}>
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl text-white" style={{ backgroundImage: item.gradient }}>
                    <Gift size={18} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className={cn('truncate text-sm font-bold', affordable ? 'text-ink-800' : 'text-ink-400')}>{item.name}</p>
                    <Chip tone={affordable ? 'leaf' : 'neutral'} className="mt-1">{item.cost.toLocaleString('en-IN')} pts</Chip>
                  </div>
                  {affordable ? (
                    <Button accent={clinic.primaryColor} loading={busy === item.id} onClick={() => redeem(item)} className="!px-4 !py-2.5 !text-xs shrink-0">
                      Redeem
                    </Button>
                  ) : (
                    <span className="shrink-0 rounded-full bg-ink-950/[0.05] px-3 py-2 text-[11px] font-bold text-ink-400">
                      {(gap).toLocaleString('en-IN')} to go
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          {error && <p className="rounded-2xl bg-blush-soft p-3 text-xs font-medium text-blush-deep">{error}</p>}
          <p className="flex items-center justify-center gap-1.5 pt-1 text-[11px] text-ink-400">
            Points are applied at checkout <ArrowRight size={12} />
          </p>
        </div>
      )}
    </Sheet>
  );
};

export default RedeemSheet;
