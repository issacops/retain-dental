import React, { useState, useMemo } from 'react';
import { Calendar as CalendarIcon, Clock, ChevronLeft, ChevronRight, User as UserIcon, Check, X, Plus } from 'lucide-react';
import { Appointment, AppointmentStatus, AppointmentType, Clinic, User } from '../../../types';

interface Props {
    clinic: Clinic;
    appointments: Appointment[];
    patients: User[];
    onSchedule: (patientId: string, start: string, end: string, type: AppointmentType, notes: string) => any;
    onUpdateStatus: (id: string, status: AppointmentStatus) => any;
    onViewProfile?: (patient: User) => void;
}

const AppointmentScheduler: React.FC<Props> = ({ clinic, appointments, patients, onSchedule, onUpdateStatus, onViewProfile }) => {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [showBookingModal, setShowBookingModal] = useState(false);

    // Modal State
    const [selectedPatientId, setSelectedPatientId] = useState('');
    const [selectedType, setSelectedType] = useState<AppointmentType>(AppointmentType.CHECKUP);
    const [selectedTime, setSelectedTime] = useState('09:00');
    const [notes, setNotes] = useState('');

    const timeSlots = useMemo(() => {
        const slots = [];
        for (let i = 9; i < 18; i++) {
            slots.push(`${i.toString().padStart(2, '0')}:00`);
            slots.push(`${i.toString().padStart(2, '0')}:30`);
        }
        return slots;
    }, []);

    const appointmentsForDay = useMemo(() => {
        return appointments.filter(a => {
            const d = new Date(a.startTime);
            return d.getDate() === selectedDate.getDate() &&
                d.getMonth() === selectedDate.getMonth() &&
                d.getFullYear() === selectedDate.getFullYear() &&
                a.clinicId === clinic.id;
        });
    }, [appointments, selectedDate, clinic.id]);

    const handleBook = () => {
        if (!selectedPatientId) return;

        const [hours, minutes] = selectedTime.split(':').map(Number);
        const start = new Date(selectedDate);
        start.setHours(hours, minutes, 0, 0);

        const end = new Date(start);
        end.setMinutes(end.getMinutes() + 30); // Default 30 min slots

        onSchedule(selectedPatientId, start.toISOString(), end.toISOString(), selectedType, notes);
        setShowBookingModal(false);
        setSelectedPatientId('');
        setNotes('');
    };

    const getStatusColor = (status: AppointmentStatus) => {
        switch (status) {
            case AppointmentStatus.CONFIRMED: return 'bg-emerald-500 text-white';
            case AppointmentStatus.COMPLETED: return 'bg-slate-200 text-ink-500';
            case AppointmentStatus.CANCELLED: return 'bg-rose-500/10 text-rose-500';
            case AppointmentStatus.NO_SHOW: return 'bg-red-500 text-white';
            default: return 'bg-teal-500 text-white';
        }
    };

    return (
        <div className="flex-1 flex overflow-hidden bg-cream-100/50">
            {/* SIDEBAR - MINI CALENDAR & FILTERS */}
            <div className="w-80 border-r border-ink-950/10 p-6 flex flex-col bg-white">
                <h2 className="text-2xl font-bold text-ink-900 tracking-tight mb-8">Schedule</h2>

                <div className="bg-cream-100 rounded-[20px] p-6 mb-8 border border-ink-950/[0.07]">
                    <div className="flex justify-between items-center mb-6">
                        <button onClick={() => setSelectedDate(new Date(selectedDate.setDate(selectedDate.getDate() - 1)))} className="p-2 hover:bg-white rounded-xl transition-all"><ChevronLeft size={16} /></button>
                        <span className="font-bold text-ink-700">{selectedDate.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}</span>
                        <button onClick={() => setSelectedDate(new Date(selectedDate.setDate(selectedDate.getDate() + 1)))} className="p-2 hover:bg-white rounded-xl transition-all"><ChevronRight size={16} /></button>
                    </div>
                    <div className="text-center">
                        <span className="text-6xl font-bold text-ink-900 block">{selectedDate.getDate()}</span>
                        <span className="text-sm font-bold text-ink-400 uppercase tracking-widest block mt-2">{selectedDate.toLocaleDateString('en-IN', { weekday: 'long' })}</span>
                    </div>
                </div>

                <button onClick={() => setShowBookingModal(true)} className="w-full py-4 bg-ink-950 text-white rounded-2xl font-bold shadow-soft hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2">
                    <Plus size={18} /> New Appointment
                </button>
            </div>

            {/* MAIN TIMELINE */}
            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar relative">
                <div className="max-w-4xl mx-auto space-y-4">
                    {timeSlots.map(time => {
                        const appt = appointmentsForDay.find(a => new Date(a.startTime).getHours() === parseInt(time.split(':')[0]) && new Date(a.startTime).getMinutes() === parseInt(time.split(':')[1]));
                        const patient = patients.find(p => p.id === appt?.patientId);

                        return (
                            <div key={time} className="flex gap-6 group">
                                <div className="w-20 pt-3 text-right">
                                    <span className="font-mono text-sm font-bold text-ink-400">{time}</span>
                                </div>
                                <div className={`flex-1 min-h-[100px] rounded-[20px] border transition-all relative overflow-hidden ${appt ? 'bg-white border-ink-950/10 shadow-sm hover:shadow-md' : 'border-dashed border-ink-950/10 hover:bg-slate-100/50'}`}>
                                    {appt ? (
                                        <div className="p-6 flex justify-between items-start h-full">
                                            <div className="absolute left-0 top-0 bottom-0 w-1.5" style={{ backgroundColor: appt.type === AppointmentType.CHECKUP ? '#0d9488' : '#10b981' }}></div>
                                            <div>
                                                <div className="flex items-center gap-3 mb-2">
                                                    <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-lg ${getStatusColor(appt.status)}`}>{appt.status}</span>
                                                    <span className="text-[10px] font-bold uppercase text-ink-400 tracking-widest">{appt.type}</span>
                                                </div>
                                                <h4 className="font-bold text-xl text-ink-900">{patient?.name || 'Unknown Patient'}</h4>
                                                <p className="text-sm text-ink-500 mt-1">{appt.notes || 'No clinical notes added.'}</p>
                                            </div>
                                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity mt-4">
                                                {onViewProfile && (
                                                    <button onClick={() => onViewProfile(patient!)} className="px-3 py-2 bg-ink-950 text-white text-[10px] font-bold rounded-xl flex items-center gap-2 hover:bg-black whitespace-nowrap">
                                                        <UserIcon size={12} /> Profile
                                                    </button>
                                                )}
                                                <div className="flex-1"></div>
                                                <button onClick={() => onUpdateStatus(appt.id, AppointmentStatus.CONFIRMED)} className="p-2 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-100"><Check size={16} /></button>
                                                <button onClick={() => onUpdateStatus(appt.id, AppointmentStatus.CANCELLED)} className="p-2 bg-rose-50 text-rose-600 rounded-xl hover:bg-rose-100"><X size={16} /></button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div onClick={() => { setSelectedTime(time); setShowBookingModal(true); }} className="w-full h-full flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer">
                                            <Plus size={24} className="text-ink-300" />
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* BOOKING MODAL */}
            {showBookingModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-ink-950/50 backdrop-blur-xl p-6">
                    <div className="bg-white rounded-[24px] p-12 w-full max-w-xl shadow-lift animate-in zoom-in-95 duration-300">
                        <div className="flex justify-between items-center mb-10">
                            <h3 className="text-3xl font-bold text-ink-900 tracking-tight">Book Slot</h3>
                            <button onClick={() => setShowBookingModal(false)} className="p-3 bg-cream-100 rounded-xl hover:bg-slate-100"><X size={20} /></button>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <label className="text-xs font-bold text-ink-400 uppercase tracking-widest block mb-3">Time Slot</label>
                                <div className="flex items-center gap-4 bg-cream-100 p-4 rounded-2xl border border-ink-950/[0.07]">
                                    <Clock size={20} className="text-teal-500" />
                                    <span className="font-bold text-xl text-ink-800">{selectedTime}</span>
                                    <span className="text-ink-400 font-bold">{selectedDate.toLocaleDateString()}</span>
                                </div>
                            </div>

                            <div>
                                <label className="text-xs font-bold text-ink-400 uppercase tracking-widest block mb-3">Select Patient</label>
                                <select value={selectedPatientId} onChange={(e) => setSelectedPatientId(e.target.value)}
                                    className="w-full p-4 bg-white border-2 border-ink-950/[0.07] rounded-2xl font-bold text-ink-700 outline-none focus:border-teal-500 transition-all">
                                    <option value="">Select Identity...</option>
                                    {patients.map(p => <option key={p.id} value={p.id}>{p.name} ({p.mobile})</option>)}
                                </select>
                            </div>

                            <div>
                                <label className="text-xs font-bold text-ink-400 uppercase tracking-widest block mb-3">Appointment Type</label>
                                <div className="grid grid-cols-2 gap-3">
                                    {Object.values(AppointmentType).map(t => (
                                        <button key={t} onClick={() => setSelectedType(t)}
                                            className={`p-4 rounded-xl font-bold text-sm transition-all border-2 ${selectedType === t ? 'border-teal-500 bg-teal-50 text-teal-700' : 'border-transparent bg-cream-100 text-ink-500'}`}>
                                            {t}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="text-xs font-bold text-ink-400 uppercase tracking-widest block mb-3">Clinical Notes</label>
                                <textarea value={notes} onChange={(e) => setNotes(e.target.value)} className="w-full p-4 bg-cream-100 border-none rounded-2xl font-medium resize-none h-24 outline-none focus:ring-2 focus:ring-teal-500/20" placeholder="Reason for visit..."></textarea>
                            </div>

                            <button onClick={handleBook} disabled={!selectedPatientId}
                                className="w-full py-6 bg-ink-950 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-[20px] font-bold text-lg shadow-soft hover:scale-[1.02] active:scale-95 transition-all mt-4">
                                Confirm Booking
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AppointmentScheduler;
