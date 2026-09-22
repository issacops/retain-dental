import { useState } from 'react'

const screenshots = [
  { src: '/assets/screens/doctor-dashboard.png', alt: 'Doctor OS Dashboard - Practice analytics and patient management', label: 'Doctor OS' },
  { src: '/assets/screens/patient-mobile.png', alt: 'Patient Mobile App - Loyalty points, bookings, and payments', label: 'Patient App' },
]

export default function BrandShowcase() {
  const [active, setActive] = useState(0)

  return (
    <section className="py-24 px-6 bg-cream-100 relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl font-semibold text-slate-900 tracking-tight">
            See Retain Dental in <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-violet-400">Action</span>
          </h2>
          <p className="text-lg text-slate-500">
            A fully branded experience for every user, clinic owners, staff, and patients.
          </p>
        </div>

        <div className="flex justify-center gap-4 mb-10">
          {screenshots.map((s, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`px-6 py-3 rounded-full text-sm font-semibold transition-all duration-300 ${
                active === i
                  ? 'bg-white text-slate-900 shadow-xl'
                  : 'bg-cream-100/70 text-slate-500 border border-gray-200 hover:border-white/30'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>

        <div className="relative max-w-4xl mx-auto">
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent z-10 pointer-events-none"></div>
          <div className="rounded-2xl overflow-hidden border border-gray-200 shadow-xl shadow-gray-200/80 bg-cream-50">
            <img
              src={screenshots[active].src}
              alt={screenshots[active].alt}
              className="w-full h-auto"
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
