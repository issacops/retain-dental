import { useState } from 'react';

const reviews = [
  { name: 'Sarah M.', stars: 5, text: 'Best dental experience ever! The team made me feel so comfortable.', time: '2 hours ago', verified: true },
  { name: 'James L.', stars: 5, text: 'Quick, professional, and painless. Highly recommend!', time: '1 day ago', verified: true },
  { name: 'Maria G.', stars: 4, text: 'Great service and friendly staff. Will definitely be back.', time: '3 days ago', verified: false },
];

export default function FeatureReviews() {
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSend = () => {
    setSending(true);
    setTimeout(() => { setSending(false); setSent(true); }, 1500);
    setTimeout(() => setSent(false), 4000);
  };

  return (
    <div className="max-w-md mx-auto space-y-4">
      {/* Review request flow */}
      <div className="bg-white rounded-3xl p-5 border border-cream-200 shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-xl bg-teal-100 flex items-center justify-center">
            <span className="text-sm">⭐</span>
          </div>
          <div>
            <p className="text-xs font-bold text-slate-900">Automated Review Request</p>
            <p className="text-[9px] text-slate-400">Sent 7 days after visit</p>
          </div>
        </div>

        {!sent ? (
          <button
            onClick={handleSend}
            disabled={sending}
            className={`w-full py-3 rounded-2xl font-bold text-sm transition-all ${
              sending
                ? 'bg-teal-100 text-teal-600 cursor-wait'
                : 'bg-teal-600 text-white hover:bg-teal-700 hover:shadow-lg'
            }`}
          >
            {sending ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" className="opacity-25"/><path d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" fill="currentColor" className="opacity-75"/></svg>
                Sending request...
              </span>
            ) : (
              'Send Review Request'
            )}
          </button>
        ) : (
          <div className="text-center py-3">
            <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-2">
              <span className="text-emerald-600 text-lg">✓</span>
            </div>
            <p className="text-xs font-bold text-emerald-700">Request sent to patient!</p>
            <p className="text-[9px] text-slate-400 mt-0.5">They'll receive an SMS with a review link</p>
          </div>
        )}
      </div>

      {/* Recent reviews */}
      <div className="space-y-2">
        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest px-1">Recent Reviews</p>
        {reviews.map((r, i) => (
          <div key={i} className="bg-white rounded-2xl p-3.5 border border-cream-200 hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center text-white text-[8px] font-bold">
                  {r.name[0]}
                </div>
                <span className="text-xs font-bold text-slate-900">{r.name}</span>
                {r.verified && (
                  <span className="px-1.5 py-0.5 bg-emerald-50 rounded text-[7px] font-bold text-emerald-600 border border-emerald-200">VERIFIED</span>
                )}
              </div>
              <span className="text-[9px] text-slate-400">{r.time}</span>
            </div>
            <div className="flex gap-0.5 mb-1">
              {Array.from({ length: 5 }).map((_, j) => (
                <span key={j} className={`text-xs ${j < r.stars ? 'text-amber-400' : 'text-slate-200'}`}>★</span>
              ))}
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed">{r.text}</p>
          </div>
        ))}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2">
        <div className="bg-teal-50 rounded-2xl p-3 text-center border border-teal-100">
          <p className="text-lg font-black text-teal-700">3.4x</p>
          <p className="text-[8px] font-bold text-teal-600 uppercase tracking-widest">More reviews</p>
        </div>
        <div className="bg-amber-50 rounded-2xl p-3 text-center border border-amber-100">
          <p className="text-lg font-black text-amber-700">4.8</p>
          <p className="text-[8px] font-bold text-amber-600 uppercase tracking-widest">Avg rating</p>
        </div>
        <div className="bg-emerald-50 rounded-2xl p-3 text-center border border-emerald-100">
          <p className="text-lg font-black text-emerald-700">92%</p>
          <p className="text-[8px] font-bold text-emerald-600 uppercase tracking-widest">Response rate</p>
        </div>
      </div>
    </div>
  );
}
