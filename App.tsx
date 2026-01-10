import React, { useState, useEffect, useMemo } from 'react';
import { BrowserRouter, useLocation, Link, useNavigate, Routes, Route } from 'react-router-dom';
import { LandingPage } from './pages/LandingPage';
import {
  User, Wallet, Transaction, FamilyGroup, Role, AppState, ViewMode, Clinic, TransactionCategory, TransactionType, CarePlan, ThemeTexture,
  AppointmentType, AppointmentStatus
} from './types';
import { getBackendService } from './services/BackendFactory';
import { AppRouter } from './router';
import { supabase } from './lib/supabase'; // Auth

// Icons
import { Activity } from 'lucide-react';

import { useToast } from './context/ToastContext';

// Auth State Helper Component to handle redirects outside of Router context
const AuthHandler = ({
  currentUser,
  onRoleChange
}: {
  currentUser: User | null,
  onRoleChange: (r: Role) => void
}) => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // If no user and trying to access protected route, send to Login
    const publicPaths = ['/login', '/public', '/god'];
    const isPublic = publicPaths.some(p => location.pathname.startsWith(p));

    if (!currentUser && !isPublic) {
      // Check if we are at root, redirect to login
      navigate('/login' + location.search);
    }

    // Role-based Redirects (Only if at root or login)
    if (currentUser && (location.pathname === '/' || location.pathname.startsWith('/login'))) {
      if (currentUser.role === Role.SUPER_ADMIN) navigate('/platform');
      else if (currentUser.role === Role.ADMIN) navigate('/doctor');
      else if (currentUser.role === Role.PATIENT) navigate('/patient');
    }
  }, [currentUser, location, navigate]);

  return null;
};

const App = () => {
  const [isClient, setIsClient] = useState(false);
  const { addToast } = useToast();

  // Initialize Backend Service (Singleton) via Factory
  const backendService = useMemo(() => getBackendService(), []);

  // Initialize State (Async)
  const [data, setData] = useState<AppState | null>(null);
  const [loading, setLoading] = useState(true);

  // CORE DATA FETCHING
  const fetchData = async () => {
    try {
      // Don't set loading true here to avoid flashing if just refreshing
      // only if we have no data? No, let's keep it smooth.

      const dbData = await backendService.getData(); // Initial Fetch

      const { data: { session } } = await supabase.auth.getSession();
      let activeUser: User | null = null;
      let derivedClinicId = 'platform';

      // SUBDOMAIN DETECTION (DNS LEVEL)
      // This is the "Proper Solution": clinic.platform.com
      const hostname = window.location.hostname;
      const parts = hostname.split('.');
      let subdomain = null;

      // 1. Handle Localhost (e.g. city.localhost)
      if (hostname.includes('localhost') && parts.length > 1) {
        subdomain = parts[0];
      }
      // 2. Handle Custom Domains (e.g. city.dentalos.com)
      // We must exclude 'vercel.app' because 'retain-dental.vercel.app' -> 'retain-dental' is NOT a clinic.
      else if (parts.length > 2 && !hostname.endsWith('vercel.app')) {
        subdomain = parts[0];
      }
      // 3. Fallback: Query Param (for testing/sharing without wildcards)
      const params = new URLSearchParams(window.location.search);
      const subParam = params.get('subdomain');
      if (subParam) subdomain = subParam;

      // PERSISTENT TENANT CONTEXT (LocalStorage)
      // Only use this if we don't have a REAL subdomain already.
      // If I am at 'city.dentalos.com', I AM 'city'. LocalStorage shouldn't override DNS.
      if (!subdomain) {
        const storedSlug = localStorage.getItem('retain_tenant_slug');
        if (storedSlug) {
          subdomain = storedSlug;
        }
      } else {
        // If we HAVE a subdomain (link or DNS), save it for next time (if used in fallback mode)
        localStorage.setItem('retain_tenant_slug', subdomain);
      }

      const IGNORED_SUBDOMAINS = ['www', 'app', 'platform', 'api', 'localhost'];
      let tenantClinic: Clinic | undefined;

      if (subdomain === 'platform') {
      } else if (subdomain && !IGNORED_SUBDOMAINS.includes(subdomain)) {
        tenantClinic = dbData.clinics.find(c => c.slug === subdomain);
        if (tenantClinic) {
          derivedClinicId = tenantClinic.id;
        }
      }

      if (session) {
        // 1. Try to find REAL profile in DB first (Prioritize specific clinic roles)
        let found = dbData.users.find(u => u.id === session.user.id);

        if (!found && session.user.email) {
          const sessionEmail = session.user.email.trim().toLowerCase();
          found = dbData.users.find(u => u.email?.trim().toLowerCase() === sessionEmail);
        }

        if (found) {
          // MERGE: If DB Name is missing/default, try to pull from Auth Metadata
          // This fixes issues where 'profiles' might lag or miss the full_name sync
          if ((!found.name || found.name === 'Unknown User') && session.user.user_metadata?.full_name) {
            found = { ...found, name: session.user.user_metadata.full_name };
          }
          activeUser = found;
        } else if (session.user.email?.toLowerCase() === 'issaciconnect@gmail.com') {
          // 2. Fallback: God Mode (Only if no specific profile exists)
          activeUser = {
            id: session.user.id,
            name: 'Isaac Thomas',
            mobile: 'SUPER-ADMIN',
            role: Role.SUPER_ADMIN,
            clinicId: 'platform',
            currentTier: 'PLATINUM',
            lifetimeSpend: 0,
            joinedAt: new Date().toISOString()
          } as any;
        } else {
          activeUser = null;
        }
      }

      if (session && !activeUser) {
        console.warn("Session exists but User Profile not found", session.user.email);
        addToast(`Login Error: No profile found for ${session.user.email}`, "error");
      }

      // CONFLICT RESOLUTION: Sticky Session vs URL Context
      // If the user accessed a specific clinic link (e.g., ?subdomain=newclinic) but is logged in as a user of 'oldclinic',
      // we must force a logout to respect the link's intent.
      if (tenantClinic && activeUser && activeUser.clinicId !== tenantClinic.id) {
        console.log("Context Mismatch: URL requests", tenantClinic.name, "but User is in", activeUser.clinicId);
        await supabase.auth.signOut();
        activeUser = null;
        addToast(`Switched to ${tenantClinic.name}`, "info");
      }

      setData({
        ...dbData,
        activeClinicId: tenantClinic ? tenantClinic.id : (activeUser?.clinicId || derivedClinicId),
        currentUser: activeUser || null
      });

    } catch (err) {
      console.error("Failed to load backend data", err);
      const errorMessage = err instanceof Error ? err.message : (err as any).message || JSON.stringify(err);
      addToast(`Connection Failed: ${errorMessage}`, "error");
    } finally {
      setLoading(false);
    }
  };

  // ------------------------------------------------------------------
  // EFFECTS
  // ------------------------------------------------------------------

  // Dynamic PWA Manifest Injection (Client-Side Blob)
  useEffect(() => {
    if (data?.activeClinicId && data?.clinics) {
      const clinic = data.clinics.find(c => c.id === data.activeClinicId);
      if (clinic) {
        const isSvg = clinic.logoUrl && (clinic.logoUrl.includes('.svg') || clinic.logoUrl.includes('dicebear'));
        const iconType = isSvg ? "image/svg+xml" : "image/png";
        const iconSizes = isSvg ? "any" : "192x192";
        const iconSizesLg = isSvg ? "any" : "512x512";

        // 1. Construct Manifest Object
        const manifest = {
          name: clinic.name,
          short_name: clinic.name,
          description: `Patient Portal for ${clinic.name}`,
          start_url: `/?subdomain=${clinic.slug}`,
          display: "standalone",
          background_color: "#0f172a",
          theme_color: clinic.primaryColor || '#6366f1',
          icons: clinic.logoUrl ? [
            { src: clinic.logoUrl, sizes: iconSizes, type: iconType, purpose: "any maskable" },
            { src: clinic.logoUrl, sizes: iconSizesLg, type: iconType, purpose: "any maskable" }
          ] : [
            { src: "/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any maskable" },
            { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any maskable" }
          ]
        };

        // 2. Determine Manifest URL (Server-Side for Prod to fix Chrome Badge, Blob for Localhost)
        const isLocalhost = window.location.hostname.includes('localhost');
        let manifestUrl = '';

        if (isLocalhost) {
          const stringManifest = JSON.stringify(manifest);
          const blob = new Blob([stringManifest], { type: 'application/json' });
          manifestUrl = URL.createObjectURL(blob);
        } else {
          // Server-Side: Use Slug to fetch clean manifest from DB (Avoids URL length issues)
          // This relies on api/manifest.js connecting to Supabase, which it does.
          manifestUrl = `/api/manifest?slug=${clinic.slug}`;
        }

        // 3. Update Link Tag
        const link = document.querySelector<HTMLLinkElement>('link[rel="manifest"]');
        if (link) {
          link.href = manifestUrl;
          console.log('PWA Manifest Updated (Blob):', clinic.name);
        } else {
          const newLink = document.createElement('link');
          newLink.rel = 'manifest';
          newLink.href = manifestUrl;
          document.head.appendChild(newLink);
        }

        // 4. Update Document Title
        document.title = clinic.name;

        // 5. iOS Specific Tags (Crucial for "Add to Home Screen" on iPhone)
        // Update Apple Touch Icon
        let appleIcon = document.querySelector<HTMLLinkElement>('link[rel="apple-touch-icon"]');
        if (!appleIcon) {
          appleIcon = document.createElement('link');
          appleIcon.rel = 'apple-touch-icon';
          document.head.appendChild(appleIcon);
        }
        appleIcon.href = clinic.logoUrl || "/icon-192.png";

        // Update Apple Mobile Title
        let appleTitle = document.querySelector<HTMLMetaElement>('meta[name="apple-mobile-web-app-title"]');
        if (!appleTitle) {
          appleTitle = document.createElement('meta');
          appleTitle.name = 'apple-mobile-web-app-title';
          document.head.appendChild(appleTitle);
        }
        appleTitle.content = clinic.name;
      }
    }
  }, [data?.activeClinicId, data?.clinics]);

  // INITIAL LOAD & AUTH LISTENER
  useEffect(() => {
    fetchData();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      // If we signed out, clear user
      if (_event === 'SIGNED_OUT' || !session) {
        setData(prev => prev ? ({ ...prev, currentUser: null }) : null);
      }
      // If signed in, or token refreshed, just refresh data (no reload)
      else if (_event === 'SIGNED_IN' || _event === 'TOKEN_REFRESHED' || _event === 'INITIAL_SESSION') {
        // Only fetch if we suspect a change, but simply fetching is safer than reloading
        // We check if we already have a user to avoid redundant fetches on INITIAL_SESSION if fetchData already ran
        fetchData();
      }
    });

    return () => subscription.unsubscribe();
  }, [backendService, addToast]); // Added addToast to dependencies as it's used in fetchData

  // Client-side hydration check
  useEffect(() => {
    setIsClient(true);
  }, []);

  if (loading || !data) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Activity size={48} className="text-indigo-500 animate-pulse" />
          <h2 className="text-white text-xl font-medium tracking-tight">Booting Retain.OS...</h2>
        </div>
      </div>
    );
  }

  const handleTransaction = async (patientId: string, amount: number, category: TransactionCategory, type: TransactionType, carePlanTemplate?: any) => {
    const result = await backendService.processTransaction(data.activeClinicId!, patientId, amount, category, type, carePlanTemplate);
    if (result.success && result.updatedData) {
      setData(prev => ({ ...prev, ...result.updatedData }));
    }
    return result;
  };

  const handleUpdateCarePlan = async (carePlanId: string, updates: Partial<CarePlan>) => {
    const result = await backendService.updateCarePlan(carePlanId, updates);
    if (result.success && result.updatedData) {
      setData(prev => ({ ...prev, ...result.updatedData }));
    }
    return result;
  };

  const handleLinkFamily = async (headUserId: string, memberMobile: string) => {
    const result = await backendService.linkFamilyMember(headUserId, memberMobile);
    if (result.success && result.updatedData) {
      setData(prev => ({ ...prev, ...result.updatedData }));
    }
    return result;
  };

  const handleAddPatient = async (name: string, mobile: string, pin?: string) => {
    const result = await backendService.addPatient(data.activeClinicId!, name, mobile, pin);
    if (result.success && result.updatedData) {
      setData(prev => ({ ...prev, ...result.updatedData }));
    }
    return result;
  };

  const handleOnboardClinic = async (name: string, color: string, texture: ThemeTexture, ownerName: string, logoUrl: string, slug: string, adminEmail: string) => {
    const result = await backendService.createClinic(name, color, texture, ownerName, logoUrl, slug, adminEmail);
    if (result.success && result.updatedData) {
      setData(prev => ({ ...prev, ...result.updatedData }));
      addToast("Clinic Deployed Successfully", "success");
    } else {
      addToast(`Deployment Failed: ${result.message}`, "error");
    }
    return result;
  };

  const handleEnterClinic = (clinicId: string) => {
    // Dynamically find the admin for this clinic
    const realAdmin = data.users.find(u => u.clinicId === clinicId && u.role === Role.ADMIN);
    const targetClinic = data.clinics.find(c => c.id === clinicId);

    // If no real admin profile exists (e.g. freshly deployed demo clinic), synthesize one for the session
    const activeUser = realAdmin || (targetClinic ? {
      id: `virtual-admin-${clinicId}`,
      clinicId: clinicId,
      name: targetClinic.ownerName || 'Clinic Director',
      role: Role.ADMIN,
      mobile: 'DOC-ACCESS',
      currentTier: Role.ADMIN as any,
      lifetimeSpend: 0,
      joinedAt: new Date().toISOString()
    } as User : data.currentUser);

    setData(prev => ({
      ...prev,
      activeClinicId: clinicId,
      currentUser: activeUser || prev.currentUser
    }));
  };

  const handleDeleteClinic = async (clinicId: string) => {
    const result = await backendService.deleteClinic(clinicId);
    if (result.success && result.updatedData) {
      setData(prev => ({ ...prev, ...result.updatedData }));
    }
  };

  const handleUpdateClinic = async (clinicId: string, updates: Partial<Clinic>) => {
    const result = await backendService.updateClinic(clinicId, updates);
    if (result.success && result.updatedData) {
      setData(prev => ({ ...prev, ...result.updatedData }));
      addToast("Clinic Updates Deployed", "success");
    } else {
      addToast(`Update Failed: ${result.message}`, "error");
    }
  };

  const handleUpdateAdminAuth = async (clinicId: string, email: string, password?: string) => {
    const result = await backendService.updateAdminAuth(clinicId, email, password);
    if (result.success) {
      addToast(result.message, "success");
      // If we are updating ourselves, maybe force logout? Na.
    } else {
      addToast(`Auth Update Failed: ${result.message}`, "error");
    }
  };

  const handleUpdateGlobalConfig = async (updates: any) => {
    const result = await backendService.updateSystemConfig(updates);
    if (result.success) {
      // Config is internal to backend service for now in terms of state ref, but we could sync if needed
      // Force re-render if needed or just sync
      setData(prev => ({ ...prev }));
    }
  };

  const handleToggleChecklistItem = async (carePlanId: string, itemId: string) => {
    const result = await backendService.toggleChecklistItem(carePlanId, itemId);
    if (result.success && result.updatedData) {
      setData(prev => ({ ...prev, ...result.updatedData }));
    }
  };

  const handleScheduleAppointment = async (patientId: string, start: string, end: string, type: AppointmentType, notes: string) => {
    const result = await backendService.scheduleAppointment(data.activeClinicId!, patientId, undefined, start, end, type, notes);
    if (result.success && result.updatedData) {
      setData(prev => ({ ...prev, ...result.updatedData }));
    }
    return result;
  };

  const handleAssignPlan = async (clinicId: string, patientId: string, template: any) => {
    const result = await backendService.assignCarePlan(clinicId, patientId, template);
    if (result.success && result.updatedData) {
      setData(prev => ({ ...prev, ...result.updatedData }));
      addToast("Clinical Protocol Initialized", "success");
    } else {
      addToast(`Failed to initialize protocol: ${result.message}`, "error");
    }
    return result;
  };

  const handleTerminateCarePlan = async (carePlanId: string) => {
    const result = await backendService.terminateCarePlan(carePlanId);
    if (result.success && result.updatedData) {
      setData(prev => ({ ...prev, ...result.updatedData }));
      addToast("Treatment Protocol Terminated", "success");
    } else {
      addToast(`Failed to terminate protocol: ${result.message}`, "error");
    }
    return result;
  };

  const handleUpdateAppointmentStatus = async (id: string, status: AppointmentStatus) => {
    const result = await backendService.updateAppointmentStatus(id, status);
    if (result.success && result.updatedData) {
      setData(prev => ({ ...prev, ...result.updatedData }));
    }
    return result;
  };

  const handleAddFamilyMember = async (name: string, relation: string, age: string) => {
    if (!data.currentUser) return;
    const result = await backendService.addFamilyMember(data.currentUser.id, name, relation, age);
    if (result.success && result.updatedData) {
      setData(prev => {
        // Refresh current user from existing ID to ensure familyGroupId is up to date
        const updatedCurrentUser = result.updatedData.users ? result.updatedData.users.find((u: User) => u.id === prev.currentUser?.id) : prev.currentUser;
        return { ...prev, ...result.updatedData, currentUser: updatedCurrentUser || prev.currentUser };
      });
    }
  };

  const handleSwitchProfile = (userId: string) => {
    const targetUser = data.users.find(u => u.id === userId);
    if (targetUser) {
      setData(prev => ({ ...prev, currentUser: targetUser }));
    }
  };

  const handleLogin = (role: Role) => {
    // MOCK: Find the first user with this role
    let targetUser;
    if (role === Role.ADMIN) {
      // Find admin of active clinic
      const clinic = data.clinics.find(c => c.id === data.activeClinicId);
      targetUser = data.users.find(u => u.id === clinic?.adminUserId);
    } else {
      targetUser = data.users.find(u => u.role === role);
    }

    if (targetUser) {
      setData(prev => ({ ...prev, currentUser: targetUser }));
    } else {
      alert("No mock user found for this role. Check constants.");
    }
  };

  if (!isClient) return null;

  // Bundle handlers for easier passing
  const handlers = {
    setActiveClinicId: (id: string) => setData(prev => ({ ...prev, activeClinicId: id })),
    onUpdateGlobalConfig: handleUpdateGlobalConfig,
    onToggleChecklistItem: handleToggleChecklistItem,
    onSchedule: handleScheduleAppointment,
    onUpdateAppointmentStatus: handleUpdateAppointmentStatus,
    onAddFamilyMember: handleAddFamilyMember,
    onSwitchProfile: handleSwitchProfile,
    onProcessTransaction: handleTransaction,
    onUpdateCarePlan: handleUpdateCarePlan,
    onAssignPlan: handleAssignPlan,
    onTerminateCarePlan: handleTerminateCarePlan,
    onLinkFamily: handleLinkFamily,
    onAddPatient: handleAddPatient,
    onOnboardClinic: handleOnboardClinic,
    onEnterClinic: handleEnterClinic,
    onDeleteClinic: handleDeleteClinic,
    onUpdateAdminAuth: handleUpdateAdminAuth,
    onLogin: handleLogin,
    onRedeem: (amount: number, description: string) => handleTransaction(data.currentUser?.id!, amount, TransactionCategory.REWARD, TransactionType.REDEEM, { name: description } as any),
  };

  if (loading || !data) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-slate-950">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-500 font-mono text-xs uppercase tracking-widest animate-pulse">Initializing Retain OS...</p>
        </div>
      </div>
    );
  }

  // CHECK FOR PENDING STATUS (Approval Workflow)
  if (data?.currentUser?.status === 'PENDING') {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-slate-950 p-6">
        <div className="max-w-md w-full glass-panel border border-amber-500/30 p-8 rounded-3xl text-center shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-amber-500"></div>
          <div className="w-16 h-16 bg-amber-500/10 rounded-full flex items-center justify-center mx-auto mb-6 text-amber-500">
            <Activity size={32} />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Access Restricted</h2>
          <p className="text-slate-400 mb-8">
            Your clinic workspace has been provisioned, but access requires final security clearance from the Platform Super Admin.
          </p>
          <div className="space-y-3">
            <button onClick={fetchData} className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold rounded-xl transition-colors">
              Check Status Again
            </button>
            <button onClick={() => supabase.auth.signOut()} className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white font-medium rounded-xl transition-colors">
              Logout
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full relative bg-slate-950 min-h-screen">
      <BrowserRouter>
        <Routes>
          {/* Public Landing Page at Root (No Auth Required) */}
          <Route path="/" element={
            data && data.activeClinicId !== 'platform' && !window.location.hostname.startsWith('retaindental.com') && !window.location.hostname.includes('localhost') ?
              // Logic Check: If we have a TENANT context, we show the app.
              // But simpler: The Router handles this?
              // Actually, AppRouter expects to handle everything. We need to Wrap Landing Page.
              <PublicLandingWrapper appState={data} handlers={handlers} backend={backendService} />
              : <PublicLandingWrapper appState={data} handlers={handlers} backend={backendService} />
          } />

          {/* Explicit Login Route */}
          <Route path="/login" element={
            <>
              <AuthHandler currentUser={data.currentUser} onRoleChange={() => { }} />
              <AppRouter appState={data} handlers={handlers} backendService={backendService} />
            </>
          } />

          {/* Catch-all for App usage (once logged in or if subdomain exists) */}
          <Route path="/*" element={
            <>
              <AuthHandler currentUser={data.currentUser} onRoleChange={() => { }} />
              <AppRouter appState={data} handlers={handlers} backendService={backendService} />
            </>
          } />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

// Helper to determine if we show Landing Page or App
const PublicLandingWrapper = ({ appState, handlers, backend }: any) => {
  // 1. Check Subdomain
  const hostname = window.location.hostname;
  // If we are at a subdomain (city.retaindental.com), SHOW THE APP (Login/PatientView)
  const isSubdomain = ((hostname.split('.').length > 2 && !hostname.endsWith('vercel.app')) ||
    (hostname.includes('localhost') && hostname.split('.').length > 1))
    && !hostname.startsWith('www.');

  // 2. Check Query Param override
  const params = new URLSearchParams(window.location.search);
  const hasSubParam = !!params.get('subdomain');

  if (isSubdomain || hasSubParam) {
    // Render the Main App Router (which handles Login/Dashboard based on Auth)
    return (
      <>
        <AuthHandler currentUser={appState?.currentUser || null} onRoleChange={() => { }} />
        <AppRouter appState={appState} handlers={handlers} backendService={backend} />
      </>
    );
  }

  // Default: Show Landing Page
  return <LandingPage />;
};

export default App;
