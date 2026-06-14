import React from 'react';
import { motion } from 'framer-motion';

interface FeatureSectionProps {
    title: string;
    subtitle: string;
    description: string;
    badge?: string;
    align?: 'left' | 'right';
    children: React.ReactNode;
}

const FeatureSection: React.FC<FeatureSectionProps> = ({ title, subtitle, description, badge, align = 'left', children }) => {
    return (
        <section className="py-32 relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className={`flex flex-col md:flex-row items-center gap-16 ${align === 'right' ? 'md:flex-row-reverse' : ''}`}>

                    {/* Text Content */}
                    <div className="flex-1 space-y-8">
                        {badge && (
                            <span className="px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-full text-xs font-black uppercase tracking-widest">
                                {badge}
                            </span>
                        )}
                        <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter leading-[1.1]">
                            {title}
                            <span className="block text-slate-500 mt-2">{subtitle}</span>
                        </h2>
                        <p className="text-lg text-slate-400 font-medium leading-relaxed max-w-lg">
                            {description}
                        </p>
                    </div>

                    {/* Visual Content */}
                    <div className="flex-1 w-full flex justify-center perspective-[2000px]">
                        {children}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default FeatureSection;
