import React from 'react';

interface LeadsTabProps {
  leadsData: any[];
  leadsFilter: string;
  setLeadsFilter: (filter: string) => void;
  fetchLeads: () => void;
}

export const LeadsTab: React.FC<LeadsTabProps> = ({
  leadsData,
  leadsFilter,
  setLeadsFilter,
  fetchLeads,
}) => {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-8">
      {/* Header controls */}
      <div className="flex justify-between items-center bg-white/5 border border-white/5 p-8 rounded-[36px]">
        <div>
          <h3 className="text-2xl font-black text-white tracking-tighter">Inbound Demo Requests</h3>
          <p className="text-sm text-slate-400 font-bold mt-1">Leads captured from marketing site demo form</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex bg-black/40 p-1.5 rounded-2xl border border-white/10">
            {['all', 'new', 'contacted', 'converted'].map(filter => (
              <button
                key={filter}
                onClick={() => setLeadsFilter(filter)}
                className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
                  leadsFilter === filter
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
          <button
            onClick={fetchLeads}
            className="px-6 py-3 bg-white/5 hover:bg-white/10 rounded-xl font-bold text-xs uppercase tracking-widest transition-colors text-white"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Leads', value: leadsData.length, color: 'text-indigo-400' },
          { label: 'New', value: leadsData.filter(l => l.status === 'new').length, color: 'text-emerald-400' },
          { label: 'Contacted', value: leadsData.filter(l => l.status === 'contacted').length, color: 'text-amber-400' },
          { label: 'Converted', value: leadsData.filter(l => l.status === 'converted').length, color: 'text-indigo-400' },
        ].map((stat, i) => (
          <div key={i} className="bg-white/5 border border-white/5 rounded-3xl p-6 text-center">
            <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest">{stat.label}</p>
            <p className={`text-3xl font-black ${stat.color} mt-1`}>{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="space-y-3">
        {/* HEADER ROW */}
        <div className="grid grid-cols-12 gap-4 px-6 py-3 border-b border-white/5 text-[10px] font-black uppercase text-slate-500 tracking-widest">
          <div className="col-span-1">Date</div>
          <div className="col-span-2">Name</div>
          <div className="col-span-2">Email</div>
          <div className="col-span-2">Phone</div>
          <div className="col-span-2">Clinic</div>
          <div className="col-span-1">Type</div>
          <div className="col-span-1">Source</div>
          <div className="col-span-1 text-right">Status</div>
        </div>

        {leadsData.length === 0 ? (
          <div className="p-16 text-center text-slate-500 font-bold">
            <p className="text-lg mb-2">No leads yet</p>
            <p className="text-sm opacity-60">Leads will appear here when visitors submit the demo form.</p>
          </div>
        ) : (
          leadsData
            .filter(l => leadsFilter === 'all' || l.status === leadsFilter)
            .map((lead: any) => (
              <div
                key={lead.id}
                className="grid grid-cols-12 gap-4 items-center p-5 bg-white/5 border border-white/5 rounded-2xl hover:bg-white/[0.08] transition-all"
              >
                <div className="col-span-1 text-[10px] font-mono text-slate-400">
                  {new Date(lead.created_at).toLocaleDateString()}
                </div>
                <div className="col-span-2 font-bold text-white text-sm flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400 text-[10px] font-bold shrink-0">
                    {lead.name?.charAt(0) || '?'}
                  </div>
                  <span className="truncate">{lead.name || 'Unknown'}</span>
                </div>
                <div className="col-span-2 text-xs text-slate-400 truncate">{lead.email || '-'}</div>
                <div className="col-span-2 text-xs text-slate-400 font-mono">
                  {lead.phone ? `+${lead.country_code || ''} ${lead.phone}` : '-'}
                </div>
                <div className="col-span-2 text-xs text-slate-300 truncate">{lead.clinic_name || '-'}</div>
                <div className="col-span-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">{lead.practice_type || '-'}</span>
                </div>
                <div className="col-span-1">
                  <span className="text-[10px] font-bold text-slate-500 uppercase">{lead.source || 'website'}</span>
                </div>
                <div className="col-span-1 text-right">
                  <span
                    className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${
                      lead.status === 'converted'
                        ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
                        : lead.status === 'qualified'
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                        : lead.status === 'contacted'
                        ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                        : 'bg-white/5 text-slate-400 border-white/10'
                    }`}
                  >
                    {lead.status || 'new'}
                  </span>
                </div>
              </div>
            ))
        )}
      </div>
    </div>
  );
};
