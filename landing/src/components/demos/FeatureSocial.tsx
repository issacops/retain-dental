import { useState } from 'react';

function SparklesIcon({ className = '' }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
      <path d="M5 3v4" />
      <path d="M19 17v4" />
      <path d="M3 5h4" />
      <path d="M17 19h4" />
    </svg>
  );
}

function StarIcon({ className = '' }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

function StethoscopeIcon({ className = '' }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M11 2v2" />
      <path d="M5 2v2" />
      <path d="M5 3H4a2 2 0 0 0-2 2v4a6 6 0 0 0 12 0V5a2 2 0 0 0-2-2h-1" />
      <path d="M8 15a6 6 0 0 0 12 0v-3" />
      <circle cx="20" cy="10" r="2" />
    </svg>
  );
}

function BadgePercentIcon({ className = '' }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.77 4 4 0 0 1 0 6.76 4 4 0 0 1-4.78 4.77 4 4 0 0 1-6.74 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z" />
      <path d="M9 12h.01" />
      <path d="M15 12h.01" />
      <path d="M8 16s1.5 2 4 2 4-2 4-2" />
    </svg>
  );
}

function MegaphoneIcon({ className = '' }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="m3 11 18-5v12L3 13v-2z" />
      <path d="M11.6 16.8a3 3 0 1 1-5.8-1.6" />
    </svg>
  );
}

function BookOpenIcon({ className = '' }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </svg>
  );
}

function DownloadIcon({ className = '' }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" x2="12" y1="15" y2="3" />
    </svg>
  );
}

function ShareIcon({ className = '' }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <line x1="8.59" x2="15.42" y1="13.51" y2="17.49" />
      <line x1="15.41" x2="8.59" y1="6.51" y2="10.49" />
    </svg>
  );
}

const templates = [
  { id: 'transformation', name: 'Transformation Story', category: 'Trust' as const, gradient: 'from-violet-600 to-violet-800', Icon: SparklesIcon, description: 'Before/After split layout' },
  { id: 'review', name: 'Hero Review', category: 'Trust' as const, gradient: 'from-violet-400 to-violet-600', Icon: StarIcon, description: 'Editorial quote style' },
  { id: 'myth', name: 'Myth Buster', category: 'Education' as const, gradient: 'from-violet-200 to-violet-400', Icon: StethoscopeIcon, description: 'Red myth / green fact' },
  { id: 'offer', name: 'Limited Offer', category: 'Sales' as const, gradient: 'from-ink-800 to-ink-950', Icon: BadgePercentIcon, description: 'Swiss grid / gift card' },
  { id: 'update', name: 'Clinic Update', category: 'Engagement' as const, gradient: 'from-ink-900 to-ink-950', Icon: MegaphoneIcon, description: 'Announcement style' },
  { id: 'educational', name: 'Educational Content', category: 'Education' as const, gradient: 'from-violet-300 to-violet-500', Icon: BookOpenIcon, description: 'Topic / fact based' },
];

type CategoryColors = {
  [key: string]: string;
};

const categoryColors: CategoryColors = {
  Trust: 'bg-violet-500/20 text-violet-300',
  Education: 'bg-emerald-500/20 text-emerald-300',
  Sales: 'bg-amber-500/20 text-amber-300',
  Engagement: 'bg-sky-500/20 text-sky-300',
};

const categoryAccent: CategoryColors = {
  Trust: 'ring-violet-500/50',
  Education: 'ring-emerald-500/50',
  Sales: 'ring-amber-500/50',
  Engagement: 'ring-sky-500/50',
};

export default function FeatureSocial() {
  const [selected, setSelected] = useState(0);

  const t = templates[selected];

  return (
    <div className="max-w-lg mx-auto">
      <div className="grid grid-cols-3 gap-2 mb-4">
        {templates.map((tmpl, i) => (
          <button
            key={tmpl.id}
            onClick={() => setSelected(i)}
            className={`rounded-lg p-3 text-left cursor-pointer transition-all duration-200 border ${
              selected === i
                ? `bg-gradient-to-br ${tmpl.gradient} text-white shadow-lg shadow-violet-600/20 ring-2 ${categoryAccent[tmpl.category]} border-transparent`
                : 'bg-ink-900 border-ink-border hover:border-violet-400/50 hover:bg-ink-800'
            }`}
          >
            <div className="flex items-center gap-2 mb-1.5">
              <tmpl.Icon className={`w-4 h-4 ${selected === i ? 'text-white/90' : 'text-onDark-400'}`} />
              <span className={`text-[7px] font-bold uppercase tracking-wider ${selected === i ? 'text-white/70' : 'text-onDark-500'}`}>
                {tmpl.category}
              </span>
            </div>
            <p className={`text-[10px] font-semibold leading-tight ${selected === 0 && i === selected || selected === i ? 'text-white' : 'text-onDark-300'}`}>
              {tmpl.name}
            </p>
          </button>
        ))}
      </div>

      {/* Format indicator */}
      <div className="flex items-center justify-center gap-1.5 mb-3">
        <span className="text-[9px] font-mono text-onDark-500 tracking-wider uppercase">9:16</span>
        <span className="text-onDark-600 text-[8px]">&bull;</span>
        <span className="text-[9px] font-mono text-onDark-500 tracking-wider">1080 x 1920</span>
        <span className="text-onDark-600 text-[8px]">&bull;</span>
        <span className="text-[9px] font-mono text-onDark-500 tracking-wider uppercase">Instagram Story</span>
      </div>

      {/* Preview card */}
      <div className={`rounded-xl bg-gradient-to-br ${t.gradient} p-8 text-white shadow-2xl shadow-violet-600/10 relative overflow-hidden aspect-[9/16] max-h-[420px] flex flex-col justify-between`}>
        {/* Dot grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '24px 24px' }}
        />

        <div className="relative z-10">
          {/* Top bar: category pill + template icon */}
          <div className="flex items-center justify-between mb-6">
            <span className={`text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full ${categoryColors[t.category]}`}>
              {t.category}
            </span>
            <t.Icon className="w-5 h-5 text-white/60" />
          </div>

          {/* Template-specific preview content */}
          {selected === 0 && (
            <>
              <h3 className="text-lg font-bold mb-3 leading-tight">Transformation Story</h3>
              <div className="grid grid-cols-2 gap-2 mb-4">
                <div className="bg-white/10 rounded-lg aspect-square flex items-center justify-center">
                  <span className="text-[10px] font-semibold text-white/50 uppercase tracking-wider">Before</span>
                </div>
                <div className="bg-white/10 rounded-lg aspect-square flex items-center justify-center">
                  <span className="text-[10px] font-semibold text-white/50 uppercase tracking-wider">After</span>
                </div>
              </div>
              <p className="text-sm text-white/70 leading-relaxed italic">
                &ldquo;Sarah&apos;s smile transformation after just 6 months of Invisalign treatment...&rdquo;
              </p>
            </>
          )}

          {selected === 1 && (
            <>
              <div className="flex items-center gap-1 mb-3">
                {[1, 2, 3, 4, 5].map(s => (
                  <StarIcon key={s} className="w-4 h-4 text-amber-300 fill-amber-300" />
                ))}
              </div>
              <h3 className="text-lg font-bold mb-4 leading-tight font-serif italic">
                &ldquo;Best dental experience I&apos;ve ever had. The team made me feel so comfortable!&rdquo;
              </h3>
              <p className="text-xs font-bold uppercase tracking-wider text-white/80">Sarah J.</p>
              <p className="text-[10px] text-white/50">Satisfied Patient</p>
            </>
          )}

          {selected === 2 && (
            <>
              <h3 className="text-base font-bold mb-4 leading-tight uppercase tracking-wide">Dental Facts 101</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-red-500/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg viewBox="0 0 12 12" className="w-2.5 h-2.5 text-red-400" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="2" y1="2" x2="10" y2="10" />
                      <line x1="10" y1="2" x2="2" y2="10" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-[9px] font-bold text-red-300 uppercase tracking-wider">The Myth</p>
                    <p className="text-xs text-white/80 font-semibold">Whitening damages your enamel</p>
                  </div>
                </div>
                <div className="h-px bg-white/10 mx-4" />
                <div className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg viewBox="0 0 12 12" className="w-2.5 h-2.5 text-emerald-400" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="2 6 5 9 10 3" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-[9px] font-bold text-emerald-300 uppercase tracking-wider">The Reality</p>
                    <p className="text-xs text-white/80 font-semibold">Professional whitening is safe</p>
                  </div>
                </div>
              </div>
            </>
          )}

          {selected === 3 && (
            <>
              <h3 className="text-3xl font-black mb-2 leading-none">50% OFF</h3>
              <p className="text-sm font-bold uppercase tracking-wider text-white/80 mb-4">On all cleaning services</p>
              <div className="h-px bg-white/20 mb-4" />
              <p className="text-[10px] font-semibold uppercase tracking-wider text-white/50">Valid until Aug 31st</p>
            </>
          )}

          {selected === 4 && (
            <>
              <h3 className="text-xl font-bold mb-3 leading-tight uppercase tracking-wide">We&apos;re Open!</h3>
              <p className="text-sm text-white/70 leading-relaxed">
                Now open on Saturdays from 10am for your convenience. Walk-ins welcome!
              </p>
            </>
          )}

          {selected === 5 && (
            <>
              <h3 className="text-lg font-bold mb-3 leading-tight">Brushing Tips</h3>
              <p className="text-sm text-white/70 leading-relaxed mb-4">
                Did you know? Brushing too hard can damage your enamel. Use a soft-bristled brush and gentle circular motions.
              </p>
              <div className="bg-white/10 rounded-lg p-3">
                <p className="text-[10px] font-bold uppercase tracking-wider text-white/50 mb-1">Quick Fact</p>
                <p className="text-xs text-white/80 font-semibold">Dentists recommend replacing your toothbrush every 3 months.</p>
              </div>
            </>
          )}
        </div>

        {/* Footer branding */}
        <div className="relative z-10 flex items-center gap-2.5 mt-4">
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-[10px] font-bold">RC</div>
          <div>
            <p className="text-[11px] font-semibold">RetainOS Clinic</p>
            <p className="text-[9px] text-white/40">clinic.retainos.clinic</p>
          </div>
        </div>

        {/* Bottom accent line */}
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-white/0 via-white/20 to-white/0" />
      </div>

      <div className="mt-4 flex gap-2 justify-center">
        <button className="flex items-center gap-1.5 px-4 py-2 bg-ink-900 rounded-lg text-xs font-semibold text-onDark-500 border border-ink-border hover:bg-ink-800 hover:border-violet-400/30 transition-all duration-200 cursor-pointer">
          <DownloadIcon className="w-3.5 h-3.5" />
          Download Post
        </button>
        <button className="flex items-center gap-1.5 px-4 py-2 bg-violet-600 rounded-lg text-xs font-semibold text-white hover:bg-violet-500 transition-all duration-200 cursor-pointer">
          <ShareIcon className="w-3.5 h-3.5" />
          Share to Instagram
        </button>
      </div>
    </div>
  );
}
