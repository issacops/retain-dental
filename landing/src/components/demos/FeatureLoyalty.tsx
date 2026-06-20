import { useState } from 'react';

const tiers = [
  {
    name: 'MEMBER',
    threshold: 'Rs.0',
    badge: 'bg-slate-200',
    bg: 'bg-ink-800',
    multiplier: '1.0x',
    earnRate: '2%',
    perks: ['Base loyalty points', 'Family pooling'],
  },
  {
    name: 'GOLD',
    threshold: 'Rs.25,000',
    badge: 'bg-amber-400',
    bg: 'bg-ink-800',
    multiplier: '1.5x',
    earnRate: '5%',
    perks: ['1.5x points on all treatments', 'Priority scheduling', 'Free annual cleaning'],
  },
  {
    name: 'PLATINUM',
    threshold: 'Rs.1,00,000',
    badge: 'bg-violet-600',
    bg: 'bg-ink-800',
    multiplier: '2.0x',
    earnRate: '10%',
    perks: ['2x points on all treatments', 'VIP scheduling', 'Free quarterly cleaning', 'Exclusive cosmetic discounts'],
  },
];

const categoryMultipliers = [
  { category: 'HYGIENE', multiplier: '1.0x', color: 'text-slate-400' },
  { category: 'GENERAL', multiplier: '1.3x', color: 'text-blue-400' },
  { category: 'COSMETIC', multiplier: '1.8x', color: 'text-pink-400' },
];

const earnItems = [
  { label: 'Visit completed', points: '+200 pts', icon: (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-violet-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    </svg>
  )},
  { label: 'Daily care ritual', points: '+50 pts', icon: (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-violet-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
    </svg>
  )},
  { label: 'Referral bonus', points: '+500 pts', icon: (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-violet-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
      <circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
      <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  )},
  { label: 'Review left', points: '+100 pts', icon: (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-violet-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
    </svg>
  )},
];

const familyMembers = [
  { name: 'Sarah', points: 2450, color: 'bg-violet-600' },
  { name: 'Mike', points: 1200, color: 'bg-violet-400' },
  { name: 'Emma', points: 800, color: 'bg-violet-200' },
];

export default function FeatureLoyalty() {
  const [selectedTier, setSelectedTier] = useState(1);
  const [showFamily, setShowFamily] = useState(false);

  return (
    <div className="max-w-lg mx-auto space-y-6">
      {/* Tier selector */}
      <div className="flex gap-2">
        {tiers.map((tier, i) => (
          <button
            key={i}
            onClick={() => setSelectedTier(i)}
            className={`flex-1 rounded p-3 border-2 transition-all cursor-pointer ${
              selectedTier === i
                ? `${tier.bg} border-violet-600 shadow-lg shadow-violet-600/10`
                : 'bg-ink-900 border-ink-border hover:border-violet-400 opacity-80 hover:opacity-100'
            }`}
          >
            <div className={`w-8 h-8 rounded ${tier.badge} flex items-center justify-center mx-auto mb-1.5`}>
              <span className="text-white text-sm font-bold">{tier.multiplier}</span>
            </div>
            <p className="text-xs font-semibold text-onDark-100">{tier.name}</p>
            <p className="text-[9px] text-onDark-500">{tier.threshold}</p>
          </button>
        ))}
      </div>

      {/* Selected tier perks */}
      <div className="rounded p-4 border border-violet-600/30 bg-ink-800">
        <p className="text-sm font-semibold text-onDark-100 mb-1">{tiers[selectedTier].name} Perks</p>
        <p className="text-[10px] text-violet-400 mb-2">{tiers[selectedTier].earnRate} back on all treatments</p>
        <div className="flex flex-wrap gap-1.5">
          {tiers[selectedTier].perks.map((perk, i) => (
            <span key={i} className="px-2.5 py-1 bg-ink-900 rounded text-[10px] font-semibold text-onDark-500 border border-ink-border">
              {perk}
            </span>
          ))}
        </div>
      </div>

      {/* Category multipliers */}
      <div className="bg-ink-900 rounded p-3 border border-ink-border">
        <p className="text-[10px] font-semibold text-onDark-500 mb-2 uppercase tracking-wider">Category Multipliers</p>
        <div className="flex gap-3">
          {categoryMultipliers.map((cat, i) => (
            <div key={i} className="flex items-center gap-1.5">
              <span className={`text-[10px] font-semibold ${cat.color}`}>{cat.category}</span>
              <span className="text-[10px] font-bold text-onDark-100">{cat.multiplier}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Earn grid */}
      <div className="grid grid-cols-2 gap-2">
        {earnItems.map((item, i) => (
          <div key={i} className="bg-ink-900 rounded p-3 border border-ink-border flex items-center gap-2.5 hover:shadow-md hover:shadow-violet-600/5 transition-all cursor-pointer hover:bg-ink-800">
            {item.icon}
            <div>
              <p className="text-[10px] font-semibold text-onDark-100">{item.label}</p>
              <p className="text-xs font-semibold text-violet-400">{item.points}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Household pooling toggle */}
      <button
        onClick={() => setShowFamily(!showFamily)}
        className="w-full bg-ink-800 rounded p-4 border border-violet-600/20 text-left hover:shadow-md hover:shadow-violet-600/5 transition-all cursor-pointer"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex -space-x-2">
              {familyMembers.map((m, i) => (
                <div key={i} className={`w-7 h-7 rounded-full ${m.color} border-2 border-ink-900 flex items-center justify-center text-white text-[8px] font-semibold`}>
                  {m.name[0]}
                </div>
              ))}
            </div>
            <div>
              <p className="text-xs font-semibold text-onDark-100">Johnson Family Pool</p>
              <p className="text-[10px] text-onDark-500">3 members</p>
            </div>
          </div>
          <span className="text-lg font-semibold text-violet-400">
            {familyMembers.reduce((a, m) => a + m.points, 0).toLocaleString()} pts
          </span>
        </div>
        {showFamily && (
          <div className="mt-3 pt-3 border-t border-ink-border space-y-1.5">
            {familyMembers.map((m, i) => (
              <div key={i} className="flex items-center justify-between">
                <span className="text-[10px] font-semibold text-onDark-500">{m.name}</span>
                <span className="text-[10px] font-semibold text-onDark-500">{m.points.toLocaleString()} pts</span>
              </div>
            ))}
          </div>
        )}
      </button>
    </div>
  );
}
