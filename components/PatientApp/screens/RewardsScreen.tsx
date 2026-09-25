import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Sparkles, Gift, ArrowDownLeft, ArrowUpRight, TrendingUp, Star } from 'lucide-react';
import { Clinic, User, Transaction, TransactionType, TIER_THRESHOLDS, TIER_BENEFITS, Tier } from '../../../types';
import { cn } from '../../Doctor/ui/primitives';
import { Surface, Well, GradientCard, SectionLabel, Display, Button, Chip, ProgressRing, StatCard, FeatureCard, EmptyState, CountUp, stagger, rise, relTime } from '../ui';

interface Props {
  clinic: Clinic;
  currentUser: User;
  points: number;
  ledger: Transaction[];
  onRedeem: () => void;
}

const TIER_ORDER: Tier[] = [Tier.MEMBER, Tier.GOLD, Tier.PLATINUM];

const REWARD_TILES = [
  { id: 'r500', label: '₹500 off', sub: '500 pts', gradient: 'linear-gradient(150deg,#3B82F6,#0B2447)', icon: <Gift size={18} /> },
  { id: 'r1000', label: '₹1,000 cosmetic', sub: '1,000 pts', gradient: 'linear-gradient(150deg,#8B5CF6,#3B0764)', icon: <Sparkles size={18} /> },
  { id: 'rclean', label: 'Free polish', sub: '1,200 pts', gradient: 'linear-gradient(150deg,#22C55E,#052E16)', icon: <Sparkles size={18} /> },
  { id: 'rwhite', label: 'Free whitening', sub: '5,000 pts', gradient: 'linear-gradient(150deg,#F5A524,#4A2200)', icon: <Star size={18} /> },
];

const RewardsScreen: React.FC<Props> = ({ clinic, currentUser, points, ledger, onRedeem }) => {
  const reduce = !!useReducedMotion();
  const spend = currentUser.lifetimeSpend;
  const nextTier = currentUser.currentTier === Tier.MEMBER ? Tier.GOLD : currentUser.currentTier === Tier.GOLD ? Tier.PLATINUM : null;
  const nextThreshold = nextTier ? TIER_THRESHOLDS[nextTier === Tier.GOLD ? 'GOLD' : 'PLATINUM'] : 0;
  const prevThreshold = currentUser.currentTier === Tier.PLATINUM ? TIER_THRESHOLDS.PLATINUM : currentUser.currentTier === Tier.GOLD ? TIER_THRESHOLDS.GOLD : 0;
  const tierProgress = nextTier ? Math.max(0, Math.min(1, (spend - prevThreshold) / (nextThreshold - prevThreshold))) : 1;
  const earnedTotal = ledger.filter((t) => t.type === TransactionType.EARN).reduce((s, t) => s + t.pointsEarned, 0);

  return (
    <motion.div variants={stagger(0.06)} initial={reduce ? false : 'hidden'} animate="show" className="space-y-4">
      <motion.div variants={rise} className="px-1 pb-1">
        <Display as="h1" className="text-[1.75rem] leading-tight">Rewards</Display>
        <p className="mt-1 text-sm font-medium text-ink-500">Earn Smile Points on every visit and put them toward your care.</p>
      </motion.div>

      {/* Balance */}
      <motion.div variants={rise}>
        <GradientCard accent="#EAB308" className="p-5">
          <div className="flex items-center justify-between">
            <Chip tone="glass">Smile Points</Chip>
            <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-white/20 text-white ring-1 ring-inset ring-white/25"><Sparkles size={16} /></span>
          </div>
          <div className="mt-4 flex items-end justify-between">
            <div>
              <p className="font-display text-5xl font-bold leading-none tracking-tighter text-white"><CountUp value={points} /></p>
              <p className="mt-1 text-xs font-medium text-white/75">available to redeem</p>
            </div>
            <button onClick={onRedeem} className="rounded-full bg-white px-5 py-3 text-sm font-bold text-[#4A2200]">Redeem</button>
          </div>
        </GradientCard>
      </motion.div>

      {/* Tiles */}
      <motion.div variants={rise} className="grid grid-cols-2 gap-3">
        <StatCard icon={<TrendingUp size={16} />} value={<CountUp value={earnedTotal} />} label="Points earned" accent={clinic.primaryColor} />
        <StatCard icon={<Star size={16} />} value={currentUser.currentTier} label="Current tier" accent="#8B5CF6" />
      </motion.div>

      {/* Tier progress */}
      <motion.div variants={rise}>
        <Surface tone="white" className="p-5">
          <div className="flex items-center gap-4">
            <ProgressRing value={tierProgress} size={88} stroke={9} accent={clinic.primaryColor} track="rgba(10,10,10,0.08)" glow>
              <Star size={18} style={{ color: clinic.primaryColor }} />
            </ProgressRing>
            <div className="min-w-0 flex-1">
              <SectionLabel>Next tier</SectionLabel>
              {nextTier ? (
                <>
                  <p className="font-display text-lg font-bold text-ink-900">{nextTier}</p>
                  <p className="mt-0.5 text-xs text-ink-500">Spend <span className="font-bold text-ink-700">₹{(nextThreshold - spend).toLocaleString('en-IN')}</span> more</p>
                </>
              ) : (
                <p className="font-display text-lg font-bold text-ink-900">Top tier reached</p>
              )}
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            {TIER_ORDER.map((tier) => {
              const passed = TIER_ORDER.indexOf(tier) <= TIER_ORDER.indexOf(currentUser.currentTier);
              return (
                <div key={tier} className={cn('flex-1 rounded-2xl border px-3 py-2', passed ? 'border-transparent' : 'border-ink-950/[0.06] bg-ink-950/[0.03]')}
                  style={passed ? { backgroundColor: `${clinic.primaryColor}16` } : undefined}>
                  <p className="font-mono text-[10px] font-bold uppercase tracking-wider" style={{ color: passed ? clinic.primaryColor : undefined }}>{tier}</p>
                  <p className="mt-0.5 text-[11px] text-ink-400">{TIER_BENEFITS[tier].earnMultiplier}× points</p>
                </div>
              );
            })}
          </div>
        </Surface>
      </motion.div>

      {/* Redeem */}
      <motion.div variants={rise}>
        <div className="mb-2 flex items-center justify-between px-1">
          <SectionLabel>Redeem</SectionLabel>
          <button onClick={onRedeem} className="text-xs font-bold text-ink-500">See all</button>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {REWARD_TILES.map((r) => (
            <FeatureCard key={r.id} gradient={r.gradient} icon={r.icon} label={r.label} sub={r.sub} onClick={onRedeem} />
          ))}
        </div>
      </motion.div>

      {/* History */}
      <motion.div variants={rise}>
        <Surface tone="white" className="p-5">
          <SectionLabel>Points history</SectionLabel>
          <Well className="mt-3 !p-2">
            {ledger.length === 0 ? (
              <EmptyState title="No activity yet" hint="Your points activity will appear here after your first visit." />
            ) : (
              <div className="divide-y divide-ink-950/[0.06]">
                {ledger.slice(0, 20).map((t) => {
                  const earn = t.type === TransactionType.EARN;
                  return (
                    <div key={t.id} className="flex items-center gap-3 px-2.5 py-3">
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
          </Well>
        </Surface>
      </motion.div>
    </motion.div>
  );
};

export default RewardsScreen;
