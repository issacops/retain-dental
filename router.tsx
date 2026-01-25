import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppState, Role } from './types';
import { IBackendService } from './services/IBackendService';
import { LandingPage } from './pages/LandingPage'; // Eager Load Landing Page

// Lazy Load Heavy Platform Pages to isolate Marketing Bundle
const PlatformPage = React.lazy(() => import('./pages/PlatformPage').then(module => ({ default: module.PlatformPage })));
const ClinicPage = React.lazy(() => import('./pages/ClinicPage').then(module => ({ default: module.ClinicPage })));
const PatientPage = React.lazy(() => import('./pages/PatientPage').then(module => ({ default: module.PatientPage })));
const LoginPage = React.lazy(() => import('./pages/LoginPage').then(module => ({ default: module.LoginPage })));

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

// Loading Spinner for Code Splitting
const RouterLoader = () => (
    <div className="h-screen w-full flex items-center justify-center bg-slate-50">
        <div className="h-8 w-8 border-4 border-slate-200 border-t-slate-900 rounded-full animate-spin"></div>
    </div>
);

// Hardcoded Auth for Super Admin
const GodGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = React.useState(false);
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [error, setError] = React.useState('');

    if (isAuthenticated) return <>{children}</>;

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (email === 'issaciconnect@gmail.com' && password === 'Jisha@99898542') {
            setIsAuthenticated(true);
            setError('');
        } else {
            setError('ACCESS DENIED');
        }
    };

    return (
        <div className="flex items-center justify-center h-[100dvh] bg-slate-950 text-white">
            <form onSubmit={handleLogin} className="p-10 bg-slate-900 rounded-3xl border border-slate-800 shadow-2xl w-full max-w-md space-y-6">
                <div className="text-center">
                    <h1 className="text-3xl font-black tracking-tighter text-indigo-500 mb-2">GOD MODE</h1>
                    <p className="text-slate-500 font-mono text-xs uppercase tracking-widest">Restricted Access Level 0</p>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-3 mb-1 block">Identity</label>
                        <input autoFocus type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-slate-950 border border-slate-800 p-4 rounded-xl font-mono text-sm outline-none focus:border-indigo-500 transition-all" placeholder="user@system.core" />
                    </div>
                    <div>
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-3 mb-1 block">Passkey</label>
                        <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full bg-slate-950 border border-slate-800 p-4 rounded-xl font-mono text-sm outline-none focus:border-indigo-500 transition-all" placeholder="••••••••••••" />
                    </div>
                </div>

                {error && <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-500 text-xs font-bold text-center animate-pulse">{error}</div>}

                <button type="submit" className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-black uppercase tracking-widest rounded-xl transition-all shadow-lg hover:shadow-indigo-500/20 active:scale-95">Authenticate</button>
            </form>
        </div>
    );
};

// Safe Router Wrapper
export const AppRouter: React.FC<RouterProps> = ({ appState, handlers, backendService }) => {
    // Defensive access to clinics array
    const clinics = appState?.clinics || [];
    const activeClinic = clinics.find(c => c.id === appState?.activeClinicId);

    if (!appState) return <div className="p-10 text-white">App Error: State Missing</div>;
    return (
        <Suspense fallback={<RouterLoader />}>
            <Routes>
                {/* PUBLIC: LANDING PAGE */}
                <Route path="/" element={<LandingPage backend={backendService} />} />

                {/* PUBLIC: UNIFIED LOGIN & BRANDED LOGIN */}
                <Route path="/login" element={<LoginPage clinics={clinics} activeClinic={activeClinic} />} />
                <Route path="/login/:slug" element={<LoginPage clinics={clinics} activeClinic={activeClinic} />} />

                {/* SUPER ADMIN PORTAL - Secured */}
                <Route path="/god" element={
                    <GodGuard>
                        <PlatformPage
                            data={appState}
                            onNavigate={() => { }}
                            {...handlers}
                        />
                    </GodGuard>
                } />
                <Route path="/platform" element={
                    <GodGuard>
                        <PlatformPage
                            data={appState}
                            onNavigate={() => { }}
                            {...handlers}
                        />
                    </GodGuard>
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
                        appointments={appState.appointments}
                        clinic={activeClinic}
                        onToggleChecklistItem={handlers.onToggleChecklistItem}
                        onUpdateCarePlan={handlers.onUpdateCarePlan}
                        onSchedule={handlers.onSchedule}
                        onAddFamilyMember={handlers.onAddFamilyMember}
                        onSwitchProfile={handlers.onSwitchProfile}
                        onRedeem={handlers.onRedeem}
                        onLinkFamily={handlers.onLinkFamily}
                    />
                } />

                {/* ROOT REDIRECT - Default to Login (Preserve Query Params for PWA) */}
                <Route path="/auth/callback" element={<Navigate to="/" replace />} />
            </Routes>
        </Suspense>
    );
};
