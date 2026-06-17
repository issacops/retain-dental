import { useState, useCallback, useEffect } from 'react'
import PhoneInput from './PhoneInput'

type FormState = 'idle' | 'submitting' | 'success' | 'error'

interface FormData {
  name: string
  email: string
  phone: string
  countryCode: string
  clinic: string
  practiceType: string
  locations: string
}

const STORAGE_KEY = 'retainos_lead_uuid'

function getOrCreateUUID(): string {
  if (typeof window === 'undefined') return ''
  let uuid = localStorage.getItem(STORAGE_KEY)
  if (!uuid) {
    uuid = crypto.randomUUID()
    localStorage.setItem(STORAGE_KEY, uuid)
  }
  return uuid
}

export default function DemoForm() {
  const [state, setState] = useState<FormState>('idle')
  const [form, setForm] = useState<FormData>({
    name: '', email: '', phone: '', countryCode: '+1',
    clinic: '', practiceType: '', locations: ''
  })
  const [uuid] = useState(getOrCreateUUID)

  const update = (field: keyof FormData, value: string) => {
    setForm(f => ({ ...f, [field]: value }))
  }

  useEffect(() => {
    const timeout = setTimeout(async () => {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
      const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY
      if (!supabaseUrl || !supabaseKey || !uuid) return
      const hasData = form.name || form.email || form.phone || form.clinic
      if (!hasData) return

      try {
        const { createClient } = await import('@supabase/supabase-js')
        const supabase = createClient(supabaseUrl, supabaseKey)

        const { error } = await supabase.from('leads').upsert({
          id: uuid,
          name: form.name || null,
          email: form.email || null,
          phone: form.phone || null,
          country_code: form.countryCode,
          clinic_name: form.clinic || null,
          practice_type: form.practiceType || null,
          locations: form.locations ? parseInt(form.locations) : null,
          form_data: form,
          source: 'landing-page',
          status: 'incomplete',
        }, { onConflict: 'id' })

        if (error) console.error('Partial save failed:', error)
      } catch (err) {
        console.error('Partial save error:', err)
      }
    }, 1000)

    return () => clearTimeout(timeout)
  }, [form, uuid])

  const submit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    setState('submitting')

    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey) {
      setState('error')
      return
    }

    try {
      const { createClient } = await import('@supabase/supabase-js')
      const supabase = createClient(supabaseUrl, supabaseKey)

      const { error } = await supabase.from('leads').upsert({
        id: uuid,
        name: form.name,
        email: form.email,
        phone: form.phone,
        country_code: form.countryCode,
        clinic_name: form.clinic,
        practice_type: form.practiceType,
        locations: form.locations ? parseInt(form.locations) : null,
        form_data: form,
        source: 'landing-page',
        status: 'new',
      }, { onConflict: 'id' })

      if (error) throw error

      if (typeof window !== 'undefined' && typeof (window as any).__retainOS_trackConversion === 'function') {
        (window as any).__retainOS_trackConversion('generate_lead')
      }

      setState('success')
    } catch (err) {
      console.error('Submit error:', err)
      setState('error')
    }
  }, [form, uuid])

  if (state === 'success') {
    return (
      <div class="max-w-lg mx-auto p-10 rounded-3xl bg-white border border-cream-200 text-center space-y-6 shadow-xl">
        <div class="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#0d9488" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
        </div>
        <div>
          <h3 class="text-2xl font-black text-slate-900 mb-2">You're in.</h3>
          <p class="text-slate-500 leading-relaxed">We'll be in touch within 24 hours to schedule your personalized 30-minute demo.</p>
        </div>
        <div class="p-5 rounded-2xl bg-cream-50 border border-cream-200">
          <p class="text-sm text-slate-600 leading-relaxed">While you wait, here's what you can expect: a walkthrough of your branded patient app, a custom migration plan from your current tools, and a live Q&A with our team.</p>
        </div>
        <button onClick={() => { setState('idle'); setForm({ name: '', email: '', phone: '', countryCode: '+1', clinic: '', practiceType: '', locations: '' }) }} class="text-sm text-slate-400 hover:text-slate-600 transition-colors">
          Submit another request
        </button>
      </div>
    )
  }

  return (
    <div id="demo-form" class="grid lg:grid-cols-2 gap-10 lg:gap-16 items-start">
      <div class="space-y-8">
        <div>
          <h2 class="text-3xl md:text-4xl font-black text-slate-900 tracking-tight mb-4">What to expect from<br/>your RetainOS demo</h2>
          <p class="text-slate-500 leading-relaxed">See how RetainOS replaces your recall, loyalty, and review tools with one branded patient app.</p>
        </div>

        <div class="space-y-5">
          <div class="flex items-start gap-4">
            <div class="w-7 h-7 rounded-full bg-teal-100 flex items-center justify-center shrink-0 mt-0.5">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0d9488" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            </div>
            <p class="text-slate-700 leading-relaxed">In a <strong>30-minute session</strong>, you and your team will see exactly how RetainOS replaces 6 separate tools</p>
          </div>
          <div class="flex items-start gap-4">
            <div class="w-7 h-7 rounded-full bg-teal-100 flex items-center justify-center shrink-0 mt-0.5">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0d9488" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            </div>
            <p class="text-slate-700 leading-relaxed">Walk through a <strong>live branded patient app</strong> built for your clinic — not a generic demo</p>
          </div>
          <div class="flex items-start gap-4">
            <div class="w-7 h-7 rounded-full bg-teal-100 flex items-center justify-center shrink-0 mt-0.5">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0d9488" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            </div>
            <p class="text-slate-700 leading-relaxed">Get a <strong>custom migration plan</strong> from your current stack — no disruption to your workflow</p>
          </div>
          <div class="flex items-start gap-4">
            <div class="w-7 h-7 rounded-full bg-teal-100 flex items-center justify-center shrink-0 mt-0.5">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0d9488" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            </div>
            <p class="text-slate-700 leading-relaxed">See how <strong>12 pilot clinics</strong> increased patient retention by 4.2x in the first 90 days</p>
          </div>
        </div>

        <div class="flex items-center gap-6 pt-4 border-t border-cream-200">
          <span class="flex items-center gap-2 text-sm text-slate-500">
            <svg class="w-4 h-4 text-teal-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
            HIPAA-ready
          </span>
          <span class="flex items-center gap-2 text-sm text-slate-500">
            <svg class="w-4 h-4 text-teal-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
            Dentrix & Eaglesoft
          </span>
          <span class="flex items-center gap-2 text-sm text-slate-500">
            <svg class="w-4 h-4 text-teal-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
            20 min setup
          </span>
        </div>
      </div>

      <form onSubmit={submit} class="p-8 rounded-3xl bg-white border border-cream-200 shadow-xl space-y-5">
        <h3 class="text-xl font-bold text-slate-900 mb-1">Request a personalized demo</h3>
        <p class="text-sm text-slate-500 mb-6">Fill out the form and we'll schedule a 30-minute session tailored to your practice.</p>

        <div>
          <label class="block text-sm font-semibold text-slate-700 mb-1.5">Full Name *</label>
          <input type="text" required value={form.name} onInput={(e) => update('name', (e.target as HTMLInputElement).value)} placeholder="Dr. Jane Smith" class="w-full px-4 py-3 rounded-xl border border-cream-300 bg-cream-50 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all" />
        </div>

        <div>
          <label class="block text-sm font-semibold text-slate-700 mb-1.5">Work Email *</label>
          <input type="email" required value={form.email} onInput={(e) => update('email', (e.target as HTMLInputElement).value)} placeholder="jane@practice.com" class="w-full px-4 py-3 rounded-xl border border-cream-300 bg-cream-50 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all" />
        </div>

        <div>
          <label class="block text-sm font-semibold text-slate-700 mb-1.5">Phone *</label>
          <PhoneInput value={form.phone} countryCode={form.countryCode} onPhoneChange={(v) => update('phone', v)} onCountryChange={(v) => update('countryCode', v)} />
        </div>

        <div>
          <label class="block text-sm font-semibold text-slate-700 mb-1.5">Practice Name</label>
          <input type="text" value={form.clinic} onInput={(e) => update('clinic', (e.target as HTMLInputElement).value)} placeholder="Your Practice Name" class="w-full px-4 py-3 rounded-xl border border-cream-300 bg-cream-50 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all" />
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-semibold text-slate-700 mb-1.5">Practice Type</label>
            <select value={form.practiceType} onChange={(e) => update('practiceType', (e.target as HTMLSelectElement).value)} class="w-full px-4 py-3 rounded-xl border border-cream-300 bg-cream-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all appearance-none">
              <option value="">Select...</option>
              <option value="solo">Solo Practice</option>
              <option value="multi">Multi-Location</option>
              <option value="dso">DSO</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-semibold text-slate-700 mb-1.5">Locations</label>
            <input type="number" min="1" value={form.locations} onInput={(e) => update('locations', (e.target as HTMLInputElement).value)} placeholder="e.g. 3" class="w-full px-4 py-3 rounded-xl border border-cream-300 bg-cream-50 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all" />
          </div>
        </div>

        <button type="submit" disabled={state === 'submitting'} class="w-full py-4 bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-xl font-bold text-lg hover:scale-[1.02] hover:shadow-xl hover:shadow-teal-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
          {state === 'submitting' ? 'Submitting...' : 'Book My Demo'}
        </button>

        {state === 'error' && (
          <p class="text-center text-sm text-rose-600">Something went wrong. Please try again or email us directly.</p>
        )}

        <p class="text-center text-xs text-slate-400 leading-relaxed">By submitting this form, you agree to our <a href="/privacy" class="underline hover:text-slate-600">Privacy Policy</a>. This site is protected by reCAPTCHA.</p>
      </form>
    </div>
  )
}
