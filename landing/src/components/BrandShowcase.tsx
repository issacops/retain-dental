import { useState } from 'react'

const screenshots = [
  { src: '/assets/screens/doctor-dashboard.png', alt: 'Doctor OS Dashboard - Practice analytics and patient management', label: 'Doctor OS' },
  { src: '/assets/screens/patient-mobile.png', alt: 'Patient Mobile App - Loyalty points, bookings, and payments', label: 'Patient App' },
]

export default function BrandShowcase() {
  const [active, setActive] = useState(0)

  return (
    <section class="py-24 px-6 bg-cream-100 relative overflow-hidden">
      <div class="max-w-7xl mx-auto">
        <div class="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <h2 class="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter">
            See RetainOS in <span class="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-violet-400">Action</span>
          </h2>
          <p class="text-lg text-slate-500">
            A fully branded experience for every user — clinic owners, staff, and patients.
          </p>
        </div>

        <div class="flex justify-center gap-4 mb-10">
          {screenshots.map((s, i) => (
            <button
              onClick={() => setActive(i)}
              className={`px-6 py-3 rounded-full text-sm font-bold transition-all duration-300 ${
                active === i
                  ? 'bg-white text-slate-900 shadow-xl'
                  : 'bg-cream-100/70 text-slate-500 border border-gray-200 hover:border-white/30'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>

        <div class="relative max-w-4xl mx-auto">
          <div class="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent z-10 pointer-events-none"></div>
          <div class="rounded-2xl overflow-hidden border border-gray-200 shadow-xl shadow-gray-200/80 bg-cream-50">
            <img
              src={screenshots[active].src}
              alt={screenshots[active].alt}
              class="w-full h-auto"
              width="1200"
              height="750"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
