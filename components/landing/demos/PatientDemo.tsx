import React from 'react';
import { LandingPatientView } from './visuals/LandingPatientView';

interface PatientDemoProps {
    initialTab?: 'HOME' | 'WALLET' | 'CARE' | 'PROFILE';
}

const PatientDemo: React.FC<PatientDemoProps> = ({ initialTab = 'HOME' }) => {
    return (
        <div className="w-full h-full bg-slate-950 text-white overflow-hidden rounded-[2.5rem] border-[8px] border-slate-900 shadow-2xl relative">
            {/* Mobile Status Bar (Simulated overlay) */}
            <div className="absolute top-0 left-0 w-full h-6 bg-black/20 z-20 backdrop-blur-sm"></div>

            {/* The Real Screenshot */}
            <img
                src="/assets/screens/patient-mobile.png"
                alt="RetainOS Patient App"
                className="w-full h-full object-cover object-top"
            />

            {/* Reflection Glare */}
            <div className="absolute top-0 right-0 w-full h-[300px] bg-gradient-to-bl from-white/10 to-transparent pointer-events-none rounded-tr-[2rem]"></div>
        </div>
    );
};

export default PatientDemo;
