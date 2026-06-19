import { useState } from 'react';

const procedures = [
  { id: 'root-canal', label: 'Root Canal' },
  { id: 'implant', label: 'Implant' },
  { id: 'extraction', label: 'Extraction' },
  { id: 'whitening', label: 'Whitening' },
];

const initialTasks = [
  { id: 1, label: 'Apply ice pack (15 min on, 15 off)', days: 'Day 0–2' },
  { id: 2, label: 'Take prescribed antibiotics', days: 'Day 0–7' },
  { id: 3, label: 'Rinse with warm salt water', days: 'Day 1–7' },
  { id: 4, label: 'Avoid hard/crunchy foods', days: 'Day 0–5' },
  { id: 5, label: 'Schedule follow-up appointment', days: 'Day 7' },
];

export default function FeatureAftercare() {
  const [selectedProc, setSelectedProc] = useState('root-canal');
  const [tasks, setTasks] = useState(initialTasks);

  const toggleTask = (id: number) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t));
  };

  const doneCount = tasks.filter(t => t.done).length;

  return (
    <div className="max-w-md mx-auto">
      <div className="bg-ink-900 rounded border border-ink-border overflow-hidden shadow-2xl shadow-violet-glow/10">
        {/* Header */}
        <div className="px-5 pt-5 pb-3 border-b border-ink-border">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-6 rounded-lg bg-violet-600 flex items-center justify-center">
              <svg className="w-3 h-3 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
            </div>
            <span className="text-xs font-semibold text-onDark-100">Aftercare Checklists</span>
          </div>
          <div className="flex gap-1.5">
            {procedures.map(p => (
              <button
                key={p.id}
                onClick={() => setSelectedProc(p.id)}
                className={`px-2.5 py-1 rounded text-[9px] font-semibold transition-all ${
                  selectedProc === p.id
                    ? 'bg-violet-600 text-white'
                    : 'bg-ink-800 text-onDark-500 hover:text-onDark-100'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Checklist */}
        <div className="px-5 py-4 space-y-2">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-semibold text-onDark-500 uppercase tracking-wider">Recovery Tasks</span>
            <span className="text-[10px] font-semibold text-violet-400">{doneCount}/{tasks.length}</span>
          </div>
          {tasks.map(task => (
            <button
              key={task.id}
              onClick={() => toggleTask(task.id)}
              className={`w-full flex items-center gap-3 p-2.5 rounded transition-all ${
                task.done ? 'bg-violet-600/10 border border-violet-600/20' : 'bg-ink-800 border border-ink-border'
              }`}
            >
              <div className={`w-4 h-4 rounded flex items-center justify-center shrink-0 ${
                task.done ? 'bg-violet-600 text-white' : 'border border-onDark-500'
              }`}>
                {task.done && <span className="text-[7px]">✓</span>}
              </div>
              <div className="flex-1 text-left">
                <span className={`text-[11px] font-medium ${task.done ? 'text-violet-400 line-through' : 'text-onDark-100'}`}>
                  {task.label}
                </span>
              </div>
              <span className="text-[8px] text-onDark-500 shrink-0">{task.days}</span>
            </button>
          ))}
        </div>

        {/* Progress bar */}
        <div className="px-5 pb-5">
          <div className="h-1.5 bg-ink-800 rounded overflow-hidden">
            <div
              className="h-full bg-violet-600 rounded transition-all duration-500"
              style={{ width: `${(doneCount / tasks.length) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}
