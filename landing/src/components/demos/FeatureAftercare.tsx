import { useState } from 'react';

type Category = 'Cosmetic' | 'General / Restorative' | 'Hygiene / Preventive' | 'General';

interface Procedure {
  name: string;
  category: Category;
  instructions: string[];
  customFields: { key: string; label: string; defaultValue: string | number }[];
}

const procedures: Procedure[] = [
  {
    name: 'Invisalign / Clear Aligners',
    category: 'Cosmetic',
    instructions: [
      'Wear trays for 22+ hours daily. Only remove for eating and brushing.',
      'Use "Chewies" for 5 minutes twice daily to ensure trays are fully seated.',
      'Clean trays with cold water and soft brush only. Do not use hot water.',
      'Switch to next tray only after completing the full prescribed days.',
      'Keep your previous tray in the packet as a backup.',
    ],
    customFields: [
      { key: 'currentTray', label: 'Start Tray #', defaultValue: 1 },
      { key: 'totalTrays', label: 'Total Trays', defaultValue: 24 },
      { key: 'changeInterval', label: 'Days Per Tray', defaultValue: 10 },
      { key: 'nextApptWeeks', label: 'Review In (Weeks)', defaultValue: 6 },
    ],
  },
  {
    name: 'Teeth Whitening (Home Kit)',
    category: 'Cosmetic',
    instructions: [
      'Apply a small drop of gel into each tooth compartment of the tray.',
      'Wear for the prescribed time (usually 2-4 hours or overnight).',
      'Wipe away excess gel from gums immediately to prevent burning.',
      'Avoid "staining" foods (coffee, tea, curry, wine) for 48 hours.',
      'Use sensitivity toothpaste if you experience "zings".',
    ],
    customFields: [
      { key: 'shadeStart', label: 'Start Shade', defaultValue: 'A3' },
      { key: 'targetShade', label: 'Target Shade', defaultValue: 'B1' },
      { key: 'concentration', label: 'Gel %', defaultValue: '10% CP' },
    ],
  },
  {
    name: 'Composite Bonding',
    category: 'Cosmetic',
    instructions: [
      'Avoid coffee, tea, and red wine for 48 hours to prevent potential staining.',
      'Do not bite fingernails, pens, or open packages with your front teeth.',
      'Floss carefully; pull floss out laterally, not popping it up.',
      'Attend polish appointments every 6 months to maintain shine.',
    ],
    customFields: [
      { key: 'surfaces', label: 'Surfaces Treated', defaultValue: 'Unknown' },
      { key: 'warrantyYears', label: 'Warranty (Yrs)', defaultValue: 2 },
    ],
  },
  {
    name: 'Porcelain Veneers',
    category: 'Cosmetic',
    instructions: [
      'It is normal for gums to be slightly sore for a few days.',
      'Sensitivity to hot/cold is common for 1-2 weeks.',
      'Wear your night guard every night to protect the porcelain.',
      'Maintain excellent hygiene; veneers cannot decay but the tooth under them can.',
    ],
    customFields: [
      { key: 'veneerCount', label: 'Unit Count', defaultValue: 1 },
      { key: 'cementShade', label: 'Cement Shade', defaultValue: 'Translucent' },
    ],
  },
  {
    name: 'Dental Implant',
    category: 'General / Restorative',
    instructions: [
      'Apply ice pack to face: 10 mins on, 10 mins off for first 24 hours.',
      'Do not disturb the surgical site with tongue or fingers.',
      'Soft diet for 7 days. Absolutely no seeds, nuts, or popcorn.',
      'Rinse gently with warm salt water starting from Day 2.',
      'Avoid smoking for at least 7 days as it causes failure.',
    ],
    customFields: [
      { key: 'site', label: 'Implant Site', defaultValue: 'UR1' },
      { key: 'implantBrand', label: 'System', defaultValue: 'Straumann' },
      { key: 'healingTime', label: 'Integration (Mos)', defaultValue: 3 },
    ],
  },
  {
    name: 'Root Canal Treatment',
    category: 'General / Restorative',
    instructions: [
      'Avoid chewing on the treated tooth until the permanent crown is placed.',
      'The tooth may feel tender for 3-5 days; taking ibuprofen helps.',
      'If you develop visible swelling or a fever, contact the clinic immediately.',
      'Be gentle when brushing around the temporary filling.',
    ],
    customFields: [
      { key: 'tooth', label: 'Tooth #', defaultValue: '' },
      { key: 'canals', label: 'Canals Found', defaultValue: 1 },
      { key: 'visitStage', label: 'Stage', defaultValue: 'Obturation' },
    ],
  },
  {
    name: 'Dental Crown',
    category: 'General / Restorative',
    instructions: [
      'Avoid sticky foods (gum, toffee) while waiting for the permanent crown.',
      'Floss by pulling the floss through the side rather than popping it up.',
      'Sensitivity is normal for a few days after placement.',
      'If the bite feels "high" (hitting first), call us for an adjustment.',
    ],
    customFields: [
      { key: 'material', label: 'Material', defaultValue: 'Zirconia' },
      { key: 'glaze', label: 'Shade', defaultValue: 'A2' },
    ],
  },
  {
    name: 'White Filling (Composite)',
    category: 'General / Restorative',
    instructions: [
      'You can chew as soon as the numbness wears off (composite sets instantly).',
      'The tooth may be sensitive to cold for a few days.',
      'If the bite feels uneven or "high", return for an adjustment.',
      'Maintain regular flossing to prevent decay around the edges.',
    ],
    customFields: [
      { key: 'surfaces', label: 'Surfaces', defaultValue: 'MO' },
      { key: 'bondingAgent', label: 'Bond', defaultValue: 'Scotchbond' },
    ],
  },
  {
    name: 'Wisdom Tooth Extraction',
    category: 'General / Restorative',
    instructions: [
      'Bite firmly on gauze for 30 minutes to stop bleeding.',
      'Do NOT rinse, spit, or use a straw for 24 hours (prevents Dry Socket).',
      'Soft foods only (yogurt, mash, soup) for 2-3 days.',
      'No smoking for at least 48-72 hours.',
      'Use painkillers as prescribed before the numbness wears off.',
    ],
    customFields: [
      { key: 'difficulty', label: 'Difficulty', defaultValue: 'Surgical' },
      { key: 'sutures', label: 'Sutures Placed', defaultValue: 0 },
    ],
  },
  {
    name: 'Simple Tooth Extraction',
    category: 'General / Restorative',
    instructions: [
      'Keep the gauze pack in place with pressure for 20 minutes.',
      'Avoid hot drinks and alcohol for 24 hours.',
      'Do not disturb the clot with your tongue.',
      'Take painkillers if needed, but avoid aspirin.',
    ],
    customFields: [
      { key: 'tooth', label: 'Tooth #', defaultValue: '' },
      { key: 'comments', label: 'Notes', defaultValue: '' },
    ],
  },
  {
    name: 'Scale & Polish (Cleaning)',
    category: 'Hygiene / Preventive',
    instructions: [
      'Gums may feel slightly tender or bleed slightly today.',
      'Use warm salt water rinses if gums are sore.',
      'Avoid staining foods (curry, wine) for 2 hours as pores are open.',
      'Resume normal brushing and flossing tonight.',
    ],
    customFields: [
      { key: 'recall', label: 'Recall (Months)', defaultValue: 6 },
      { key: 'gumHealth', label: 'Gum Score', defaultValue: 'Healthy' },
    ],
  },
  {
    name: 'Deep Cleaning (Perio)',
    category: 'Hygiene / Preventive',
    instructions: [
      'Numbness may last for a few hours; chew carefully.',
      'Sensitivity to cold is common as roots heal.',
      'Use the prescribed mouthwash or salt water rinses.',
      'Use interdental brushes strictly as advised.',
    ],
    customFields: [
      { key: 'quadrants', label: 'Quadrants', defaultValue: 'UR, LR' },
      { key: 'nextVisit', label: 'Review', defaultValue: '3 Months' },
    ],
  },
  {
    name: 'Night Guard / Splint',
    category: 'General',
    instructions: [
      'Wear every night to protect teeth from grinding.',
      'Bring the guard to every check-up for adjustment.',
      'Clean with cold water and soap; do not use hot water.',
      'If it feels too tight, run it under warm water before inserting.',
    ],
    customFields: [
      { key: 'type', label: 'Design', defaultValue: 'Michigan' },
      { key: 'material', label: 'Material', defaultValue: 'Hard/Soft' },
    ],
  },
];

const categories: Category[] = ['Cosmetic', 'General / Restorative', 'Hygiene / Preventive', 'General'];

function ComplianceRing({ done, total }: { done: number; total: number }) {
  const pct = total === 0 ? 0 : done / total;
  const r = 28;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - pct);

  return (
    <svg width="72" height="72" viewBox="0 0 72 72" className="shrink-0">
      <circle cx="36" cy="36" r={r} fill="none" stroke="#1e1b2e" strokeWidth="5" />
      <circle
        cx="36"
        cy="36"
        r={r}
        fill="none"
        stroke="#7c3aed"
        strokeWidth="5"
        strokeLinecap="round"
        strokeDasharray={circ}
        strokeDashoffset={offset}
        className="transition-all duration-500"
        transform="rotate(-90 36 36)"
      />
      <text x="36" y="36" textAnchor="middle" dominantBaseline="central" className="fill-white text-xs font-bold">
        {Math.round(pct * 100)}%
      </text>
    </svg>
  );
}

function IconClipboard({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
      <path d="M9 14l2 2 4-4" />
    </svg>
  );
}

function IconCheck({ className = 'w-3 h-3' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function IconTooth({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2C9.5 2 7.3 3.2 6 5c-1.3 1.8-2 4.2-2 6.5 0 2 .5 3.5 1 5 .5 1.5 1 3 1 5 0 1 .5 1.5 1 1.5s1-.5 1.5-1.5c.3-.7.7-1.5 1.5-1.5h2c.8 0 1.2.8 1.5 1.5.5 1 1 1.5 1 1.5s.5-.5 1-1.5c.5-2 1-3.5 1-5 .5-1.5 1-3 1-5 0-2.3-.7-4.7-2-6.5C16.7 3.2 14.5 2 12 2z" />
    </svg>
  );
}

function IconSparkle({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2l1.5 5.5L19 9l-5.5 1.5L12 16l-1.5-5.5L5 9l5.5-1.5z" />
      <path d="M19 14l1 3.5L23.5 18.5 19.5 20l-1 3-1-3-4-1.5 4-1.5z" opacity="0.6" />
    </svg>
  );
}

function IconShield({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  );
}

function IconHeart({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}

const categoryIcons: Record<Category, (props: { className?: string }) => JSX.Element> = {
  'Cosmetic': IconSparkle,
  'General / Restorative': IconTooth,
  'Hygiene / Preventive': IconHeart,
  'General': IconShield,
};

interface ChecklistItem {
  id: number;
  label: string;
  timeFrame: string;
  done: boolean;
}

function buildChecklist(proc: Procedure): ChecklistItem[] {
  return proc.instructions.map((text, i) => ({
    id: i,
    label: text,
    timeFrame: i === 0 ? 'Day 0' : i <= 2 ? 'Day 0-7' : 'Ongoing',
    done: false,
  }));
}

export default function FeatureAftercare() {
  const [selectedProc, setSelectedProc] = useState(procedures[0]);
  const [items, setItems] = useState<ChecklistItem[]>(() => buildChecklist(procedures[0]));
  const [completedAll, setCompletedAll] = useState(false);

  const selectProcedure = (proc: Procedure) => {
    setSelectedProc(proc);
    setItems(buildChecklist(proc));
    setCompletedAll(false);
  };

  const toggleItem = (id: number) => {
    setItems(prev => {
      const next = prev.map(t => (t.id === id ? { ...t, done: !t.done } : t));
      if (next.every(t => t.done)) setCompletedAll(true);
      return next;
    });
  };

  const doneCount = items.filter(t => t.done).length;

  return (
    <div className="max-w-lg mx-auto">
      <div className="bg-ink-900 rounded-xl border border-ink-border overflow-hidden shadow-2xl shadow-violet-glow/10">

        {/* Header */}
        <div className="px-5 pt-5 pb-4 border-b border-ink-border">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-7 h-7 rounded-lg bg-violet-600 flex items-center justify-center">
              <IconClipboard className="w-4 h-4 text-white" />
            </div>
            <div>
              <span className="text-sm font-semibold text-onDark-100 block leading-tight">Aftercare Plans</span>
              <span className="text-[10px] text-onDark-500">13 procedure templates</span>
            </div>
            <div className="ml-auto">
              <ComplianceRing done={doneCount} total={items.length} />
            </div>
          </div>

          {/* Category selector */}
          <div className="flex gap-1.5 mb-3">
            {categories.map(cat => {
              const CatIcon = categoryIcons[cat];
              const isActive = selectedProc.category === cat;
              return (
                <button
                  key={cat}
                  onClick={() => {
                    const first = procedures.find(p => p.category === cat);
                    if (first) selectProcedure(first);
                  }}
                  className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[10px] font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-violet-600 text-white'
                      : 'bg-ink-800 text-onDark-500 hover:text-onDark-100 hover:bg-ink-800/80'
                  }`}
                >
                  <CatIcon className="w-3 h-3" />
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Procedure pills within active category */}
          <div className="flex flex-wrap gap-1.5">
            {procedures
              .filter(p => p.category === selectedProc.category)
              .map(proc => (
                <button
                  key={proc.name}
                  onClick={() => selectProcedure(proc)}
                  className={`px-2 py-1 rounded-md text-[9px] font-medium transition-all cursor-pointer ${
                    selectedProc.name === proc.name
                      ? 'bg-violet-600/20 text-violet-300 ring-1 ring-violet-600/40'
                      : 'bg-ink-800/60 text-onDark-500 hover:text-onDark-200 hover:bg-ink-800'
                  }`}
                >
                  {proc.name}
                </button>
              ))}
          </div>
        </div>

        {/* Procedure details */}
        <div className="px-5 pt-4 pb-2">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-semibold text-violet-400">{selectedProc.name}</span>
            <span className="text-[9px] px-1.5 py-0.5 rounded bg-ink-800 text-onDark-500 font-medium">{selectedProc.category}</span>
          </div>
          <div className="flex flex-wrap gap-x-3 gap-y-1 mb-3">
            {selectedProc.customFields.map(f => (
              <span key={f.key} className="text-[9px] text-onDark-500">
                <span className="text-onDark-400">{f.label}:</span>{' '}
                <span className="text-onDark-200 font-medium">{f.defaultValue}</span>
              </span>
            ))}
          </div>
        </div>

        {/* Care protocol card */}
        <div className="mx-5 mb-3 p-3 rounded-lg bg-ink-800/50 border border-ink-border">
          <div className="flex items-center gap-1.5 mb-2">
            <IconClipboard className="w-3 h-3 text-violet-400" />
            <span className="text-[9px] font-semibold text-onDark-400 uppercase tracking-wider">Care Protocol</span>
          </div>
          <ol className="space-y-1.5">
            {selectedProc.instructions.map((instr, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="w-4 h-4 rounded-full bg-violet-600/20 text-violet-400 flex items-center justify-center shrink-0 text-[8px] font-bold mt-0.5">
                  {i + 1}
                </span>
                <span className="text-[10px] text-onDark-300 leading-relaxed">{instr}</span>
              </li>
            ))}
          </ol>
        </div>

        {/* Checklist */}
        <div className="px-5 py-3 border-t border-ink-border">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-semibold text-onDark-500 uppercase tracking-wider">Checklist</span>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-semibold text-violet-400">{doneCount}/{items.length}</span>
              {completedAll && (
                <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-emerald-600/20 text-emerald-400 font-semibold">
                  Complete
                </span>
              )}
            </div>
          </div>
          <div className="space-y-1.5">
            {items.map(item => (
              <button
                key={item.id}
                onClick={() => toggleItem(item.id)}
                className={`w-full flex items-center gap-3 p-2.5 rounded-lg transition-all cursor-pointer ${
                  item.done
                    ? 'bg-violet-600/10 border border-violet-600/20'
                    : 'bg-ink-800 border border-ink-border hover:border-onDark-500'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded flex items-center justify-center shrink-0 transition-all ${
                    item.done ? 'bg-violet-600 text-white' : 'border border-onDark-500'
                  }`}
                >
                  {item.done && <IconCheck className="w-2.5 h-2.5" />}
                </div>
                <div className="flex-1 text-left min-w-0">
                  <span
                    className={`text-[11px] font-medium leading-tight block ${
                      item.done ? 'text-violet-400 line-through' : 'text-onDark-100'
                    }`}
                  >
                    {item.label}
                  </span>
                </div>
                <span className="text-[8px] text-onDark-500 shrink-0 font-medium">{item.timeFrame}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Progress bar */}
        <div className="px-5 pb-5">
          <div className="h-1.5 bg-ink-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-violet-600 rounded-full transition-all duration-500"
              style={{ width: `${(doneCount / items.length) * 100}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
