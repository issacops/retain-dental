import React from 'react';
import { Clinic } from '../../../types';
import { Server } from 'lucide-react';

interface DeploymentsTabProps {
  clinics: Clinic[];
  getClinicStats: (id: string) => { patients: number; staff: number };
  onEnterClinic: (id: string) => void;
  onDeleteClinic: (id: string) => Promise<any>;
}

export const DeploymentsTab: React.FC<DeploymentsTabProps> = ({
  clinics,
  getClinicStats,
  onEnterClinic,
  onDeleteClinic,
}) => {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 grid grid-cols-3 gap-6">
      {clinics.map(clinic => {
        const stats = getClinicStats(clinic.id);
        return (
          <div
            key={clinic.id}
            className="bg-white/[0.02] border border-white/5 p-10 rounded-[48px] space-y-8 group relative overflow-hidden hover:bg-white/5 transition-all"
          >
            <div className="absolute bottom-0 right-0 w-24 h-24 bg-indigo-500/5 blur-[40px] rounded-full transition-all group-hover:scale-150"></div>

            {/* HEADER */}
            <div className="flex justify-between items-center relative z-10">
              <div className="h-14 w-14 rounded-2xl bg-indigo-600/10 flex items-center justify-center text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                {clinic.logoUrl ? <img src={clinic.logoUrl} className="w-8 h-8 rounded-full" alt={clinic.name} /> : <Server size={28} />}
              </div>
              <div className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                <span className="text-[9px] font-black uppercase text-emerald-400 tracking-widest">Active Node</span>
              </div>
            </div>

            {/* DETAILS */}
            <div className="relative z-10">
              <h4 className="text-2xl font-black text-white tracking-tighter truncate" title={clinic.name}>
                {clinic.name}
              </h4>
              <p className="text-sm text-slate-500 font-bold uppercase tracking-widest mt-1 opacity-60">
                {clinic.slug}.retain.os
              </p>
            </div>

            {/* ADMIN INFO */}
            <div className="space-y-4 pt-6 border-t border-white/5 relative z-10">
              <div>
                <p className="text-[9px] font-black uppercase text-slate-600 mb-1">Clinic Director</p>
                <div className="flex items-center justify-between">
                  <p className="text-sm font-bold text-white">{clinic.ownerName || 'Unassigned'}</p>
                </div>
              </div>
              <div>
                <p className="text-[9px] font-black uppercase text-slate-600 mb-1">Admin Credentials</p>
                <p className="text-sm font-mono text-slate-400 truncate" title={clinic.adminEmail}>
                  {clinic.adminEmail || 'No Email Set'}
                </p>
              </div>
            </div>

            {/* LIVE STATS */}
            <div className="grid grid-cols-2 gap-8 pt-6 border-t border-white/5 relative z-10">
              <div>
                <p className="text-[9px] font-black uppercase text-slate-600 mb-1">Patients</p>
                <p className="text-2xl font-black text-white">{stats.patients}</p>
              </div>
              <div className="text-right">
                <p className="text-[9px] font-black uppercase text-slate-600 mb-1">Active Staff</p>
                <p className="text-2xl font-black text-white">{stats.staff}</p>
              </div>
            </div>

            {/* ACTIONS */}
            <div className="grid grid-cols-2 gap-4 pt-6 border-t border-white/5 relative z-10">
              <button
                onClick={() => onEnterClinic(clinic.id)}
                className="py-3 bg-white/5 hover:bg-white/10 rounded-xl text-xs font-bold text-white uppercase tracking-wider transition-colors"
              >
                Enter Console
              </button>
              <button
                onClick={() => onDeleteClinic(clinic.id)}
                className="py-3 bg-red-500/10 hover:bg-red-500/20 rounded-xl text-xs font-bold text-red-400 uppercase tracking-wider transition-colors"
              >
                Shutdown
              </button>
            </div>
          </div>
        );
      })}

      {clinics.length === 0 && (
        <div className="col-span-3 bg-white/5 border border-white/5 rounded-[48px] p-24 text-center text-slate-500">
          <p className="font-bold text-xl mb-2">No Active Deployments</p>
          <p className="text-sm opacity-60">Deploy your first Clinic Node to see it here.</p>
        </div>
      )}
    </div>
  );
};
