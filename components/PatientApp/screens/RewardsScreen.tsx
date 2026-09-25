import React from 'react';
import { Sparkles, Gift, ArrowDownLeft, ArrowUpRight, TrendingUp, Star } from 'lucide-react';
import { Clinic, User, Transaction, TransactionType, TIER_THRESHOLDS, TIER_BENEFITS, Tier } from '../../../types';
import { cn } from '../../Doctor/ui/primitives';
import { Surface, SectionLabel, Display, Button, Chip, ProgressRing, EmptyState, relTime } from '../ui';

interface Props {
  clinic: Clinic;
  currentUser: User;
  points: number;
  ledger: Transaction[];
  onRedeem: () => void;
}

const TIER_ORDER: Tier[] = [Tier.MEMBER, Tier.GOLD, Tier.PLATINUM];

const RewardsScreen: React.FC<Props> = ({ clinic, currentUser, points, ledger, onRedeem }) => {
  const spend = currentUser.lifetimeSpend;
  const nextTier = currentUser.currentTier === Tier.MEMBER ? Tier.GOLD : currentUser.currentTier === Tier.GOLD ? Tier.PLATINUM : null;
  const nextThreshold = nextTier ? TIER_THRESHOLDS[nextTier === Tier.GOLD ? 'GOLD' : 'PLATINUM'] : 0;
  const prevThreshold = currentUser.currentTier === Tier.PLATINUM ? TIER_THRESHOLDS.PLATINUM : currentUser.currentTier === Tier.GOLD ? TIER_THRESHOLDS.GOLD : 0;
  const tierProgress = nextTier
    ? Math.max(0, Math.min(1, (spend - prevThreshold) / (nextThreshold - prevThreshold)))
    : 1;

  const earns = ledger.filter((t) => t.type === TransactionType.EARN);
  const earnedTotal = earns.reduce((s, t) => s + t.pointsEarned, 0);

  return (
    <div className="space-y-5">
      <div>
        <Display as="h1">Rewards</Display>
        <p className="mt-1 text-sm text-ink-500">Earn Smile Points on every visit and redeem them for care.</p>
      </div>

      {/* Balance */}
      <Surface tone="dark" className="relative overflow-hidden p-6">
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full opacity-30 blur-2xl" style={{ backgroundColor: clinic.primaryColor }} />
        <div className="relative">
          <SectionLabel onDark>Your balance</SectionLabel>
          <p className="mt-2 font-display text-5xl font-bold tracking-tight text-cream-50">{points.toLocaleString('en-IN')}</p>
          <p className="mt-1 text-sm text-cream-50/60">Smile Points available to redeem</p>
          <Button accent={clinic.primaryColor} className="mt-5" onClick={onRedeem}><Gift size={16} /> Redeem points</Button>
        </div>
      </Surface>

      {/* Tier progress */}
      <Surface className="p-5">
        <div className="flex items-center gap-4">
          <ProgressRing value={tierProgress} size={96} stroke={9} accent={clinic.primaryColor}>
            <Star size={18} style={{ color: clinic.primaryColor }} />
          </ProgressRing>
          <div className="min-w-0 flex-1">
            <SectionLabel>Current tier</SectionLabel>
            <p className="font-display text-lg font-bold text-ink-900">{currentUser.currentTier}</p>
            {nextTier ? (
              <p className="mt-1 text-xs text-ink-500">
                Spend <span className="font-bold text-ink-700">₹{(nextThreshold - spend).toLocaleString('en-IN')}</span> more to reach {nextTier}.
              </p>
            ) : (
              <p className="mt-1 text-xs text-ink-500">You are on our highest tier.</p>
            )}
          </div>
        </div>

        <div className="mt-4 flex gap-2">
          {TIER_ORDER.map((tier) => {
            const reached = currentUser.currentTier === tier;
            const passed = TIER_ORDER.indexOf(tier) <= TIER_ORDER.indexOf(currentUser.currentTier);
            return (
              <div key={tier} className={cn('flex-1 rounded-2xl border px-3 py-2', passed ? 'border-transparent' : 'border-ink-950/[0.07]')}
                style={passed ? { backgroundColor: `${clinic.primaryColor}14` } : undefined}>
                <p className="font-mono text-[10px] font-bold uppercase tracking-wider" style={{ color: passed ? clinic.primaryColor : undefined }}>{tier}</p>
                <p className="mt-0.5 text-[11px] text-ink-400">{TIER_BENEFITS[tier].earnMultiplier}× points</p>
              </div>
            );
          })}
        </div>
      </Surface>

      {/* How to earn */}
      <Surface className="p-5">
        <div className="flex items-center gap-2"><TrendingUp size={16} className="text-ink-400" /><SectionLabel>How you earn</SectionLabel></div>
        <div className="mt-3 space-y-2">
          {TIER_BENEFITS[currentUser.currentTier].perks.map((perk) => (
            <div key={perk} className="flex items-center gap-2.5 rounded-2xl bg-cream-100 px-3.5 py-2.5">
              <Sparkles size={14} style={{ color: clinic.primaryColor }} />
              <span className="text-sm text-ink-700">{perk}</span>
            </div>
          ))}
          <div className="rounded-2xl bg-cream-100 px-3.5 py-2.5 text-sm text-ink-500">
            You have earned <span className="font-bold text-ink-800">{earnedTotal.toLocaleString('en-IN')}</span> points in total.
          </div>
        </div>
      </Surface>

      {/* History */}
      <Surface className="p-5">
        <SectionLabel>Points history</SectionLabel>
        <div className="mt-3">
          {ledger.length === 0 ? (
            <EmptyState title="No activity yet" hint="Your points activity will appear here after your first visit." />
          ) : (
            <div className="divide-y divide-ink-950/[0.06]">
              {ledger.slice(0, 20).map((t) => {
                const earn = t.type === TransactionType.EARN;
                return (
                  <div key={t.id} className="flex items-center gap-3 py-3">
                    <span className={cn('flex h-9 w-9 shrink-0 items-center justify-center rounded-full', earn ? 'bg-leaf-soft text-leaf-deep' : 'bg-blush-soft text-blush-deep')}>
                      {earn ? <ArrowDownLeft size={15} /> : <ArrowUpRight size={15} />}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-ink-800">{t.description}</p>
                      <p className="font-mono text-[10px] uppercase tracking-wider text-ink-300">{relTime(t.date)}</p>
                    </div>
                    <span className={cn('shrink-0 font-display text-sm font-bold', earn ? 'text-leaf-deep' : 'text-blush-deep')}>
                      {earn ? '+' : ''}{t.pointsEarned.toLocaleString('en-IN')}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </Surface>
    </div>
  );
};

export default RewardsScreen;
