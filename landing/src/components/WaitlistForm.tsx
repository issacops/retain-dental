import { useState, useCallback } from 'react'

type FormState = 'idle' | 'submitting' | 'success' | 'error'

export default function WaitlistForm() {
  const [state, setState] = useState<FormState>('idle')
  const [form, setForm] = useState({ name: '', email: '', clinic: '', phone: '' })

  const update = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }))

  const submit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()
      setState('submitting')

      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
      const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

      if (!supabaseUrl || !supabaseKey) {
        setState('error')
        return
      }

      const { createClient } = await import('@supabase/supabase-js')
      const supabase = createClient(supabaseUrl, supabaseKey)

      const { error } = await supabase.from('waitlist').insert({
        name: form.name,
        email: form.email,
        clinic_name: form.clinic,
        phone: form.phone,
        source: 'landing-page',
      })

      setState(error ? 'error' : 'success')
    },
    [form]
  )

  if (state === 'success') {
    return (
      <div id="waitlist-form" class="max-w-md mx-auto p-8 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-3">
        <div class="w-14 h-14 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#34d399" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
        </div>
        <h3 class="text-xl font-bold text-white">You're on the list!</h3>
        <p class="text-slate-400 text-sm">We'll be in touch within 24 hours to get your branded app live.</p>
        <button onClick={() => setState('idle')} class="text-xs text-slate-500 hover:text-white transition-colors underline">Submit another</button>
      </div>
    )
  }

  return (
    <div id="waitlist-form" class="max-w-xl mx-auto">
      <form onSubmit={submit} class="space-y-5">
        <div class="grid sm:grid-cols-2 gap-5">
          <div>
            <label for="name" class="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Your Name</label>
            <input
              id="name"
              name="name"
              type="text"
              required
              value={form.name}
              onInput={update}
              placeholder="Dr. John Smith"
              class="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/50 transition-colors"
            />
          </div>
          <div>
            <label for="email" class="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={form.email}
              onInput={update}
              placeholder="john@yourclinic.com"
              class="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/50 transition-colors"
            />
          </div>
        </div>
        <div class="grid sm:grid-cols-2 gap-5">
          <div>
            <label for="clinic" class="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Clinic Name</label>
            <input
              id="clinic"
              name="clinic"
              type="text"
              required
              value={form.clinic}
              onInput={update}
              placeholder="Smith Family Dentistry"
              class="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/50 transition-colors"
            />
          </div>
          <div>
            <label for="phone" class="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Phone</label>
            <input
              id="phone"
              name="phone"
              type="tel"
              value={form.phone}
              onInput={update}
              placeholder="+1 (312) 555-0123"
              class="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/50 transition-colors"
            />
          </div>
        </div>
        <button
          type="submit"
          disabled={state === 'submitting'}
          class="w-full py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-bold text-lg hover:scale-[1.02] hover:shadow-xl hover:shadow-indigo-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {state === 'submitting' ? 'Sending...' : 'Launch My App'}
        </button>
        {state === 'error' && (
          <p class="text-center text-xs text-rose-400">Something went wrong. Please try again or email us directly.</p>
        )}
        <p class="text-center text-xs text-slate-600">No spam. No contracts. Cancel anytime.</p>
      </form>
    </div>
  )
}
