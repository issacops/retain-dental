import React from 'react';
import PatientApp, { PatientTab } from '../components/PatientApp/PatientApp';
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

// Legacy tab names → the new four-tab model
const LEGACY_TAB: Record<string, PatientTab> = {
    HOME: 'TODAY',
    WALLET: 'REWARDS',
    CARE: 'CARE',
    PROFILE: 'YOU',
    TODAY: 'TODAY',
    REWARDS: 'REWARDS',
    YOU: 'YOU',
};

export const PatientPage: React.FC<Props> = (props) => {
    const effectiveUser = props.currentUser || MOCK_PATIENT;
    const effectiveClinic = props.clinic || MOCK_CLINIC;
    const defaultTab: PatientTab = LEGACY_TAB[props.defaultTab] || 'TODAY';

    return (
        <div className="min-h-[100dvh] w-full bg-cream-200">
            <PatientApp
                currentUser={effectiveUser}
                clinic={effectiveClinic}
                users={props.users || [effectiveUser]}
                wallets={props.wallets || []}
                transactions={props.transactions || []}
                carePlans={props.carePlans || []}
                familyGroups={props.familyGroups || []}
                appointments={props.appointments || []}
                defaultTab={defaultTab}
                onToggleChecklistItem={props.onToggleChecklistItem || (() => {})}
                onUpdateCarePlan={props.onUpdateCarePlan}
                onSchedule={props.onSchedule || (async () => ({ success: true }))}
                onAddFamilyMember={props.onAddFamilyMember || (async () => ({}))}
                onSwitchProfile={props.onSwitchProfile || (() => {})}
                onRedeem={props.onRedeem || (async () => ({}))}
                onLinkFamily={props.onLinkFamily || (async () => ({}))}
                onGetNotifications={props.onGetNotifications}
                onMarkNotificationRead={props.onMarkNotificationRead}
                onSavePushSubscription={props.onSavePushSubscription}
                onDeletePushSubscription={props.onDeletePushSubscription}
                onUpdateMetadata={props.onUpdateMetadata}
            />
        </div>
    );
};
