import React from 'react';

interface DeepDiveProps {
    category: string;
    title: string;
    description: string;
    children: React.ReactNode;
    inverted?: boolean;
}

const DeepDive: React.FC<DeepDiveProps> = ({ category, title, description, children, inverted = false }) => {
    return (
        <section className="py-32 px-6 bg-slate-950 border-t border-white/5">
            <div className="max-w-7xl mx-auto">
                <div className={`flex flex-col lg:flex-row gap-16 items-center ${inverted ? 'lg:flex-row-reverse' : ''}`}>

                    {/* Copy */}
                    <div className="flex-1 space-y-6">
                        <span className="text-indigo-500 font-bold tracking-widest uppercase text-sm">{category}</span>
                        <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter leading-[1.1]">
                            {title}
                        </h2>
                        <p className="text-xl text-slate-400 leading-relaxed">
                            {description}
                        </p>

                        <div className="pt-8 grid grid-cols-2 gap-8">
                            <div>
                                <h4 className="text-white font-bold mb-2">Automated</h4>
                                <p className="text-sm text-slate-500">Zero manual input required from your staff.</p>
                            </div>
                            <div>
                                <h4 className="text-white font-bold mb-2">Medical Grade</h4>
                                <p className="text-sm text-slate-500">HIPAA compliant and clinically validated.</p>
                            </div>
                        </div>
                    </div>

                    {/* Visual */}
                    <div className="flex-1 w-full relative">
                        {/* Glow Effect */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-indigo-500/10 blur-[100px] rounded-full -z-10"></div>
                        {children}
                    </div>

                </div>
            </div>
        </section>
    );
};

export default DeepDive;
