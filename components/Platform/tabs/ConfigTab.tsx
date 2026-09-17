import React from 'react';

interface ConfigTabProps {
  configDraft: any;
  setConfigDraft: (config: any) => void;
  onUpdateConfig: (config: any) => Promise<any>;
}

export const ConfigTab: React.FC<ConfigTabProps> = ({
  configDraft,
  setConfigDraft,
  onUpdateConfig,
}) => {
  return (
    <div className="max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700 bg-white/[0.02] border border-white/5 p-16 rounded-[64px] space-y-12">
      <div className="space-y-6">
        <label className="text-[10px] font-black uppercase text-slate-500 tracking-[0.3em] px-2">
          Master Identity Protocol
        </label>
        <input
          type="text"
          value={configDraft.platformName || ''}
          onChange={e => setConfigDraft({ ...configDraft, platformName: e.target.value })}
          className="w-full bg-[#0a0c10] border border-white/10 rounded-[32px] px-10 py-6 text-white font-black text-2xl outline-none focus:border-indigo-500 shadow-2xl transition-all"
        />
      </div>

      <div className="grid grid-cols-1 gap-4">
        {[
          {
            label: 'Global MFA Enforcement',
            desc: 'Secure every clinical node with multi-factor biometric auth.',
            key: 'globalMfaEnabled',
          },
          {
            label: 'Cloud Maintenance Mode',
            desc: 'Gracefully pause all public-facing endpoints for updates.',
            key: 'maintenanceMode',
          },
        ].map(toggle => (
          <div
            key={toggle.key}
            className="flex items-center justify-between p-8 bg-white/5 border border-white/5 rounded-[32px] hover:bg-white/[0.08] transition-all"
          >
            <div className="max-w-[70%]">
              <p className="text-lg font-black text-white leading-tight">{toggle.label}</p>
              <p className="text-xs text-slate-500 mt-1 font-medium">{toggle.desc}</p>
            </div>
            <button
              onClick={() =>
                setConfigDraft({ ...configDraft, [toggle.key]: !configDraft[toggle.key] })
              }
              className={`w-16 h-9 rounded-full transition-all relative p-1 ${
                configDraft[toggle.key] ? 'bg-indigo-600' : 'bg-slate-800'
              }`}
            >
              <div
                className={`w-7 h-7 rounded-full bg-white shadow-lg transition-all transform ${
                  configDraft[toggle.key] ? 'translate-x-7' : 'translate-x-0'
                }`}
              ></div>
            </button>
          </div>
        ))}
      </div>

      <button
        onClick={() => onUpdateConfig(configDraft)}
        className="w-full py-8 bg-indigo-600 hover:bg-indigo-500 text-white rounded-[32px] font-black text-lg shadow-[0_20px_40px_rgba(99,102,241,0.3)] transition-all hover:scale-[1.02] active:scale-95"
      >
        Synchronize Global Parameters
      </button>
    </div>
  );
};
