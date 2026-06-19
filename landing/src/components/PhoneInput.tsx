import { useState, useRef, useEffect, useMemo } from 'react'

const COUNTRIES = [
  { code: 'US', dial: '+1', flag: '🇺🇸', name: 'United States' },
  { code: 'GB', dial: '+44', flag: '🇬🇧', name: 'United Kingdom' },
  { code: 'CA', dial: '+1', flag: '🇨🇦', name: 'Canada' },
  { code: 'AU', dial: '+61', flag: '🇦🇺', name: 'Australia' },
  { code: 'IN', dial: '+91', flag: '🇮🇳', name: 'India' },
  { code: 'AE', dial: '+971', flag: '🇦🇪', name: 'UAE' },
  { code: 'SA', dial: '+966', flag: '🇸🇦', name: 'Saudi Arabia' },
  { code: 'DE', dial: '+49', flag: '🇩🇪', name: 'Germany' },
  { code: 'FR', dial: '+33', flag: '🇫🇷', name: 'France' },
  { code: 'JP', dial: '+81', flag: '🇯🇵', name: 'Japan' },
  { code: 'BR', dial: '+55', flag: '🇧🇷', name: 'Brazil' },
  { code: 'MX', dial: '+52', flag: '🇲🇽', name: 'Mexico' },
  { code: 'NG', dial: '+234', flag: '🇳🇬', name: 'Nigeria' },
  { code: 'ZA', dial: '+27', flag: '🇿🇦', name: 'South Africa' },
  { code: 'SG', dial: '+65', flag: '🇸🇬', name: 'Singapore' },
  { code: 'MY', dial: '+60', flag: '🇲🇾', name: 'Malaysia' },
  { code: 'PH', dial: '+63', flag: '🇵🇭', name: 'Philippines' },
  { code: 'PK', dial: '+92', flag: '🇵🇰', name: 'Pakistan' },
  { code: 'BD', dial: '+880', flag: '🇧🇩', name: 'Bangladesh' },
  { code: 'EG', dial: '+20', flag: '🇪🇬', name: 'Egypt' },
]

const TIMEZONE_COUNTRY_MAP: Record<string, string> = {
  'America/New_York': 'US', 'America/Chicago': 'US', 'America/Denver': 'US',
  'America/Los_Angeles': 'US', 'America/Anchorage': 'US', 'Pacific/Honolulu': 'US',
  'America/Toronto': 'CA', 'America/Vancouver': 'CA', 'America/Edmonton': 'CA',
  'Europe/London': 'GB', 'Europe/Paris': 'FR', 'Europe/Berlin': 'DE',
  'Asia/Tokyo': 'JP', 'Asia/Shanghai': 'CN', 'Asia/Kolkata': 'IN',
  'Asia/Dubai': 'AE', 'Asia/Riyadh': 'SA', 'Asia/Singapore': 'SG',
  'Asia/Kuala_Lumpur': 'MY', 'Asia/Manila': 'PH', 'Asia/Dhaka': 'BD',
  'Asia/Karachi': 'PK', 'Africa/Lagos': 'NG', 'Africa/Johannesburg': 'ZA',
  'America/Sao_Paulo': 'BR', 'America/Mexico_City': 'MX',
  'Australia/Sydney': 'AU', 'Australia/Melbourne': 'AU',
  'Asia/Cairo': 'EG',
}

interface PhoneInputProps {
  value: string
  countryCode: string
  onPhoneChange: (phone: string) => void
  onCountryChange: (code: string) => void
}

export default function PhoneInput({ value, countryCode, onPhoneChange, onCountryChange }: PhoneInputProps) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [detected, setDetected] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const selected = COUNTRIES.find(c => c.dial === countryCode) || COUNTRIES[0]

  const filtered = useMemo(() => {
    if (!search) return COUNTRIES
    const s = search.toLowerCase()
    return COUNTRIES.filter(c =>
      c.name.toLowerCase().includes(s) ||
      c.dial.includes(s) ||
      c.code.toLowerCase().includes(s)
    )
  }, [search])

  useEffect(() => {
    if (detected) return
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone
      const code = TIMEZONE_COUNTRY_MAP[tz]
      if (code) {
        const country = COUNTRIES.find(c => c.code === code)
        if (country) {
          onCountryChange(country.dial)
          setDetected(true)
        }
      }
    } catch {}
  }, [detected, onCountryChange])

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="relative" ref={ref}>
      <div className="flex">
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="flex items-center gap-1.5 px-3 py-3 bg-cream-50 border border-r-0 border-clay-300 rounded-l text-sm font-medium text-clay-700 hover:bg-clay-100 transition-colors shrink-0"
        >
          <span className="text-base">{selected.flag}</span>
          <span>{selected.dial}</span>
          <svg className={`w-3 h-3 text-clay-500 transition-transform ${open ? 'rotate-180' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M6 9l6 6 6-6"/></svg>
        </button>

        {open && (
          <div className="absolute top-full left-0 z-50 mt-1 w-72 bg-cream-0 border border-clay-300 rounded shadow-2xl overflow-hidden">
            <div className="p-2 border-b border-clay-100">
              <input
                type="text"
                value={search}
                onInput={(e) => setSearch((e.target as HTMLInputElement).value)}
                placeholder="Search country..."
                className="w-full px-3 py-2 text-sm bg-cream-50 border border-clay-300 rounded focus:outline-none focus:ring-2 focus:ring-terracotta-500"
                autoFocus
              />
            </div>
            <div className="max-h-48 overflow-y-auto">
              {filtered.map(c => (
                <button
                  key={c.code}
                  type="button"
                  onClick={() => { onCountryChange(c.dial); setOpen(false); setSearch('') }}
                  className={`w-full flex items-center gap-3 px-3 py-2 text-sm hover:bg-terracotta-100 transition-colors ${c.dial === countryCode ? 'bg-terracotta-100 text-terracotta-600 font-semibold' : 'text-clay-700'}`}
                >
                  <span className="text-base">{c.flag}</span>
                  <span className="flex-1 text-left">{c.name}</span>
                  <span className="text-clay-500 font-mono text-xs">{c.dial}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        <input
          type="tel"
          value={value}
          onInput={(e) => onPhoneChange((e.target as HTMLInputElement).value)}
          placeholder="(555) 123-4567"
          className="flex-1 px-4 py-3 bg-cream-50 border border-clay-300 rounded-r text-clay-900 placeholder:text-clay-500 focus:outline-none focus:ring-2 focus:ring-terracotta-500 focus:border-transparent transition-all"
        />
      </div>
    </div>
  )
}
