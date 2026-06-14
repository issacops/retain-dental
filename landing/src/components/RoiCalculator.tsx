import { useState } from 'react'

function formatUSD(n: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n)
}

export default function RoiCalculator() {
  const [newPatients, setNewPatients] = useState(40)
  const [acv, setAcv] = useState(250)
  const [retentionRate, setRetentionRate] = useState(40)

  const currentRetained = Math.round(newPatients * (retentionRate / 100))
  const retainedWithOs = Math.round(newPatients * 0.96)
  const extraPatients = retainedWithOs - currentRetained
  const extraRevenue = extraPatients * acv * 12

  return (
    <section id="roi" class="py-24 px-6 bg-slate-950 relative overflow-hidden">
      <div class="max-w-7xl mx-auto">
        <div class="flex flex-col lg:flex-row gap-12 lg:gap-16 items-start">
          <div class="flex-1 w-full space-y-8">
            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-widest">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
              ROI Calculator
            </div>
            <h2 class="text-4xl md:text-5xl font-black text-white tracking-tighter leading-tight">
              What is a <span class="text-emerald-400">96% retention rate</span> worth to your practice?
            </h2>
            <p class="text-lg text-slate-400 leading-relaxed">
              Move the sliders to see how RetainOS grows your revenue.
            </p>

            <div class="space-y-6 max-w-md">
              <div>
                <div class="flex items-center justify-between mb-2">
                  <label class="text-sm text-slate-400">New patients per month</label>
                  <span class="text-white font-bold">{newPatients}</span>
                </div>
                <input type="range" min="10" max="200" value={newPatients} onInput={(e) => setNewPatients(Number((e.target as HTMLInputElement).value))} class="w-full h-2 bg-slate-800 rounded-full appearance-none cursor-pointer accent-emerald-500" />
              </div>
              <div>
                <div class="flex items-center justify-between mb-2">
                  <label class="text-sm text-slate-400">Avg. value per patient visit</label>
                  <span class="text-white font-bold">{formatUSD(acv)}</span>
                </div>
                <input type="range" min="50" max="2000" step="50" value={acv} onInput={(e) => setAcv(Number((e.target as HTMLInputElement).value))} class="w-full h-2 bg-slate-800 rounded-full appearance-none cursor-pointer accent-emerald-500" />
              </div>
              <div>
                <div class="flex items-center justify-between mb-2">
                  <label class="text-sm text-slate-400">Current retention rate</label>
                  <span class="text-white font-bold">{retentionRate}%</span>
                </div>
                <input type="range" min="10" max="80" value={retentionRate} onInput={(e) => setRetentionRate(Number((e.target as HTMLInputElement).value))} class="w-full h-2 bg-slate-800 rounded-full appearance-none cursor-pointer accent-emerald-500" />
              </div>
            </div>
          </div>

          <div class="flex-1 w-full">
            <div class="p-6 sm:p-8 rounded-[2rem] bg-gradient-to-br from-emerald-900/20 to-slate-900 border border-emerald-700/20 shadow-2xl">
              <div class="text-center mb-6 sm:mb-8">
                <p class="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-2">Annual Revenue Impact</p>
                <p class="text-4xl sm:text-5xl md:text-6xl font-black text-white break-all sm:break-normal">{formatUSD(extraRevenue)}</p>
                <p class="text-sm text-slate-500 mt-2">in additional revenue with RetainOS</p>
              </div>
              <div class="grid grid-cols-2 gap-4 sm:gap-6">
                <div class="p-4 sm:p-5 rounded-xl bg-white/5">
                  <p class="text-xs text-slate-500 uppercase tracking-wider">Currently Retained</p>
                  <p class="text-xl sm:text-2xl font-black text-white">{currentRetained}</p>
                  <p class="text-xs text-slate-600">patients/mo ({retentionRate}%)</p>
                </div>
                <div class="p-4 sm:p-5 rounded-xl bg-white/5">
                  <p class="text-xs text-slate-500 uppercase tracking-wider">With RetainOS</p>
                  <p class="text-xl sm:text-2xl font-black text-emerald-400">{retainedWithOs}</p>
                  <p class="text-xs text-slate-600">patients/mo (96%)</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
