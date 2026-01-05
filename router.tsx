import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { PlatformPage } from './pages/PlatformPage';
import { ClinicPage } from './pages/ClinicPage';
import { PatientPage } from './pages/PatientPage';
import { AppState, Role } from './types';
import { LoginPage } from './pages/LoginPage';
import { IBackendService } from './services/IBackendService';

interface RouterProps {
    appState: AppState;
    handlers: any;
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
            {/* PUBLIC: UNIFIED LOGIN & BRANDED LOGIN */}
            <Route path="/login" element={<LoginPage clinics={appState.clinics} activeClinic={activeClinic} />} />
            <Route path="/login/:slug" element={<LoginPage clinics={appState.clinics} activeClinic={activeClinic} />} />

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
                    onUpdateCarePlan={handlers.onUpdateCarePlan}
                    onToggleChecklistItem={handlers.onToggleChecklistItem}
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
                    onUpdateCarePlan={handlers.onUpdateCarePlan}
                    onSchedule={handlers.onSchedule}
                    onAddFamilyMember={handlers.onAddFamilyMember}
                    onSwitchProfile={handlers.onSwitchProfile}
                    onRedeem={handlers.onRedeem}
                />
            } />

            {/* ROOT REDIRECT - Default to Platform */}
            <Route path="/auth/callback" element={<Navigate to="/" replace />} />
            <Route path="/" element={<Navigate to="/platform" replace />} />
        </Routes>
    );
};
