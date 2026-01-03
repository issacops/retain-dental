import React from 'react';
import DesktopDoctorView from '../components/Doctor/DesktopDoctorView';
import { AppState } from '../types';

interface Props {
    data: AppState;
    // fast-track props passing
    [key: string]: any;
}

import { MockBackendService } from '../services/mockBackend';

export const ClinicPage: React.FC<Props> = (props) => {
    const { data, clinic, ...handlers } = props;

    if (!clinic) return <div className="text-white p-10">Clinic Not Found</div>;

    // Re-instantiate service for the view (lightweight)
    const backendService = new MockBackendService(
        data.clinics, data.users, data.wallets, data.transactions, data.familyGroups, data.carePlans, data.appointments
    );

    return (
        <div className="h-screen w-full bg-slate-950">
            <DesktopDoctorView
                currentUser={data.currentUser!}
                allUsers={data.users}
                wallets={data.wallets}
                transactions={data.transactions}
                familyGroups={data.familyGroups}
                carePlans={data.carePlans}
                clinic={clinic}
                backendService={backendService}
                appointments={data.appointments}
                {...handlers}
            />
        </div>
    );
};
