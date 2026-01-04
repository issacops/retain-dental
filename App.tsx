import React, { useState, useEffect, useMemo } from 'react';
import { BrowserRouter, useLocation, Link, useNavigate } from 'react-router-dom';
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
    const publicPaths = ['/login', '/public'];
    const isPublic = publicPaths.some(p => location.pathname.startsWith(p));

    if (!currentUser && !isPublic) {
      // Check if we are at root, redirect to login
      navigate('/login');
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

  // AUTH STATE
  useEffect(() => {
    const initData = async () => {
      try {
        const dbData = await backendService.getData(); // Initial Fetch

        // 1. Check Active Session
        const { data: { session } } = await supabase.auth.getSession();
        let activeUser: User | null = null;
        let derivedClinicId = dbData.clinics[0]?.id || '';

        // SUBDOMAIN DETECTION
        const hostname = window.location.hostname;
        // Logic: 'krown.retain.dental' -> 'krown'
        // Logic: 'localhost' -> null
        const parts = hostname.split('.');
        let subdomain = parts.length > 2 ? parts[0] : null; // Basic check, assumes app.domain.com structure

        // Localhost debugging override
        if (hostname.includes('localhost')) {
          // Optional: Allow testing via ?subdomain= query param since we can't easily do subdomains on localhost without /etc/hosts
          const params = new URLSearchParams(window.location.search);
          const subParam = params.get('subdomain');
          if (subParam) subdomain = subParam;
        }

        const IGNORED_SUBDOMAINS = ['www', 'app', 'platform', 'api'];
        let tenantClinic: Clinic | undefined;
        let isPlatform = false;

        if (subdomain === 'platform') {
          isPlatform = true;
        } else if (subdomain && !IGNORED_SUBDOMAINS.includes(subdomain)) {
          tenantClinic = dbData.clinics.find(c => c.slug === subdomain);
          if (tenantClinic) {
            derivedClinicId = tenantClinic.id;
          }
        }

        if (session) {
          // Find user in DB associated with this Auth ID
          // NOTE: In real prod, we'd query API. Here we search loaded DB state.
          // For Patient (Mobile+PIN), email is mobile@retain.dental
          const email = session.user.email;

          // SUPER USER CHECK
          if (email === 'issaciconnect@gmail.com') {
            activeUser = {
              id: session.user.id,
              name: 'Isaac Thomas',
              mobile: 'SUPER-ADMIN',
              role: Role.SUPER_ADMIN,
              clinicId: 'platform',
              currentTier: 'PLATINUM', // cast any
              lifetimeSpend: 0,
              joinedAt: new Date().toISOString()
            } as any;
          } else {
            // NORMAL USER CHECK
            // DB must have a mapping. For MVP, we might filter by email if we stored it.
            // 1. Try ID match (Standard)
            let found = dbData.users.find(u => u.id === session.user.id);

            // 2. Try Email Match (For Pre-Provisioned Admins)
            if (!found && session.user.email) {
              found = dbData.users.find(u => u.email === session.user.email);
            }

            activeUser = found || null;
          }
        }

        setData({
          ...dbData,
          activeClinicId: tenantClinic ? tenantClinic.id : (activeUser?.clinicId || derivedClinicId),
          currentUser: activeUser || null // If null, Router will redirect to Login
        });

      } catch (err) {
        console.error("Failed to load backend data", err);
        const errorMessage = err instanceof Error ? err.message : (err as any).message || JSON.stringify(err);
        addToast(`Connection Failed: ${errorMessage}`, "error");
      } finally {
        setLoading(false);
      }
    };

    initData();

    // Listen for Auth Changes (Login/Logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!session) {
        // Logged out
        setData(prev => prev ? ({ ...prev, currentUser: null }) : null);
      } else {
        // Logged in - Reload Data to get fresh user context
        // In a real app we'd just fetch the profile.
        // Re-triggering initData logic manually or just page reload is safest for this MVP architecture
        window.location.reload();
      }
    });

    return () => subscription.unsubscribe();

  }, [backendService]);

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

  const handleAddPatient = async (name: string, mobile: string) => {
    const result = await backendService.addPatient(data.activeClinicId!, name, mobile);
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
    onLinkFamily: handleLinkFamily,
    onAddPatient: handleAddPatient,
    onOnboardClinic: handleOnboardClinic,
    onEnterClinic: handleEnterClinic,
    onDeleteClinic: handleDeleteClinic,
    onLogin: handleLogin,
    onRedeem: (amount: number, description: string) => handleTransaction(data.currentUser?.id!, amount, TransactionCategory.REWARD, TransactionType.REDEEM, { name: description } as any),
  };

  return (
    <div className="h-screen w-full relative overflow-hidden bg-slate-950">
      <BrowserRouter>
        <AuthHandler currentUser={data.currentUser} onRoleChange={(r) => { }} />
        <AppRouter appState={data} handlers={handlers} backendService={backendService} />
      </BrowserRouter>
    </div>
  );
};

export default App;
