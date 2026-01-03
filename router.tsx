import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { PlatformPage } from './pages/PlatformPage';
import { ClinicPage } from './pages/ClinicPage';
import { PatientPage } from './pages/PatientPage';
import { AppState, Role } from './types';
import LoginPage from './components/Auth/LoginPage';

// TODO: Create a proper Auth Layout
const AuthLayout = ({ children }: { children: React.ReactNode }) => <>{children}</>;

interface RouterProps {
    appState: AppState;
    handlers: any;
}

interface ProtectedRouteProps {
    children: React.ReactElement;
    allowedRoles: Role[];
    currentUser: any;
    redirectPath?: string;
}

const ProtectedRoute = ({ children, allowedRoles, currentUser, redirectPath = '/login' }: ProtectedRouteProps) => {
    if (!currentUser) return <Navigate to={redirectPath} replace />;
    if (!allowedRoles.includes(currentUser.role)) {
        // Redirect to their allowed portal if they try to access unauthorized one
        if (currentUser.role === Role.SUPER_ADMIN) return <Navigate to="/platform" replace />;
        if (currentUser.role === Role.ADMIN) return <Navigate to="/doctor" replace />;
        if (currentUser.role === Role.PATIENT) return <Navigate to="/patient" replace />;
    }
    return children;
};

export const AppRouter: React.FC<RouterProps> = ({ appState, handlers }) => {
    return (
        <Routes>
            <Route path="/login" element={
                appState.currentUser
                    ? <Navigate to="/" replace />
                    : <LoginPage onLogin={handlers.onLogin} />
            } />

            {/* SUPER ADMIN PORTAL */}
            <Route path="/platform" element={
                <ProtectedRoute allowedRoles={[Role.SUPER_ADMIN]} currentUser={appState.currentUser}>
                    <PlatformPage
                        data={appState}
                        onNavigate={() => { }} // Internal nav handled by router now
                        {...handlers}
                    />
                </ProtectedRoute>
            } />

            {/* DOCTOR / CLINIC OS */}
            <Route path="/doctor" element={
                <ProtectedRoute allowedRoles={[Role.ADMIN]} currentUser={appState.currentUser}>
                    <ClinicPage
                        data={appState}
                        clinic={appState.clinics.find(c => c.id === appState.activeClinicId)}
                        {...handlers}
                    />
                </ProtectedRoute>
            } />

            {/* PATIENT APP */}
            <Route path="/patient" element={
                <ProtectedRoute allowedRoles={[Role.PATIENT]} currentUser={appState.currentUser}>
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
                </ProtectedRoute>
            } />

            {/* ROOT REDIRECT */}
            <Route path="/" element={
                appState.currentUser
                    ? <Navigate to={appState.currentUser.role === Role.SUPER_ADMIN ? "/platform" : appState.currentUser.role === Role.PATIENT ? "/patient" : "/doctor"} replace />
                    : <Navigate to="/login" replace />
            } />
        </Routes>
    );
};
