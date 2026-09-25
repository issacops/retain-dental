import React, { useMemo, useState } from 'react';
import { CalendarDays, Check, ChevronLeft, ChevronRight } from 'lucide-react';
import { Clinic, AppointmentType } from '../../../types';
import { cn } from '../../Doctor/ui/primitives';
import { haptic } from '../../../lib/haptics';
import { Sheet, SectionLabel, Button } from '../ui';

interface Props {
  open: boolean;
  onClose: () => void;
  clinic: Clinic;
  patientId: string;
  onSchedule: (patientId: string, date: Date, type: AppointmentType, notes?: string) => Promise<{ success: boolean; error?: string }>;
}

const TYPES: { key: AppointmentType; label: string }[] = [
  { key: AppointmentType.CHECKUP, label: 'Check-up' },
  { key: AppointmentType.CLEANING, label: 'Cleaning' },
  { key: AppointmentType.CONSULTATION, label: 'Consultation' },
  { key: AppointmentType.TREATMENT, label: 'Treatment' },
];

const SLOTS = ['09:30', '10:30', '11:30', '14:00', '15:00', '16:00', '17:00'];

const BookingSheet: React.FC<Props> = ({ open, onClose, clinic, patientId, onSchedule }) => {
  const [offset, setOffset] = useState(0);
  const [dayIndex, setDayIndex] = useState(0);
  const [slot, setSlot] = useState<string | null>(null);
  const [type, setType] = useState<AppointmentType>(AppointmentType.CHECKUP);
  const [notes, setNotes] = useState('');
  const [booking, setBooking] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const days = useMemo(() => {
    const out: Date[] = [];
    const base = new Date();
    base.setHours(0, 0, 0, 0);
    for (let i = 0; i < 5; i++) {
      const d = new Date(base);
      d.setDate(base.getDate() + offset * 5 + i);
      out.push(d);
    }
    return out;
  }, [offset]);

  const reset = () => { setDone(false); setSlot(null); setNotes(''); setError(null); setOffset(0); setDayIndex(0); setType(AppointmentType.CHECKUP); };

  const confirm = async () => {
    if (!slot) return;
    const day = days[dayIndex];
    const [h, m] = slot.split(':').map(Number);
    const start = new Date(day);
    start.setHours(h, m, 0, 0);
    setBooking(true);
    setError(null);
    const res = await onSchedule(patientId, start, type, notes);
    setBooking(false);
    if (res.success) { haptic('success'); setDone(true); }
    else { haptic('error'); setError(res.error || 'That time is not available. Please pick another.'); }
  };

  return (
    <Sheet open={open} onClose={() => { onClose(); setTimeout(reset, 250); }} title="Book a visit">
      {done ? (
        <div className="py-6 text-center">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full" style={{ backgroundColor: `${clinic.primaryColor}18`, color: clinic.primaryColor }}>
            <Check size={26} />
          </span>
          <p className="mt-4 font-display text-lg font-bold text-ink-900">Request sent</p>
          <p className="mt-1 text-sm text-ink-500">The clinic will confirm your appointment shortly. You'll see it on Today.</p>
          <Button accent={clinic.primaryColor} block className="mt-5" onClick={() => { onClose(); setTimeout(reset, 250); }}>Done</Button>
        </div>
      ) : (
        <div className="space-y-5">
          <div>
            <SectionLabel>Appointment type</SectionLabel>
            <div className="mt-2 flex flex-wrap gap-2">
              {TYPES.map((t) => (
                <button key={t.key} onClick={() => setType(t.key)}
                  className={cn('rounded-full border px-3.5 py-2 text-xs font-bold transition-colors', type === t.key ? 'border-transparent text-white' : 'border-ink-950/10 bg-white text-ink-600')}
                  style={type === t.key ? { backgroundColor: clinic.primaryColor } : undefined}>
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <SectionLabel>Pick a day</SectionLabel>
              <div className="flex gap-1">
                <button disabled={offset === 0} onClick={() => { setOffset((o) => o - 1); setDayIndex(0); }} aria-label="Earlier"
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-ink-950/10 bg-white text-ink-500 disabled:opacity-30">
                  <ChevronLeft size={15} />
                </button>
                <button onClick={() => { setOffset((o) => o + 1); setDayIndex(0); }} aria-label="Later"
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-ink-950/10 bg-white text-ink-500">
                  <ChevronRight size={15} />
                </button>
              </div>
            </div>
            <div className="mt-2 grid grid-cols-5 gap-2">
              {days.map((d, i) => {
                const active = i === dayIndex;
                return (
                  <button key={d.toISOString()} onClick={() => setDayIndex(i)}
                    className={cn('rounded-2xl border py-2.5 text-center transition-colors', active ? 'border-transparent text-white' : 'border-ink-950/10 bg-white text-ink-600')}
                    style={active ? { backgroundColor: clinic.primaryColor } : undefined}>
                    <span className="block font-mono text-[9px] font-bold uppercase tracking-wider opacity-70">{d.toLocaleDateString('en-US', { weekday: 'short' })}</span>
                    <span className="mt-0.5 block font-display text-base font-bold">{d.getDate()}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <SectionLabel>Pick a time</SectionLabel>
            <div className="mt-2 grid grid-cols-4 gap-2">
              {SLOTS.map((s) => (
                <button key={s} onClick={() => setSlot(s)}
                  className={cn('rounded-2xl border py-2.5 text-center text-xs font-bold transition-colors', slot === s ? 'border-transparent text-white' : 'border-ink-950/10 bg-white text-ink-600')}
                  style={slot === s ? { backgroundColor: clinic.primaryColor } : undefined}>
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div>
            <SectionLabel>Reason (optional)</SectionLabel>
            <input value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="e.g. sensitivity on the left side"
              className="mt-2 w-full rounded-2xl border border-ink-950/10 bg-white p-3.5 text-sm outline-none focus:border-ink-950/30" />
          </div>

          {error && <p className="rounded-2xl bg-blush-soft p-3 text-xs font-medium text-blush-deep">{error}</p>}

          <Button accent={clinic.primaryColor} block loading={booking} disabled={!slot} onClick={confirm}>
            <CalendarDays size={16} /> {slot ? `Request ${days[dayIndex].toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' })} at ${slot}` : 'Pick a time'}
          </Button>
        </div>
      )}
    </Sheet>
  );
};

export default BookingSheet;
