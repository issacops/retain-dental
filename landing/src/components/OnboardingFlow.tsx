import React, { useState, useCallback } from 'react'

type Step = 0 | 1 | 2 | 3
type State = 'idle' | 'saving' | 'error'

interface Data {
  practiceType: string
  locations: string
  clinic: string
  color: string
  name: string
  email: string
  phone: string
  countryCode: string
}

const COLORS = ['#0D9488', '#0EA5E9', '#4F46E5', '#DB2777', '#EA580C', '#0F172A']
const STORAGE_KEY = 'retain_onboarding_uuid'

function uuid(): string {
  if (typeof window === 'undefined') return ''
  let v = localStorage.getItem(STORAGE_KEY)
  if (!v) { v = crypto.randomUUID(); localStorage.setItem(STORAGE_KEY, v) }
  return v
}
function utm(): Record<string, string> {
  if (typeof window === 'undefined') return {}
  const p = new URLSearchParams(window.location.search)
  const out: Record<string, string> = {}
  ;['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'].forEach((k) => { const val = p.get(k); if (val) out[k] = val })
  return out
}

const LEAD_ENDPOINT =
  import.meta.env.PUBLIC_LEAD_ENDPOINT || 'https://script.google.com/macros/s/AKfycbz6qn1HXCN9F3YbCr14cLB9DK4LQzHO6tjrMe5Sb8IZlA6AGBgZcbRAn4UJv4LycLss/exec'

async function postLead(payload: Record<string, unknown>) {
  // Formspree wants JSON. Google Apps Script web apps want a "simple" request,
  // so we send text/plain there to avoid a CORS preflight it cannot answer.
  const isAppsScript = /script\.google\.com/.test(LEAD_ENDPOINT)
  const res = await fetch(LEAD_ENDPOINT, {
    method: 'POST',
    headers: isAppsScript
      ? { 'Content-Type': 'text/plain;charset=utf-8' }
      : { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!res.ok) throw new Error('lead failed')
}

export default function OnboardingFlow() {
  const [step, setStep] = useState<Step>(0)
  const [state, setState] = useState<State>('idle')
  const [id] = useState(uuid)
  const [data, setData] = useState<Data>({
    practiceType: '', locations: '1', clinic: '', color: COLORS[0],
    name: '', email: '', phone: '', countryCode: '+1',
  })
  const set = (k: keyof Data, v: string) => setData((d) => ({ ...d, [k]: v }))

  const submit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    setState('saving')
    try {
      await postLead({
        _subject: `New free trial: ${data.clinic || data.name}`,
        kind: 'free-trial',
        name: data.name,
        email: data.email,
        phone: data.phone,
        country_code: data.countryCode,
        clinic_name: data.clinic,
        practice_type: data.practiceType,
        locations: data.locations,
        app_color: data.color,
        source: 'onboarding',
        utm: utm(),
      })
      if (typeof window !== 'undefined' && typeof (window as any).__retain_track === 'function') {
        ;(window as any).__retain_track('start_free_trial', { clinic: data.clinic, type: data.practiceType })
      }
      setState('idle')
      setStep(3)
    } catch {
      setState('error')
    }
  }, [data, id])

  const progress = step >= 3 ? 100 : Math.round(((step + 1) / 3) * 100)
  const appUrl = `https://app.retaindental.com/?welcome=1&clinic=${encodeURIComponent(data.clinic)}&color=${encodeURIComponent(data.color.replace('#', ''))}`

  return (
    <div className="card overflow-hidden">
      {/* progress */}
      <div className="h-1.5 w-full bg-cream-200">
        <div className="h-full bg-teal-600 transition-all duration-500" style={{ width: `${progress}%` }} />
      </div>

      <div className="p-7 sm:p-10">
        {step < 3 && (
          <p className="eyebrow text-teal-700">Step {step + 1} of 3</p>
        )}

        {/* STEP 1 — practice */}
        {step === 0 && (
          <div>
            <h2 className="mt-3 font-heading text-2xl font-semibold tracking-tight text-ink-900">Tell us about your practice</h2>
            <p className="mt-2 text-[15px] text-ink-600">This shapes your app and your dashboard. It takes about 40 seconds.</p>

            <div className="mt-7 space-y-5">
              <div>
                <label className="mb-2 block text-sm font-medium text-ink-800">Practice name</label>
                <input value={data.clinic} onChange={(e) => set('clinic', e.target.value)} placeholder="Northside Dental"
                  className="w-full rounded-xl border border-cream-300 bg-white px-4 py-3 text-[15px] text-ink-900 outline-none transition-colors placeholder:text-ink-400 focus:border-teal-500" />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-ink-800">Practice type</label>
                <div className="grid grid-cols-3 gap-2">
                  {[{ v: 'solo', l: 'Solo' }, { v: 'multi', l: 'Multi-doctor' }, { v: 'dso', l: 'DSO / Group' }].map((o) => (
                    <button type="button" key={o.v} onClick={() => set('practiceType', o.v)}
                      className={'rounded-xl border px-3 py-3 text-sm font-medium transition-colors ' + (data.practiceType === o.v ? 'border-teal-600 bg-teal-50 text-teal-800' : 'border-cream-300 bg-white text-ink-700 hover:border-teal-300')}>
                      {o.l}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-ink-800">How many locations?</label>
                <input type="number" min="1" value={data.locations} onChange={(e) => set('locations', e.target.value)}
                  className="w-32 rounded-xl border border-cream-300 bg-white px-4 py-3 text-[15px] text-ink-900 outline-none transition-colors focus:border-teal-500" />
              </div>
            </div>

            <button type="button" disabled={!data.clinic}
              onClick={() => setStep(1)}
              className="btn-primary mt-8 w-full min-h-[52px] disabled:cursor-not-allowed disabled:opacity-40">
              Continue
            </button>
          </div>
        )}

        {/* STEP 2 — branding */}
        {step === 1 && (
          <div>
            <h2 className="mt-3 font-heading text-2xl font-semibold tracking-tight text-ink-900">Make it yours</h2>
            <p className="mt-2 text-[15px] text-ink-600">Pick your app colour. You can change it, add your logo, and fine-tune everything later.</p>

            <div className="mt-7 grid gap-8 sm:grid-cols-[1fr_auto] sm:items-center">
              <div>
                <p className="mb-3 text-sm font-medium text-ink-800">App colour</p>
                <div className="flex flex-wrap gap-3">
                  {COLORS.map((c) => (
                    <button type="button" key={c} onClick={() => set('color', c)} aria-label={`Colour ${c}`}
                      className={'h-11 w-11 rounded-full transition-transform ' + (data.color === c ? 'ring-2 ring-offset-2 ring-ink-900 scale-105' : 'hover:scale-105')}
                      style={{ backgroundColor: c }} />
                  ))}
                </div>
                <p className="mt-5 text-sm font-medium text-ink-800">Your app preview</p>
              </div>

              {/* mini phone preview */}
              <div className="mx-auto w-[190px] rounded-[1.8rem] border-[6px] border-ink-900 bg-ink-900 shadow-card">
                <div className="rounded-[1.4rem] bg-cream-50 p-3">
                  <div className="rounded-xl bg-white p-3 shadow-soft">
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-ink-400">{data.clinic || 'Your practice'}</p>
                    <p className="mt-1 text-[13px] font-semibold text-ink-900">Riya Sharma</p>
                    <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-cream-200">
                      <div className="h-full rounded-full" style={{ width: '62%', backgroundColor: data.color }} />
                    </div>
                    <div className="mt-3 flex items-center justify-between rounded-lg px-2 py-1.5" style={{ backgroundColor: data.color + '1a' }}>
                      <span className="text-[10px] font-semibold" style={{ color: data.color }}>Aftercare today</span>
                      <span className="text-[10px] font-bold" style={{ color: data.color }}>+10</span>
                    </div>
                  </div>
                  <div className="mt-3 flex justify-around rounded-xl bg-white py-2">
                    {[0, 1, 2].map((i) => (<span key={i} className="h-1.5 w-6 rounded-full" style={{ backgroundColor: i === 0 ? data.color : '#E7E1D6' }} />))}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 flex gap-3">
              <button type="button" onClick={() => setStep(0)} className="btn-ghost min-h-[52px]">Back</button>
              <button type="button" onClick={() => setStep(2)} className="btn-primary min-h-[52px] flex-1">Continue</button>
            </div>
          </div>
        )}

        {/* STEP 3 — account */}
        {step === 2 && (
          <form onSubmit={submit}>
            <h2 className="mt-3 font-heading text-2xl font-semibold tracking-tight text-ink-900">Where should we send your login?</h2>
            <p className="mt-2 text-[15px] text-ink-600">14 days free. No credit card. We will not add you to a drip campaign.</p>

            <div className="mt-7 space-y-5">
              <div>
                <label className="mb-2 block text-sm font-medium text-ink-800">Full name</label>
                <input required value={data.name} onChange={(e) => set('name', e.target.value)} placeholder="Dr. Jane Smith"
                  className="w-full rounded-xl border border-cream-300 bg-white px-4 py-3 text-[15px] text-ink-900 outline-none transition-colors placeholder:text-ink-400 focus:border-teal-500" />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-ink-800">Work email</label>
                <input required type="email" value={data.email} onChange={(e) => set('email', e.target.value)} placeholder="jane@practice.com"
                  className="w-full rounded-xl border border-cream-300 bg-white px-4 py-3 text-[15px] text-ink-900 outline-none transition-colors placeholder:text-ink-400 focus:border-teal-500" />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-ink-800">Mobile</label>
                <div className="flex gap-2">
                  <select value={data.countryCode} onChange={(e) => set('countryCode', e.target.value)}
                    className="rounded-xl border border-cream-300 bg-white px-3 py-3 text-[15px] text-ink-900 outline-none focus:border-teal-500">
                    {['+1', '+44', '+61', '+91', '+971', '+65'].map((c) => (<option key={c} value={c}>{c}</option>))}
                  </select>
                  <input required value={data.phone} onChange={(e) => set('phone', e.target.value)} placeholder="555 123 4567"
                    className="w-full rounded-xl border border-cream-300 bg-white px-4 py-3 text-[15px] text-ink-900 outline-none transition-colors placeholder:text-ink-400 focus:border-teal-500" />
                </div>
              </div>
            </div>

            {state === 'error' && (
              <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4">
                <p className="text-sm text-ink-800">We could not submit that automatically.</p>
                <a
                  href={`mailto:hello@retaindental.com?subject=${encodeURIComponent('Free trial: ' + (data.clinic || data.name))}&body=${encodeURIComponent(
                    `Practice: ${data.clinic}\nName: ${data.name}\nEmail: ${data.email}\nMobile: ${data.countryCode} ${data.phone}\nType: ${data.practiceType}\nLocations: ${data.locations}\nApp colour: ${data.color}`
                  )}`}
                  className="mt-2 inline-flex text-sm font-semibold text-teal-700 underline decoration-teal-300 underline-offset-4"
                >
                  Send it as an email instead
                </a>
              </div>
            )}

            <div className="mt-8 flex gap-3">
              <button type="button" onClick={() => setStep(1)} className="btn-ghost min-h-[52px]">Back</button>
              <button type="submit" disabled={state === 'saving'} className="btn-primary min-h-[52px] flex-1 disabled:opacity-60">
                {state === 'saving' ? 'Creating your app...' : 'Start free trial'}
              </button>
            </div>
            <p className="mt-4 text-center text-xs text-ink-500">By continuing you agree to our <a href="/privacy" className="underline">Privacy Policy</a>.</p>
          </form>
        )}

        {/* SUCCESS */}
        {step === 3 && (
          <div className="text-center">
            <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-teal-100 text-teal-700">
              <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
            </span>
            <h2 className="mt-6 font-heading text-2xl font-semibold tracking-tight text-ink-900">You're in, {data.name.split(' ')[0] || 'friend'}.</h2>
            <p className="mx-auto mt-3 max-w-md text-[15px] leading-relaxed text-ink-600">
              Your app is being built for <strong className="text-ink-900">{data.clinic}</strong>. We have sent setup steps to {data.email}. Most practices are live in about 20 minutes.
            </p>

            <ol className="mx-auto mt-8 max-w-md space-y-3 text-left">
              {['Open your clinic workspace', 'Add your logo and invite your team', 'Import patients and send your first aftercare plan'].map((s, i) => (
                <li key={i} className="flex items-start gap-3 text-[15px] text-ink-700">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-teal-100 text-xs font-bold text-teal-800">{i + 1}</span>
                  {s}
                </li>
              ))}
            </ol>

            <a href={appUrl} data-cta="onboarding-open-app" className="btn-primary mt-8 min-h-[52px] w-full sm:w-auto">Open my workspace</a>
            <p className="mt-4 text-xs text-ink-500">Bookmark this page: you can return to it any time.</p>
          </div>
        )}
      </div>
    </div>
  )
}
