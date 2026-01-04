
import React, { useState, useMemo } from 'react';
import { User, Wallet, Transaction, Tier, TransactionType, Clinic, CarePlan, TransactionCategory, FamilyGroup, AppointmentType } from '../../types';
import { Home, User as UserIcon, ShieldCheck, History, Calendar, Sparkles, Clock, HeartPulse, ChevronRight, PhoneCall, AlertTriangle, Timer, Smile, Zap, CircleCheck, ClipboardList, ArrowUpRight, ArrowDownLeft, Trophy, Activity as ActivityIcon, Globe, Users, Lock, X, CheckCircle, Gift } from 'lucide-react';

interface Props {
  currentUser: User;
  users: User[];
  wallets: Wallet[];
  transactions: Transaction[];
  familyGroups: FamilyGroup[];
  carePlans: CarePlan[];
  clinic: Clinic;
  onToggleChecklistItem?: (carePlanId: string, itemId: string) => Promise<any>;
  onSchedule: (patientId: string, start: string, end: string, type: AppointmentType, notes: string) => Promise<any>;
  onAddFamilyMember: (name: string, relation: string, age: string) => Promise<any>;
  onSwitchProfile: (userId: string) => void; // Switch profile is client-side only (setData), so maybe sync? App.tsx handleSwitchProfile is sync. Keep as void.
  onRedeem: (amount: number, description: string) => Promise<any>;
}

const TreatmentComplianceRing = ({ progress, color }: { progress: number, color: string }) => {
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative h-24 w-24 flex items-center justify-center">
      <svg className="h-full w-full transform -rotate-90">
        <circle cx="50%" cy="50%" r={radius} fill="transparent" stroke="rgba(255,255,255,0.1)" strokeWidth="10" />
        <circle cx="50%" cy="50%" r={radius} fill="transparent" stroke={color} strokeWidth="10" strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round" className="transition-all duration-1000 ease-out" />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-xl font-black text-white leading-none">{Math.round(progress)}%</span>
        <span className="text-[7px] font-black text-white/50 uppercase tracking-tighter">Done</span>
      </div>
    </div>
  );
};

const SpecialtyCareModule = ({ plan, primaryColor, onToggle }: { plan: CarePlan, primaryColor: string, onToggle?: (id: string, item: string) => void }) => {
  const meta = plan.metadata || {};

  if (meta.totalTrays) {
    const current = Number(meta.currentTray || 1);
    const total = Number(meta.totalTrays);
    const progress = (current / total) * 100;
    const trayWindow = Array.from({ length: 5 }, (_, i) => current - 2 + i).filter(t => t > 0 && t <= total);

    return (
      <div className="space-y-6 animate-in slide-in-from-bottom-6 duration-700">
        <div className="p-8 bg-slate-900 rounded-[48px] border border-white/10 shadow-2xl space-y-8 relative overflow-hidden group">
          <div className="absolute bottom-[-20%] right-[-10%] w-48 h-48 bg-white/5 blur-[50px] rounded-full"></div>
          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-2xl bg-white/5 flex items-center justify-center text-white border border-white/10"><Zap size={24} /></div>
              <div>
                <h5 className="font-black text-white text-lg leading-tight">Smile Journey</h5>
                <p className="text-[9px] text-white/40 uppercase font-black tracking-widest mt-1">Active Ortho Protocol</p>
              </div>
            </div>
            <TreatmentComplianceRing progress={progress} color={primaryColor} />
          </div>

          <div className="flex justify-between items-center px-4 relative z-10">
            {trayWindow.map((t) => (
              <div key={t} className={`flex flex-col items-center gap-2 transition-all duration-700 ${t === current ? 'scale-125' : 'opacity-40'}`}>
                <div className={`h-11 w-11 rounded-2xl flex items-center justify-center text-xs font-black transition-all ${t === current ? 'bg-white text-black shadow-[0_10px_30px_rgba(255,255,255,0.3)]' : 'bg-white/5 text-white/80'}`}>
                  {t}
                </div>
              </div>
            ))}
          </div>

          <div className="pt-6 border-t border-white/5 flex justify-between items-center text-[9px] font-black uppercase tracking-widest text-white/30 relative z-10">
            <span className="flex items-center gap-2"><Timer size={14} className="text-white/20" /> {meta.changeInterval || 10} Day Cycle</span>
            <span className="bg-white/5 px-4 py-2 rounded-full border border-white/10">Tray {current} of {total}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-6 duration-700">
      <div className="bg-white/80 backdrop-blur-xl p-8 rounded-[48px] border border-slate-100 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 rounded-[24px] bg-slate-50 flex items-center justify-center text-slate-400 border border-slate-100"><ClipboardList size={28} /></div>
          <div>
            <h5 className="font-black text-slate-800 text-lg">Daily Regimen</h5>
            <p className="text-[9px] text-slate-400 uppercase font-black tracking-widest mt-1">Post-{plan.treatmentName}</p>
          </div>
        </div>
        <ActivityIcon className="text-slate-100" size={32} />
      </div>
      <div className="space-y-4">
        {plan.checklist?.map((item) => (
          <button
            key={item.id}
            onClick={() => onToggle?.(plan.id, item.id)}
            className={`w-full text-left p-6 rounded-[32px] border transition-all flex gap-5 shadow-sm group active:scale-[0.98] ${item.completed ? 'bg-slate-50/50 border-slate-100 opacity-60' : 'bg-white border-slate-100'}`}
          >
            <div className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 mt-0.5 border-2 transition-all ${item.completed ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-100 bg-white group-active:border-slate-300'}`}>
              {item.completed && <CircleCheck size={20} />}
            </div>
            <p className={`text-base font-bold leading-relaxed pr-4 ${item.completed ? 'text-slate-400 line-through' : 'text-slate-700'}`}>{item.task}</p>
          </button>
        ))}
      </div>
    </div>
  );
};

const MobilePatientView: React.FC<Props> = ({ currentUser, users, wallets, transactions, carePlans, clinic, onToggleChecklistItem, onSchedule, onAddFamilyMember, onSwitchProfile, onRedeem }) => {
  const [activeTab, setActiveTab] = useState<'HOME' | 'WALLET' | 'CARE' | 'PROFILE'>('HOME');
  const [showBookingModal, setShowBookingModal] = useState(false);
  const today = new Date();
  const localDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  const [bookDate, setBookDate] = useState(localDate);
  const [bookTime, setBookTime] = useState('10:00');
  const [bookType, setBookType] = useState<AppointmentType>(AppointmentType.CHECKUP);
  const [bookSuccess, setBookSuccess] = useState(false);

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

  return (
    <>
      <main className={`min-h-screen pb-40 p-8 ${textureClass} bg-slate-50 select-none`}>
        {/* Header */}
        <div className="flex justify-between items-start mb-10">
          <div>
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">{clinic.name}</p>
            <h2 className="text-3xl font-black text-slate-900 tracking-tighter">
              {activeTab === 'HOME' && `Hello, ${currentUser.name.split(' ')[0]}.`}
              {activeTab === 'WALLET' && 'Identity Ledger'}
              {activeTab === 'CARE' && 'Care Plan'}
              {activeTab === 'PROFILE' && 'Profile'}
            </h2>
          </div>
          <button onClick={() => setShowBookingModal(true)} className="h-12 w-12 rounded-full bg-slate-900 text-white flex items-center justify-center shadow-xl active:scale-90 transition-transform" style={{ backgroundColor: clinic.primaryColor }}>
            <Calendar size={20} />
          </button>
        </div>

        {/* --- HOME TAB --- */}
        {activeTab === 'HOME' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-6 duration-700">
            {/* Loyalty Status Card */}
            <div className="p-8 bg-white rounded-[40px] border border-slate-100 shadow-xl relative overflow-hidden group active:scale-[0.98] transition-all" onClick={() => setActiveTab('WALLET')}>
              <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-bl-[40px] flex items-center justify-center">
                <Trophy size={48} className="text-slate-200" />
              </div>
              <div className="relative z-10">
                <p className="text-[10px] uppercase font-black tracking-widest text-slate-400 mb-2">Member Tier</p>
                <h3 className="text-4xl font-black text-slate-900 tracking-tighter mb-1">{currentUser.currentTier}</h3>
                <p className="font-bold text-slate-400 text-sm">Valid until Dec 2026</p>
              </div>
              <div className="mt-8 pt-6 border-t border-slate-100 flex gap-8">
                <div>
                  <p className="text-[9px] uppercase font-black tracking-widest text-slate-400 mb-1">Balance</p>
                  <p className="text-2xl font-black text-slate-900">{wallet?.balance.toLocaleString()} <span className="text-sm text-slate-400 font-bold">Pts</span></p>
                </div>
              </div>
            </div>

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
        )}

        {/* --- WALLET TAB --- */}
        {activeTab === 'WALLET' && (
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
        )}

        {/* --- CARE TAB --- */}
        {activeTab === 'CARE' && (
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
        )}

        {/* --- PROFILE TAB --- */}
        {activeTab === 'PROFILE' && (
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
        )}
      </main>

      {/* Navigation */}
      <div className="fixed bottom-8 left-0 w-full px-8 z-50">
        <nav className="bg-slate-900/90 backdrop-blur-3xl border border-white/10 shadow-[0_30px_60px_-10px_rgba(0,0,0,0.4)] rounded-[40px] px-3 py-3 flex justify-between items-center max-w-sm mx-auto overflow-hidden relative">
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
      </div>

      {/* Redeem Modal */}
      {showRedeemModal && (
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
      )}

      {/* Booking Modal */}
      {showBookingModal && (
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
                    <input type="date" value={bookDate} onChange={e => setBookDate(e.target.value)} className="flex-1 bg-slate-50 border border-slate-100 p-4 rounded-2xl font-bold outline-none" />
                    <select value={bookTime} onChange={e => setBookTime(e.target.value)} className="bg-slate-50 border border-slate-100 p-4 rounded-2xl font-bold outline-none">
                      {['09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00'].map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                </div>

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
                  const start = new Date(`${bookDate}T${bookTime}`);
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
      )}

      {/* Add Family Modal */}
      {showAddFamilyModal && (
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
      )}
    </>
  );
};

export default MobilePatientView;
