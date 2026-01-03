import React from 'react';
import MobilePatientView from '../components/Patient/MobilePatientView';
import { AppState } from '../types';

interface Props {
    data: AppState;
    // fast-track props passing
    [key: string]: any;
}

export const PatientPage: React.FC<Props> = (props) => {
    return (
        <div className="h-screen w-full bg-slate-950">
            <MobilePatientView {...props} />
        </div>
    );
};
