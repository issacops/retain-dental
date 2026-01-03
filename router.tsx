import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { PlatformPage } from './pages/PlatformPage';
import { ClinicPage } from './pages/ClinicPage';
import { PatientPage } from './pages/PatientPage';
import { AppState, Role } from './types';

// Dev Mode: No Auth Required
// We trust the App.tsx role switcher to handle the context

interface RouterProps {
    appState: AppState;
    handlers: any;
}

export const AppRouter: React.FC<RouterProps> = ({ appState, handlers }) => {
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
                    clinic={appState.clinics.find(c => c.id === appState.activeClinicId)}
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
                    clinic={appState.clinics.find(c => c.id === appState.activeClinicId)!}
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
