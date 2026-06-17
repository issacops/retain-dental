import { useState } from 'react';

const tiers = [
  { name: 'Silver', range: '0–499 pts', gradient: 'from-slate-400 to-slate-300', bg: 'bg-slate-50', perks: ['5% off products', 'Free checkup'] },
  { name: 'Gold', range: '500–1,999 pts', gradient: 'from-amber-400 to-yellow-500', bg: 'bg-amber-50', perks: ['10% off services', 'Free whitening', 'Priority booking'] },
  { name: 'Platinum', range: '2,000+ pts', gradient: 'from-rose-500 to-amber-500', bg: 'bg-rose-50', perks: ['20% off everything', 'Free cleaning', 'VIP lounge', 'Family perks'] },
];

const earnItems = [
  { label: 'Visit completed', points: '+200', icon: '🦷' },
  { label: 'Daily care ritual', points: '+50', icon: '✨' },
  { label: 'Referral bonus', points: '+500', icon: '🤝' },
  { label: 'Review left', points: '+100', icon: '⭐' },
];

const familyMembers = [
  { name: 'Sarah', points: 2450, color: 'bg-teal-500' },
  { name: 'Mike', points: 1200, color: 'bg-amber-500' },
  { name: 'Emma', points: 800, color: 'bg-rose-500' },
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
            className={`flex-1 rounded-2xl p-3 border-2 transition-all ${
              selectedTier === i
                ? `${tier.bg} border-current shadow-lg scale-[1.03]`
                : 'bg-white border-cream-200 hover:border-gray-300'
            }`}
          >
            <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${tier.gradient} flex items-center justify-center mx-auto mb-1.5`}>
              <span className="text-white text-sm">★</span>
            </div>
            <p className="text-xs font-bold text-slate-900">{tier.name}</p>
            <p className="text-[9px] text-slate-400">{tier.range}</p>
          </button>
        ))}
      </div>

      {/* Selected tier perks */}
      <div className={`rounded-2xl p-4 border ${tiers[selectedTier].bg} border-current`}>
        <p className="text-sm font-bold text-slate-900 mb-2">{tiers[selectedTier].name} Perks</p>
        <div className="flex flex-wrap gap-1.5">
          {tiers[selectedTier].perks.map((perk, i) => (
            <span key={i} className="px-2.5 py-1 bg-white rounded-full text-[10px] font-semibold text-slate-700 border border-cream-200">
              {perk}
            </span>
          ))}
        </div>
      </div>

      {/* Earn grid */}
      <div className="grid grid-cols-2 gap-2">
        {earnItems.map((item, i) => (
          <div key={i} className="bg-white rounded-2xl p-3 border border-cream-200 flex items-center gap-2.5 hover:shadow-md transition-all cursor-pointer hover:scale-[1.02]">
            <span className="text-lg">{item.icon}</span>
            <div>
              <p className="text-[10px] font-bold text-slate-900">{item.label}</p>
              <p className="text-xs font-black text-emerald-600">{item.points}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Household pooling toggle */}
      <button
        onClick={() => setShowFamily(!showFamily)}
        className="w-full bg-gradient-to-r from-teal-50 to-amber-50 rounded-2xl p-4 border border-teal-100 text-left hover:shadow-md transition-all"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex -space-x-2">
              {familyMembers.map((m, i) => (
                <div key={i} className={`w-7 h-7 rounded-full ${m.color} border-2 border-white flex items-center justify-center text-white text-[8px] font-bold`}>
                  {m.name[0]}
                </div>
              ))}
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900">Johnson Family Pool</p>
              <p className="text-[10px] text-slate-500">3 members</p>
            </div>
          </div>
          <span className="text-lg font-black text-teal-700">
            {familyMembers.reduce((a, m) => a + m.points, 0).toLocaleString()}
          </span>
        </div>
        {showFamily && (
          <div className="mt-3 pt-3 border-t border-teal-200/50 space-y-1.5">
            {familyMembers.map((m, i) => (
              <div key={i} className="flex items-center justify-between">
                <span className="text-[10px] font-semibold text-slate-600">{m.name}</span>
                <span className="text-[10px] font-bold text-slate-700">{m.points.toLocaleString()} pts</span>
              </div>
            ))}
          </div>
        )}
      </button>
    </div>
  );
}
