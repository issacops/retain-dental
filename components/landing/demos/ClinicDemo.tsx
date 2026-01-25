import React from 'react';
import { LandingDoctorView } from './visuals/LandingDoctorView';

const ClinicDemo: React.FC = () => {
    return (
        <div className="w-full h-full bg-slate-50 rounded-2xl overflow-hidden relative border border-slate-200 shadow-2xl group cursor-default">
            {/* 
               Render the Visual Mockup at a fixed scale
            */}
            <div className="absolute top-1/2 left-1/2 origin-center w-[1200px] h-[800px] -translate-x-1/2 -translate-y-1/2 transition-transform duration-700 group-hover:scale-[0.46]" style={{ transform: 'translate(-50%, -50%) scale(0.45)' }}>
                <LandingDoctorView />
            </div>

            {/* Overlay for interaction prevention if needed, but 'group-hover' implies we want some effect */}
            <div className="absolute inset-0 pointer-events-none border-[6px] border-slate-900/5 rounded-2xl"></div>
        </div>
    );
};

export default ClinicDemo;
