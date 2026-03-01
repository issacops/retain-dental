import React, { useState, useMemo } from 'react';
import { LayoutGrid, TrendingUp, Bell, Settings, Smile, LayoutGrid as LayoutGridIcon, Plus, X, Calendar as CalendarIcon, Activity, Grid, Zap, Search, UserPlus, CreditCard, MessageSquare, QrCode } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { IBackendService } from '../../services/IBackendService';
import { User, Wallet, Transaction, FamilyGroup, Clinic, CarePlan, TransactionCategory, TransactionType, Appointment, AppointmentStatus, AppointmentType, Tier, TIER_BENEFITS } from '../../types';
import MorningBriefTicker from './subcomponents/MorningBrief';
// import IntelligenceSidebar from './subcomponents/IntelligenceSidebar';
import PatientList from './subcomponents/PatientList';
import DashboardAnalytics from './subcomponents/DashboardAnalytics';
import PatientProfile from './subcomponents/PatientProfile';
import AppointmentScheduler from './subcomponents/AppointmentScheduler';
import LiveProtocolMonitor from './subcomponents/LiveProtocolMonitor';
import FinancialLedger from './subcomponents/FinancialLedger';
import SocialPostGenerator from './subcomponents/SocialPostGenerator';
import CommandPalette from './subcomponents/CommandPalette';


const RetentionDashboard: React.FC<{ clinic: Clinic, backendService: IBackendService, allUsers?: User[], wallets?: Wallet[], transactions?: Transaction[] }> = ({ clinic, backendService, allUsers = [], wallets = [], transactions = [] }) => {
   const [metrics, setMetrics] = useState<any>(null);
   const [loading, setLoading] = useState(true);

   React.useEffect(() => {
      backendService.getRetentionMetrics(clinic.id).then(m => {
         setMetrics(m);
         setLoading(false);
      });
   }, [clinic.id]);

   // Generate mock trend data for last 6 months
   const retentionTrend = useMemo(() => {
      const months = ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const baseRate = metrics?.retentionRate || 75;
      return months.map((month, i) => ({
         month,
         rate: Math.max(50, Math.min(100, baseRate + (i - 3) * 3 + Math.floor(Math.random() * 5)))
      }));
   }, [metrics]);

   // Points distribution by category
   const pointsDistribution = useMemo(() => {
      const categories = Object.values(TransactionCategory).filter(c => c !== 'REWARD');
      return categories.map(cat => {
         const catTx = transactions.filter(t => t.category === cat && t.clinicId === clinic.id);
         const earned = catTx.filter(t => t.type === 'EARN').reduce((sum, t) => sum + t.pointsEarned, 0);
         const redeemed = Math.abs(catTx.filter(t => t.type === 'REDEEM').reduce((sum, t) => sum + t.pointsEarned, 0));
         return { category: cat, earned, redeemed };
      });
   }, [transactions, clinic.id]);

   // LTV by tier
   const ltvByTier = useMemo(() => {
      const clinicPatients = allUsers.filter(u => u.clinicId === clinic.id && u.role === 'PATIENT');
      const tierData = Object.values(Tier).map(tier => {
         const tierPatients = clinicPatients.filter(u => u.currentTier === tier);
         const totalLtv = tierPatients.reduce((sum, u) => sum + u.lifetimeSpend, 0);
         return {
            tier,
            count: tierPatients.length,
            ltv: tierPatients.length > 0 ? Math.round(totalLtv / tierPatients.length) : 0,
            totalLtv
         };
      });
      return tierData;
   }, [allUsers, clinic.id]);

   const CHART_COLORS = ['#10b981', '#6366f1', '#f59e0b'];

   const CustomTooltip = ({ active, payload, label }: any) => {
      if (active && payload && payload.length) {
         return (
            <div className="bg-slate-900/90 backdrop-blur-md p-4 rounded-xl border border-white/10 shadow-2xl text-white">
               <p className="font-bold text-xs opacity-50 uppercase tracking-widest mb-2">{label}</p>
               {payload.map((p: any, i: number) => (
                  <p key={i} className="text-sm font-bold flex items-center gap-2">
                     <span className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }}></span>
                     {p.name}: <span className="font-mono">{p.value}</span>
                  </p>
               ))}
            </div>
         );
      }
      return null;
   };

   if (loading) return (
      <div className="h-[600px] flex flex-col items-center justify-center space-y-6 animate-pulse">
         <div className="h-24 w-24 rounded-full bg-slate-100 relative">
            <div className="absolute inset-0 border-t-4 border-indigo-500 rounded-full animate-spin"></div>
         </div>
         <div className="text-slate-300 font-bold uppercase tracking-widest text-sm">Computing Intelligence Vectors...</div>
      </div>
   );

   if (!metrics) return <div className="p-12 text-center text-slate-400">No data available.</div>;

   return (
      <div className="space-y-12 pb-20">
         {/* KPI Cards Header */}
         <div className="grid grid-cols-4 gap-8">
            <div className="group relative bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-[40px] p-8 text-white shadow-2xl shadow-emerald-500/20 overflow-hidden hover:scale-[1.02] transition-all duration-500">
               <div className="absolute top-0 right-0 p-8 opacity-20"><Activity size={80} /></div>
               <div className="relative z-10">
                  <p className="text-[11px] font-black uppercase tracking-widest opacity-80 mb-4 flex items-center gap-2">
                     <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span> Retention Rate
                  </p>
                  <h3 className="text-6xl font-black tracking-tighter mb-2">{metrics.retentionRate}<span className="text-3xl opacity-60">%</span></h3>
                  <p className="text-emerald-100 text-xs font-bold">+2.4% vs last month</p>
               </div>
            </div>

            <div className="group relative bg-gradient-to-br from-indigo-500 to-violet-600 rounded-[40px] p-8 text-white shadow-2xl shadow-indigo-500/20 overflow-hidden hover:scale-[1.02] transition-all duration-500">
               <div className="absolute top-0 right-0 p-8 opacity-20"><Zap size={80} /></div>
               <div className="relative z-10">
                  <p className="text-[11px] font-black uppercase tracking-widest opacity-80 mb-4">Points Engagement</p>
                  <h3 className="text-6xl font-black tracking-tighter mb-2">{metrics.pointsParticipation}<span className="text-3xl opacity-60">%</span></h3>
                  <p className="text-indigo-100 text-xs font-bold">Active Participation</p>
               </div>
            </div>

            <div className="group relative bg-white rounded-[40px] p-8 shadow-xl hover:shadow-2xl border border-slate-100 overflow-hidden hover:scale-[1.02] transition-all duration-500">
               <div className="absolute top-0 right-0 w-32 h-32 bg-amber-50 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-150 duration-700"></div>
               <div className="relative z-10">
                  <p className="text-[11px] font-black uppercase tracking-widest text-slate-400 mb-4">Avg Lifetime Value</p>
                  <h3 className="text-5xl font-black tracking-tighter text-slate-900 mb-2">₹{(metrics.ltv || 0).toLocaleString()}</h3>
                  <p className="text-emerald-500 text-xs font-bold flex items-center gap-1"><TrendingUp size={12} /> Top 10% of Clinics</p>
               </div>
            </div>

            <div className="group relative bg-white rounded-[40px] p-8 shadow-xl hover:shadow-2xl border border-slate-100 overflow-hidden hover:scale-[1.02] transition-all duration-500">
               <div className="absolute top-0 right-0 w-32 h-32 bg-rose-50 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-150 duration-700"></div>
               <div className="relative z-10">
                  <p className="text-[11px] font-black uppercase tracking-widest text-slate-400 mb-4">Redemption Rate</p>
                  <h3 className="text-5xl font-black tracking-tighter text-slate-900 mb-2">{metrics.redemptionRate}<span className="text-3xl opacity-40 text-slate-400">%</span></h3>
                  <p className="text-slate-400 text-xs font-bold">Healthy Ecosystem</p>
               </div>
            </div>
         </div>

         {/* Main Chart Section */}
         <div className="grid grid-cols-12 gap-8 h-[450px]">
            {/* Trend Chart - Large */}
            <div className="col-span-8 bg-white/80 backdrop-blur-xl rounded-[48px] p-10 shadow-2xl border border-slate-100 relative overflow-hidden group">
               <div className="flex justify-between items-start mb-8">
                  <div>
                     <h4 className="text-2xl font-black text-slate-900 tracking-tight">Retention Velocity</h4>
                     <p className="text-slate-400 text-sm font-bold mt-1">6-Month Trend Analysis</p>
                  </div>
                  <div className="flex gap-2">
                     {['3M', '6M', '1Y'].map(r => (
                        <button key={r} className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${r === '6M' ? 'bg-slate-900 text-white shadow-lg' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}>
                           {r}
                        </button>
                     ))}
                  </div>
               </div>
               <div className="h-[300px] w-full">
                  <ResponsiveContainer>
                     <LineChart data={retentionTrend}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                        <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 700, fill: '#94a3b8' }} dy={10} />
                        <YAxis hide domain={[40, 100]} />
                        <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#cbd5e1', strokeWidth: 1, strokeDasharray: '4 4' }} />
                        <defs>
                           <linearGradient id="lineColor" x1="0" y1="0" x2="1" y2="0">
                              <stop offset="0%" stopColor="#10b981" />
                              <stop offset="100%" stopColor="#6366f1" />
                           </linearGradient>
                           <filter id="shadow" height="200%">
                              <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#6366f1" floodOpacity="0.3" />
                           </filter>
                        </defs>
                        <Line type="monotone" dataKey="rate" stroke="url(#lineColor)" strokeWidth={5} dot={{ fill: '#fff', stroke: '#6366f1', strokeWidth: 3, r: 6 }} activeDot={{ r: 10, fill: '#6366f1' }} filter="url(#shadow)" />
                     </LineChart>
                  </ResponsiveContainer>
               </div>
            </div>

            {/* Pie Chart - Side */}
            <div className="col-span-4 bg-slate-900 text-white rounded-[48px] p-10 shadow-2xl relative overflow-hidden">
               <div className="absolute top-0 right-0 p-12 opacity-5"><LayoutGridIcon size={120} /></div>
               <h4 className="text-xl font-black tracking-tight mb-2 relative z-10">Tier Distribution</h4>
               <p className="text-slate-400 text-sm font-bold mb-8 relative z-10">Active Patient Base</p>

               <div className="h-[250px] relative z-10">
                  <ResponsiveContainer>
                     <PieChart>
                        <Pie
                           data={ltvByTier.filter(t => t.count > 0)}
                           dataKey="count"
                           nameKey="tier"
                           innerRadius={60}
                           outerRadius={80}
                           paddingAngle={5}
                        >
                           {ltvByTier.map((entry, index) => (
                              <Cell key={entry.tier} fill={CHART_COLORS[index % CHART_COLORS.length]} stroke="rgba(0,0,0,0)" />
                           ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                        <Legend verticalAlign="bottom" height={36} iconType="circle" content={(props: any) => {
                           const { payload } = props;
                           return (
                              <div className="flex justify-center gap-4 mt-4">
                                 {payload.map((entry: any, index: number) => (
                                    <div key={`item-${index}`} className="flex items-center gap-2">
                                       <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }}></div>
                                       <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{entry.value}</span>
                                    </div>
                                 ))}
                              </div>
                           );
                        }} />
                     </PieChart>
                  </ResponsiveContainer>
                  {/* Center Stat */}
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-[60%] text-center pointer-events-none">
                     <p className="text-3xl font-black">{allUsers.filter(u => u.clinicId === clinic.id).length}</p>
                     <p className="text-[9px] uppercase tracking-widest text-slate-500 font-bold">Total</p>
                  </div>
               </div>
            </div>
         </div>

         {/* Bottom Row */}
         <div className="grid grid-cols-3 gap-8">
            {/* Bar Chart */}
            <div className="bg-white rounded-[40px] p-10 shadow-xl border border-slate-100">
               <h4 className="text-lg font-black text-slate-900 mb-6">Points Economy</h4>
               <div className="h-[200px]">
                  <ResponsiveContainer>
                     <BarChart data={pointsDistribution} barGap={4}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="category" axisLine={false} tickLine={false} tick={{ fontSize: 9, fontWeight: 800, fill: '#cbd5e1' }} dy={10} />
                        <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f8fafc' }} />
                        <Bar dataKey="earned" fill="#10b981" radius={[4, 4, 4, 4]} barSize={12} />
                        <Bar dataKey="redeemed" fill="#f43f5e" radius={[4, 4, 4, 4]} barSize={12} />
                     </BarChart>
                  </ResponsiveContainer>
               </div>
            </div>

            {/* Top Families */}
            <div className="bg-white rounded-[40px] p-10 shadow-xl border border-slate-100 overflow-hidden">
               <h4 className="text-lg font-black text-slate-900 mb-6">Power Households</h4>
               <div className="space-y-4 max-h-[200px] overflow-y-auto pr-2 custom-scrollbar">
                  {(metrics.topFamilies || []).slice(0, 4).map((f: any, i: number) => (
                     <div key={i} className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-colors cursor-pointer group">
                        <div className="flex items-center gap-4">
                           <div className={`h-10 w-10 ${i === 0 ? 'bg-amber-100 text-amber-600' : 'bg-slate-200 text-slate-500'} rounded-full flex items-center justify-center font-black text-sm`}>
                              {i + 1}
                           </div>
                           <div>
                              <p className="font-bold text-slate-800 text-sm group-hover:text-indigo-600 transition-colors">{f.name}</p>
                              <p className="text-[10px] font-bold text-slate-400">{Math.floor(Math.random() * 4) + 2} Members</p>
                           </div>
                        </div>
                        <span className="font-black text-slate-900 text-sm">₹{f.spend.toLocaleString()}</span>
                     </div>
                  ))}
               </div>
            </div>

            {/* Churn Risk Alert */}
            <div className="rounded-[40px] p-10 relative overflow-hidden text-white flex flex-col justify-between group shadow-2xl shadow-indigo-500/30"
               style={{ background: `linear-gradient(135deg, ${clinic.primaryColor}, #000)` }}>

               <div className="absolute top-0 right-0 p-8 opacity-20 group-hover:scale-110 transition-transform duration-700">
                  <Activity size={120} />
               </div>

               <div>
                  <div className="bg-white/10 backdrop-blur-md w-fit px-4 py-2 rounded-xl mb-4 border border-white/20">
                     <p className="text-[10px] uppercase font-black tracking-widest text-white">AI Insight</p>
                  </div>
                  <h4 className="text-3xl font-black tracking-tight mb-2 relative z-10">Churn Predicted</h4>
                  <p className="text-white/70 font-medium text-sm leading-relaxed mb-6 max-w-[80%]">
                     AI has identified <span className="text-white font-bold">{metrics.churnRisk}%</span> of your patient base showing signs of disengagement.
                  </p>
               </div>

               <button className="bg-white text-slate-900 w-full py-4 rounded-2xl font-black uppercase tracking-widest text-xs relative z-10 shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex justify-center items-center gap-2">
                  <Zap size={14} className="text-amber-500" /> Auto-Engage
               </button>
            </div>
         </div>
      </div>
   );
};

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
}

const DesktopDoctorView: React.FC<Props> = ({
   currentUser, allUsers, wallets, transactions, familyGroups, carePlans, clinic,
   onProcessTransaction, onUpdateCarePlan, onLinkFamily, onAddPatient, backendService,
   appointments, onSchedule, onUpdateAppointmentStatus, onAssignPlan, onToggleChecklistItem, onDeletePatient,
   onUpdateClinic
}) => {
   const [activeSection, setActiveSection] = useState('Operational Hub');
   const [selectedPatient, setSelectedPatient] = useState<User | null>(null);
   const [searchQuery, setSearchQuery] = useState('');
   const [isAddPatientModalOpen, setIsAddPatientModalOpen] = useState(false);
   const [isQRModalOpen, setIsQRModalOpen] = useState(false);
   const [isSocialModalOpen, setIsSocialModalOpen] = useState(false); // NEW
   const [newPatientName, setNewPatientName] = useState('');
   const [newPatientMobile, setNewPatientMobile] = useState('');
   const [newPatientPin, setNewPatientPin] = useState('');

   const [stats, setStats] = useState<any>({ totalRevenue: 0 });

   React.useEffect(() => {
      let mounted = true;
      backendService.getDashboardStats(clinic.id).then(res => {
         if (mounted) setStats(res);
      });
      return () => { mounted = false; };
   }, [backendService, clinic.id, transactions]);

   const filteredPatients = useMemo(() => {
      const query = (searchQuery || '').toLowerCase();
      return (allUsers || []).filter(u =>
         u.clinicId === clinic.id &&
         u.role === 'PATIENT' &&
         ((u.name || '').toLowerCase().includes(query) || (u.mobile || '').includes(query))
      );
   }, [allUsers, clinic.id, searchQuery]);

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

   // Helper function to get user's display name (strips Dr. prefix if present)
   const getUserName = (fullName: string) => (fullName || 'Doctor').replace(/^Dr\.?\s*/i, '');

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

   console.log("[DesktopDoctorView] Rendering for clinic:", clinic.name, "Texture:", textureClass);

   return (
      <div className={`flex flex-col h-[100dvh] text-slate-900 font-sans overflow-hidden transition-all duration-1000 ${textureClass || 'bg-white'} `} style={{ '--primary': clinic.primaryColor, '--primary-rgb': hexToRgb(clinic.primaryColor), '--primary-glow': clinic.primaryColor + '15' } as React.CSSProperties}>

         {/* Sidebar */}
         <div className="flex h-full overflow-hidden">
            <aside className="w-72 bg-white/70 backdrop-blur-xl border-r border-white/40 flex flex-col justify-between p-6 z-20 relative shadow-2xl overflow-y-auto custom-scrollbar">
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
                  <nav className="space-y-1">
                     {['Operational Hub', 'Schedule', 'Patient Records', 'Retention', 'Financial Ledger', 'Settings'].map((item, i) => (
                        <div key={item}
                           onClick={() => setActiveSection(item)}
                           style={{
                              backgroundColor: activeSection === item ? clinic.primaryColor : undefined,
                              color: activeSection === item ? (isLight ? '#0f172a' : '#ffffff') : undefined,
                           }}
                           className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all duration-300 group ${activeSection === item ? 'shadow-xl scale-[1.02] font-black' : 'hover:bg-white/50 text-slate-500 hover:text-slate-800'} `}
                        >
                           <Grid size={18} className={`transition-transform duration-300 ${activeSection === item ? 'scale-110' : 'group-hover:scale-110'} `} />
                           <span className="font-bold text-sm tracking-wide flex-1">{item}</span>
                           {i === 0 && activeSection === 'Operational Hub' && <div className="h-1.5 w-1.5 rounded-full animate-pulse shadow-[0_0_10px_currentColor]" style={{ backgroundColor: isLight ? '#f43f5e' : 'white' }} />}
                        </div>
                     ))}
                  </nav>
               </div>

               <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 text-white relative overflow-hidden group shrink-0 mt-6">
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
            <main className="flex-1 relative overflow-y-auto scroll-smooth min-w-0">
               {/* Ambient Glow */}
               <div className="absolute top-[-200px] left-[-200px] w-[600px] h-[600px] bg-primary rounded-full blur-[120px] opacity-[0.08] pointer-events-none mix-blend-multiply animate-pulse-slow"></div>

               {/* Header */}
               <header className="sticky top-0 z-10 px-8 py-6 flex justify-between items-center bg-white/40 backdrop-blur-md border-b border-white/20">
                  <div>
                     <h2 className="text-2xl font-black text-slate-800 tracking-tight">{greet()}, Dr. {getUserName(currentUser.name)}</h2>
                     <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-1 flex items-center gap-2 text-indigo-500">
                        <Zap size={12} /> Press Cmd+K or Ctrl+K for Command Palette
                     </p>
                  </div>
                  <div className="flex items-center gap-4">
                     <button onClick={() => setIsQRModalOpen(true)} className="h-10 px-4 bg-indigo-600 text-white rounded-xl shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all flex items-center gap-2 font-black text-xs uppercase tracking-widest active:scale-95">
                        <QrCode size={16} /> Patient App
                     </button>
                     <div className="h-10 px-4 bg-white rounded-xl border border-slate-200 flex items-center gap-2 text-slate-400 focus-within:border-primary focus-within:text-primary transition-colors shadow-sm">
                        <Search size={16} />
                        <input type="text" placeholder="Search patients..." className="bg-transparent outline-none text-sm font-semibold text-slate-800 placeholder:text-slate-300 w-64" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
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
                                       { icon: <CalendarIcon size={20} />, label: 'Schedule', action: () => setActiveSection('Schedule') },
                                       { icon: <CreditCard size={20} />, label: 'Invoice', action: () => alert('New Invoice...') },
                                       {
                                          icon: <Zap size={20} />, label: 'Social Studio', action: () => setIsSocialModalOpen(true)
                                       }
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
                              <LiveProtocolMonitor
                                 carePlans={carePlans}
                                 users={allUsers}
                                 clinic={clinic}
                                 onUpdateCarePlan={onUpdateCarePlan}
                              />
                              <div className="bg-white/60 backdrop-blur-xl rounded-[32px] p-8 border border-white/60 shadow-xl">
                                 <h3 className="text-xl font-black text-slate-800 mb-6 font-display">Patient Queue</h3>
                                 <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                                    {(appointments || [])
                                       .filter(a => new Date(a.startTime).toDateString() === new Date().toDateString() && a.clinicId === clinic.id)
                                       .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
                                       .map(appt => {
                                          const patient = allUsers.find(u => u.id === appt.patientId);
                                          const isNow = new Date() >= new Date(appt.startTime) && new Date() <= new Date(appt.endTime);
                                          return (
                                             <div key={appt.id} className={`p-4 bg-white rounded-2xl border flex items-center gap-4 shadow-sm transition-all ${isNow ? 'border-indigo-500 ring-1 ring-indigo-500/20' : 'border-slate-100'}`}>
                                                <div className={`h-10 w-10 rounded-full flex items-center justify-center font-bold text-xs ${isNow ? 'bg-indigo-100 text-indigo-600 animate-pulse' : 'bg-slate-100 text-slate-500'}`}>
                                                   {new Date(appt.startTime).getHours() < 12 ? 'AM' : 'PM'}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                   <h5 className="font-bold text-sm text-slate-800 truncate">{patient?.name || 'Unknown'}</h5>
                                                   <p className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-2">
                                                      {new Date(appt.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                      {isNow && <span className="text-indigo-500">• In Chair</span>}
                                                   </p>
                                                </div>
                                                <button onClick={() => {
                                                   if (patient) {
                                                      setSelectedPatient(patient);
                                                      setActiveSection('Patient Records');
                                                   }
                                                }} className="px-3 py-1.5 bg-slate-900 text-white text-[10px] font-bold rounded-lg hover:bg-primary transition-colors">View</button>
                                             </div>
                                          );
                                       })}
                                    {appointments.filter(a => new Date(a.startTime).toDateString() === new Date().toDateString()).length === 0 && (
                                       <div className="text-center py-8 text-slate-400 text-xs font-bold uppercase tracking-wider">No Appointments Today</div>
                                    )}
                                 </div>
                              </div>
                           </div>
                        </div>
                     </>
                  )}
                  {activeSection === 'Schedule' && (
                     <AppointmentScheduler
                        clinic={clinic}
                        appointments={appointments}
                        patients={allUsers.filter(u => u.role === 'PATIENT' && u.clinicId === clinic.id)}
                        onSchedule={onSchedule}
                        onUpdateStatus={onUpdateAppointmentStatus}
                        onViewProfile={(patient) => {
                           setSelectedPatient(patient);
                           setActiveSection('Patient Records');
                        }}
                     />
                  )}
                  {activeSection === 'Financial Ledger' && (
                     <FinancialLedger clinic={clinic} transactions={transactions} wallets={wallets} allUsers={allUsers} />
                  )}
                  {activeSection === 'Patient Records' && (
                     <div className="flex overflow-hidden h-full">
                        <PatientList
                           clinic={clinic}
                           users={filteredPatients}
                           searchQuery={searchQuery}
                           setSearchQuery={setSearchQuery}
                           selectedPatient={selectedPatient}
                           setSelectedPatient={(u) => {
                              setSelectedPatient(u);
                              // Auto-collapse sidebar on mobile or smaller screens if desired, 
                              // or just let user toggle. For now, let's keep it manual or user-choice.
                           }}
                           setIsAddPatientModalOpen={setIsAddPatientModalOpen}
                           isCollapsed={!!selectedPatient} // Auto-collapse when a patient is selected
                           onToggleCollapse={() => {
                              // If there's a selected patient, clicking toggle clears selection to show expanded list?
                              // Or simply toggles view? Let's assume toggle view. 
                              // Wait, if we use !!selectedPatient, we can't manually toggle.
                              // Let's create a local state for this if requested, but for now
                              // the requirement is "when ... patient profile is clicked ... minimize".
                              // So deriving from selectedPatient is the simplest MVP.
                              // If user wants to see list again, they can hit back.
                              if (selectedPatient) setSelectedPatient(null);
                           }}
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
                                    onAssignPlan={onAssignPlan}
                                    onToggleChecklistItem={onToggleChecklistItem}
                                    onUpdateCarePlan={onUpdateCarePlan}
                                    onDeletePatient={onDeletePatient}
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
                        </div>

                        {/* ADD PATIENT MODAL - Premium Minimalist */}
                        {isAddPatientModalOpen && (
                           <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/60 backdrop-blur-3xl animate-in fade-in duration-500 p-4">
                              <div className="glass-panel bg-white p-10 md:p-20 w-full max-w-2xl shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] relative overflow-y-auto max-h-[90dvh] custom-scrollbar rounded-[40px]">
                                 <div className="absolute top-0 left-0 w-full h-2 bg-black"></div>
                                 <div className="flex justify-between items-center mb-16">
                                    <h3 className="text-4xl md:text-5xl font-black tracking-tighter text-slate-900">New Identity.</h3>
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
                                    <div className="space-y-4">
                                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-4">Access PIN (Optional)</label>
                                       <input type="text" placeholder="Default: 123456" value={newPatientPin} onChange={(e) => setNewPatientPin(e.target.value)}
                                          maxLength={6}
                                          className="glass-input w-full px-10 py-7 bg-slate-50 border border-slate-100 rounded-[32px] text-2xl font-black outline-none focus:border-black transition-all" />
                                    </div>
                                    <button onClick={async () => {
                                       if (!newPatientName || !newPatientMobile) {
                                          alert("Please enter both Name and Mobile Number");
                                          return;
                                       }
                                       // Pass PIN if provided, otherwise letting the service/default handle it
                                       const res = await onAddPatient(newPatientName, newPatientMobile, newPatientPin || '123456');
                                       if (res.success) {
                                          setIsAddPatientModalOpen(false);
                                          setNewPatientName('');
                                          setNewPatientMobile('');
                                          setNewPatientPin(''); // Reset PIN
                                          // Data sync happens via App.tsx setData 
                                       } else {
                                          alert("Onboarding Failed: " + res.message);
                                       }
                                    }}
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

               {activeSection === 'Retention' && (
                  <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                     <h2 className="text-3xl font-black text-slate-800 tracking-tight mb-8">Retention Intelligence</h2>
                     <RetentionDashboard clinic={clinic} backendService={backendService} allUsers={allUsers} wallets={wallets} transactions={transactions} />
                  </div>
               )}

               {activeSection === 'Settings' && (
                  <div className="grid grid-cols-12 gap-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                     <div className="col-span-8 space-y-8">
                        {/* LOYALTY CONFIG */}
                        <div className="bg-white rounded-[32px] p-10 shadow-xl border border-slate-100 relative overflow-hidden">
                           <div className="absolute top-0 right-0 p-8 opacity-10"><Zap size={64} /></div>
                           <h3 className="text-2xl font-black text-slate-900 mb-2">Loyalty Program Engine</h3>
                           <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-8">Configure Point Economics</p>

                           <div className="grid grid-cols-2 gap-8">
                              <div>
                                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2 mb-2 block">Default Earn Rate (%)</label>
                                 <input type="number"
                                    defaultValue={clinic.loyaltyConfig?.defaultRate || 10}
                                    onBlur={(e) => onUpdateClinic(clinic.id, { loyaltyConfig: { ...clinic.loyaltyConfig, defaultRate: Number(e.target.value) } as any })}
                                    className="w-full bg-slate-50 border border-slate-100 p-6 rounded-2xl font-black text-3xl outline-none focus:border-indigo-500 transition-all" />
                              </div>
                              <div>
                                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2 mb-2 block">Redemption Value (INR per Pt)</label>
                                 <input type="number"
                                    defaultValue={clinic.loyaltyConfig?.redemptionRate || 1}
                                    onBlur={(e) => onUpdateClinic(clinic.id, { loyaltyConfig: { ...clinic.loyaltyConfig, redemptionRate: Number(e.target.value) } as any })}
                                    className="w-full bg-slate-50 border border-slate-100 p-6 rounded-2xl font-black text-3xl outline-none focus:border-indigo-500 transition-all" />
                              </div>
                           </div>

                           <div className="mt-8 pt-8 border-t border-slate-100">
                              <h4 className="text-sm font-black text-slate-700 mb-4">Category Multipliers (Advanced)</h4>
                              <div className="grid grid-cols-3 gap-4">
                                 {Object.values(TransactionCategory).map(cat => (
                                    <div key={cat} className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                                       <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-1">{cat}</label>
                                       <div className="flex items-center gap-2">
                                          <input
                                             type="number"
                                             placeholder="Default"
                                             defaultValue={clinic.loyaltyConfig?.categoryRates?.[cat] || ''}
                                             onBlur={(e) => {
                                                const val = e.target.value ? Number(e.target.value) : undefined;
                                                const newRates = { ...clinic.loyaltyConfig?.categoryRates, [cat]: val };
                                                // Clean up undefined
                                                if (!val) delete newRates[cat];
                                                onUpdateClinic(clinic.id, { loyaltyConfig: { ...clinic.loyaltyConfig, categoryRates: newRates } as any });
                                             }}
                                             className="w-full bg-transparent font-black text-lg outline-none"
                                          />
                                          <span className="text-xs font-bold text-slate-400">%</span>
                                       </div>
                                    </div>
                                 ))}
                              </div>
                           </div>
                        </div>

                        {/* Branding Config could go here */}
                        <div className="bg-slate-900 rounded-[32px] p-10 shadow-xl text-white relative overflow-hidden">
                           <h3 className="text-2xl font-black mb-2">Clinic Identity</h3>
                           <p className="text-sm font-bold text-white/40 uppercase tracking-widest mb-8">Brand & Aesthetics</p>
                           <div className="grid grid-cols-2 gap-8">
                              <div>
                                 <label className="text-[10px] font-black text-white/40 uppercase tracking-widest pl-2 mb-2 block">Primary Color</label>
                                 <div className="flex items-center gap-4 bg-white/10 p-2 rounded-2xl border border-white/10">
                                    <div className="h-10 w-10 rounded-xl" style={{ backgroundColor: clinic.primaryColor }}></div>
                                    <input type="text"
                                       defaultValue={clinic.primaryColor}
                                       onBlur={(e) => onUpdateClinic(clinic.id, { primaryColor: e.target.value })}
                                       className="bg-transparent font-bold text-lg outline-none w-full text-white" />
                                 </div>
                              </div>
                              <div>
                                 <label className="text-[10px] font-black text-white/40 uppercase tracking-widest pl-2 mb-2 block">Theme Texture</label>
                                 <select
                                    value={clinic.themeTexture}
                                    onChange={(e) => onUpdateClinic(clinic.id, { themeTexture: e.target.value as any })}
                                    className="w-full bg-white/10 border border-white/10 p-5 rounded-2xl font-bold text-white outline-none appearance-none">
                                    <option value="minimal" className="text-slate-900">Minimal</option>
                                    <option value="glass" className="text-slate-900">Glass</option>
                                    <option value="aurora" className="text-slate-900">Aurora</option>
                                    <option value="grain" className="text-slate-900">Grain</option>
                                 </select>
                              </div>
                           </div>
                        </div>

                     </div>
                     <div className="col-span-4">
                        <div className="bg-indigo-600 rounded-[40px] p-10 text-white shadow-2xl shadow-indigo-500/30">
                           <h3 className="text-3xl font-black tracking-tight mb-4">Pro &<br />Power.</h3>
                           <p className="text-indigo-200 font-medium leading-relaxed mb-8">
                              Advanced configurations for multi-location syncing and API access are available in the Enterprise tier.
                           </p>
                           <button className="py-4 px-8 bg-white text-indigo-600 font-black rounded-xl uppercase tracking-widest text-xs shadow-lg hover:bg-indigo-50 transition-colors">
                              Contact Support
                           </button>
                        </div>
                     </div>
                  </div>
               )}

               {/* QR CODE MODAL */}
               {isQRModalOpen && (
                  <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-6 animate-in fade-in duration-200">
                     <div className="bg-white rounded-[48px] p-12 max-w-md w-full shadow-2xl relative overflow-hidden text-center animate-in zoom-in-95 duration-300">
                        <div className="absolute top-0 left-0 w-full h-2" style={{ backgroundColor: clinic.primaryColor }}></div>
                        <button onClick={() => setIsQRModalOpen(false)} className="absolute top-6 right-6 p-2 bg-slate-50 hover:bg-slate-100 rounded-full transition-colors"><X size={20} className="text-slate-400" /></button>

                        <div className="mb-8">
                           <div className="h-16 w-16 mx-auto bg-slate-50 rounded-[20px] flex items-center justify-center mb-6 shadow-sm">
                              <QrCode size={32} style={{ color: clinic.primaryColor }} />
                           </div>
                           <h3 className="text-2xl font-black text-slate-900 tracking-tight">Patient Access Portal</h3>
                           <p className="text-sm font-bold text-slate-400 mt-2">Scan to install the App</p>
                        </div>

                        <div className="bg-slate-900 p-8 rounded-[32px] inline-block shadow-2xl mb-8 group relative overflow-hidden">
                           <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                           <img
                              src={`https://api.qrserver.com/v1/create-qr-code/?size=300x300&bgcolor=ffffff&color=000000&margin=0&data=${encodeURIComponent(`${window.location.origin}/?subdomain=${clinic.slug}`)}`}
                              alt="Patient Portal QR"
                              className="w-48 h-48 rounded-xl bg-white"
                           />
                        </div>

                        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                           <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Direct Link</p>
                           <p className="font-mono text-xs font-bold text-slate-600 break-all select-all">{window.location.origin}/?subdomain={clinic.slug}</p>
                        </div>
                     </div>
                  </div>
               )}

               {/* SOCIAL POST GENERATOR MODAL */}
               {isSocialModalOpen && (
                  <SocialPostGenerator
                     clinic={clinic}
                     onClose={() => setIsSocialModalOpen(false)}
                  />
               )}

            </main >
         </div >
      </div >
   );
};

export default DesktopDoctorView;
