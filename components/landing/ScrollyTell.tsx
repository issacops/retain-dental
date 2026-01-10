import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring, useInView } from 'framer-motion';

interface Pillar {
    id: string;
    title: string;
    subtitle: string;
    description: string;
    features: { icon: React.ReactNode; label: string; desc: string }[];
    visual: React.ReactNode;
}

interface ScrollyTellProps {
    pillars: Pillar[];
}

const ScrollyTell: React.FC<ScrollyTellProps> = ({ pillars }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [activeStep, setActiveStep] = useState(0);

    // Track scroll progress for the whole section
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    return (
        <div ref={containerRef} className="relative bg-slate-950">
            {pillars.map((pillar, index) => (
                // CHANGED: Increased min-h from 150vh to 180vh for more breathing room
                // CHANGED: Added pb-32 on mobile to separate sections
                <div key={pillar.id} className="relative min-h-[180vh] flex flex-col lg:flex-row pb-32 lg:pb-0 border-b lg:border-none border-white/5 last:border-none">

                    {/* LEFT: Content (Scrolls) */}
                    {/* CHANGED: Padded heavily (p-32 on desktop) */}
                    {/* CHANGED: Mobile padding increased to p-8 */}
                    <div className="w-full lg:w-1/2 p-8 py-24 lg:p-32 flex items-center z-10 pointer-events-none">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            viewport={{ margin: "-10% 0px -10% 0px", once: true }}
                            className="space-y-10 max-w-xl pointer-events-auto"
                        >
                            <div className="flex items-center gap-4">
                                <span className="w-16 h-[1px] bg-indigo-500/50"></span>
                                <span className="text-indigo-400 font-bold tracking-[0.3em] uppercase text-xs">
                                    {pillar.subtitle}
                                </span>
                            </div>

                            <h2 className="text-5xl md:text-8xl font-black text-white tracking-tighter leading-[0.9]">
                                {pillar.title}
                            </h2>

                            <p className="text-xl md:text-2xl text-slate-400 font-medium leading-relaxed max-w-lg">
                                {pillar.description}
                            </p>

                            <div className="grid gap-8 pt-12">
                                {pillar.features.map((feat, i) => (
                                    <div key={i} className="flex gap-6 items-start group">
                                        <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 group-hover:border-indigo-500/50 group-hover:bg-indigo-500/10 transition-colors flex items-center justify-center shrink-0 text-indigo-400">
                                            {feat.icon}
                                        </div>
                                        <div>
                                            <h4 className="text-white font-bold text-xl mb-1">{feat.label}</h4>
                                            <p className="text-slate-500 text-sm leading-relaxed">{feat.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </div>

                    {/* RIGHT: Visual (Sticky) */}
                    {/* CHANGED: Sticky alignment tweaks for mobile */}
                    {/* CHANGED: h-[60vh] on mobile to give it significance */}
                    <div className="w-full lg:w-1/2 h-[60vh] lg:h-screen sticky top-0 lg:top-0 flex items-center justify-center p-6 lg:p-24 bg-gradient-to-b from-slate-900/0 to-slate-900/20 lg:bg-transparent overflow-hidden">
                        <div className="relative w-full h-full max-w-2xl max-h-[800px] flex items-center justify-center">
                            {/* Background Glow */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[140%] bg-indigo-600/5 blur-[100px] rounded-full"></div>

                            <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                                transition={{ duration: 1, ease: "easeOut" }}
                                viewport={{ margin: "-10% 0px -10% 0px", once: true }}
                                className="relative z-10 w-full"
                            >
                                {pillar.visual}
                            </motion.div>
                        </div>
                    </div>

                </div>
            ))}
        </div>
    );
};

export default ScrollyTell;
