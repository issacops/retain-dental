import { useState } from 'react';

const tabs = [
  { id: 'home', label: 'HOME', icon: '🏠' },
  { id: 'wallet', label: 'WALLET', icon: '💳' },
  { id: 'care', label: 'CARE', icon: '🦷' },
  { id: 'profile', label: 'PROFILE', icon: '👤' },
];

const walletItems = [
  { type: 'earn', label: 'Daily Care Ritual', points: '+50', time: 'Today' },
  { type: 'earn', label: 'Check-in Complete', points: '+25', time: 'Yesterday' },
  { type: 'redeem', label: 'Whitening Kit', points: '-5,000', time: '2 days ago' },
  { type: 'earn', label: 'Appointment Kept', points: '+200', time: '3 days ago' },
];

const careSteps = [
  { step: 1, title: 'Brush for 2 minutes', done: true },
  { step: 2, title: 'Floss all teeth', done: true },
  { step: 3, title: 'Use mouthwash', done: false },
  { step: 4, title: 'Apply fluoride gel', done: false },
];

export default function FeaturePatientPwa() {
  const [activeTab, setActiveTab] = useState('home');
  const [steps, setSteps] = useState(careSteps);

  const toggleStep = (idx: number) => {
    setSteps(prev => prev.map((s, i) => i === idx ? { ...s, done: !s.done } : s));
  };

  return (
    <div className="relative mx-auto w-[280px] sm:w-[300px]">
      <div className="rounded-[2.5rem] bg-gradient-to-b from-[#fdf8f0] to-[#f0e8db] border border-gray-200 shadow-2xl shadow-teal-900/10 overflow-hidden">
        {/* Status bar */}
        <div className="flex items-center justify-between px-6 pt-3 pb-1">
          <span className="text-[10px] font-semibold text-slate-500">9:41</span>
          <div className="flex gap-1">
            <div className="w-4 h-2 rounded-sm bg-slate-300"></div>
            <div className="w-3 h-2 rounded-sm bg-slate-300"></div>
          </div>
        </div>

        {/* Header */}
        <div className="px-5 py-2 flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-teal-600 flex items-center justify-center text-white text-[9px] font-black">R</div>
          <span className="text-xs font-bold text-slate-900">RetainOS Clinic</span>
        </div>

        {/* Content area */}
        <div className="px-5 pb-3 min-h-[320px]">
          {activeTab === 'home' && (
            <div className="space-y-3">
              {/* Loyalty card */}
              <div className="bg-white rounded-3xl p-4 shadow-sm border border-cream-100">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Loyalty Status</p>
                    <p className="text-sm font-black text-slate-900 mt-0.5">Welcome, Sarah</p>
                  </div>
                  <div className="px-2.5 py-1 bg-amber-100 rounded-full">
                    <span className="text-[9px] font-black text-amber-700">GOLD</span>
                  </div>
                </div>
                <p className="text-2xl font-black text-slate-900">2,450 <span className="text-sm font-bold text-slate-400">Pts</span></p>
                <div className="mt-2 h-1 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full w-[62%] bg-gradient-to-r from-teal-500 to-amber-500 rounded-full"></div>
                </div>
                <p className="text-[9px] text-slate-400 mt-1">550 pts to Platinum</p>
              </div>

              {/* Next appointment */}
              <div className="bg-white rounded-3xl p-4 shadow-sm border border-cream-100">
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-2">Next Visit</p>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-teal-50 flex flex-col items-center justify-center shrink-0">
                    <span className="text-[9px] font-bold text-teal-600 leading-none">JAN</span>
                    <span className="text-lg font-black text-teal-700 leading-none mt-0.5">15</span>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">Cleaning & Checkup</p>
                    <p className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                      Confirmed
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'wallet' && (
            <div className="space-y-3">
              <div className="bg-slate-900 rounded-3xl p-4 text-white">
                <p className="text-[9px] font-bold text-white/50 uppercase tracking-widest">Balance</p>
                <p className="text-3xl font-black mt-1">2,450</p>
                <p className="text-xs text-white/60">Smile Points</p>
              </div>
              {walletItems.map((item, i) => (
                <div key={i} className="bg-white rounded-2xl p-3 shadow-sm border border-cream-100 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${item.type === 'earn' ? 'bg-emerald-50' : 'bg-rose-50'}`}>
                      <span className={`text-xs font-bold ${item.type === 'earn' ? 'text-emerald-600' : 'text-rose-600'}`}>
                        {item.type === 'earn' ? '↓' : '↑'}
                      </span>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900">{item.label}</p>
                      <p className="text-[9px] text-slate-400">{item.time}</p>
                    </div>
                  </div>
                  <span className={`text-sm font-black ${item.type === 'earn' ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {item.points}
                  </span>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'care' && (
            <div className="space-y-3">
              <div className="bg-white rounded-3xl p-4 shadow-sm border border-cream-100">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                  <p className="text-xs font-bold text-slate-900">Daily Care Ritual</p>
                </div>
                <div className="space-y-2">
                  {steps.map((s, i) => (
                    <button
                      key={i}
                      onClick={() => toggleStep(i)}
                      className={`w-full flex items-center gap-3 p-2.5 rounded-xl transition-all ${
                        s.done ? 'bg-emerald-50 border border-emerald-200' : 'bg-slate-50 border border-slate-200'
                      }`}
                    >
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                        s.done ? 'bg-emerald-500 text-white' : 'border-2 border-slate-300'
                      }`}>
                        {s.done && <span className="text-[8px]">✓</span>}
                      </div>
                      <span className={`text-xs font-semibold ${s.done ? 'text-emerald-700 line-through' : 'text-slate-700'}`}>
                        {s.title}
                      </span>
                    </button>
                  ))}
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-[9px] text-slate-400">{steps.filter(s => s.done).length}/{steps.length} complete</span>
                  <span className="text-[9px] font-bold text-emerald-600">+{steps.filter(s => s.done).length * 50} pts</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'profile' && (
            <div className="space-y-3">
              <div className="bg-white rounded-3xl p-4 shadow-sm border border-cream-100 text-center">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-teal-500 to-teal-700 flex items-center justify-center text-white text-xl font-black mx-auto">S</div>
                <p className="text-sm font-bold text-slate-900 mt-2">Sarah Johnson</p>
                <p className="text-[10px] text-slate-400">Gold Member since 2024</p>
              </div>
              <div className="bg-white rounded-3xl p-4 shadow-sm border border-cream-100">
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-2">Household</p>
                <div className="space-y-2">
                  {['Sarah (You)', 'Mike Johnson', 'Emma Johnson'].map((name, i) => (
                    <div key={i} className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-50">
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-white text-[8px] font-bold ${i === 0 ? 'bg-teal-500' : i === 1 ? 'bg-amber-500' : 'bg-rose-500'}`}>
                        {name[0]}
                      </div>
                      <span className="text-xs font-semibold text-slate-700">{name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Tab bar */}
        <div className="px-4 pb-4">
          <div className="bg-white/95 backdrop-blur-xl rounded-[28px] p-1.5 flex shadow-lg border border-gray-100">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex flex-col items-center gap-0.5 py-2 rounded-[22px] transition-all ${
                  activeTab === tab.id ? 'bg-teal-600 text-white shadow-md' : 'text-slate-400'
                }`}
              >
                <span className="text-sm">{tab.icon}</span>
                <span className="text-[7px] font-bold tracking-wider">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
