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
        <div className="flex-1 bg-ink-800 rounded p-3 text-center border border-ink-border">
          <p className="text-2xl font-semibold text-violet-600">3x</p>
          <p className="text-[9px] font-semibold text-violet-600 uppercase tracking-widest">More returns</p>
        </div>
        <div className="flex-1 bg-ink-800 rounded p-3 text-center border border-ink-border">
          <p className="text-2xl font-semibold text-violet-600">87%</p>
          <p className="text-[9px] font-semibold text-violet-600 uppercase tracking-widest">Engagement</p>
        </div>
        <div className="flex-1 bg-emerald-50 rounded p-3 text-center border border-emerald-100">
          <p className="text-2xl font-semibold text-emerald-700">0</p>
          <p className="text-[9px] font-semibold text-emerald-600 uppercase tracking-widest">Manual calls</p>
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
              <div className={`relative z-10 w-7 h-7 rounded flex items-center justify-center shrink-0 transition-all ${
                hoveredIdx === i
                  ? 'bg-violet-600 text-white scale-110 shadow-lg shadow-teal-500/30'
                  : 'bg-ink-900 border-2 border-teal-300 text-violet-600'
              }`}>
                <span className="text-[9px] font-black">{item.day.replace('Day ', 'D')}</span>
              </div>

              {/* Card */}
              <div className={`flex-1 rounded p-3 transition-all ${
                hoveredIdx === i
                  ? 'bg-ink-900 shadow-lg border border-teal-200 scale-[1.02]'
                  : 'bg-ink-900/60 border border-ink-border'
              }`}>
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-sm">{item.icon}</span>
                  <span className="text-[9px] font-semibold text-violet-600 uppercase tracking-widest">{item.day}</span>
                </div>
                <p className="text-sm font-semibold text-onDark-100">{item.title}</p>
                <p className="text-[10px] text-onDark-500 mt-0.5">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
