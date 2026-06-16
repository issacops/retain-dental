import React, { useState, useEffect } from 'react';
import MobilePatientView from '../components/Patient/MobilePatientView';
import UnboxingFlow from '../components/Patient/subcomponents/UnboxingFlow';
import { User, Clinic, Tier } from '../types';

interface Props {
    data: any;
    [key: string]: any;
}

const MOCK_PATIENT: User = {
    id: 'demo-patient',
    name: 'Rahul Kumar',
    mobile: '9999999999',
    role: 'PATIENT' as any,
    clinicId: 'demo-clinic',
    currentTier: Tier.GOLD,
    lifetimeSpend: 45000,
    joinedAt: new Date().toISOString(),
    metadata: {}
};

const MOCK_CLINIC: Clinic = {
    id: 'demo-clinic',
    name: 'Demo Dental Care',
    primaryColor: '#0d9488',
    slug: 'demo',
    themeTexture: 'minimal',
    subscriptionTier: 'PRO',
    adminUserId: 'system',
    ownerName: 'Dr. Demo',
    createdAt: new Date().toISOString(),
    loyaltyConfig: { defaultRate: 10, categoryRates: {}, redemptionRate: 1 }
};

export const PatientPage: React.FC<Props> = (props) => {
    const [showOnboarding, setShowOnboarding] = useState(false);
    const effectiveUser = props.currentUser || MOCK_PATIENT;
    const effectiveClinic = props.clinic || MOCK_CLINIC;

    useEffect(() => {
        const hasOnboarded = localStorage.getItem(`retend_onboarded_${effectiveUser.id}`);
        if (!hasOnboarded) {
            setShowOnboarding(true);
        }
    }, [effectiveUser.id]);

    return (
        <div className="h-[100dvh] w-full bg-[#fdf8f0] overflow-y-auto overflow-x-hidden relative">
            {showOnboarding && (
                <UnboxingFlow
                    clinic={effectiveClinic}
                    user={effectiveUser}
                    onComplete={() => setShowOnboarding(false)}
                />
            )}
            <MobilePatientView
                currentUser={effectiveUser}
                clinic={effectiveClinic}
                users={props.users || [effectiveUser]}
                wallets={props.wallets || []}
                transactions={props.transactions || []}
                carePlans={props.carePlans || []}
                familyGroups={props.familyGroups || []}
                appointments={props.appointments || []}
                onToggleChecklistItem={props.onToggleChecklistItem || (() => {})}
                onSchedule={props.onSchedule || (async () => ({ success: true }))}
                onAddFamilyMember={props.onAddFamilyMember || (async () => {})}
                onSwitchProfile={props.onSwitchProfile || (() => {})}
                onRedeem={props.onRedeem || (async () => {})}
                onLinkFamily={props.onLinkFamily || (async () => {})}
                onUpdateCarePlan={props.onUpdateCarePlan}
            />
        </div>
    );
};
