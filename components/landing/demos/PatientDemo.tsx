import React from 'react';
import { LandingPatientView } from './visuals/LandingPatientView';

interface PatientDemoProps {
    initialTab?: 'HOME' | 'WALLET' | 'CARE' | 'PROFILE';
}

const PatientDemo: React.FC<PatientDemoProps> = ({ initialTab = 'HOME' }) => {
    return (
        <div className="w-full h-full bg-slate-50 text-slate-900 overflow-hidden rounded-[2.5rem] border-4 border-slate-900 shadow-2xl relative">
            {/* Status Bar Mock */}
            <div className="absolute top-6 left-0 w-full px-8 flex justify-between items-center z-20 text-xs font-bold text-slate-900 pointer-events-none">
                <span>9:41</span>
                <div className="flex gap-2">
                    <div className="w-4 h-4 bg-slate-900 rounded-full opacity-20"></div>
                    <div className="w-4 h-4 bg-slate-900 rounded-full opacity-20"></div>
                </div>
            </div>

            <LandingPatientView initialTab={initialTab} />
        </div>
    );
};

export default PatientDemo;
