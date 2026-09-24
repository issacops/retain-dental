import React, { useState, useMemo } from 'react';
import {
  LayoutGrid, CalendarDays, Users, TrendingUp, CreditCard, Settings as SettingsIcon,
  Search, Bell, Plus, X, QrCode, Activity, LogOut, Zap,
} from 'lucide-react';
import { IBackendService } from '../../services/IBackendService';
import {
  User, Wallet, Transaction, FamilyGroup, Clinic, CarePlan, TransactionCategory,
  Appointment, AppointmentStatus, AppointmentType,
} from '../../types';
import TodayView from './subcomponents/TodayView';
import CommandPalette from './subcomponents/CommandPalette';
const RetentionView = React.lazy(() => import('./subcomponents/RetentionView'));
import PatientDirectory from './subcomponents/PatientDirectory';
import PatientProfile from './subcomponents/PatientProfile';
const AppointmentScheduler = React.lazy(() => import('./subcomponents/AppointmentScheduler'));
const FinancialLedger = React.lazy(() => import('./subcomponents/FinancialLedger'));
const SocialPostGenerator = React.lazy(() => import('./subcomponents/SocialPostGenerator'));
const SettingsView = React.lazy(() => import('./subcomponents/SettingsView'));
import { Card, Label, SectionHeader, cn } from './ui/primitives';
import { useToast } from '../../context/ToastContext';

interface Props {
  currentUser: User;
  allUsers: User[];
  wallets: Wallet[];
  transactions: Transaction[];
  familyGroups: FamilyGroup[];
  carePlans: CarePlan[];
  clinic: Clinic;
  appointments: Appointment[];
  backendService: IBackendService;
  onProcessTransaction: (patientId: string, amount: number, category: any, type: any, carePlanTemplate?: any) => Promise<any>;
  onUpdateCarePlan: (carePlanId: string, updates: Partial<CarePlan>) => Promise<any>;
  onLinkFamily: (headUserId: string, memberMobile: string) => Promise<any>;
  onAddPatient: (name: string, mobile: string, pin?: string) => Promise<{ success: boolean; message: string; user?: User }>;
  onAssignPlan: (clinicId: string, patientId: string, template: any) => Promise<any>;
  onSchedule: (patientId: string, start: string, end: string, type: AppointmentType, notes: string) => Promise<any>;
  onUpdateAppointmentStatus: (id: string, status: AppointmentStatus) => Promise<any>;
  onToggleChecklistItem: (carePlanId: string, itemId: string) => Promise<any>;
  onDeletePatient: (patientId: string) => Promise<any>;
  onUpdateClinic: (clinicId: string, updates: Partial<Clinic>) => Promise<any>;
  onUpdatePatient: (clinicId: string, patientId: string, updates: { name?: string; email?: string; mobile?: string; status?: string; metadata?: Record<string, any> }) => Promise<any>;
  onGetAuditLog: (clinicId: string, limit?: number) => Promise<{ success: boolean; updatedData?: any[] }>;
  onRefreshData?: () => void;
}

const SectionFallback = () => (
  <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
    {[0, 1, 2, 3].map((i) => <div key={i} className="h-28 animate-pulse rounded-[22px] border border-ink-950/[0.07] bg-white" />)}
  </div>
);

const NAV: { group: string; items: { id: string; icon: React.ElementType }[] }[] = [
  { group: 'Practice', items: [
    { id: 'Today', icon: LayoutGrid },
    { id: 'Schedule', icon: CalendarDays },
    { id: 'Patients', icon: Users },
  ] },
  { group: 'Growth', items: [
    { id: 'Retention', icon: TrendingUp },
    { id: 'Payments', icon: CreditCard },
  ] },
  { group: 'System', items: [
    { id: 'Settings', icon: SettingsIcon },
  ] },
];

const DesktopDoctorView: React.FC<Props> = ({
  currentUser, allUsers, wallets, transactions, familyGroups, carePlans, clinic,
  onProcessTransaction, onUpdateCarePlan, onLinkFamily, onAddPatient, backendService,
  appointments, onSchedule, onUpdateAppointmentStatus, onAssignPlan, onToggleChecklistItem, onDeletePatient,
  onUpdateClinic, onUpdatePatient, onGetAuditLog, onRefreshData,
}) => {
  const [activeSection, setActiveSection] = useState('Today');
  const [selectedPatient, setSelectedPatient] = useState<User | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddPatientModalOpen, setIsAddPatientModalOpen] = useState(false);
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const [isSocialModalOpen, setIsSocialModalOpen] = useState(false);
  const [newPatientName, setNewPatientName] = useState('');
  const [newPatientMobile, setNewPatientMobile] = useState('');
  const [newPatientPin, setNewPatientPin] = useState('');
  const [addPatientError, setAddPatientError] = useState<string | null>(null);
  const [isAddingPatient, setIsAddingPatient] = useState(false);
  const [stats, setStats] = useState<any>({ totalRevenue: 0 });
  const { addToast } = useToast();

  const mobileDigits = newPatientMobile.replace(/\D/g, '');
  const canSubmitPatient = newPatientName.trim().length >= 2 && mobileDigits.length >= 6;

  const submitNewPatient = async () => {
    if (!canSubmitPatient) {
      setAddPatientError('Enter a name and a valid mobile number.');
      return;
    }
    setIsAddingPatient(true);
    setAddPatientError(null);
    const res = await onAddPatient(newPatientName.trim(), mobileDigits, newPatientPin || '123456');
    setIsAddingPatient(false);
    if (res.success) {
      addToast(`${newPatientName.trim()} added`, 'success');
      setIsAddPatientModalOpen(false);
      setNewPatientName(''); setNewPatientMobile(''); setNewPatientPin(''); setAddPatientError(null);
    } else {
      setAddPatientError(res.message || 'Could not add patient.');
    }
  };

  React.useEffect(() => {
    let mounted = true;
    backendService.getDashboardStats(clinic.id).then((res) => { if (mounted) setStats(res); });
    return () => { mounted = false; };
  }, [backendService, clinic.id, transactions]);

  const filteredPatients = useMemo(() => {
    const q = (searchQuery || '').toLowerCase();
    return (allUsers || []).filter(
      (u) => u.clinicId === clinic.id && u.role === 'PATIENT' &&
        ((u.name || '').toLowerCase().includes(q) || (u.mobile || '').includes(q)),
    );
  }, [allUsers, clinic.id, searchQuery]);

  const onSearch = (value: string) => {
    setSearchQuery(value);
    if (value && activeSection !== 'Patients') setActiveSection('Patients');
  };

  const openPatient = (u: User) => { setSelectedPatient(u); setActiveSection('Patients'); };

  return (
    <div className="flex h-[100dvh] bg-cream-200 p-3 sm:p-4 font-sans text-ink-900">
      <div className="flex w-full overflow-hidden rounded-[28px] border border-ink-950/10 bg-cream-50 shadow-lift">
        {/* Sidebar */}
        <aside className="hidden w-64 shrink-0 flex-col bg-ink-950 text-cream-50 lg:flex">
          <div className="flex items-center gap-3 p-5">
            {clinic.logoUrl ? (
              <img src={clinic.logoUrl} alt="" className="h-9 w-9 rounded-xl" />
            ) : (
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10"><Activity size={18} /></span>
            )}
            <div className="min-w-0">
              <p className="truncate font-display text-sm font-bold leading-tight text-cream-50">{clinic.name}</p>
              <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-cream-50/40">{clinic.subscriptionTier} plan</p>
            </div>
          </div>

          <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-2 custom-scrollbar">
            {NAV.map((group) => (
              <div key={group.group}>
                <p className="px-3 pb-2 font-mono text-[10px] uppercase tracking-[0.16em] text-cream-50/35">{group.group}</p>
                <div className="space-y-1">
                  {group.items.map((item) => {
                    const Icon = item.icon;
                    const active = activeSection === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => setActiveSection(item.id)}
                        className={cn(
                          'flex w-full items-center gap-3 rounded-[14px] px-3 py-2.5 text-left transition-colors',
                          active ? 'bg-white/10 text-cream-50' : 'text-cream-50/60 hover:bg-white/5 hover:text-cream-50',
                        )}
                      >
                        <span className={cn('flex h-7 w-7 items-center justify-center rounded-[10px]', active ? 'bg-white/15' : 'bg-white/5')}>
                          <Icon size={15} />
                        </span>
                        <span className="text-sm font-semibold">{item.id}</span>
                        {active && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-primary" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>

          <div className="space-y-3 border-t border-white/10 p-4">
            <button
              onClick={() => setIsQRModalOpen(true)}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-white/10 px-4 py-2.5 text-xs font-bold uppercase tracking-[0.08em] text-cream-50 transition-colors hover:bg-white/15"
            >
              <QrCode size={14} /> Patient app
            </button>
            <div className="flex items-center gap-3 rounded-[14px] bg-white/5 p-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 font-display text-[11px] font-bold">
                {(currentUser.name || 'D').split(' ').map((w) => w[0]).slice(0, 2).join('')}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-semibold text-cream-50">{currentUser.name}</p>
                <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-cream-50/40">Admin</p>
              </div>
              <LogOut size={14} className="text-cream-50/40" />
            </div>
          </div>
        </aside>

        {/* Main */}
        <main className="flex min-w-0 flex-1 flex-col">
          <header className="flex items-center gap-3 border-b border-ink-950/5 px-4 py-3 sm:px-5">
            <div className="relative min-w-0 flex-1 sm:max-w-md">
              <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearch(e.target.value)}
                placeholder="Search patients"
                className="w-full rounded-full border border-ink-950/10 bg-white py-2.5 pl-10 pr-4 text-sm font-semibold text-ink-900 outline-none transition-colors placeholder:text-ink-400 focus:border-ink-950/30"
              />
            </div>
            <div className="ml-auto flex items-center gap-2">
              <button
                onClick={() => setIsAddPatientModalOpen(true)}
                className="hidden items-center gap-2 rounded-full bg-ink-950 px-4 py-2.5 text-xs font-bold uppercase tracking-[0.08em] text-cream-50 transition-colors hover:bg-ink-800 sm:inline-flex"
              >
                <Plus size={14} /> Add patient
              </button>
              <button className="relative flex h-10 w-10 items-center justify-center rounded-full border border-ink-950/10 bg-white text-ink-600 transition-colors hover:text-ink-900">
                <Bell size={17} />
                <span className="absolute right-2.5 top-2.5 h-1.5 w-1.5 rounded-full bg-blush-deep" />
              </button>
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-ink-950 font-display text-xs font-bold text-cream-50">
                {(currentUser.name || 'D').split(' ').map((w) => w[0]).slice(0, 2).join('')}
              </span>
            </div>
          </header>

          {/* Mobile nav */}
          <div className="flex gap-2 overflow-x-auto border-b border-ink-950/5 px-4 py-2.5 lg:hidden">
            {NAV.flatMap((g) => g.items).map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={cn(
                  'shrink-0 rounded-full px-3.5 py-1.5 text-xs font-bold',
                  activeSection === item.id ? 'bg-ink-950 text-cream-50' : 'border border-ink-950/10 bg-white text-ink-600',
                )}
              >
                {item.id}
              </button>
            ))}
          </div>

          <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
            {activeSection === 'Patients' ? (
              <div className="flex-1 overflow-y-auto p-5 sm:p-7 custom-scrollbar">
                {selectedPatient ? (
                  <PatientProfile
                    selectedPatient={selectedPatient}
                    clinic={clinic}
                    wallets={wallets}
                    carePlans={carePlans}
                    transactions={transactions}
                    allUsers={allUsers}
                    familyGroups={familyGroups}
                    appointments={appointments}
                    backendService={backendService}
                    onBack={() => setSelectedPatient(null)}
                    onProcessTransaction={onProcessTransaction}
                    onAssignPlan={onAssignPlan}
                    onToggleChecklistItem={onToggleChecklistItem}
                    onUpdateCarePlan={onUpdateCarePlan}
                    onDeletePatient={onDeletePatient}
                    onRefreshData={onRefreshData}
                    onBookReview={() => setActiveSection('Schedule')}
                  />
                ) : (
                  <PatientDirectory
                    clinic={clinic}
                    users={filteredPatients}
                    wallets={wallets}
                    transactions={transactions}
                    appointments={appointments}
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    onSelectPatient={setSelectedPatient}
                    onAddPatient={() => setIsAddPatientModalOpen(true)}
                  />
                )}
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto p-5 sm:p-7 custom-scrollbar">
                {activeSection === 'Today' && (
                  <TodayView
                    clinic={clinic}
                    backendService={backendService}
                    currentUser={currentUser}
                    allUsers={allUsers}
                    wallets={wallets}
                    transactions={transactions}
                    familyGroups={familyGroups}
                    carePlans={carePlans}
                    appointments={appointments}
                    stats={stats}
                    onAddPatient={() => setIsAddPatientModalOpen(true)}
                    onGoTo={setActiveSection}
                    onSelectPatient={openPatient}
                    onOpenQR={() => setIsQRModalOpen(true)}
                    onOpenSocial={() => setIsSocialModalOpen(true)}
                  />
                )}
                {activeSection === 'Schedule' && (
                  <React.Suspense fallback={<SectionFallback />}>
                  <AppointmentScheduler
                    clinic={clinic}
                    appointments={appointments}
                    patients={allUsers.filter((u) => u.role === 'PATIENT' && u.clinicId === clinic.id)}
                    onSchedule={onSchedule}
                    onUpdateStatus={onUpdateAppointmentStatus}
                    onViewProfile={openPatient}
                  />
                  </React.Suspense>
                )}
                {activeSection === 'Retention' && (
                  <React.Suspense fallback={<SectionFallback />}>
                    <RetentionView clinic={clinic} backendService={backendService} allUsers={allUsers} wallets={wallets} transactions={transactions} />
                  </React.Suspense>
                )}
                {activeSection === 'Payments' && (
                  <React.Suspense fallback={<SectionFallback />}>
                    <FinancialLedger clinic={clinic} transactions={transactions} wallets={wallets} allUsers={allUsers} />
                  </React.Suspense>
                )}
                {activeSection === 'Settings' && (
                  <React.Suspense fallback={<SectionFallback />}>
                    <SettingsView
                      clinic={clinic}
                      currentUser={currentUser}
                      allUsers={allUsers}
                      wallets={wallets}
                      transactions={transactions}
                      carePlans={carePlans}
                      appointments={appointments}
                      onUpdateClinic={onUpdateClinic}
                      onGetAuditLog={onGetAuditLog}
                    />
                  </React.Suspense>
                )}
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Add patient */}
      {isAddPatientModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-ink-950/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-[28px] border border-ink-950/10 bg-cream-50 p-8 shadow-lift">
            <div className="flex items-start justify-between">
              <div>
                <Label>New record</Label>
                <h3 className="mt-1 font-display text-2xl font-bold tracking-tight text-ink-900">Add a patient</h3>
              </div>
              <button onClick={() => setIsAddPatientModalOpen(false)} className="flex h-9 w-9 items-center justify-center rounded-full border border-ink-950/10 text-ink-500 hover:text-ink-900">
                <X size={18} />
              </button>
            </div>
            <div className="mt-7 space-y-5">
              <div>
                <Label>Full name</Label>
                <input
                  type="text"
                  autoFocus
                  placeholder="e.g. Riya Sharma"
                  value={newPatientName}
                  onChange={(e) => { setNewPatientName(e.target.value); setAddPatientError(null); }}
                  onKeyDown={(e) => e.key === 'Enter' && canSubmitPatient && submitNewPatient()}
                  className="mt-2 w-full rounded-[14px] border border-ink-950/10 bg-white p-4 text-base font-semibold outline-none transition-colors focus:border-ink-950/30"
                />
              </div>
              <div>
                <Label>Mobile number</Label>
                <input
                  type="tel"
                  placeholder="+91 00000 00000"
                  value={newPatientMobile}
                  onChange={(e) => { setNewPatientMobile(e.target.value); setAddPatientError(null); }}
                  onKeyDown={(e) => e.key === 'Enter' && canSubmitPatient && submitNewPatient()}
                  className="mt-2 w-full rounded-[14px] border border-ink-950/10 bg-white p-4 text-base font-semibold outline-none transition-colors focus:border-ink-950/30"
                />
                <p className="mt-1.5 text-xs text-ink-400">Used as the patient's login for the app. Must be unique in this clinic.</p>
              </div>
              <div>
                <Label>Access PIN (optional)</Label>
                <input
                  type="text"
                  placeholder="Default 123456"
                  value={newPatientPin}
                  onChange={(e) => setNewPatientPin(e.target.value.replace(/\D/g, ''))}
                  maxLength={6}
                  inputMode="numeric"
                  className="mt-2 w-full rounded-[14px] border border-ink-950/10 bg-white p-4 text-base font-semibold outline-none transition-colors focus:border-ink-950/30"
                />
              </div>

              {addPatientError && (
                <p className="rounded-[14px] bg-blush-soft px-4 py-3 text-xs font-semibold text-blush-deep">{addPatientError}</p>
              )}

              <button
                onClick={submitNewPatient}
                disabled={!canSubmitPatient || isAddingPatient}
                className={cn(
                  'w-full rounded-full py-4 text-sm font-bold uppercase tracking-[0.08em] transition-colors',
                  canSubmitPatient && !isAddingPatient ? 'bg-ink-950 text-cream-50 hover:bg-ink-800' : 'cursor-not-allowed bg-ink-950/10 text-ink-400',
                )}
              >
                {isAddingPatient ? 'Adding…' : 'Add patient'}
              </button>
              <p className="text-center text-xs text-ink-400">You can complete the clinical chart from the patient's record.</p>
            </div>
          </div>
        </div>
      )}

      {/* QR */}
      {isQRModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-ink-950/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-[28px] border border-ink-950/10 bg-cream-50 p-8 text-center shadow-lift">
            <div className="flex justify-end">
              <button onClick={() => setIsQRModalOpen(false)} className="flex h-9 w-9 items-center justify-center rounded-full border border-ink-950/10 text-ink-500 hover:text-ink-900"><X size={18} /></button>
            </div>
            <span className="mx-auto mt-2 flex h-14 w-14 items-center justify-center rounded-[18px] bg-ink-950 text-cream-50"><QrCode size={26} /></span>
            <h3 className="mt-5 font-display text-xl font-bold tracking-tight text-ink-900">Patient app</h3>
            <p className="mt-1 text-sm text-ink-500">Scan to install the {clinic.name} app.</p>
            <div className="mt-6 inline-block rounded-[20px] border border-ink-950/10 bg-white p-4">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=300x300&bgcolor=ffffff&color=000000&margin=0&data=${encodeURIComponent(`${window.location.origin}/?subdomain=${clinic.slug}`)}`}
                alt="Patient app QR code" className="h-44 w-44 rounded-xl bg-white"
              />
            </div>
            <div className="mt-5 rounded-[14px] border border-ink-950/10 bg-white p-4">
              <Label>Direct link</Label>
              <p className="mt-1 break-all font-mono text-xs font-bold text-ink-700 select-all">{window.location.origin}/?subdomain={clinic.slug}</p>
            </div>
          </div>
        </div>
      )}

      {isSocialModalOpen && (
        <React.Suspense fallback={null}>
          <SocialPostGenerator clinic={clinic} onClose={() => setIsSocialModalOpen(false)} />
        </React.Suspense>
      )}

      <CommandPalette
        patients={allUsers.filter((u) => u.clinicId === clinic.id && u.role === 'PATIENT')}
        onSelectPatient={openPatient}
        onNavigate={setActiveSection}
        onQuickAction={(a) => {
          if (a === 'add-patient') setIsAddPatientModalOpen(true);
          else if (a === 'qr') setIsQRModalOpen(true);
          else if (a === 'social') setIsSocialModalOpen(true);
        }}
      />
    </div>
  );
};

export default DesktopDoctorView;
