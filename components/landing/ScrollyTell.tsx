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
                <div key={pillar.id} className="relative min-h-[150vh] flex flex-col lg:flex-row">

                    {/* LEFT: Content (Scrolls) */}
                    <div className="w-full lg:w-1/2 p-8 lg:p-24 flex items-center z-10 pointer-events-none">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            viewport={{ margin: "-20% 0px -20% 0px" }}
                            className="space-y-8 max-w-xl pointer-events-auto"
                        >
                            <div className="flex items-center gap-3">
                                <span className="w-12 h-[1px] bg-indigo-500"></span>
                                <span className="text-indigo-400 font-bold tracking-[0.2em] uppercase text-sm">
                                    {pillar.subtitle}
                                </span>
                            </div>

                            <h2 className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-none">
                                {pillar.title}
                            </h2>

                            <p className="text-xl text-slate-400 font-medium leading-relaxed">
                                {pillar.description}
                            </p>

                            <div className="grid gap-6 pt-8">
                                {pillar.features.map((feat, i) => (
                                    <div key={i} className="flex gap-4 items-start">
                                        <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 text-indigo-400">
                                            {feat.icon}
                                        </div>
                                        <div>
                                            <h4 className="text-white font-bold text-lg">{feat.label}</h4>
                                            <p className="text-slate-500 text-sm leading-relaxed">{feat.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </div>

                    {/* RIGHT: Visual (Sticky) */}
                    <div className="w-full lg:w-1/2 h-[50vh] lg:h-screen lg:sticky lg:top-0 flex items-center justify-center p-8 lg:p-24 bg-slate-900/10 lg:bg-transparent overflow-hidden">
                        <div className="relative w-full h-full max-w-2xl max-h-[800px] flex items-center justify-center">
                            {/* Background Glow */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] bg-indigo-600/10 blur-[120px] rounded-full"></div>

                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.8 }}
                                viewport={{ margin: "-20% 0px -20% 0px" }}
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
