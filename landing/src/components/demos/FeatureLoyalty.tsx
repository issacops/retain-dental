import { useState } from 'react';

const tiers = [
  { name: 'Silver', range: '0–499 pts', badge: 'bg-violet-200', bg: 'bg-ink-800', perks: ['5% off products', 'Free checkup'] },
  { name: 'Gold', range: '500–1,999 pts', badge: 'bg-violet-400', bg: 'bg-ink-800', perks: ['10% off services', 'Free whitening', 'Priority booking'] },
  { name: 'Platinum', range: '2,000+ pts', badge: 'bg-violet-600', bg: 'bg-ink-800', perks: ['20% off everything', 'Free cleaning', 'VIP lounge', 'Family perks'] },
];

const earnItems = [
  { label: 'Visit completed', points: '+200', icon: '🦷' },
  { label: 'Daily care ritual', points: '+50', icon: '✨' },
  { label: 'Referral bonus', points: '+500', icon: '🤝' },
  { label: 'Review left', points: '+100', icon: '⭐' },
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
            className={`flex-1 rounded p-3 border-2 transition-all ${
              selectedTier === i
                ? `${tier.bg} border-violet-600 shadow-lg shadow-violet-600/10 scale-[1.03]`
                : 'bg-ink-900 border-ink-border hover:border-violet-400'
            }`}
          >
            <div className={`w-8 h-8 rounded ${tier.badge} flex items-center justify-center mx-auto mb-1.5`}>
              <span className="text-white text-sm">★</span>
            </div>
            <p className="text-xs font-semibold text-onDark-100">{tier.name}</p>
            <p className="text-[9px] text-onDark-500">{tier.range}</p>
          </button>
        ))}
      </div>

      {/* Selected tier perks */}
      <div className="rounded p-4 border border-violet-600/30 bg-ink-800">
        <p className="text-sm font-semibold text-onDark-100 mb-2">{tiers[selectedTier].name} Perks</p>
        <div className="flex flex-wrap gap-1.5">
          {tiers[selectedTier].perks.map((perk, i) => (
            <span key={i} className="px-2.5 py-1 bg-ink-900 rounded text-[10px] font-semibold text-onDark-500 border border-ink-border">
              {perk}
            </span>
          ))}
        </div>
      </div>

      {/* Earn grid */}
      <div className="grid grid-cols-2 gap-2">
        {earnItems.map((item, i) => (
          <div key={i} className="bg-ink-900 rounded p-3 border border-ink-border flex items-center gap-2.5 hover:shadow-md hover:shadow-violet-600/5 transition-all cursor-pointer hover:scale-[1.02]">
            <span className="text-lg">{item.icon}</span>
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
        className="w-full bg-ink-800 rounded p-4 border border-violet-600/20 text-left hover:shadow-md hover:shadow-violet-600/5 transition-all"
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
            {familyMembers.reduce((a, m) => a + m.points, 0).toLocaleString()}
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
