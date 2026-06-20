import { useState } from 'react';

const templates = [
  { id: 'story', name: 'Transformation Story', category: 'Trust', gradient: 'from-violet-600 to-violet-800', icon: '✨' },
  { id: 'review', name: 'Hero Review', category: 'Trust', gradient: 'from-violet-400 to-violet-600', icon: '⭐' },
  { id: 'myth', name: 'Myth Buster', category: 'Education', gradient: 'from-violet-200 to-violet-400', icon: '🔬' },
  { id: 'offer', name: 'Limited Offer', category: 'Sales', gradient: 'from-ink-800 to-ink-950', icon: '🎁' },
  { id: 'update', name: 'Clinic Update', category: 'Engagement', gradient: 'from-ink-900 to-ink-950', icon: '📢' },
];

export default function FeatureSocial() {
  const [selected, setSelected] = useState(0);

  return (
    <div className="max-w-lg mx-auto">
      <div className="grid grid-cols-5 gap-2 mb-6">
        {templates.map((t, i) => (
          <button
            key={i}
            onClick={() => setSelected(i)}
            className={`rounded p-3 text-center transition-all ${
              selected === i
                ? `bg-gradient-to-br ${t.gradient} text-white shadow-lg shadow-violet-600/20 scale-[1.05] ring-2 ring-violet-400`
                : 'bg-ink-900 border border-ink-border hover:border-violet-400 hover:shadow-md'
            }`}
          >
            <span className="text-xl block mb-1">{t.icon}</span>
            <p className={`text-[8px] font-semibold uppercase tracking-wider ${selected === i ? 'text-white/80' : 'text-onDark-500'}`}>
              {t.category}
            </p>
            <p className={`text-[9px] font-semibold mt-0.5 ${selected === i ? 'text-white' : 'text-onDark-500'}`}>
              {t.name}
            </p>
          </button>
        ))}
      </div>

      {/* Preview card */}
      <div className={`rounded bg-gradient-to-br ${templates[selected].gradient} p-8 text-white shadow-2xl shadow-violet-600/10 relative overflow-hidden`}>
        <div className="absolute inset-0 opacity-10" style={{backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '20px 20px'}}></div>
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center text-sm">{templates[selected].icon}</div>
            <span className="text-[9px] font-semibold uppercase tracking-widest text-white/60">{templates[selected].category}</span>
          </div>
          <h3 className="text-xl font-semibold mb-2">{templates[selected].name}</h3>
          <p className="text-sm text-white/70 leading-relaxed">
            {selected === 0 && "\u201cSarah\u2019s smile transformation after just 6 months of Invisalign treatment...\u201d"}
            {selected === 1 && "\u201cBest dental experience I\u2019ve ever had. The team made me feel so comfortable!\u201d"}
            {selected === 2 && "\u201cMyth: Whitening damages your enamel. Truth: Professional whitening is safe...\u201d"}
            {selected === 3 && "\u201cThis month only: Free consultation + 20% off your first treatment plan\u201d"}
            {selected === 4 && "\u201cWe\u2019re excited to announce our new Saturday hours for your convenience!\u201d"}
          </p>
          <div className="mt-6 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-[10px] font-bold">RC</div>
            <div>
              <p className="text-xs font-semibold">RetainOS Clinic</p>
              <p className="text-[9px] text-white/50">retainos.clinic</p>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-white/0 via-white/30 to-white/0"></div>
      </div>

      <div className="mt-4 flex gap-2 justify-center">
        <button className="px-4 py-2 bg-ink-900 rounded text-xs font-semibold text-onDark-500 border border-ink-border hover:shadow-md transition-all">
          Download Post
        </button>
        <button className="px-4 py-2 bg-violet-600 rounded text-xs font-semibold text-white hover:bg-violet-400 transition-all">
          Share to Instagram
        </button>
      </div>
    </div>
  );
}
