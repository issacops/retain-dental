import React, { useState, useMemo } from 'react';
import { User, Wallet, Transaction, Tier, TransactionType, Clinic, CarePlan, TransactionCategory, FamilyGroup, AppointmentType, Appointment } from '../../types';
import { Home, User as UserIcon, ShieldCheck, History, Calendar, Sparkles, Clock, HeartPulse, ChevronRight, PhoneCall, AlertTriangle, Timer, Smile, Zap, CircleCheck, ClipboardList, ArrowUpRight, ArrowDownLeft, Trophy, Activity as ActivityIcon, Globe, Users, Lock, X, CheckCircle, Gift } from 'lucide-react';

interface Props {
  currentUser: User;
  users: User[];
  wallets: Wallet[];
  transactions: Transaction[];
  familyGroups: FamilyGroup[];
  carePlans: CarePlan[];
  appointments?: Appointment[]; // Optional to prevent breaking if parent doesn't pass immediately
  clinic: Clinic;
  onToggleChecklistItem?: (carePlanId: string, itemId: string) => Promise<any>;
  onSchedule: (patientId: string, start: string, end: string, type: AppointmentType, notes: string) => Promise<any>;
  onAddFamilyMember: (name: string, relation: string, age: string) => Promise<any>;
  onSwitchProfile: (userId: string) => void;
  onRedeem: (amount: number, description: string) => Promise<any>;
}

const TreatmentComplianceRing: React.FC<{ percentage: number; color: string }> = ({ percentage, color }) => (
  <div className="relative h-12 w-12 flex items-center justify-center">
    <svg className="h-full w-full transform -rotate-90">
      <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-slate-100" />
      <circle cx="24" cy="24" r="20" stroke={color} strokeWidth="4" fill="transparent" strokeDasharray={125.6} strokeDashoffset={125.6 - (125.6 * percentage) / 100} strokeLinecap="round" />
    </svg>
    <span className="absolute text-[10px] font-black" style={{ color }}>{Math.round(percentage)}%</span>
  </div>
);

const SpecialtyCareModule: React.FC<{ plan: CarePlan; primaryColor: string; onToggle?: (id: string, itemId: string) => Promise<any> }> = ({ plan, primaryColor, onToggle }) => (
  <div className="bg-white p-6 rounded-[40px] border border-slate-100 shadow-sm space-y-6">
    <div className="flex justify-between items-center">
      <div>
        <h4 className="text-xl font-black text-slate-900 tracking-tight">{plan.treatmentName}</h4>
        <p className="text-xs font-bold text-slate-400 mt-1">{plan.category} Protocol</p>
      </div>
      <TreatmentComplianceRing percentage={(plan.checklist?.filter(i => i.completed).length || 0) / (plan.checklist?.length || 1) * 100} color={primaryColor} />
    </div>

    <div className="space-y-3">
      {plan.checklist?.map(item => (
        <div key={item.id} onClick={() => onToggle && onToggle(plan.id, item.id)} className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 active:scale-[0.98] transition-all cursor-pointer">
          <div className={`h-6 w-6 rounded-full border-2 flex items-center justify-center transition-colors ${item.completed ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-300'}`}>
            {item.completed && <CheckCircle size={14} />}
          </div>
          <span className={`text-sm font-bold ${item.completed ? 'text-slate-400 line-through' : 'text-slate-700'}`}>{item.task}</span>
        </div>
      ))}
    </div>
  </div>
);

const MobilePatientView: React.FC<Props> = ({ currentUser, users, wallets, transactions, carePlans, appointments = [], clinic, onToggleChecklistItem, onSchedule, onAddFamilyMember, onSwitchProfile, onRedeem }) => {
  const [activeTab, setActiveTab] = useState<'HOME' | 'WALLET' | 'CARE' | 'PROFILE'>('HOME');
  const [showBookingModal, setShowBookingModal] = useState(false);
  const today = new Date();
  const localDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  const [bookDate, setBookDate] = useState(localDate);
  const [bookTime, setBookTime] = useState('10:00');
  const [bookType, setBookType] = useState<AppointmentType>(AppointmentType.CHECKUP);
  const [bookSuccess, setBookSuccess] = useState(false);
  const [bookingError, setBookingError] = useState('');

  // FAMILY STATE
  const [showAddFamilyModal, setShowAddFamilyModal] = useState(false);
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberRelation, setNewMemberRelation] = useState('Spouse');
  const [newMemberAge, setNewMemberAge] = useState('');

  const wallet = useMemo(() => wallets.find(w => w.userId === currentUser.id), [wallets, currentUser]);

  const ledger = useMemo(() => {
    return transactions
      .filter(t => t.walletId === wallet?.id && t.clinicId === clinic.id)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [transactions, wallet, clinic]);

  const activeCarePlan = useMemo(() => {
    return carePlans.find(cp => cp.userId === currentUser.id && cp.isActive && cp.clinicId === clinic.id);
  }, [carePlans, currentUser, clinic]);

  const familyMembers = useMemo(() => {
    if (!currentUser.familyGroupId) return [];
    return users.filter(u => u.familyGroupId === currentUser.familyGroupId && u.id !== currentUser.id);
  }, [users, currentUser]);

  const textureClass = useMemo(() => {
    switch (clinic.themeTexture) {
      case 'grain': return 'texture-grain';
      case 'aurora': return 'texture-aurora';
      case 'glass': return 'texture-glass-heavy';
      default: return '';
    }
  }, [clinic.themeTexture]);

  // REDEEM STATE
  const [showRedeemModal, setShowRedeemModal] = useState(false);
  const [redeemSuccess, setRedeemSuccess] = useState(false);

  const REWARD_CATALOG = [
    { id: 'r1', name: 'Whitening Kit', cost: 5000, icon: <Sparkles size={24} /> },
    { id: 'r2', name: 'Electric Toothbrush', cost: 12000, icon: <Zap size={24} /> },
    { id: 'r3', name: '₹1000 Service Voucher', cost: 10000, icon: <Gift size={24} /> },
    { id: 'r4', name: 'Premium Hygiene Session', cost: 8000, icon: <ShieldCheck size={24} /> },
  ];

  const upcomingAppointments = useMemo(() => {
    return appointments
      .filter(a => a.patientId === currentUser.id && a.clinicId === clinic.id && new Date(a.startTime) > new Date())
      .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
  }, [appointments, currentUser, clinic]);

  return (
    <>
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black pointer-events-none -z-20"></div>
      <div className="fixed top-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-500/20 rounded-full blur-[100px] pointer-events-none -z-10 animate-pulse" style={{ backgroundColor: `${clinic.primaryColor}20` }}></div>
      <div className="fixed bottom-[-10%] right-[-10%] w-[300px] h-[300px] bg-emerald-500/10 rounded-full blur-[80px] pointer-events-none -z-10"></div>

      <main className="pb-32 px-6 pt-12 max-w-md mx-auto min-h-screen transition-all duration-700">

        {/* --- HOME TAB --- */}
        {
          activeTab === 'HOME' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-6 duration-700">
              {/* Clinic Header (Logo) */}
              <div className="flex items-center gap-4 px-2">
                {clinic.logoUrl && (
                  <img src={clinic.logoUrl} className="h-12 w-12 object-contain bg-white/10 rounded-xl p-2 border border-white/20 backdrop-blur-sm" />
                )}
                <div>
                  <h1 className="text-2xl font-black text-white tracking-tighter shadow-black drop-shadow-lg">{clinic.name}</h1>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Patient Portal</p>
                </div>
              </div>

              {/* Loyalty Status Card */}
              {/* Loyalty Status Card - Premium Redesign */}
              <div className="p-8 relative rounded-[40px] overflow-hidden group active:scale-[0.98] transition-all shadow-2xl" onClick={() => setActiveTab('WALLET')}>
                {/* Background composed of gradients */}
                <div className="absolute inset-0 bg-gradient-to-br from-white via-slate-100 to-slate-200"></div>

                {/* Texture/Noise Overlay (simulated with opacity) */}
                <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>

                {/* Brand Glow */}
                <div className="absolute top-[-50%] right-[-50%] w-[150%] h-[150%] bg-gradient-to-b from-transparent to-black/5 rotate-12"></div>
                <div className="absolute top-0 right-0 w-64 h-64 rounded-full blur-[60px] opacity-20" style={{ backgroundColor: clinic.primaryColor }}></div>

                <div className="relative z-10 flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="px-3 py-1 bg-black/5 rounded-full text-[9px] font-black uppercase tracking-widest text-slate-600 border border-black/5">
                        {currentUser.currentTier} Tier
                      </span>
                    </div>
                    <h3 className="text-3xl font-black text-slate-900 tracking-tighter mb-1 leading-none">{currentUser.name}</h3>
                    <p className="font-bold text-slate-400 text-xs mt-1">ID: {currentUser.mobile.slice(-4) || '####'}</p>
                  </div>
                  <Trophy size={42} className="text-slate-900 opacity-80 drop-shadow-sm" style={{ color: clinic.primaryColor }} />
                </div>

                <div className="mt-8 pt-6 border-t border-slate-200/60 flex items-end justify-between relative z-10">
                  <div>
                    <p className="text-[9px] uppercase font-black tracking-widest text-slate-400 mb-1">Rewards Balance</p>
                    <p className="text-3xl font-black text-slate-900 tracking-tighter">{(wallet?.balance || 0).toLocaleString()} <span className="text-sm text-slate-500 font-bold">Pts</span></p>
                  </div>
                  <div className="h-8 w-8 rounded-full bg-slate-900 text-white flex items-center justify-center shadow-lg" style={{ backgroundColor: clinic.primaryColor }}>
                    <ChevronRight size={16} />
                  </div>
                </div>
              </div>

              {/* UPCOMING APPOINTMENTS */}
              {upcomingAppointments.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-4">Upcoming Visits</h4>
                  {upcomingAppointments.map(appt => (
                    <div key={appt.id} className="p-6 bg-white rounded-[32px] border border-slate-100 shadow-sm flex items-center gap-5 relative overflow-hidden">
                      {appt.status !== 'CONFIRMED' && (
                        <div className="absolute top-0 right-0 bg-amber-100 text-amber-600 text-[9px] font-black uppercase px-3 py-1 rounded-bl-xl tracking-widest">
                          Awaiting
                        </div>
                      )}
                      {appt.status === 'CONFIRMED' && (
                        <div className="absolute top-0 right-0 bg-emerald-100 text-emerald-600 text-[9px] font-black uppercase px-3 py-1 rounded-bl-xl tracking-widest">
                          Confirmed
                        </div>
                      )}

                      <div className={`h-16 w-16 rounded-2xl flex flex-col items-center justify-center border ${appt.status === 'CONFIRMED' ? 'bg-indigo-50 border-indigo-100 text-indigo-600' : 'bg-slate-50 border-slate-100 text-slate-400'}`}>
                        <span className="text-xl font-black">{new Date(appt.startTime).getDate()}</span>
                        <span className="text-[9px] font-bold uppercase">{new Date(appt.startTime).toLocaleDateString('en-US', { month: 'short' })}</span>
                      </div>
                      <div>
                        <h5 className="font-black text-slate-900 text-lg">{appt.type}</h5>
                        <p className="text-xs font-bold text-slate-400 flex items-center gap-2">
                          {new Date(appt.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Active Treatment Quick Look */}
              {activeCarePlan && (
                <button onClick={() => setActiveTab('CARE')} className="w-full text-left p-8 rounded-[48px] bg-slate-900 text-white shadow-2xl relative overflow-hidden group active:scale-[0.98] transition-all border" style={{ borderColor: clinic.primaryColor, borderWidth: '1px' }}>
                  <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-indigo-500/10 blur-[80px] rounded-full"></div>
                  <div className="absolute right-0 top-0 p-8 opacity-10 scale-150 group-hover:scale-125 transition-transform duration-700"><ActivityIcon size={80} /></div>

                  <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></div>
                      <p className="text-[10px] font-black uppercase tracking-[0.25em] text-white/50">Live Protocol</p>
                    </div>
                    <h4 className="text-3xl font-black tracking-tighter mb-8 leading-tight">{activeCarePlan.treatmentName}</h4>

                    <div className="space-y-3">
                      <div className="flex justify-between items-end">
                        <p className="text-[9px] font-black uppercase tracking-widest text-white/30">Journey Progress</p>
                        <span className="text-xs font-black tracking-widest text-emerald-400">{Math.round((activeCarePlan.checklist?.filter(i => i.completed).length || 0) / (activeCarePlan.checklist?.length || 1) * 100)}%</span>
                      </div>
                      <div className="h-2.5 bg-white/10 rounded-full overflow-hidden backdrop-blur-sm">
                        <div className="h-full bg-emerald-400 shadow-[0_0_15px_rgba(52,211,153,0.5)] transition-all duration-1000" style={{ width: `${(activeCarePlan.checklist?.filter(i => i.completed).length || 0) / (activeCarePlan.checklist?.length || 1) * 100}%` }}></div>
                      </div>
                    </div>
                  </div>
                </button>
              )}

              {/* Quick Actions */}
              <div className="grid grid-cols-2 gap-4">
                <button onClick={() => setShowBookingModal(true)} className="p-6 bg-slate-900 text-white rounded-[32px] flex flex-col items-center gap-3 active:scale-95 transition-all shadow-xl" style={{ backgroundColor: clinic.primaryColor }}>
                  <Calendar size={24} />
                  <span className="text-[10px] uppercase font-black tracking-widest">Book Visit</span>
                </button>
                <button onClick={() => setActiveTab('CARE')} className="p-6 bg-white text-slate-900 border border-slate-100 rounded-[32px] flex flex-col items-center gap-3 active:scale-95 transition-all shadow-sm">
                  <HeartPulse size={24} className="text-slate-400" />
                  <span className="text-[10px] uppercase font-black tracking-widest text-slate-600">My Care</span>
                </button>
              </div>
            </div>
          )
        }

        {/* --- WALLET TAB --- */}
        {
          activeTab === 'WALLET' && (
            <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-700">
              <div className="flex justify-between items-end">
                <div className="hidden"></div> {/* Spacer for formatting if needed, layout handled by header */}
                <button onClick={() => setShowRedeemModal(true)} className="w-full px-5 py-6 bg-slate-900 text-white rounded-[32px] font-black uppercase tracking-widest text-xs shadow-xl active:scale-95 transition-all flex items-center justify-center gap-3">
                  <Gift size={18} /> Redeem Rewards
                </button>
              </div>

              <div className="bg-white rounded-[48px] border border-slate-100 shadow-sm overflow-hidden p-4">
                <div className="space-y-2">
                  {ledger.length > 0 ? ledger.map((tx) => (
                    <div key={tx.id} className="flex items-center gap-5 p-6 hover:bg-slate-50 rounded-[32px] transition-all group">
                      <div className={`h-14 w-14 rounded-2xl flex items-center justify-center shrink-0 border transition-all ${tx.type === TransactionType.EARN ? 'bg-emerald-50 text-emerald-500 border-emerald-100' : 'bg-rose-50 text-rose-500 border-rose-100'}`}>
                        {tx.type === TransactionType.EARN ? <ArrowUpRight size={24} /> : <ArrowDownLeft size={24} />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-black text-base text-slate-800 truncate leading-none">{tx.description}</h4>
                        <span className="text-[9px] uppercase font-black text-slate-400 tracking-[0.2em] mt-2 block">{tx.category} • {new Date(tx.date).toLocaleDateString()}</span>
                      </div>
                      <div className={`text-xl font-black tracking-tighter ${tx.type === TransactionType.EARN ? 'text-emerald-500' : 'text-rose-500'}`}>
                        {tx.type === TransactionType.EARN ? '+' : ''}{tx.pointsEarned}
                      </div>
                    </div>
                  )) : (
                    <div className="p-16 text-center text-slate-200">
                      <History size={64} className="mx-auto mb-6 opacity-20" />
                      <p className="font-black text-xl tracking-tighter">Ledger clear.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )
        }

        {/* --- CARE TAB --- */}
        {
          activeTab === 'CARE' && (
            <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-700">
              {activeCarePlan ? (
                <div className="space-y-8">
                  <SpecialtyCareModule plan={activeCarePlan} primaryColor={clinic.primaryColor} onToggle={onToggleChecklistItem} />
                  <div className="grid grid-cols-2 gap-4">
                    <button className="p-8 bg-slate-900 rounded-[40px] text-white flex flex-col items-center gap-3 active:scale-95 shadow-2xl transition-all shadow-black/20">
                      <PhoneCall size={28} style={{ color: clinic.primaryColor }} />
                      <span className="text-[10px] font-black uppercase tracking-[0.2em]">Priority SOS</span>
                    </button>
                    <button className="p-8 bg-white border border-slate-100 rounded-[40px] text-slate-800 flex flex-col items-center gap-3 active:scale-95 transition-all">
                      <AlertTriangle size={28} className="text-rose-500" />
                      <span className="text-[10px] font-black uppercase tracking-[0.2em]">Report Issue</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-20 bg-white rounded-[56px] border border-slate-100 text-center opacity-80 animate-pulse">
                  <HeartPulse size={64} className="text-slate-100 mb-8 mx-auto" />
                  <h4 className="text-2xl font-black text-slate-300 tracking-tighter italic">Bio-sync inactive.</h4>
                </div>
              )}
            </div>
          )
        }

        {/* --- PROFILE TAB --- */}
        {
          activeTab === 'PROFILE' && (
            <div className="space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-700 pt-6">
              <div className="text-center space-y-8">
                <div className="h-40 w-40 rounded-[64px] mx-auto flex items-center justify-center text-5xl font-black text-slate-200 border-[8px] border-white shadow-2xl bg-white relative">
                  <div className="absolute inset-[-12px] rounded-[70px] border border-slate-50"></div>
                  {currentUser.name.charAt(0)}
                </div>
                <div>
                  <h2 className="text-4xl font-black text-slate-900 tracking-tighter">{currentUser.name}</h2>
                  <p className="text-slate-400 font-black uppercase tracking-[0.4em] text-[10px] mt-2">{currentUser.currentTier} Identity Verified</p>
                </div>
              </div>

              <div className="bg-white rounded-[56px] p-10 border border-slate-100 flex justify-between shadow-sm">
                <div className="flex-1 text-center">
                  <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">Global Spend</p>
                  <p className="text-3xl font-black text-slate-800 tracking-tighter">₹{currentUser.lifetimeSpend.toLocaleString()}</p>
                </div>
                <div className="w-px h-12 bg-slate-50 my-auto"></div>
                <div className="flex-1 text-center">
                  <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">Status Shift</p>
                  <p className="text-3xl font-black text-emerald-500 tracking-tighter">84%</p>
                </div>
              </div>

              <div className="space-y-6 pt-6 border-t border-slate-100">
                <div className="flex justify-between items-center">
                  <h4 className="text-xl font-black text-slate-900 tracking-tight">Family Hub</h4>
                  <button onClick={() => setShowAddFamilyModal(true)} className="px-4 py-2 bg-slate-900 text-white rounded-full text-[10px] font-black uppercase tracking-widest">+ Add</button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Current User Card */}
                  <div className="p-4 rounded-[32px] bg-slate-900 text-white shadow-lg relative overflow-hidden group">
                    <div className="relative z-10">
                      <div className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center text-sm font-black mb-3 border border-white/10">{currentUser.name.charAt(0)}</div>
                      <p className="font-bold text-sm truncate">{currentUser.name}</p>
                      <p className="text-[9px] uppercase tracking-widest text-white/50 mt-1">Primary</p>
                    </div>
                  </div>

                  {/* Family Members */}
                  {familyMembers.map(m => (
                    <div key={m.id} onClick={() => onSwitchProfile(m.id)} className="p-4 rounded-[32px] bg-white border border-slate-100 shadow-sm relative overflow-hidden active:scale-95 transition-all">
                      <div className="h-10 w-10 rounded-full bg-slate-50 flex items-center justify-center text-sm font-black mb-3 text-slate-400 border border-slate-100">{m.name.charAt(0)}</div>
                      <p className="font-bold text-sm text-slate-700 truncate">{m.name}</p>
                      <p className="text-[9px] uppercase tracking-widest text-slate-400 mt-1">{m.metadata?.relation || 'Kin'}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                {[
                  { label: 'Security & Biometrics', icon: <ShieldCheck size={18} /> },
                  { label: 'Family Link Manager', icon: <Users size={18} /> },
                  { label: 'Global Privacy Node', icon: <Lock size={18} /> },
                ].map((item, i) => (
                  <div key={i} className="bg-white p-7 rounded-[32px] border border-slate-50 flex justify-between items-center group active:scale-[0.98] transition-all">
                    <div className="flex items-center gap-4">
                      <span className="text-slate-300">{item.icon}</span>
                      <span className="text-sm font-black text-slate-700 tracking-tight uppercase tracking-widest">{item.label}</span>
                    </div>
                    <ChevronRight size={18} className="text-slate-100 transition-transform group-hover:translate-x-1" />
                  </div>
                ))}
              </div>
            </div>
          )
        }
      </main >

      {/* Navigation */}
      < div className="fixed bottom-8 left-0 w-full px-6 z-50" >
        <nav className="bg-slate-900/90 backdrop-blur-3xl border border-white/10 shadow-[0_30px_60px_-10px_rgba(0,0,0,0.4)] rounded-[40px] px-3 py-3 flex justify-between items-center max-w-md mx-auto overflow-hidden relative">
          <div className="absolute bottom-0 left-0 w-full h-1 bg-white/5 opacity-50"></div>
          {['HOME', 'WALLET', 'CARE', 'PROFILE'].map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab as any)} className={`flex-1 flex flex-col items-center justify-center h-16 rounded-[28px] transition-all duration-500 relative group overflow-hidden ${activeTab === tab ? 'text-white' : 'text-slate-500 hover:text-slate-300'}`} style={activeTab === tab ? { backgroundColor: clinic.primaryColor } : {}}>
              {tab === 'HOME' && <Home size={24} className={activeTab === tab ? 'scale-110' : ''} />}
              {tab === 'WALLET' && <History size={24} className={activeTab === tab ? 'scale-110' : ''} />}
              {tab === 'CARE' && <HeartPulse size={24} className={activeTab === tab ? 'scale-110' : ''} />}
              {tab === 'PROFILE' && <UserIcon size={24} className={activeTab === tab ? 'scale-110' : ''} />}
              {activeTab === tab && <div className="absolute bottom-1 w-1 h-1 bg-white rounded-full"></div>}
            </button>
          ))}
        </nav>
      </div >

      {/* Redeem Modal */}
      {
        showRedeemModal && (
          <div className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-md flex items-end">
            <div className="bg-white w-full rounded-t-[48px] p-8 pb-12 animate-in slide-in-from-bottom-full duration-500 shadow-2xl h-[85vh] flex flex-col">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-3xl font-black text-slate-900 tracking-tight">Rewards</h3>
                <button onClick={() => setShowRedeemModal(false)} className="p-2 bg-slate-50 rounded-full"><X size={20} /></button>
              </div>

              <div className="flex-1 overflow-y-auto space-y-4 pr-2">
                <div className="p-6 bg-slate-900 rounded-[32px] text-white mb-6 sticky top-0 z-10 shadow-xl">
                  <p className="text-[10px] font-black uppercase tracking-widest text-white/50 mb-1">Available Balance</p>
                  <p className="text-4xl font-black tracking-tighter">{wallet?.balance.toLocaleString()} Pts</p>
                </div>

                {REWARD_CATALOG.map(reward => {
                  const canAfford = (wallet?.balance || 0) >= reward.cost;
                  return (
                    <div key={reward.id} className={`p-6 rounded-[32px] border flex justify-between items-center transition-all ${canAfford ? 'bg-white border-slate-100' : 'bg-slate-50 border-transparent opacity-60 grayscale'}`}>
                      <div className="flex items-center gap-4">
                        <div className="h-16 w-16 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-900 border border-slate-100 shadow-sm">
                          {reward.icon}
                        </div>
                        <div>
                          <h4 className="font-black text-lg text-slate-900 leading-tight">{reward.name}</h4>
                          <p className="font-bold text-slate-400 text-xs mt-1">{reward.cost.toLocaleString()} Pts</p>
                        </div>
                      </div>
                      <button
                        disabled={!canAfford}
                        onClick={async () => {
                          await onRedeem(reward.cost, reward.name);
                          setRedeemSuccess(true);
                          setTimeout(() => {
                            setRedeemSuccess(false);
                            setShowRedeemModal(false);
                          }, 2000);
                        }}
                        className={`px-5 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${canAfford ? 'bg-indigo-600 text-white shadow-lg active:scale-95' : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`}
                        style={canAfford ? { backgroundColor: clinic.primaryColor } : {}}
                      >
                        {redeemSuccess ? <CheckCircle size={16} /> : 'Claim'}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )
      }

      {/* Booking Modal */}
      {
        showBookingModal && (
          <div className="fixed inset-0 z-[100] bg-slate-900/40 backdrop-blur-md flex items-end">
            <div className="bg-white w-full rounded-t-[48px] p-8 pb-12 animate-in slide-in-from-bottom-full duration-500 shadow-2xl">
              {bookSuccess ? (
                <div className="text-center py-10 space-y-6">
                  <div className="h-24 w-24 bg-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-xl text-white">
                    <CheckCircle size={48} />
                  </div>
                  <h3 className="text-3xl font-black text-slate-900 tracking-tighter">Slot Secured.</h3>
                  <p className="text-slate-500 font-medium">Your appointment is confirmed. We look forward to seeing you.</p>
                  <button onClick={() => { setShowBookingModal(false); setBookSuccess(false); }} className="w-full py-5 bg-slate-900 text-white rounded-[32px] font-black tracking-widest uppercase">My Pleasure</button>
                </div>
              ) : (
                <div className="space-y-8">
                  <div className="flex justify-between items-center">
                    <h3 className="text-2xl font-black text-slate-900 tracking-tight">Priority Booking</h3>
                    <button onClick={() => setShowBookingModal(false)} className="p-2 bg-slate-50 rounded-full"><X size={20} /></button>
                  </div>

                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">Date & Time</label>
                    <div className="flex gap-4">
                      <input type="date" value={bookDate} min={localDate} onChange={e => { setBookDate(e.target.value); setBookingError(''); }} className="flex-1 bg-slate-50 border border-slate-100 p-4 rounded-2xl font-bold outline-none focus:border-indigo-500 transition-all" />
                      <select value={bookTime} onChange={e => { setBookTime(e.target.value); setBookingError(''); }} className="bg-slate-50 border border-slate-100 p-4 rounded-2xl font-bold outline-none focus:border-indigo-500 transition-all">
                        {['09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00'].map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                    </div>
                  </div>

                  {bookingError && (
                    <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
                      <AlertTriangle size={18} className="text-rose-500 shrink-0" />
                      <p className="text-xs font-bold text-rose-500 leading-tight">{bookingError}</p>
                    </div>
                  )}

                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">Session Type</label>
                    <div className="grid grid-cols-2 gap-3">
                      {[AppointmentType.CHECKUP, AppointmentType.CLEANING, AppointmentType.CONSULTATION, AppointmentType.TREATMENT].map(t => (
                        <button key={t} onClick={() => setBookType(t)}
                          className={`p-4 rounded-2xl font-bold text-xs uppercase tracking-wider border-2 transition-all ${bookType === t ? 'border-slate-900 bg-slate-900 text-white shadow-lg' : 'border-slate-100 bg-white text-slate-500'}`}>
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button onClick={async () => {
                    setBookingError('');
                    const start = new Date(`${bookDate}T${bookTime}`);
                    const now = new Date();

                    // 1. Past Check
                    if (start < now) {
                      setBookingError("Cannot book appointments in the past.");
                      return;
                    }

                    // 2. Conflict Check (Simple Client-Side)
                    // Check if user has any active appointment on the same day roughly overlapping
                    // Backend should catch this, but good UX to catch here.
                    // (Assuming 'transactions' or a separate 'appointments' prop list exists? 
                    // Oh wait, Mobile view only gets 'carePlans', 'wallets', 'transactions'. 
                    // It doesn't receive raw appointments list. 
                    // We should pass 'appointments' to MobilePatientView Prop if we want this check.
                    // For now, we'll skip rigorous conflict check or use 'carePlans' for strict protocol tracking.)

                    // Proceed
                    const end = new Date(start);
                    end.setMinutes(end.getMinutes() + 30);
                    await onSchedule(currentUser.id, start.toISOString(), end.toISOString(), bookType, 'Mobile Booking');
                    setBookSuccess(true);
                  }} className="w-full py-5 bg-indigo-600 text-white rounded-[32px] font-black text-lg shadow-xl shadow-indigo-200 mt-4 active:scale-95 transition-transform" style={{ backgroundColor: clinic.primaryColor }}>
                    Confirm Request
                  </button>
                </div>
              )}
            </div>
          </div>
        )
      }

      {/* Add Family Modal */}
      {
        showAddFamilyModal && (
          <div className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-6">
            <div className="bg-white rounded-[48px] p-8 w-full max-w-sm animate-in zoom-in-95 duration-300 relative">
              <button onClick={() => setShowAddFamilyModal(false)} className="absolute top-6 right-6 p-2 bg-slate-50 rounded-full"><X size={18} /></button>
              <h3 className="text-2xl font-black text-slate-900 tracking-tight mb-6">Add Dependent</h3>

              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2 mb-2 block">Name</label>
                  <input value={newMemberName} onChange={e => setNewMemberName(e.target.value)} className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl font-bold outline-none" placeholder="e.g. Rohan Sharma" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2 mb-2 block">Relation</label>
                    <select value={newMemberRelation} onChange={e => setNewMemberRelation(e.target.value)} className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl font-bold outline-none">
                      <option value="Spouse">Spouse</option>
                      <option value="Child">Child</option>
                      <option value="Parent">Parent</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2 mb-2 block">Age</label>
                    <input value={newMemberAge} onChange={e => setNewMemberAge(e.target.value)} className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl font-bold outline-none" placeholder="e.g. 10" />
                  </div>
                </div>

                <button onClick={async () => {
                  await onAddFamilyMember(newMemberName, newMemberRelation, newMemberAge);
                  setShowAddFamilyModal(false);
                  setNewMemberName('');
                  setNewMemberAge('');
                }} className="w-full py-5 bg-slate-900 text-white rounded-[32px] font-black mt-4 shadow-xl active:scale-95 transition-all">
                  Link Identity
                </button>
              </div>
            </div>
          </div>
        )
      }
    </>
  );
};

export default MobilePatientView;
