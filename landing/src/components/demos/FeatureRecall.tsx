import { useState } from 'react';

const timeline = [
  { day: '24h', title: 'Post-Treatment Check-in', desc: 'Automated message asking how they feel', color: 'teal' },
  { day: 'Day 3', title: 'Healing Progress Nudge', desc: 'Follow-up with care instructions', color: 'teal' },
  { day: 'Day 7', title: 'Review Request', desc: 'Happy patients prompted to leave a 5-star review', color: 'amber' },
  { day: 'Day 14', title: 'Recall Schedule Set', desc: 'Next appointment auto-scheduled', color: 'teal' },
  { day: 'Day 30', title: 'Loyalty Reward Earned', desc: 'Points credited, tier progress updated', color: 'amber' },
];

export default function FeatureRecall() {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  return (
    <div className="max-w-md mx-auto">
      <span className="inline-block px-2.5 py-0.5 rounded-full bg-violet-600/15 text-violet-400 text-[9px] font-semibold uppercase tracking-widest border border-violet-600/20 mb-4">Coming Soon</span>
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
        <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-gradient-to-b from-violet-400 to-violet-600/10"></div>

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
                  ? 'bg-violet-600 text-white scale-110 shadow-lg shadow-violet-600/30'
                  : 'bg-ink-900 border-2 border-violet-600/30 text-violet-600'
              }`}>
                <span className="text-[9px] font-black">{item.day.replace('Day ', 'D')}</span>
              </div>

              {/* Card */}
              <div className={`flex-1 rounded p-3 transition-all ${
                hoveredIdx === i
                  ? 'bg-ink-900 shadow-lg border border-violet-600/20 scale-[1.02]'
                  : 'bg-ink-900/60 border border-ink-border'
              }`}>
                <div className="flex items-center gap-2 mb-0.5">
                  {item.color === 'teal' ? (
                    <svg className="w-4 h-4 text-violet-400" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd"/></svg>
                  ) : (
                    <svg className="w-4 h-4 text-violet-400" viewBox="0 0 20 20" fill="currentColor"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                  )}
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
