import React, { useState, useEffect, useMemo } from 'react';
import { BrowserRouter, useLocation, Link } from 'react-router-dom';
import {
  User, Wallet, Transaction, FamilyGroup, Role, AppState, ViewMode, Clinic, TransactionCategory, TransactionType, CarePlan, ThemeTexture,
  AppointmentType, AppointmentStatus
} from './types';
import { getBackendService } from './services/BackendFactory';
import { AppRouter } from './router';

// Icons
import { Activity } from 'lucide-react';

import { useToast } from './context/ToastContext';

const App = () => {
  const [isClient, setIsClient] = useState(false);
  const { addToast } = useToast();

  // Initialize Backend Service (Singleton) via Factory
  const backendService = useMemo(() => getBackendService(), []);

  // Initialize State (Async)
  const [data, setData] = useState<AppState | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initData = async () => {
      try {
        const dbData = await backendService.getData();

        // Compute Derived State (UI State)
        const path = window.location.pathname;
        let initialClinicId: string | null = null;
        let initialUser: User | null = null;
        let initialViewMode: ViewMode = 'PLATFORM_MASTER';

        // ... (Keep existing URL logic logic here, but adapted)
        // For brevity in this replacement, I'll simplify the dev logic or copy it if I can see it clearly.
        // Re-implementing the URL parsing logic from previous state:

        const pathParts = path.split('/').filter(Boolean); // e.g. ['clinic', 'city-dental']

        // 1. Check for specific clinic slug
        if (pathParts[0] === 'clinic' && pathParts[1]) {
          const found = dbData.clinics.find(c => c.slug === pathParts[1]);
          if (found) {
            initialClinicId = found.id;

            // Context-Aware User: Admin
            // For Dev Mode: Auto-login as the Admin of this clinic
            const admin = dbData.users.find(u => u.clinicId === found.id && u.role === Role.ADMIN);
            if (admin) initialUser = admin;
          }
        }
        // 2. Patient App
        else if (pathParts[0] === 'patient') {
          initialViewMode = 'MOBILE_PATIENT';
          // Find a patient
          const patient = dbData.users.find(u => u.role === Role.PATIENT);
          if (patient) {
            initialUser = patient;
            initialClinicId = patient.clinicId;
          }
        }
        // 3. Platform Admin (Default)
        else {
          const superAdmin = dbData.users.find(u => u.role === Role.SUPER_ADMIN);
          // Fallback to creating a fake super admin if none exists in mock
          initialUser = superAdmin || {
            id: 'super-admin',
            clinicId: 'platform',
            name: 'Platform Master',
            mobile: '0000',
            role: Role.SUPER_ADMIN,
            lifetimeSpend: 0,
            currentTier: Role.SUPER_ADMIN as any,
            joinedAt: new Date().toISOString()
          };
        }

        setData({
          ...dbData,
          activeClinicId: initialClinicId || dbData.clinics[0]?.id || '', // Fallback to first clinic if no specific clinic found
          currentUser: initialUser || dbData.users[0], // Fallback to first user if no specific user found
          viewMode: initialViewMode
        });
      } catch (err) {
        console.error("Failed to load backend data", err);
        addToast(`Connection Failed: ${err instanceof Error ? err.message : String(err)}`, "error");
      } finally {
        setLoading(false);
      }
    };

    initData();
  }, [backendService]);

  if (loading || !data) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Activity size={48} className="text-indigo-500 animate-pulse" />
          <h2 className="text-white text-xl font-medium tracking-tight">Booting DentalOS...</h2>
        </div>
      </div>
    );
  }

  // Client-side hydration check
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Handle Deep Linking simulation
  useEffect(() => {
    if (!isClient) return;
    const params = new URLSearchParams(window.location.search);
    const clinicSlug = params.get('c');
    const mode = params.get('v'); // 'staff' or 'patient'

    if (clinicSlug) {
      const foundClinic = data.clinics.find(cl => cl.slug === clinicSlug);
      if (foundClinic) {
        let targetUser: User | undefined;

        if (mode === 'patient') {
          targetUser = data.users.find(u => u.clinicId === foundClinic.id && u.role === Role.PATIENT);
        } else {
          // Default to Kiosk/Doctor
          targetUser = data.users.find(u => u.id === foundClinic.adminUserId);
        }

        setData(prev => ({
          ...prev,
          activeClinicId: foundClinic.id,
          currentUser: targetUser || prev.currentUser
        }));
      }
    }
  }, [isClient]);

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

  const handleOnboardClinic = async (name: string, color: string, texture: ThemeTexture, ownerName: string, logoUrl: string) => {
    const result = await backendService.createClinic(name, color, texture, ownerName, logoUrl);
    if (result.success && result.updatedData) {
      setData(prev => ({ ...prev, ...result.updatedData }));
    }
    return result;
  };

  const handleEnterClinic = (clinicId: string) => {
    const targetClinic = data.clinics.find(c => c.id === clinicId);
    const admin = data.users.find(u => u.id === targetClinic?.adminUserId);

    setData(prev => ({
      ...prev,
      activeClinicId: clinicId,
      currentUser: admin || prev.currentUser
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

  const DevModeRoleSwitcher = () => {
    const location = useLocation();
    const path = location.pathname;

    useEffect(() => {
      // Logic to auto-switch user based on path in Dev Mode
      let requiredRole: Role | null = null;
      if (path.startsWith('/platform')) requiredRole = Role.SUPER_ADMIN;
      else if (path.startsWith('/patient')) requiredRole = Role.PATIENT;

      if (requiredRole && data.currentUser?.role !== requiredRole) {
        console.log(`[DevMode] Auto-switching to ${requiredRole} based on path ${path}`);
        const targetUser = data.users.find(u => u.role === requiredRole);
        if (targetUser) {
          setData(prev => ({
            ...prev,
            currentUser: targetUser
          }));
        }
      }
    }, [path]);

    return null;
  };

  return (
    <div className="h-screen w-full relative overflow-hidden bg-slate-950">
      <BrowserRouter>
        <DevModeRoleSwitcher />
        <div className="fixed top-2 right-2 z-[100] flex gap-2 opacity-50 hover:opacity-100 transition-opacity">
          <Link to="/patient" className="px-2 py-1 bg-slate-800 text-white text-[10px] rounded">Patient</Link>
          <Link to="/doctor" className="px-2 py-1 bg-slate-800 text-white text-[10px] rounded">Doctor</Link>
          <Link to="/platform" className="px-2 py-1 bg-slate-800 text-white text-[10px] rounded">Platform</Link>
        </div>
        <AppRouter appState={data} handlers={handlers} backendService={backendService} />
      </BrowserRouter>
    </div>
  );
};

export default App;
