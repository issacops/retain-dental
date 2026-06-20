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
      <span className="inline-block px-2.5 py-0.5 rounded-full bg-violet-600/15 text-violet-400 text-[9px] font-semibold uppercase tracking-widest border border-violet-600/20">Coming Soon</span>
      {/* Review request flow */}
      <div className="bg-ink-900 rounded p-5 border border-ink-border shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded bg-ink-800 flex items-center justify-center">
            <svg className="w-4 h-4 text-amber-400" viewBox="0 0 20 20" fill="currentColor"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
          </div>
          <div>
            <p className="text-xs font-semibold text-onDark-100">Automated Review Request</p>
            <p className="text-[9px] text-onDark-500">Sent 7 days after visit</p>
          </div>
        </div>

        {!sent ? (
          <button
            onClick={handleSend}
            disabled={sending}
            className={`w-full py-3 rounded font-semibold text-sm transition-all ${
              sending
                ? 'bg-ink-800 text-violet-600 cursor-wait'
                : 'bg-violet-600 text-white hover:bg-violet-400 hover:shadow-lg hover:shadow-violet-600/20'
            }`}
          >
            {sending ? (
              <span className="flex items-center justify-center gap-2 cursor-wait">
                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" className="opacity-25"/><path d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" fill="currentColor" className="opacity-75"/></svg>
                Sending request...
              </span>
            ) : (
              'Send Review Request'
            )}
          </button>
        ) : (
          <div className="text-center py-3">
            <div className="w-10 h-10 rounded bg-violet-600/20 flex items-center justify-center mx-auto mb-2">
              <span className="text-violet-400 text-lg">✓</span>
            </div>
            <p className="text-xs font-semibold text-violet-400">Request sent to patient!</p>
            <p className="text-[9px] text-onDark-500 mt-0.5">They'll receive an SMS with a review link</p>
          </div>
        )}
      </div>

      {/* Recent reviews */}
      <div className="space-y-2">
        <p className="text-[9px] font-semibold text-onDark-500 uppercase tracking-widest px-1">Recent Reviews</p>
        {reviews.map((r, i) => (
          <div key={i} className="bg-ink-900 rounded p-3.5 border border-ink-border hover:shadow-md transition-all cursor-pointer">
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-violet-600 flex items-center justify-center text-white text-[8px] font-semibold">
                  {r.name[0]}
                </div>
                <span className="text-xs font-semibold text-onDark-100">{r.name}</span>
                {r.verified && (
                  <span className="px-1.5 py-0.5 bg-violet-600/10 rounded text-[7px] font-semibold text-violet-400 border border-violet-600/20">VERIFIED</span>
                )}
              </div>
              <span className="text-[9px] text-onDark-500">{r.time}</span>
            </div>
            <div className="flex gap-0.5 mb-1">
              {Array.from({ length: 5 }).map((_, j) => (
                <span key={j} className={`text-xs ${j < r.stars ? 'text-violet-400' : 'text-onDark-500'}`}>★</span>
              ))}
            </div>
            <p className="text-[11px] text-onDark-500 leading-relaxed">{r.text}</p>
          </div>
        ))}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2">
        <div className="bg-ink-800 rounded p-3 text-center border border-ink-border">
          <p className="text-lg font-semibold text-violet-400">3.4x</p>
          <p className="text-[8px] font-semibold text-violet-400 uppercase tracking-widest">More reviews</p>
        </div>
        <div className="bg-ink-800 rounded p-3 text-center border border-ink-border">
          <p className="text-lg font-semibold text-violet-400">4.8</p>
          <p className="text-[8px] font-semibold text-violet-400 uppercase tracking-widest">Avg rating</p>
        </div>
        <div className="bg-ink-800 rounded p-3 text-center border border-violet-600/20">
          <p className="text-lg font-semibold text-violet-400">92%</p>
          <p className="text-[8px] font-semibold text-violet-400 uppercase tracking-widest">Response rate</p>
        </div>
      </div>
    </div>
  );
}
