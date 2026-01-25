import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import PatientDemo from './demos/PatientDemo';

interface Pillar {
    id: string;
    title: string;
    description: string;
    highlight: string;
}

interface ScrollyTellProps {
    pillars: Pillar[];
}

const ScrollyTell: React.FC<ScrollyTellProps> = ({ pillars }) => {
    // We map the active tab based on which pillar is in view.
    // Ideally, we'd use a sticky container and update the index based on scroll position.

    // Hardcoded logic for this specific demo flow:
    // Pillar 0 -> HOME
    // Pillar 1 -> CARE
    // Pillar 2 -> WALLET
    // Pillar 3 -> PROFILE

    // Since we can't easily pass a MotionValue to the imperative logic inside PatientDemo (which uses internal state mostly),
    // we will just render a sticky container that changes the prop based on the pillar currently intersecting top.

    // We will use a simple IntersectionObserver approach or just use the index of the map.

    // Actually, simpler: We render the PatientDemo STICKY, and we change its props based on the parent's current active section.
    // BUT, we can't lift state easily up from the map without a Context or a useTransform listener.

    // Let's use a ref for each section and a scroll listener to determine active index.

    const [activeIndex, setActiveIndex] = React.useState(0);

    return (
        <section className="relative bg-slate-50 border-t border-slate-200">
            {pillars.map((pillar, i) => (
                <PillarSection key={pillar.id} pillar={pillar} index={i} onInView={() => setActiveIndex(i)} />
            ))}

            {/* Sticky Container for Desktop - Absolute positioned relative to section? No, Fixed or Sticky. */}
            {/* The tricky part is positioning the sticky element alongside the scrolling text. */}
            {/* Let's try a different structure: One container with Sticky Right col and Scrolling Left col. */}

            <div className="hidden md:block absolute top-0 right-0 w-1/2 h-full pointer-events-none">
                <div className="sticky top-0 h-screen flex items-center justify-center p-20">
                    <PatientDemo initialTab={
                        activeIndex === 0 ? 'HOME' :
                            activeIndex === 1 ? 'CARE' :
                                activeIndex === 2 ? 'WALLET' : 'PROFILE'
                    } />
                </div>
            </div>
        </section>
    );
};

// Helper component to detect in-view
const PillarSection: React.FC<{ pillar: Pillar, index: number, onInView: () => void }> = ({ pillar, index, onInView }) => {
    const ref = useRef<HTMLDivElement>(null);
    const isInView = true; // simplified for SSR/Initial

    // Real intersection logic
    React.useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    onInView();
                }
            },
            { threshold: 0.5 }
        );
        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, [onInView]);

    return (
        <div ref={ref} className="min-h-screen flex items-center relative border-b border-slate-100 last:border-0 z-10 w-full md:w-1/2 bg-slate-50/80 backdrop-blur-sm md:bg-transparent md:backdrop-filter-none">
            <div className="max-w-xl mx-auto px-6 space-y-8 py-24">
                <span className="text-9xl font-black text-slate-200 absolute -top-10 -left-10 -z-10 select-none opacity-50">
                    0{index + 1}
                </span>
                <div className="flex items-center gap-3">
                    <div className="w-12 h-1 px-4 bg-primary-500"></div>
                    <span className="text-primary-600 font-bold tracking-widest uppercase">{pillar.highlight}</span>
                </div>
                <h2 className="text-5xl md:text-6xl font-black text-slate-900 tracking-tighter leading-none">
                    {pillar.title}
                </h2>
                <p className="text-xl text-slate-500 leading-relaxed">
                    {pillar.description}
                </p>

                {/* Mobile only demo - Static for valid context if needed, or simple image */}
                <div className="md:hidden mt-8 h-[500px] pointer-events-auto">
                    <PatientDemo initialTab={
                        index === 0 ? 'HOME' :
                            index === 1 ? 'CARE' :
                                index === 2 ? 'WALLET' : 'PROFILE'
                    } />
                </div>
            </div>
        </div>
    );
}

export default ScrollyTell;
