import React, { useState, useMemo } from 'react';
import { LayoutGrid, TrendingUp, Bell, Settings, Smile, LayoutGrid as LayoutGridIcon, Plus, X, Calendar as CalendarIcon, Activity, Grid, Zap, Search, UserPlus, CreditCard, MessageSquare } from 'lucide-react';
import { IBackendService } from '../../services/IBackendService';
import { User, Wallet, Transaction, FamilyGroup, Clinic, CarePlan, TransactionCategory, TransactionType, Appointment, AppointmentStatus, AppointmentType } from '../../types';
import MorningBriefTicker from './subcomponents/MorningBrief';
import IntelligenceSidebar from './subcomponents/IntelligenceSidebar';
import PatientList from './subcomponents/PatientList';
import DashboardAnalytics from './subcomponents/DashboardAnalytics';
import PatientProfile from './subcomponents/PatientProfile';
import AppointmentScheduler from './subcomponents/AppointmentScheduler';

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
   onAddPatient: (name: string, mobile: string) => Promise<{ success: boolean; message: string; user?: User }>;
   onSchedule: (patientId: string, start: string, end: string, type: AppointmentType, notes: string) => Promise<any>;
   onUpdateAppointmentStatus: (id: string, status: AppointmentStatus) => Promise<any>;
}

const DesktopDoctorView: React.FC<Props> = ({
   currentUser, allUsers, wallets, transactions, familyGroups, carePlans, clinic,
   onProcessTransaction, onUpdateCarePlan, onLinkFamily, onAddPatient, backendService,
   appointments, onSchedule, onUpdateAppointmentStatus
}) => {
   const [activeSection, setActiveSection] = useState('Operational Hub');
   const [selectedPatient, setSelectedPatient] = useState<User | null>(null);
   const [searchQuery, setSearchQuery] = useState('');
   const [isAddPatientModalOpen, setIsAddPatientModalOpen] = useState(false);
   const [newPatientName, setNewPatientName] = useState('');
   const [newPatientMobile, setNewPatientMobile] = useState('');

   const [stats, setStats] = useState<any>({});

   // Async Stats Fetch
   React.useEffect(() => {
      let mounted = true;
      backendService.getDashboardStats(clinic.id).then(res => {
         if (mounted) setStats(res);
      });
      return () => { mounted = false; };
   }, [backendService, clinic.id, transactions]);

   const filteredPatients = allUsers.filter(u => u.clinicId === clinic.id && u.role === 'PATIENT' && (u.name.toLowerCase().includes(searchQuery.toLowerCase()) || u.mobile.includes(searchQuery)));

   // ... (Rest of useMemos same) ...

   // ... (Render) ...

   // In the Add Patient button handler:
   // <button onClick={async () => { if (!newPatientName || !newPatientMobile) return; const res = await onAddPatient(newPatientName, newPatientMobile); ... }}

   const activeCarePlan = useMemo(() => {
      return carePlans.find(cp => cp.userId === selectedPatient?.id && cp.isActive && cp.clinicId === clinic.id);
   }, [carePlans, selectedPatient, clinic.id]);

   const textureClass = useMemo(() => {
      switch (clinic.themeTexture) {
         case 'grain': return 'texture-grain';
         case 'aurora': return 'texture-aurora';
         case 'glass': return 'texture-glass-heavy';
         default: return 'bg-slate-50';
      }
   }, [clinic.themeTexture]);

   // Helper function for greeting
   const greet = () => {
      const hour = new Date().getHours();
      if (hour < 12) return 'Good Morning';
      if (hour < 18) return 'Good Afternoon';
      return 'Good Evening';
   };

   // Helper function to get user's first name
   const getUserName = (fullName: string) => (fullName || 'Doctor').split(' ')[0];

   // Helper to convert hex to rgb string for Tailwind alpha support
   const hexToRgb = (hex: string) => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result ? `${parseInt(result[1], 16)} ${parseInt(result[2], 16)} ${parseInt(result[3], 16)} ` : '99 102 241';
   };

   // Helper to calculate luminance for contrast
   const getLuminance = (hex: string) => {
      const rgb = parseInt(hex.slice(1), 16);
      const r = (rgb >> 16) & 0xff;
      const g = (rgb >> 8) & 0xff;
      const b = (rgb >> 0) & 0xff;
      return 0.2126 * r + 0.7152 * g + 0.0722 * b;
   };

   const isLight = useMemo(() => {
      return /^#[0-9A-F]{6}$/i.test(clinic.primaryColor) ? getLuminance(clinic.primaryColor) > 180 : false;
   }, [clinic.primaryColor]);

   return (
      <div className={`flex flex - col h - screen text - slate - 900 font - sans overflow - hidden transition - all duration - 1000 ${textureClass} `} style={{ '--primary': clinic.primaryColor, '--primary-rgb': hexToRgb(clinic.primaryColor), '--primary-glow': clinic.primaryColor + '15' } as React.CSSProperties}>

         {/* Sidebar */}
         <div className="flex h-full">
            <aside className="w-72 bg-white/70 backdrop-blur-xl border-r border-white/40 flex flex-col justify-between p-6 z-20 relative shadow-2xl">
               <div className="space-y-10">
                  {/* Brand */}
                  <div className="flex items-center gap-4 group cursor-pointer">
                     {clinic.logoUrl ? (
                        <img src={clinic.logoUrl} className="h-10 w-10 rounded-xl shadow-lg ring-2 ring-white transition-transform group-hover:scale-105" />
                     ) : (
                        <div className={`h - 10 w - 10 bg - primary rounded - xl flex items - center justify - center shadow - lg ring - 2 ring - white transition - transform group - hover: scale - 105 ${isLight ? 'text-slate-900' : 'text-white'} `}>
                           <Activity size={20} />
                        </div>
                     )}
                     <div>
                        <h1 className="font-extrabold text-lg tracking-tight text-slate-900 leading-tight">{clinic.name}</h1>
                        <p className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">{clinic.subscriptionTier} Tier</p>
                     </div>
                  </div>

                  {/* Navigation */}
                  <nav className="space-y-2">
                     {['Operational Hub', 'Patient Records', 'Financial Ledger', 'Settings'].map((item, i) => (
                        <div key={item}
                           onClick={() => setActiveSection(item)}
                           className={`flex items - center gap - 4 px - 4 py - 3.5 rounded - xl cursor - pointer transition - all duration - 300 group ${activeSection === item ? `bg-primary shadow-xl shadow-primary/20 scale-[1.02] ${isLight ? 'text-slate-900 font-black' : 'text-white'}` : 'hover:bg-white/50 text-slate-500 hover:text-slate-800'} `}
                        >
                           <Grid size={18} className={`transition - transform duration - 300 ${activeSection === item ? 'scale-110' : 'group-hover:scale-110'} `} />
                           <span className="font-bold text-sm tracking-wide">{item}</span>
                           {i === 0 && <div className="ml-auto h-2 w-2 rounded-full bg-rose-500 animate-pulse box-shadow-lg shadow-rose-500/50" />}
                        </div>
                     ))}
                  </nav>
               </div>

               <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 text-white relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity"><Zap size={48} /></div>
                  <h4 className="font-bold text-sm mb-2 relative z-10">System Status</h4>
                  <p className="text-xs text-slate-400 leading-relaxed relative z-10 mb-4">All systems operational. Sync active.</p>
                  <div className="flex items-center gap-2 text-[10px] font-mono text-emerald-400 bg-emerald-400/10 px-3 py-1.5 rounded-lg w-fit">
                     <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></div>
                     ONLINE
                  </div>
               </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 relative overflow-y-auto scroll-smooth">
               {/* Ambient Glow */}
               <div className="absolute top-[-200px] left-[-200px] w-[600px] h-[600px] bg-primary rounded-full blur-[120px] opacity-[0.08] pointer-events-none mix-blend-multiply animate-pulse-slow"></div>

               {/* Header */}
               <header className="sticky top-0 z-10 px-8 py-6 flex justify-between items-center bg-white/40 backdrop-blur-md border-b border-white/20">
                  <div>
                     <h2 className="text-2xl font-black text-slate-800 tracking-tight">{greet()}, Dr. {getUserName(currentUser.name)}</h2>
                     <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-1 flex items-center gap-2">
                        <CalendarIcon size={12} /> {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                     </p>
                  </div>
                  <div className="flex items-center gap-4">
                     <div className="h-10 px-4 bg-white rounded-xl border border-slate-200 flex items-center gap-2 text-slate-400 focus-within:border-primary focus-within:text-primary transition-colors shadow-sm">
                        <Search size={16} />
                        <input type="text" placeholder="Search patients..." className="bg-transparent outline-none text-sm font-semibold text-slate-800 placeholder:text-slate-300 w-64" />
                     </div>
                     <button className="h-10 w-10 bg-white rounded-xl border border-slate-200 flex items-center justify-center text-slate-400 hover:text-primary hover:border-primary transition-all shadow-sm relative">
                        <Bell size={18} />
                        <span className="absolute top-2 right-2.5 h-1.5 w-1.5 bg-rose-500 rounded-full border border-white"></span>
                     </button>
                  </div>
               </header>

               <div className="p-8 space-y-8 max-w-[1600px] mx-auto pb-20">
                  {activeSection === 'Operational Hub' && (
                     <>
                        <DashboardAnalytics clinic={clinic} stats={stats} />
                        <div className="grid grid-cols-12 gap-8">
                           <div className="col-span-8 space-y-8">
                              <MorningBriefTicker clinic={clinic} stats={stats} />

                              <div className="bg-white/60 backdrop-blur-xl rounded-[32px] p-8 border border-white/60 shadow-xl relative overflow-hidden">
                                 <div className="flex justify-between items-center mb-8">
                                    <div>
                                       <h3 className="text-xl font-black text-slate-800">Quick Actions</h3>
                                       <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mt-1">Frequent Tasks</p>
                                    </div>
                                 </div>
                                 <div className="grid grid-cols-4 gap-4">
                                    {[
                                       { icon: <UserPlus size={20} />, label: 'Add Patient', action: () => setIsAddPatientModalOpen(true) },
                                       { icon: <CalendarIcon size={20} />, label: 'Schedule', action: () => alert('Opening Scheduler...') },
                                       { icon: <CreditCard size={20} />, label: 'Invoice', action: () => alert('New Invoice...') },
                                       { icon: <MessageSquare size={20} />, label: 'Message', action: () => alert('Blast Message...') }
                                    ].map((action, i) => (
                                       <button key={i} onClick={action.action} className="flex flex-col items-center gap-3 p-6 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:border-primary/20 hover:-translate-y-1 transition-all group">
                                          <div className="h-12 w-12 bg-slate-50 rounded-xl flex items-center justify-center text-slate-500 group-hover:bg-primary group-hover:text-white transition-colors">
                                             {action.icon}
                                          </div>
                                          <span className="font-bold text-xs text-slate-600 group-hover:text-slate-900">{action.label}</span>
                                       </button>
                                    ))}
                                 </div>
                              </div>
                           </div>

                           <div className="col-span-4 space-y-8">
                              <div className="bg-white/60 backdrop-blur-xl rounded-[32px] p-8 border border-white/60 shadow-xl h-full">
                                 <h3 className="text-xl font-black text-slate-800 mb-6">Patient Queue</h3>
                                 {/* Placeholder for waiting list */}
                                 <div className="space-y-4">
                                    <div className="p-4 bg-white rounded-2xl border border-slate-100 flex items-center gap-4 shadow-sm">
                                       <div className="h-10 w-10 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-xs">AM</div>
                                       <div>
                                          <h5 className="font-bold text-sm text-slate-800">Anita Malik</h5>
                                          <p className="text-[10px] font-bold text-slate-400 uppercase">Waiting (10m)</p>
                                       </div>
                                       <button className="ml-auto px-3 py-1.5 bg-slate-900 text-white text-[10px] font-bold rounded-lg hover:bg-primary transition-colors">Call</button>
                                    </div>
                                 </div>
                              </div>
                           </div>
                        </div>
                     </>
                  )}
                  {activeSection === 'Patient Records' && (
                     <div className="flex overflow-hidden h-full">
                        <PatientList
                           clinic={clinic}
                           users={filteredPatients}
                           searchQuery={searchQuery}
                           setSearchQuery={setSearchQuery}
                           selectedPatient={selectedPatient}
                           setSelectedPatient={setSelectedPatient}
                           setIsAddPatientModalOpen={setIsAddPatientModalOpen}
                        />

                        {/* WORKSPACE PANEL */}
                        <div className="flex-1 flex overflow-hidden">
                           <div className="flex-1 p-16 overflow-y-auto custom-scrollbar">
                              {selectedPatient ? (
                                 <PatientProfile
                                    selectedPatient={selectedPatient}
                                    clinic={clinic}
                                    wallets={wallets}
                                    carePlans={carePlans}
                                    transactions={transactions}
                                    allUsers={allUsers}
                                    familyGroups={familyGroups}
                                    onProcessTransaction={onProcessTransaction}
                                 />
                              ) : (
                                 <div className="h-full flex flex-col items-center justify-center animate-in zoom-in-95 duration-1000">
                                    <div className="relative">
                                       <div className="absolute inset-0 bg-primary/20 blur-[120px] rounded-full scale-150"></div>
                                       <LayoutGrid size={160} className="relative text-white/20" />
                                    </div>
                                    <h2 className="text-5xl font-black text-slate-300 tracking-tighter mt-12">Select Patient Identity</h2>
                                    <p className="text-slate-400 font-bold uppercase tracking-[0.4em] mt-4">Operational Hub v3.4</p>
                                 </div>
                              )}
                           </div>

                           {selectedPatient && (
                              <IntelligenceSidebar
                                 patient={selectedPatient}
                                 wallet={wallets.find(w => w.userId === selectedPatient.id)}
                                 carePlan={activeCarePlan}
                              />
                           )}
                        </div>

                        {/* ADD PATIENT MODAL - Premium Minimalist */}
                        {isAddPatientModalOpen && (
                           <div className="fixed inset-0 z-[60] flex items-center justify-center bg-dark-900/60 backdrop-blur-3xl animate-in fade-in duration-500">
                              <div className="glass-panel bg-white p-20 w-full max-w-2xl shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] relative overflow-hidden">
                                 <div className="absolute top-0 left-0 w-full h-2 bg-black"></div>
                                 <div className="flex justify-between items-center mb-16">
                                    <h3 className="text-5xl font-black tracking-tighter text-slate-900">New Identity.</h3>
                                    <button onClick={() => setIsAddPatientModalOpen(false)} className="p-4 rounded-[20px] hover:bg-slate-50 transition-all"><X size={32} /></button>
                                 </div>
                                 <div className="space-y-12">
                                    <div className="space-y-4">
                                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-4">Subject Name</label>
                                       <input type="text" placeholder="Identity Signature" value={newPatientName} onChange={(e) => setNewPatientName(e.target.value)}
                                          className="glass-input w-full px-10 py-7 bg-slate-50 border border-slate-100 rounded-[32px] text-2xl font-black outline-none focus:border-black transition-all" />
                                    </div>
                                    <div className="space-y-4">
                                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-4">Mobile Key</label>
                                       <input type="tel" placeholder="+91 0000 000 000" value={newPatientMobile} onChange={(e) => setNewPatientMobile(e.target.value)}
                                          className="glass-input w-full px-10 py-7 bg-slate-50 border border-slate-100 rounded-[32px] text-2xl font-black outline-none focus:border-black transition-all" />
                                    </div>
                                    <button onClick={async () => { if (!newPatientName || !newPatientMobile) return; const res = await onAddPatient(newPatientName, newPatientMobile); if (res.success) { setIsAddPatientModalOpen(false); setNewPatientName(''); setNewPatientMobile(''); if (res.updatedData) { /* Handle user update if needed or rely on global reload */ } } }}
                                       className="w-full py-10 rounded-[32px] bg-slate-900 text-white font-black text-xl tracking-widest shadow-2xl transition-all hover:scale-[1.02] active:scale-95 text-center block">
                                       Initiate Identity Onboarding
                                    </button>
                                 </div>
                              </div>
                           </div>
                        )}
                     </div>
                  )}
               </div >
            </main >
         </div >
      </div >
   );
};

export default DesktopDoctorView;
