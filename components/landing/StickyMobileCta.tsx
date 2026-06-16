import React, { useEffect, useState } from 'react';
import { ArrowRight, X } from 'lucide-react';

const StickyMobileCta: React.FC<{ onJoinWaitlist: () => void }> = ({ onJoinWaitlist }) => {
    const [visible, setVisible] = useState(false);
    const [dismissed, setDismissed] = useState(false);

    useEffect(() => {
        if (dismissed) return;
        const handleScroll = () => {
            setVisible(window.scrollY > 600);
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();
        return () => window.removeEventListener('scroll', handleScroll);
    }, [dismissed]);

    if (dismissed) return null;

    return (
        <div
            className={`fixed bottom-0 left-0 right-0 z-40 md:hidden transition-transform duration-300 ${visible ? 'translate-y-0' : 'translate-y-full'}`}
        >
            <div className="bg-white border-t border-slate-200 shadow-2xl shadow-slate-900/20 px-4 py-3 flex items-center gap-2">
                <button
                    onClick={onJoinWaitlist}
                    className="flex-1 px-4 py-3 bg-teal-600 text-white rounded-full font-bold text-sm flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-transform"
                >
                    Get Early Access <ArrowRight size={14} />
                </button>
                <a
                    href="/login"
                    className="px-4 py-3 bg-slate-100 text-slate-700 rounded-full font-bold text-sm active:scale-95 transition-transform"
                >
                    Free Trial
                </a>
                <button
                    onClick={() => setDismissed(true)}
                    className="p-2 text-slate-400 hover:text-slate-600"
                    aria-label="Dismiss"
                >
                    <X size={18} />
                </button>
            </div>
        </div>
    );
};

export default StickyMobileCta;
