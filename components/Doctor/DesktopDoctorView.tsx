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
import RetentionView from './subcomponents/RetentionView';
import PatientDirectory from './subcomponents/PatientDirectory';
import PatientProfile from './subcomponents/PatientProfile';
import AppointmentScheduler from './subcomponents/AppointmentScheduler';
import FinancialLedger from './subcomponents/FinancialLedger';
import SocialPostGenerator from './subcomponents/SocialPostGenerator';
import { Card, Label, SectionHeader, cn } from './ui/primitives';

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
  onRefreshData?: () => void;
}

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
  onUpdateClinic, onRefreshData,
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
  const [stats, setStats] = useState<any>({ totalRevenue: 0 });

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
                  <AppointmentScheduler
                    clinic={clinic}
                    appointments={appointments}
                    patients={allUsers.filter((u) => u.role === 'PATIENT' && u.clinicId === clinic.id)}
                    onSchedule={onSchedule}
                    onUpdateStatus={onUpdateAppointmentStatus}
                    onViewProfile={openPatient}
                  />
                )}
                {activeSection === 'Retention' && (
                  <RetentionView clinic={clinic} backendService={backendService} allUsers={allUsers} wallets={wallets} transactions={transactions} />
                )}
                {activeSection === 'Payments' && (
                  <FinancialLedger clinic={clinic} transactions={transactions} wallets={wallets} allUsers={allUsers} />
                )}
                {activeSection === 'Settings' && (
                  <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
                    <div className="space-y-6">
                      <Card tone="white">
                        <SectionHeader eyebrow="Loyalty" title="Point economics" />
                        <div className="mt-6 grid gap-5 sm:grid-cols-2">
                          <div>
                            <Label>Default earn rate (%)</Label>
                            <input type="number" defaultValue={clinic.loyaltyConfig?.defaultRate || 10}
                              onBlur={(e) => onUpdateClinic(clinic.id, { loyaltyConfig: { ...clinic.loyaltyConfig, defaultRate: Number(e.target.value) } as any })}
                              className="mt-2 w-full rounded-[14px] border border-ink-950/10 bg-cream-50 p-4 font-display text-2xl font-bold outline-none focus:border-ink-950/30" />
                          </div>
                          <div>
                            <Label>Redemption value (per point)</Label>
                            <input type="number" defaultValue={clinic.loyaltyConfig?.redemptionRate || 1}
                              onBlur={(e) => onUpdateClinic(clinic.id, { loyaltyConfig: { ...clinic.loyaltyConfig, redemptionRate: Number(e.target.value) } as any })}
                              className="mt-2 w-full rounded-[14px] border border-ink-950/10 bg-cream-50 p-4 font-display text-2xl font-bold outline-none focus:border-ink-950/30" />
                          </div>
                        </div>
                        <div className="mt-6 border-t border-ink-950/5 pt-6">
                          <Label>Category multipliers</Label>
                          <div className="mt-3 grid gap-3 sm:grid-cols-3">
                            {Object.values(TransactionCategory).map((cat) => (
                              <div key={cat} className="rounded-[14px] border border-ink-950/10 bg-cream-50 p-4">
                                <Label>{cat}</Label>
                                <div className="mt-2 flex items-center gap-2">
                                  <input type="number" placeholder="Default"
                                    defaultValue={clinic.loyaltyConfig?.categoryRates?.[cat] || ''}
                                    onBlur={(e) => {
                                      const val = e.target.value ? Number(e.target.value) : undefined;
                                      const next = { ...clinic.loyaltyConfig?.categoryRates, [cat]: val };
                                      if (!val) delete (next as any)[cat];
                                      onUpdateClinic(clinic.id, { loyaltyConfig: { ...clinic.loyaltyConfig, categoryRates: next } as any });
                                    }}
                                    className="w-full bg-transparent font-display text-lg font-bold outline-none" />
                                  <span className="text-xs font-bold text-ink-400">%</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </Card>

                      <Card tone="white">
                        <SectionHeader eyebrow="Brand" title="Clinic identity" />
                        <div className="mt-6 grid gap-5 sm:grid-cols-2">
                          <div>
                            <Label>Primary colour</Label>
                            <div className="mt-2 flex items-center gap-3 rounded-[14px] border border-ink-950/10 bg-cream-50 p-2.5">
                              <span className="h-9 w-9 rounded-[10px]" style={{ backgroundColor: clinic.primaryColor }} />
                              <input type="text" defaultValue={clinic.primaryColor}
                                onBlur={(e) => onUpdateClinic(clinic.id, { primaryColor: e.target.value })}
                                className="w-full bg-transparent font-mono text-sm font-bold outline-none" />
                            </div>
                          </div>
                          <div>
                            <Label>Theme</Label>
                            <select value={clinic.themeTexture}
                              onChange={(e) => onUpdateClinic(clinic.id, { themeTexture: e.target.value as any })}
                              className="mt-2 w-full appearance-none rounded-[14px] border border-ink-950/10 bg-cream-50 p-4 text-sm font-semibold outline-none focus:border-ink-950/30">
                              <option value="minimal">Minimal</option>
                              <option value="glass">Glass</option>
                              <option value="aurora">Aurora</option>
                              <option value="grain">Grain</option>
                            </select>
                          </div>
                        </div>
                      </Card>
                    </div>

                    <Card tone="dark" className="h-fit">
                      <Label onDark>Pro</Label>
                      <h3 className="mt-3 font-display text-2xl font-bold tracking-tight text-cream-50">Multi-location & API</h3>
                      <p className="mt-2 text-sm text-cream-50/60">Advanced configuration for groups, SSO, and integrations.</p>
                      <button className="mt-5 w-full rounded-full bg-cream-50 px-5 py-2.5 text-xs font-bold uppercase tracking-[0.08em] text-ink-950 hover:bg-white transition-colors">
                        Contact support
                      </button>
                    </Card>
                  </div>
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
                <input type="text" placeholder="e.g. Riya Sharma" value={newPatientName} onChange={(e) => setNewPatientName(e.target.value)}
                  className="mt-2 w-full rounded-[14px] border border-ink-950/10 bg-white p-4 text-base font-semibold outline-none focus:border-ink-950/30" />
              </div>
              <div>
                <Label>Mobile number</Label>
                <input type="tel" placeholder="+91 00000 00000" value={newPatientMobile} onChange={(e) => setNewPatientMobile(e.target.value)}
                  className="mt-2 w-full rounded-[14px] border border-ink-950/10 bg-white p-4 text-base font-semibold outline-none focus:border-ink-950/30" />
              </div>
              <div>
                <Label>Access PIN (optional)</Label>
                <input type="text" placeholder="Default 123456" value={newPatientPin} onChange={(e) => setNewPatientPin(e.target.value)} maxLength={6}
                  className="mt-2 w-full rounded-[14px] border border-ink-950/10 bg-white p-4 text-base font-semibold outline-none focus:border-ink-950/30" />
              </div>
              <button
                onClick={async () => {
                  if (!newPatientName || !newPatientMobile) { alert('Please enter a name and mobile number.'); return; }
                  const res = await onAddPatient(newPatientName, newPatientMobile, newPatientPin || '123456');
                  if (res.success) { setIsAddPatientModalOpen(false); setNewPatientName(''); setNewPatientMobile(''); setNewPatientPin(''); }
                  else alert('Could not add patient: ' + res.message);
                }}
                className="w-full rounded-full bg-ink-950 py-4 text-sm font-bold uppercase tracking-[0.08em] text-cream-50 transition-colors hover:bg-ink-800"
              >
                Create patient
              </button>
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

      {isSocialModalOpen && <SocialPostGenerator clinic={clinic} onClose={() => setIsSocialModalOpen(false)} />}
    </div>
  );
};

export default DesktopDoctorView;
