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
  const [open, setOpen] = useState(false)
  const [state, setState] = useState<FormState>('idle')
  const [form, setForm] = useState<FormData>({
    name: '', email: '', phone: '', countryCode: '+1',
    clinic: '', practiceType: '', locations: ''
  })
  const [uuid] = useState(getOrCreateUUID)

  useEffect(() => {
    const handler = () => setOpen(true)
    window.addEventListener('open-demo-form', handler)
    return () => window.removeEventListener('open-demo-form', handler)
  }, [])

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [open])

  const close = () => {
    setOpen(false)
    if (state === 'success') {
      setState('idle')
      setForm({ name: '', email: '', phone: '', countryCode: '+1', clinic: '', practiceType: '', locations: '' })
    }
  }

  const update = (field: keyof FormData, value: string) => {
    setForm(f => ({ ...f, [field]: value }))
  }

  useEffect(() => {
    if (!open) return
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
  }, [form, uuid, open])

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

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-ink-950/80 backdrop-blur-sm p-4" onClick={close}>
      <div
          className="bg-ink-900 rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto relative border border-ink-border shadow-[0_24px_60px_rgba(124,92,255,0.15)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button onClick={close} className="absolute top-5 right-5 z-10 w-10 h-10 rounded bg-ink-800 hover:bg-ink-border flex items-center justify-center transition-colors">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9C93A8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>

        {state === 'success' ? (
          <div className="p-12 text-center space-y-6">
            <div className="w-20 h-20 bg-violet-600/20 rounded-full flex items-center justify-center mx-auto">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#6366F1" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            </div>
            <div>
              <h3 className="text-3xl font-sans font-[400] text-onDark-100 mb-3">You're in.</h3>
              <p className="text-onDark-500 text-lg leading-relaxed max-w-md mx-auto">We'll be in touch within 24 hours to schedule your personalized 30-minute demo.</p>
            </div>
            <div className="p-6 rounded bg-ink-800 border border-ink-border max-w-md mx-auto">
              <p className="text-sm text-onDark-500 leading-relaxed">While you wait: a walkthrough of your branded patient app, a custom migration plan, and a live Q&A with our team.</p>
            </div>
            <button onClick={close} className="px-8 py-3 bg-violet-600 text-white rounded-full font-semibold hover:bg-violet-400 transition-colors">
              Close
            </button>
          </div>
        ) : (
          <div className="grid lg:grid-cols-2 gap-0">
            {/* Left side - info */}
            <div className="p-8 lg:p-10 bg-ink-950 space-y-6">
              <div>
                <h2 className="text-2xl lg:text-3xl font-sans font-[400] text-onDark-100 tracking-tight mb-3">What to expect from<br/>your RetainOS demo</h2>
                <p className="text-onDark-500 leading-relaxed text-sm">See how RetainOS replaces your recall, loyalty, and review tools with one branded patient app.</p>
              </div>

              <div className="space-y-4">
                {[
                  'In a <strong>30-minute session</strong>, see how RetainOS replaces 6 separate tools',
                  'Walk through a <strong>live branded patient app</strong> built for your clinic',
                  'Get a <strong>custom migration plan</strong> from your current stack',
                  'See how <strong>12 pilot clinics</strong> increased retention by 4.2x in 90 days',
                ].map((text, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded bg-violet-200/20 flex items-center justify-center shrink-0 mt-0.5">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#A78BFA" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                    </div>
                    <p className="text-onDark-500 text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: text }} />
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-ink-border">
                <span className="flex items-center gap-1.5 text-xs text-onDark-500">
                  <svg className="w-3.5 h-3.5 text-violet-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                  HIPAA-ready
                </span>
                <span className="flex items-center gap-1.5 text-xs text-onDark-500">
                  <svg className="w-3.5 h-3.5 text-violet-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                  Dentrix & Eaglesoft
                </span>
                <span className="flex items-center gap-1.5 text-xs text-onDark-500">
                  <svg className="w-3.5 h-3.5 text-violet-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                  20 min setup
                </span>
              </div>
            </div>

            {/* Right side - form */}
            <div className="p-8 lg:p-10">
              <form onSubmit={submit} className="space-y-4">
                <div>
                  <h3 className="text-xl font-sans font-[500] text-onDark-100 mb-1">Request a personalized demo</h3>
                  <p className="text-sm text-onDark-500">Fill out the form and we'll schedule a 30-minute session.</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-onDark-100 mb-1.5">Full Name *</label>
                  <input type="text" required value={form.name} onInput={(e) => update('name', (e.target as HTMLInputElement).value)} placeholder="Dr. Jane Smith" className="w-full px-4 py-3 rounded border border-ink-border bg-ink-800 text-onDark-100 placeholder:text-onDark-500 focus:outline-none focus:ring-2 focus:ring-violet-600 focus:border-transparent transition-all text-sm" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-onDark-100 mb-1.5">Work Email *</label>
                  <input type="email" required value={form.email} onInput={(e) => update('email', (e.target as HTMLInputElement).value)} placeholder="jane@practice.com" className="w-full px-4 py-3 rounded border border-ink-border bg-ink-800 text-onDark-100 placeholder:text-onDark-500 focus:outline-none focus:ring-2 focus:ring-violet-600 focus:border-transparent transition-all text-sm" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-onDark-100 mb-1.5">Phone *</label>
                  <PhoneInput value={form.phone} countryCode={form.countryCode} onPhoneChange={(v) => update('phone', v)} onCountryChange={(v) => update('countryCode', v)} />
                </div>

                <div>
                  <label className="block text-sm font-medium text-onDark-100 mb-1.5">Practice Name</label>
                  <input type="text" value={form.clinic} onInput={(e) => update('clinic', (e.target as HTMLInputElement).value)} placeholder="Your Practice Name" className="w-full px-4 py-3 rounded border border-ink-border bg-ink-800 text-onDark-100 placeholder:text-onDark-500 focus:outline-none focus:ring-2 focus:ring-violet-600 focus:border-transparent transition-all text-sm" />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-onDark-100 mb-1.5">Practice Type</label>
                    <select value={form.practiceType} onChange={(e) => update('practiceType', (e.target as HTMLSelectElement).value)} className="w-full px-4 py-3 rounded border border-ink-border bg-ink-800 text-onDark-100 focus:outline-none focus:ring-2 focus:ring-violet-600 focus:border-transparent transition-all appearance-none text-sm">
                      <option value="">Select...</option>
                      <option value="solo">Solo Practice</option>
                      <option value="multi">Multi-Location</option>
                      <option value="dso">DSO</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-onDark-100 mb-1.5">Locations</label>
                    <input type="number" min="1" value={form.locations} onInput={(e) => update('locations', (e.target as HTMLInputElement).value)} placeholder="e.g. 3" className="w-full px-4 py-3 rounded border border-ink-border bg-ink-800 text-onDark-100 placeholder:text-onDark-500 focus:outline-none focus:ring-2 focus:ring-violet-600 focus:border-transparent transition-all text-sm" />
                  </div>
                </div>

                <button type="submit" disabled={state === 'submitting'} className="w-full py-4 bg-violet-600 text-white rounded-full font-semibold text-lg hover:bg-violet-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-2">
                  {state === 'submitting' ? 'Submitting...' : 'Book My Demo'}
                </button>

                {state === 'error' && (
                  <p className="text-center text-sm text-onDark-500">Something went wrong. Please try again.</p>
                )}

                <p className="text-center text-xs text-onDark-500">By submitting, you agree to our <a href="/privacy" className="underline hover:text-onDark-100">Privacy Policy</a>.</p>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
