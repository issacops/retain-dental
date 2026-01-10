export { }; // Ensure module
import React from 'react';
import DesktopDoctorView from '../../Doctor/DesktopDoctorView';
import {
    MOCK_USER, MOCK_ALL_USERS, MOCK_WALLET, MOCK_TRANSACTIONS,
    MOCK_CARE_PLAN, MOCK_CLINIC, MOCK_FAMILY_GROUPS, MOCK_APPOINTMENTS, mockBackendService
} from './MockDemoData';

const ClinicDemo: React.FC = () => {
    return (
        <div className="w-full h-full bg-slate-900 rounded-2xl overflow-hidden relative border border-slate-800 shadow-2xl">
            {/* 
               We render the full desktop view at a fixed large resolution (e.g. 1440x900)
               and scale it down to fit the container using CSS transform.
            */}
            <div className="absolute top-0 left-0 origin-top-left w-[1400px] h-[900px]" style={{ transform: 'scale(0.45)' }}>
                <DesktopDoctorView
                    currentUser={MOCK_USER}
                    allUsers={MOCK_ALL_USERS}
                    wallets={[MOCK_WALLET]}
                    transactions={MOCK_TRANSACTIONS}
                    carePlans={[MOCK_CARE_PLAN]}
                    familyGroups={MOCK_FAMILY_GROUPS}
                    clinic={MOCK_CLINIC}
                    appointments={MOCK_APPOINTMENTS}
                    backendService={mockBackendService}
                    onProcessTransaction={mockBackendService.processTransaction}
                    onUpdateCarePlan={mockBackendService.updateCarePlan}
                    onLinkFamily={mockBackendService.linkFamilyMember}
                    onAddPatient={mockBackendService.addPatient}
                    onAssignPlan={mockBackendService.assignCarePlan}
                    onSchedule={mockBackendService.scheduleAppointment}
                    onUpdateAppointmentStatus={mockBackendService.updateAppointmentStatus}
                    onToggleChecklistItem={mockBackendService.toggleChecklistItem}
                    onDeletePatient={mockBackendService.deletePatient}
                />
            </div>

            {/* Overlay to prevent interaction if desired, or let it be interactive? 
                User said "mockups... from actual platform". Interactive is cooler.
                But scaling might mess up hit targets. I'll leave it interactive but maybe add `pointer-events-none` if it feels janky.
                For now, interactive.
            */}
        </div>
    );
};

export default ClinicDemo;
