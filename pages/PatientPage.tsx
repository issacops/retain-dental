import React from 'react';
import MobilePatientView from '../components/Patient/MobilePatientView';
import { AppState } from '../types';

interface Props {
    data: AppState;
    // fast-track props passing
    [key: string]: any;
}

export const PatientPage: React.FC<any> = (props) => {
    if (!props.currentUser || !props.clinic) {
        return (
            <div className="h-screen w-full bg-slate-950 flex items-center justify-center">
                <div className="text-white text-opacity-50 animate-pulse font-bold tracking-widest uppercase text-xs">
                    Loading Identity...
                </div>
            </div>
        );
    }

    return (
        <div className="h-screen w-full bg-slate-950">
            <MobilePatientView {...props} />
        </div>
    );
};
