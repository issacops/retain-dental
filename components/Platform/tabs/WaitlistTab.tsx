import React from 'react';

interface WaitlistTabProps {
  waitlistData: any[];
  fetchWaitlist: () => void;
}

export const WaitlistTab: React.FC<WaitlistTabProps> = ({ waitlistData, fetchWaitlist }) => {
  return (
    <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700 bg-white/[0.02] border border-white/5 p-12 rounded-[56px] min-h-[600px]">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h4 className="text-2xl font-black text-white tracking-tighter">Access Requests</h4>
          <p className="text-sm text-slate-500 font-bold uppercase tracking-widest mt-2 opacity-60">Waitlist Management</p>
        </div>
        <div className="flex gap-4">
          <button
            onClick={fetchWaitlist}
            className="px-6 py-3 bg-white/5 hover:bg-white/10 rounded-xl font-bold text-xs uppercase tracking-widest transition-colors text-white"
          >
            Refresh
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {/* HEADER ROW */}
        <div className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-white/5 text-[10px] font-black uppercase text-slate-500 tracking-widest">
          <div className="col-span-2">Date</div>
          <div className="col-span-3">Doctor Name</div>
          <div className="col-span-3">Clinic</div>
          <div className="col-span-2">Contact</div>
          <div className="col-span-2 text-right">Status</div>
        </div>

        {waitlistData.length === 0 ? (
          <div className="p-12 text-center text-slate-500 font-bold">No requests yet.</div>
        ) : (
          waitlistData.map((entry: any) => (
            <div key={entry.id} className="grid grid-cols-12 gap-4 items-center p-6 bg-white/5 border border-white/5 rounded-3xl hover:bg-white/[0.08] transition-all">
              <div className="col-span-2 text-xs font-mono text-slate-400">
                {new Date(entry.created_at).toLocaleDateString()}
              </div>
              <div className="col-span-3 font-bold text-white text-sm">
                {entry.full_name}
              </div>
              <div className="col-span-3 text-sm text-slate-300">
                {entry.clinic_name || '-'}
              </div>
              <div className="col-span-2">
                <p className="text-xs text-indigo-400 font-mono">{entry.mobile}</p>
                <p className="text-[10px] text-slate-500 truncate">{entry.email}</p>
              </div>
              <div className="col-span-2 text-right">
                <span className="px-3 py-1 bg-amber-500/10 text-amber-500 rounded-lg text-[10px] font-black uppercase tracking-widest border border-amber-500/20">
                  {entry.status || 'PENDING'}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
