import React, { useState, useEffect } from 'react';
import MobilePatientView from '../components/Patient/MobilePatientView';
import UnboxingFlow from '../components/Patient/subcomponents/UnboxingFlow';
import { AppState } from '../types';

interface Props {
    data: AppState;
    // fast-track props passing
    [key: string]: any;
}

export const PatientPage: React.FC<any> = (props) => {
    const [showOnboarding, setShowOnboarding] = useState(false);

    useEffect(() => {
        if (props.currentUser) {
            const hasOnboarded = localStorage.getItem(`retend_onboarded_${props.currentUser.id}`);
            if (!hasOnboarded) {
                setShowOnboarding(true);
            }
        }
    }, [props.currentUser]);

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
        <div className="h-[100dvh] w-full bg-slate-950 overflow-y-auto overflow-x-hidden relative">
            {showOnboarding && (
                <UnboxingFlow
                    clinic={props.clinic}
                    user={props.currentUser}
                    onComplete={() => setShowOnboarding(false)}
                />
            )}
            <MobilePatientView {...props} />
        </div>
    );
};
