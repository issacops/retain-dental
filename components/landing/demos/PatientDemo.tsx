import React, { useEffect, useState } from 'react';
import MobilePatientView from '../../Patient/MobilePatientView';
import {
    MOCK_USER, MOCK_ALL_USERS, MOCK_WALLET, MOCK_TRANSACTIONS,
    MOCK_CARE_PLAN, MOCK_CLINIC, MOCK_FAMILY_GROUPS, mockBackendService
} from './MockDemoData';
import { AppointmentType } from '../../../types';

interface PatientDemoProps {
    initialTab?: 'HOME' | 'WALLET' | 'CARE' | 'PROFILE';
}

const PatientDemo: React.FC<PatientDemoProps> = ({ initialTab = 'HOME' }) => {
    return (
        <div className="w-full h-full bg-slate-50 text-slate-900 overflow-hidden rounded-[2.5rem] border-4 border-slate-900 shadow-2xl relative">
            {/* Status Bar Mock */}
            <div className="absolute top-4 left-0 w-full px-8 flex justify-between items-center z-20 text-xs font-bold text-slate-900">
                <span>9:41</span>
                <div className="flex gap-2">
                    <div className="w-4 h-4 bg-slate-900 rounded-full opacity-20"></div>
                    <div className="w-4 h-4 bg-slate-900 rounded-full opacity-20"></div>
                </div>
            </div>

            <MobilePatientView
                currentUser={MOCK_USER}
                users={MOCK_ALL_USERS}
                wallets={[MOCK_WALLET]}
                transactions={MOCK_TRANSACTIONS}
                carePlans={[MOCK_CARE_PLAN]}
                familyGroups={MOCK_FAMILY_GROUPS}
                clinic={MOCK_CLINIC}
                appointments={[
                    {
                        id: 'apt1',
                        clinicId: MOCK_CLINIC.id,
                        patientId: MOCK_USER.id,
                        startTime: new Date(Date.now() + 86400000).toISOString(),
                        endTime: new Date(Date.now() + 90000000).toISOString(),
                        status: 'CONFIRMED' as any,
                        type: 'CHECKUP' as any,
                        createdAt: new Date().toISOString()
                    }
                ]}
                onToggleChecklistItem={mockBackendService.toggleChecklistItem}
                onSchedule={mockBackendService.scheduleAppointment}
                onAddFamilyMember={mockBackendService.addFamilyMember}
                onSwitchProfile={() => { }}
                onRedeem={mockBackendService.processTransaction}
                defaultTab={initialTab} // Passed Prop
            />
        </div>
    );
};

export default PatientDemo;
