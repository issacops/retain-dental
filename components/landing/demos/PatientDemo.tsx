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
    // We need to trick the component into setting the initial tab if it doesn't support a prop for it.
    // However, MobilePatientView uses internal state `useState('HOME')`.
    // We cannot easily override it without modifying MobilePatientView.
    // For now, we will render it as is. If we need specific tabs (like Wallet),
    // we might need to refactor MobilePatientView to accept `defaultTab` prop.
    // Let's check MobilePatientView code again. (Step 78) - It has `useState<'HOME' ...>('HOME')`.
    // It does NOT accept a default tab prop.

    // DECISION: I will MODIFY MobilePatientView to accept `defaultTab` prop.
    // But first, let's just create this wrapper.

    return (
        <div className="w-full h-full bg-slate-950 text-slate-900 overflow-hidden rounded-[2.5rem]">
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
            />
        </div>
    );
};

export default PatientDemo;
