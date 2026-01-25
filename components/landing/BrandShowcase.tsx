import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Palette, Globe, Layers } from 'lucide-react';
import PhoneMockup from './PhoneMockup';

// Define the Theme Types
type Theme = 'luxury' | 'professional' | 'boutique';

const themes = {
    luxury: {
        id: 'luxury',
        name: 'The Elite',
        primary: 'bg-amber-500',
        text: 'text-amber-500',
        bg: 'bg-slate-950',
        card: 'bg-slate-900',
        accent: 'border-amber-500/50',
        font: 'font-serif' // Mock font class
    },
    professional: {
        id: 'professional',
        name: 'The Clinical',
        primary: 'bg-blue-600',
        text: 'text-blue-600',
        bg: 'bg-white',
        card: 'bg-slate-50',
        accent: 'border-blue-200',
        font: 'font-sans'
    },
    boutique: {
        id: 'boutique',
        name: 'The Boutique',
        primary: 'bg-rose-400',
        text: 'text-rose-400',
        bg: 'bg-stone-50',
        card: 'bg-white',
        accent: 'border-rose-200',
        font: 'font-sans'
    }
};

const BrandShowcase = () => {
    const [activeTheme, setActiveTheme] = useState<Theme>('luxury');

    const current = themes[activeTheme];

    return (
        <section className="py-32 bg-slate-900 relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className={`absolute -top-[20%] -right-[10%] w-[50%] h-[50%] rounded-full blur-[120px] opacity-20 transition-colors duration-1000 ${current.primary}`}></div>
                <div className={`absolute -bottom-[20%] -left-[10%] w-[50%] h-[50%] rounded-full blur-[120px] opacity-20 transition-colors duration-1000 ${current.primary}`}></div>
            </div>

            <div className="max-w-7xl mx-auto px-6 relative z-10 flex flex-col md:flex-row items-center gap-16">

                {/* Text Content */}
                <div className="flex-1 space-y-8">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/60 text-xs font-bold uppercase tracking-widest mb-6">
                            <Palette size={14} /> White Label Engine
                        </div>
                        <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter leading-tight mb-6">
                            Unapologetically <br />
                            <span className={`transition-colors duration-500 ${current.text}`}>Yours.</span>
                        </h2>
                        <p className="text-lg text-slate-400 max-w-xl">
                            We don't just put your logo in the corner. We re-engineer the entire interface to match your brand identity.
                            To your patients, RetainOS doesn't exist. Only <b>You</b> exist.
                        </p>
                    </div>

                    {/* Theme Toggles */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {(Object.keys(themes) as Theme[]).map((themeKey) => (
                            <button
                                key={themeKey}
                                onClick={() => setActiveTheme(themeKey)}
                                className={`p-4 rounded-xl border text-left transition-all duration-300 ${activeTheme === themeKey
                                    ? `bg-white/10 ${themes[themeKey].accent} ring-2 ring-offset-2 ring-offset-slate-900 ${themes[themeKey].text.replace('text', 'ring')}`
                                    : 'bg-white/5 border-white/5 hover:bg-white/10 text-slate-400'
                                    }`}
                            >
                                <div className={`w-8 h-8 rounded-full mb-3 ${themes[themeKey].primary}`}></div>
                                <div className="font-bold text-white text-sm">{themes[themeKey].name}</div>
                                <div className="text-[10px] opacity-60 mt-1 uppercase tracking-wider">
                                    {themeKey === 'luxury' ? 'Dark Mode' : themeKey === 'professional' ? 'Medical' : 'Soft'}
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Visual: The Chameleon Phone */}
                <div className="flex-1 w-full max-w-md mx-auto relative">
                    <motion.div
                        key={activeTheme}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        <PhoneMockup className="shadow-2xl">
                            <div className={`w-full h-full flex flex-col ${current.bg} transition-colors duration-500`}>
                                {/* Header */}
                                <div className={`h-32 p-6 flex flex-col justify-end ${current.font}`}>
                                    <div className={`text-xs font-bold uppercase tracking-widest opacity-50 mb-1 ${activeTheme === 'luxury' ? 'text-white' : 'text-slate-900'}`}>
                                        Welcome to
                                    </div>
                                    <div className={`text-2xl font-black ${activeTheme === 'luxury' ? 'text-white' : 'text-slate-900'}`}>
                                        {activeTheme === 'luxury' ? 'AURORA DENTAL' : activeTheme === 'professional' ? 'SMILE CLINIC' : 'GLOW STUDIO'}
                                    </div>
                                </div>

                                {/* Body */}
                                <div className={`flex-1 rounded-t-[2.5rem] shadow-xl p-6 space-y-4 overflow-hidden relative ${current.card}`}>

                                    {/* App Card 1 */}
                                    <div className={`p-4 rounded-2xl border ${activeTheme === 'luxury' ? 'bg-white/5 border-white/10' : 'bg-slate-100 border-slate-200'} flex items-center gap-4`}>
                                        <div className={`w-12 h-12 rounded-full ${current.primary} flex items-center justify-center text-white`}>
                                            <Check size={20} />
                                        </div>
                                        <div>
                                            <div className={`font-bold ${activeTheme === 'luxury' ? 'text-white' : 'text-slate-900'}`}>Treatment Plan</div>
                                            <div className="text-xs opacity-50">On Track • Day 14</div>
                                        </div>
                                    </div>

                                    {/* App Card 2 */}
                                    <div className={`p-4 rounded-2xl border ${activeTheme === 'luxury' ? 'bg-white/5 border-white/10' : 'bg-slate-100 border-slate-200'} flex items-center gap-4`}>
                                        <div className={`w-12 h-12 rounded-full ${activeTheme === 'luxury' ? 'bg-slate-800' : 'bg-white'} flex items-center justify-center ${current.text}`}>
                                            <Globe size={20} />
                                        </div>
                                        <div>
                                            <div className={`font-bold ${activeTheme === 'luxury' ? 'text-white' : 'text-slate-900'}`}>My Points</div>
                                            <div className="text-xs opacity-50">2,450 pts available</div>
                                        </div>
                                    </div>

                                    {/* Brand Logo Watermark */}
                                    <div className="absolute bottom-8 left-0 w-full text-center opacity-10 pointer-events-none">
                                        <Layers size={64} className={`mx-auto ${current.text}`} />
                                    </div>

                                </div>
                            </div>
                        </PhoneMockup>
                    </motion.div>

                    {/* Reflection/Glow underneath */}
                    <div className={`absolute -bottom-10 left-10 right-10 h-10 blur-xl ${current.primary} opacity-40 transition-colors duration-500`}></div>
                </div>

            </div>
        </section>
    );
};

export default BrandShowcase;
