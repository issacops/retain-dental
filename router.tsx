import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { PlatformPage } from './pages/PlatformPage';
import { ClinicPage } from './pages/ClinicPage';
import { PatientPage } from './pages/PatientPage';
import { AppState, Role } from './types';

// Dev Mode: No Auth Required
// We trust the App.tsx role switcher to handle the context

import { IBackendService } from './services/IBackendService';

interface RouterProps {
    appState: AppState;
    handlers: any;
    backendService: IBackendService;
}

backendService: IBackendService;
}

// Fallback for empty state (prevents crashes when no clinics exist yet)
const SAFE_CLINIC_FALLBACK: any = {
    id: 'fallback',
    name: 'Loading...',
    slug: 'loading',
    primaryColor: '#6366f1',
    themeTexture: 'minimal',
    adminUserId: 'system',
    createdAt: new Date().toISOString()
};

export const AppRouter: React.FC<RouterProps> = ({ appState, handlers, backendService }) => {
    const activeClinic = appState.clinics.find(c => c.id === appState.activeClinicId) || appState.clinics[0] || SAFE_CLINIC_FALLBACK;
    return (
        <Routes>
            {/* Auto-redirect Login to Platform in Dev Mode */}
            <Route path="/login" element={<Navigate to="/platform" replace />} />

            {/* SUPER ADMIN PORTAL - Unprotected */}
            <Route path="/platform" element={
                <PlatformPage
                    data={appState}
                    onNavigate={() => { }}
                    {...handlers}
                />
            } />

            {/* DOCTOR / CLINIC OS - Unprotected */}
            <Route path="/doctor" element={
                <ClinicPage
                    data={appState}
                    clinic={activeClinic}
                    backendService={backendService}
                    {...handlers}
                />
            } />

            {/* PATIENT APP - Unprotected */}
            <Route path="/patient" element={
                <PatientPage
                    currentUser={appState.currentUser}
                    users={appState.users}
                    wallets={appState.wallets}
                    transactions={appState.transactions}
                    carePlans={appState.carePlans}
                    clinic={activeClinic}
                    onToggleChecklistItem={handlers.onToggleChecklistItem}
                    onSchedule={handlers.onSchedule}
                    onAddFamilyMember={handlers.onAddFamilyMember}
                    onSwitchProfile={handlers.onSwitchProfile}
                    onRedeem={handlers.onRedeem}
                />
            } />

            {/* ROOT REDIRECT - Default to Platform */}
            <Route path="/" element={<Navigate to="/platform" replace />} />
        </Routes>
    );
};
