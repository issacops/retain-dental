import React from 'react';
import DesktopDoctorView from '../components/Doctor/DesktopDoctorView';
import { AppState } from '../types';

import { IBackendService } from '../services/IBackendService';

interface Props {
    data: AppState;
    backendService: IBackendService;
    // fast-track props passing
    [key: string]: any;
}

export const ClinicPage: React.FC<Props> = (props) => {
    const { data, clinic, backendService, ...handlers } = props;

    if (!clinic) return <div className="text-white p-10">Clinic Not Found</div>;

    return (
        <div className="h-screen w-full bg-slate-950">
            <DesktopDoctorView
                currentUser={data.currentUser!}
                allUsers={data.users}
                wallets={data.wallets}
                transactions={data.transactions}
                familyGroups={data.familyGroups}
                carePlans={data.carePlans}
                clinic={clinic} // Clinic object has logoUrl
                backendService={backendService}
                appointments={data.appointments}
                {...handlers}
            />
        </div>
    );
};
