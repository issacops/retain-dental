import React, { useState, useMemo, useEffect } from 'react';
import { AreaChart, Area, XAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Clinic, ThemeTexture } from '../../types';
import { LayoutGrid, Plus, BarChart3, Lock, Cpu, Settings, Globe, Radio, Search, Palette, X, Copy, Terminal, Monitor, Server, LayoutGrid as LayoutGridIcon } from 'lucide-react';
import GlobalStats from './subcomponents/GlobalStats';
import ClinicCard from './subcomponents/ClinicCard';

interface PerformanceMetric {
   id: string;
   name: string;
   revenue: number;
   patients: number;
   rpp: number;
   tier: string;
   color: string;
   logo?: string;
   createdAt: string;
   slug: string;
}

interface ShardStatus {
   id: string;
   region: string;
   health: number;
   load: number;
   latency: string;
}

interface Props {
   clinics: Clinic[];
   stats: {
      totalClinics: number;
      totalPatients: number;
      mrr: number;
      totalSystemRevenue: number;
      subscriptionMix: { name: string; value: number }[];
      clinicPerformance: PerformanceMetric[];
      recentActivity: any[];
      config: any;
      shards: ShardStatus[];
   };
   onOnboardClinic: (name: string, color: string, texture: ThemeTexture, ownerName: string, logoUrl: string, slug: string, adminEmail: string) => Promise<any>;
   onEnterClinic: (clinicId: string) => void; // Sync nav wrapper
   onDeleteClinic: (clinicId: string) => Promise<any>;
   onUpdateConfig: (updates: any) => Promise<any>;
}

const LiveHeartbeat = () => (
   <div className="flex items-end gap-[2px] h-6 px-3 bg-indigo-500/10 rounded-full border border-indigo-500/20">
      {[0.2, 0.4, 0.8, 0.3, 0.9, 0.5, 0.2, 0.6].map((h, i) => (
         <div key={i} className="w-1 bg-indigo-400 rounded-t-sm animate-pulse" style={{ height: `${h * 100}%`, animationDelay: `${i * 0.1}s` }}></div>
      ))}
      <span className="ml-2 text-[8px] font-black text-indigo-400 uppercase tracking-tighter">Live Node Sync</span>
   </div>
);

const PlatformDashboard: React.FC<Props> = ({ clinics, stats, onOnboardClinic, onEnterClinic, onUpdateConfig, onDeleteClinic }) => {
   const [activeView, setActiveView] = useState<'HUB' | 'REVENUE' | 'SECURITY' | 'DEPLOYMENTS' | 'CONFIG'>('HUB');
   const [showOnboardModal, setShowOnboardModal] = useState(false);
   const [selectedClinicForManifest, setSelectedClinicForManifest] = useState<PerformanceMetric | null>(null);
   const [searchQuery, setSearchQuery] = useState('');

   const [newClinicName, setNewClinicName] = useState('');
   const [newClinicOwner, setNewClinicOwner] = useState('');
   const [newClinicLogo, setNewClinicLogo] = useState('');
   const [newClinicColor, setNewClinicColor] = useState('#6366f1');
   const [newClinicTexture, setNewClinicTexture] = useState<ThemeTexture>('minimal');

   // NEW FIELDS
   const [newClinicSlug, setNewClinicSlug] = useState('');
   const [newClinicAdminEmail, setNewClinicAdminEmail] = useState('');

   const [configDraft, setConfigDraft] = useState(stats.config);

   useEffect(() => {
      setConfigDraft(stats.config);
   }, [stats.config]);

   const filteredPerformance = useMemo(() =>
      stats.clinicPerformance.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase())),
      [stats.clinicPerformance, searchQuery]
   );

   const formatCurrency = (val: number) =>
      new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);

   return (
      <div className="flex h-screen bg-[#020406] text-slate-400 font-sans overflow-hidden selection:bg-indigo-500 selection:text-white">
         {/* GLOWING BACKGROUND ORBS */}
         <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-900/10 blur-[150px] rounded-full pointer-events-none"></div>
         <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-900/10 blur-[150px] rounded-full pointer-events-none"></div>

         {/* SIDEBAR - Ultra Dark Mono */}
         <aside className="w-72 border-r border-white/5 bg-[#05070a]/80 backdrop-blur-xl flex flex-col z-30 shrink-0">
            <div className="p-8">
               <div className="flex items-center gap-3">
                  <div className="bg-gradient-to-br from-indigo-500 to-blue-600 p-2.5 rounded-2xl shadow-[0_0_20px_rgba(99,102,241,0.4)]">
                     <Globe size={22} className="text-white" />
                  </div>
                  <div>
                     <h1 className="font-black tracking-tighter text-xl text-white">PRIME<span className="text-indigo-400">.</span>OS</h1>
                     <p className="text-[9px] font-bold text-slate-500 uppercase tracking-[0.2em] leading-none">Global Master</p>
                  </div>
               </div>
            </div>

            <nav className="flex-1 px-6 space-y-1.5 mt-8">
               {[
                  { id: 'HUB', label: 'Network Hub', icon: <LayoutGrid size={18} /> },
                  { id: 'REVENUE', label: 'Revenue Pulse', icon: <BarChart3 size={18} /> },
                  { id: 'SECURITY', label: 'Access Vault', icon: <Lock size={18} /> },
                  { id: 'DEPLOYMENTS', label: 'Infrastructure', icon: <Cpu size={18} /> },
                  { id: 'CONFIG', label: 'System Config', icon: <Settings size={18} /> },
               ].map((item) => (
                  <button key={item.id} onClick={() => setActiveView(item.id as any)}
                     className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl font-bold text-sm transition-all group relative ${activeView === item.id ? 'bg-indigo-600/10 text-white' : 'hover:bg-white/5 text-slate-500 hover:text-slate-300'}`}>
                     {activeView === item.id && <div className="absolute left-0 w-1 h-6 bg-indigo-500 rounded-full"></div>}
                     <span className={`${activeView === item.id ? 'text-indigo-400' : 'group-hover:text-white transition-colors'}`}>{item.icon}</span>
                     {item.label}
                  </button>
               ))}
            </nav>

            <div className="p-8 border-t border-white/5">
               <div className="bg-white/5 rounded-2xl p-5 border border-white/5 space-y-4">
                  <div className="flex justify-between items-center">
                     <span className="text-[10px] font-black uppercase text-slate-500">System Status</span>
                     <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
                  </div>
                  <div className="flex items-center gap-2">
                     <Radio size={12} className="text-indigo-400" />
                     <span className="text-xs font-bold text-white">Production Shard A</span>
                  </div>
               </div>
            </div>
         </aside>

         {/* MAIN VIEWPORT */}
         <main className="flex-1 overflow-y-auto relative p-12 custom-scrollbar">
            <div className="max-w-[1400px] mx-auto space-y-12">

               {/* HEADER BAR */}
               <div className="flex justify-between items-end">
                  <div>
                     <div className="flex items-center gap-4 mb-2">
                        <span className="text-[10px] font-black uppercase text-indigo-400 tracking-widest bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20">Operational Control</span>
                        <LiveHeartbeat />
                     </div>
                     <h2 className="text-5xl font-black text-white tracking-tighter">
                        {activeView === 'HUB' && 'Network Hub'}
                        {activeView === 'REVENUE' && 'Revenue Pulse'}
                        {activeView === 'SECURITY' && 'Identity & Access'}
                        {activeView === 'DEPLOYMENTS' && 'System Infrastructure'}
                        {activeView === 'CONFIG' && 'Root Configuration'}
                     </h2>
                  </div>
                  {activeView === 'HUB' && (
                     <button onClick={() => setShowOnboardModal(true)} className="group bg-white text-black px-8 py-5 rounded-[24px] font-black text-sm flex items-center gap-3 shadow-[0_20px_40px_rgba(255,255,255,0.1)] transition-all hover:scale-105 active:scale-95">
                        <Plus size={20} className="group-hover:rotate-90 transition-transform" /> Deploy New Node
                     </button>
                  )}
               </div>

               {activeView === 'HUB' && (
                  <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">

                     <GlobalStats stats={stats} formatCurrency={formatCurrency} />

                     {/* CLINIC REGISTRY GRID */}
                     <div className="bg-white/[0.02] border border-white/5 p-12 rounded-[56px] space-y-10 relative overflow-hidden">
                        <div className="flex justify-between items-center">
                           <h4 className="text-2xl font-black text-white tracking-tighter">Active Deployments</h4>
                           <div className="relative group">
                              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" size={16} />
                              <input type="text" placeholder="Search the network..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                                 className="bg-[#0a0c10] border border-white/10 rounded-2xl pl-12 pr-6 py-4 text-xs font-bold text-white outline-none w-80 focus:border-indigo-500/50 transition-all" />
                           </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                           {filteredPerformance.map(clinic => (
                              <ClinicCard
                                 key={clinic.id}
                                 clinic={clinic}
                                 onEnterClinic={onEnterClinic}
                                 onSelectForManifest={setSelectedClinicForManifest}
                                 formatCurrency={formatCurrency}
                              />
                           ))}
                        </div>
                     </div>
                  </div>
               )}

               {activeView === 'REVENUE' && (
                  <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-8">
                     <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="bg-white/[0.02] border border-white/5 p-12 rounded-[56px] h-[500px]">
                           <h4 className="text-2xl font-black text-white tracking-tighter mb-10">Network GTV Acceleration</h4>
                           <ResponsiveContainer width="100%" height="80%">
                              <AreaChart data={[{ n: 'Jan', r: 450000 }, { n: 'Feb', r: 520000 }, { n: 'Mar', r: 890000 }, { n: 'Apr', r: 1240000 }, { n: 'May', r: 1560000 }]}>
                                 <defs>
                                    <linearGradient id="colorGtv" x1="0" y1="0" x2="0" y2="1">
                                       <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                                       <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                    </linearGradient>
                                 </defs>
                                 <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" strokeOpacity={0.5} />
                                 <XAxis dataKey="n" axisLine={false} tickLine={false} tick={{ fill: '#475569', fontSize: 10, fontWeight: 900 }} />
                                 <Tooltip contentStyle={{ backgroundColor: '#0a0c10', border: '1px solid #1e293b', borderRadius: '16px', boxShadow: '0 20px 40px rgba(0,0,0,0.5)' }} />
                                 <Area type="monotone" dataKey="r" stroke="#6366f1" strokeWidth={6} fillOpacity={1} fill="url(#colorGtv)" />
                              </AreaChart>
                           </ResponsiveContainer>
                        </div>
                        <div className="bg-white/[0.02] border border-white/5 p-12 rounded-[56px] flex flex-col justify-center">
                           <h4 className="text-2xl font-black text-white tracking-tighter mb-10">Subscription Yield</h4>
                           <div className="space-y-4">
                              {stats.subscriptionMix.map((mix, i) => (
                                 <div key={i} className="group flex justify-between items-center p-8 bg-white/5 hover:bg-white/[0.08] border border-white/5 rounded-[32px] transition-all">
                                    <div>
                                       <h5 className="font-black text-xl text-white">{mix.name} Cluster</h5>
                                       <p className="text-[10px] text-slate-500 font-black uppercase mt-1 tracking-widest">Global Allocation</p>
                                    </div>
                                    <div className="text-right">
                                       <span className="text-3xl font-black text-indigo-400">{mix.value}</span>
                                       <p className="text-[10px] text-slate-500 font-bold uppercase mt-1">Nodes</p>
                                    </div>
                                 </div>
                              ))}
                           </div>
                        </div>
                     </div>
                  </div>
               )}

               {activeView === 'DEPLOYMENTS' && (
                  <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 grid grid-cols-3 gap-6">
                     {stats.shards.map(shard => (
                        <div key={shard.id} className="bg-white/[0.02] border border-white/5 p-10 rounded-[48px] space-y-8 group relative overflow-hidden">
                           <div className="absolute bottom-0 right-0 w-24 h-24 bg-indigo-500/5 blur-[40px] rounded-full transition-all group-hover:scale-150"></div>
                           <div className="flex justify-between items-center relative z-10">
                              <div className="h-14 w-14 rounded-2xl bg-indigo-600/10 flex items-center justify-center text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-all"><Server size={28} /></div>
                              <div className="flex items-center gap-2">
                                 <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                                 <span className="text-[9px] font-black uppercase text-emerald-400 tracking-widest">Optimized</span>
                              </div>
                           </div>
                           <div className="relative z-10">
                              <h4 className="text-2xl font-black text-white tracking-tighter">{shard.id}</h4>
                              <p className="text-sm text-slate-500 font-bold uppercase tracking-widest mt-1">{shard.region}</p>
                           </div>
                           <div className="grid grid-cols-2 gap-8 pt-8 border-t border-white/5 relative z-10">
                              <div>
                                 <p className="text-[9px] font-black uppercase text-slate-600 mb-1">Resource Load</p>
                                 <p className="text-2xl font-black text-white">{shard.load}%</p>
                              </div>
                              <div className="text-right">
                                 <p className="text-[9px] font-black uppercase text-slate-600 mb-1">Latency (avg)</p>
                                 <p className="text-2xl font-black text-white">{shard.latency}</p>
                              </div>
                           </div>
                        </div>
                     ))}
                  </div>
               )}

               {activeView === 'CONFIG' && (
                  <div className="max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700 bg-white/[0.02] border border-white/5 p-16 rounded-[64px] space-y-12">
                     <div className="space-y-6">
                        <label className="text-[10px] font-black uppercase text-slate-500 tracking-[0.3em] px-2">Master Identity Protocol</label>
                        <input type="text" value={configDraft.platformName} onChange={e => setConfigDraft({ ...configDraft, platformName: e.target.value })}
                           className="w-full bg-[#0a0c10] border border-white/10 rounded-[32px] px-10 py-6 text-white font-black text-2xl outline-none focus:border-indigo-500 shadow-2xl transition-all" />
                     </div>
                     <div className="grid grid-cols-1 gap-4">
                        {[
                           { label: 'Global MFA Enforcement', desc: 'Secure every clinical node with multi-factor biometric auth.', key: 'globalMfaEnabled' },
                           { label: 'Cloud Maintenance Mode', desc: 'Gracefully pause all public-facing endpoints for updates.', key: 'maintenanceMode' }
                        ].map((toggle) => (
                           <div key={toggle.key} className="flex items-center justify-between p-8 bg-white/5 border border-white/5 rounded-[32px] hover:bg-white/[0.08] transition-all">
                              <div className="max-w-[70%]">
                                 <p className="text-lg font-black text-white leading-tight">{toggle.label}</p>
                                 <p className="text-xs text-slate-500 mt-1 font-medium">{toggle.desc}</p>
                              </div>
                              <button onClick={() => setConfigDraft({ ...configDraft, [toggle.key]: !configDraft[toggle.key as keyof typeof configDraft] })}
                                 className={`w-16 h-9 rounded-full transition-all relative p-1 ${configDraft[toggle.key as keyof typeof configDraft] ? 'bg-indigo-600' : 'bg-slate-800'}`}>
                                 <div className={`w-7 h-7 rounded-full bg-white shadow-lg transition-all transform ${configDraft[toggle.key as keyof typeof configDraft] ? 'translate-x-7' : 'translate-x-0'}`}></div>
                              </button>
                           </div>
                        ))}
                     </div>
                     <button onClick={() => onUpdateConfig(configDraft)} className="w-full py-8 bg-indigo-600 hover:bg-indigo-500 text-white rounded-[32px] font-black text-lg shadow-[0_20px_40px_rgba(99,102,241,0.3)] transition-all hover:scale-[1.02] active:scale-95">Synchronize Global Parameters</button>
                  </div>
               )}
            </div>
         </main>

         {/* MANIFEST MODAL */}
         {selectedClinicForManifest && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-3xl p-6">
               <div className="bg-[#0a0c10] border border-white/10 rounded-[64px] p-16 w-full max-w-3xl shadow-2xl relative overflow-hidden animate-in zoom-in-95 duration-500">
                  <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/10 blur-[150px] rounded-full pointer-events-none"></div>
                  <div className="flex justify-between items-start mb-16 relative z-10">
                     <div className="flex items-center gap-8">
                        <div className="h-24 w-24 rounded-[32px] flex items-center justify-center text-5xl font-black text-white shadow-2xl" style={{ backgroundColor: selectedClinicForManifest.color }}>
                           {selectedClinicForManifest.logo ? <img src={selectedClinicForManifest.logo} className="w-full h-full object-cover rounded-[32px]" /> : selectedClinicForManifest.name.charAt(0)}
                        </div>
                        <div>
                           <h3 className="text-5xl font-black text-white tracking-tighter leading-none mb-3">{selectedClinicForManifest.name}</h3>
                           <p className="text-lg text-slate-500 font-bold uppercase tracking-widest">Instance Manifest v1.0.4</p>
                        </div>
                     </div>
                     <button onClick={() => setSelectedClinicForManifest(null)} className="p-4 bg-white/5 hover:bg-white/10 text-slate-500 hover:text-white rounded-[24px] transition-all"><X size={32} /></button>
                  </div>

                  <div className="space-y-10 relative z-10">
                     <div className="grid grid-cols-2 gap-6">
                        <div className="bg-white/5 p-8 rounded-[40px] border border-white/5 space-y-4">
                           <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Network Deployment ID</p>
                           <p className="font-mono text-xs text-white bg-black/50 p-4 rounded-2xl border border-white/10">{selectedClinicForManifest.id.toUpperCase()}</p>
                        </div>
                        <div className="bg-white/5 p-8 rounded-[40px] border border-white/5 space-y-4">
                           <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Provisioning Date</p>
                           <p className="text-xl font-black text-white">{new Date(selectedClinicForManifest.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                        </div>
                     </div>

                     <div className="bg-white/5 p-10 rounded-[40px] border border-white/5 space-y-8">
                        <div className="flex justify-between items-center px-2">
                           <h5 className="font-black text-white text-lg tracking-tight">Access Gateways</h5>
                           <span className="text-[10px] font-black uppercase text-indigo-400">Identity-Bound URLs</span>
                        </div>
                        <div className="space-y-4">
                           <div className="bg-black/40 rounded-3xl p-6 border border-white/10 flex justify-between items-center group">
                              <div>
                                 <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-1">Staff Admin Portal</p>
                                 <p className="font-mono text-xs text-slate-400">practiceprime.os/c/{selectedClinicForManifest.slug}/staff</p>
                              </div>
                              <button onClick={() => { navigator.clipboard.writeText(`practiceprime.os/c/${selectedClinicForManifest.slug}/staff`); alert('Copied'); }} className="p-3 bg-white/5 hover:bg-indigo-600 rounded-xl transition-all opacity-0 group-hover:opacity-100"><Copy size={16} /></button>
                           </div>
                        </div>
                     </div>

                     <div className="flex gap-4">
                        <button onClick={() => onEnterClinic(selectedClinicForManifest.id)} className="flex-1 py-7 bg-indigo-600 hover:bg-indigo-500 text-white rounded-[32px] font-black text-xl shadow-2xl transition-all hover:scale-[1.02]">
                           Initiate Master Override
                        </button>
                        <button onClick={() => {
                           if (confirm(`CRITICAL WARNING: You are about to Permanently Decommission Node ${selectedClinicForManifest.name.toUpperCase()}.\n\nThis action cannot be undone. All associated data (records, wallets, transactions) will be wiped from the network.\n\nProceed?`)) {
                              onDeleteClinic(selectedClinicForManifest.id);
                              setSelectedClinicForManifest(null);
                           }
                        }} className="py-7 px-8 bg-rose-950/30 hover:bg-rose-900/50 border border-rose-900/50 text-rose-500 hover:text-rose-400 rounded-[32px] font-black text-lg transition-all hover:scale-[1.02] flex items-center justify-center gap-2">
                           <LayoutGridIcon size={24} className="animate-pulse" /> Nuke Node
                        </button>
                     </div>
                  </div>
               </div>
            </div>
         )}

         {/* ONBOARD MODAL */}
         {showOnboardModal && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-3xl p-6">
               <div className="bg-[#0a0c10] border border-white/10 rounded-[64px] p-16 w-full max-w-3xl shadow-2xl relative overflow-y-auto max-h-[90vh] animate-in zoom-in-95 duration-500">
                  <div className="flex justify-between items-start mb-16">
                     <div>
                        <h3 className="text-5xl font-black text-white tracking-tighter">Node Provisioning</h3>
                        <p className="text-xl text-slate-500 font-bold uppercase tracking-widest mt-2">Scale the Dental Network</p>
                     </div>
                     <button onClick={() => setShowOnboardModal(false)} className="p-4 bg-white/5 text-slate-500 hover:text-white rounded-[24px] transition-all"><X size={32} /></button>
                  </div>

                  <div className="space-y-12">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                           <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-3">Identity Signature</label>
                           <input type="text" className="w-full bg-white/5 border border-white/10 rounded-[32px] px-8 py-5 text-white font-black text-xl outline-none focus:border-indigo-500 transition-all" placeholder="Practice Name" value={newClinicName} onChange={e => setNewClinicName(e.target.value)} />
                        </div>
                        <div className="space-y-4">
                           <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-3">Primary Stakeholder</label>
                           <input type="text" className="w-full bg-white/5 border border-white/10 rounded-[32px] px-8 py-5 text-white font-black text-xl outline-none focus:border-indigo-500 transition-all" placeholder="Owner Full Name" value={newClinicOwner} onChange={e => setNewClinicOwner(e.target.value)} />
                        </div>
                     </div>

                     {/* NEW ROW: SLUG & EMAIL */}
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                           <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-3">Network Subdomain</label>
                           <div className="flex items-center bg-white/5 border border-white/10 rounded-[32px] px-8 py-2 focus-within:border-indigo-500 transition-all">
                              <input type="text" className="bg-transparent text-white font-black text-xl outline-none w-full py-3" placeholder="slug" value={newClinicSlug} onChange={e => setNewClinicSlug(e.target.value.toLowerCase().replace(/\s+/g, '-'))} />
                              <span className="text-slate-500 font-bold text-xs uppercase tracking-widest bg-white/5 px-2 py-1 rounded">.retain.dental</span>
                           </div>
                        </div>
                        <div className="space-y-4">
                           <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-3">Administrator Email</label>
                           <input type="email" className="w-full bg-white/5 border border-white/10 rounded-[32px] px-8 py-5 text-white font-black text-xl outline-none focus:border-indigo-500 transition-all" placeholder="doctor@gmail.com" value={newClinicAdminEmail} onChange={e => setNewClinicAdminEmail(e.target.value)} />
                        </div>
                     </div>

                     <div className="space-y-8">
                        <div className="flex items-center gap-3 px-3">
                           <Palette size={18} className="text-indigo-400" />
                           <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Visual Identity Engine</label>
                        </div>

                        <div className="grid grid-cols-2 gap-8">
                           <div className="bg-white/5 p-8 rounded-[40px] border border-white/5 space-y-6">
                              <p className="text-xs font-black text-slate-400 px-1 uppercase tracking-widest">Brand Frequency</p>
                              <div className="flex items-center gap-6">
                                 <input type="color" value={newClinicColor} onChange={e => setNewClinicColor(e.target.value)} className="h-16 w-16 bg-transparent border-none cursor-pointer rounded-2xl" />
                                 <span className="font-mono text-xl font-bold text-white tracking-widest uppercase">{newClinicColor}</span>
                              </div>
                           </div>
                           <div className="bg-white/5 p-8 rounded-[40px] border border-white/5 space-y-6">
                              <p className="text-xs font-black text-slate-400 px-1 uppercase tracking-widest">Asset Sync</p>
                              <input type="text" className="w-full bg-black/50 border border-white/10 rounded-2xl px-6 py-4 text-white text-xs font-bold outline-none focus:border-indigo-500" placeholder="Logo Asset URL" value={newClinicLogo} onChange={e => setNewClinicLogo(e.target.value)} />
                           </div>
                        </div>

                        <div className="space-y-6">
                           <p className="text-xs font-black text-slate-400 px-3 uppercase tracking-widest">Surface Physics</p>
                           <div className="grid grid-cols-2 gap-4">
                              {[
                                 { id: 'minimal', label: 'Clean Minimal', desc: 'Symmetry & solid-fills' },
                                 { id: 'grain', label: 'Industrial Grain', desc: 'Analog texture & depth' },
                                 { id: 'aurora', label: 'Aurora Mesh', desc: 'Vibrant fluid-gradients' },
                                 { id: 'glass', label: 'Refractive Glass', desc: 'Heavy blur & saturation' }
                              ].map(tex => (
                                 <button key={tex.id} onClick={() => setNewClinicTexture(tex.id as ThemeTexture)}
                                    className={`p-8 rounded-[40px] border text-left transition-all relative overflow-hidden group ${newClinicTexture === tex.id ? 'bg-indigo-600 border-indigo-500 text-white shadow-2xl scale-[1.02]' : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/[0.08]'}`}>
                                    <h5 className="font-black text-xl mb-1 tracking-tighter">{tex.label}</h5>
                                    <p className="text-[10px] font-bold opacity-60 uppercase tracking-widest">{tex.desc}</p>
                                 </button>
                              ))}
                           </div>
                        </div>
                     </div>

                     <button onClick={async () => { await onOnboardClinic(newClinicName, newClinicColor, newClinicTexture, newClinicOwner, newClinicLogo, newClinicSlug || newClinicName.toLowerCase().replace(/\s+/g, '-'), newClinicAdminEmail); setShowOnboardModal(false); }}
                        className="w-full py-10 bg-indigo-600 hover:bg-indigo-500 text-white rounded-[48px] font-black text-2xl shadow-[0_30px_60px_-10px_rgba(99,102,241,0.4)] transition-all hover:scale-[1.02] active:scale-95">
                        Deploy Optimized Node
                     </button>
                  </div>
               </div>
            </div>
         )}
      </div>
   );
};

export default PlatformDashboard;
