import { useState } from 'react';

const timeline = [
  { day: '24h', title: 'Post-Treatment Check-in', desc: 'Automated message asking how they feel', icon: '💬', color: 'teal' },
  { day: 'Day 3', title: 'Healing Progress Nudge', desc: 'Follow-up with care instructions', icon: '🩹', color: 'teal' },
  { day: 'Day 7', title: 'Review Request', desc: 'Happy patients prompted to leave a 5-star review', icon: '⭐', color: 'amber' },
  { day: 'Day 14', title: 'Recall Schedule Set', desc: 'Next appointment auto-scheduled', icon: '📅', color: 'teal' },
  { day: 'Day 30', title: 'Loyalty Reward Earned', desc: 'Points credited, tier progress updated', icon: '🏆', color: 'amber' },
];

export default function FeatureRecall() {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  return (
    <div className="max-w-md mx-auto">
      {/* Stats row */}
      <div className="flex gap-3 mb-6">
        <div className="flex-1 bg-teal-50 rounded-2xl p-3 text-center border border-teal-100">
          <p className="text-2xl font-black text-teal-700">3x</p>
          <p className="text-[9px] font-bold text-teal-600 uppercase tracking-widest">More returns</p>
        </div>
        <div className="flex-1 bg-amber-50 rounded-2xl p-3 text-center border border-amber-100">
          <p className="text-2xl font-black text-amber-700">87%</p>
          <p className="text-[9px] font-bold text-amber-600 uppercase tracking-widest">Engagement</p>
        </div>
        <div className="flex-1 bg-emerald-50 rounded-2xl p-3 text-center border border-emerald-100">
          <p className="text-2xl font-black text-emerald-700">0</p>
          <p className="text-[9px] font-bold text-emerald-600 uppercase tracking-widest">Manual calls</p>
        </div>
      </div>

      {/* Timeline */}
      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-gradient-to-b from-teal-400 to-teal-100"></div>

        <div className="space-y-1">
          {timeline.map((item, i) => (
            <div
              key={i}
              className="relative flex items-start gap-4 pl-2 py-2 cursor-pointer group"
              onMouseEnter={() => setHoveredIdx(i)}
              onMouseLeave={() => setHoveredIdx(null)}
            >
              {/* Node */}
              <div className={`relative z-10 w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-all ${
                hoveredIdx === i
                  ? 'bg-teal-500 text-white scale-110 shadow-lg shadow-teal-500/30'
                  : 'bg-white border-2 border-teal-300 text-teal-600'
              }`}>
                <span className="text-[9px] font-black">{item.day.replace('Day ', 'D')}</span>
              </div>

              {/* Card */}
              <div className={`flex-1 rounded-2xl p-3 transition-all ${
                hoveredIdx === i
                  ? 'bg-white shadow-lg border border-teal-200 scale-[1.02]'
                  : 'bg-white/60 border border-cream-200'
              }`}>
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-sm">{item.icon}</span>
                  <span className="text-[9px] font-bold text-teal-600 uppercase tracking-widest">{item.day}</span>
                </div>
                <p className="text-sm font-bold text-slate-900">{item.title}</p>
                <p className="text-[10px] text-slate-500 mt-0.5">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
