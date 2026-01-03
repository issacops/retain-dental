import React, { useState, useEffect, useMemo } from 'react';
import { BrowserRouter, useLocation, Link } from 'react-router-dom';
import {
  User, Wallet, Transaction, FamilyGroup, Role, AppState, ViewMode, Clinic, TransactionCategory, TransactionType, CarePlan, ThemeTexture,
  AppointmentType, AppointmentStatus
} from './types';
import { MockBackendService } from './services/mockBackend';
import { AppRouter } from './router';

// Icons
import { Activity } from 'lucide-react';

const App = () => {
  const [isClient, setIsClient] = useState(false);

  // Initialize Backend Service (Singleton)
  const backendService = useMemo(() => MockBackendService.getInstance(), []);

  // Initialize State from Backend
  const [data, setData] = useState<AppState>(() => {
    const dbData = backendService.getData();

    // Determine user based on URL for dev/demo mode bypass
    let activeUser: User | null = null;

    if (typeof window !== 'undefined') {
      // 1. Check for manual override
      const overrideId = localStorage.getItem('dev_override_user_id');
      if (overrideId) {
        activeUser = dbData.users.find(u => u.id === overrideId) || null;
      }

      // 2. Fallback to path-based default if no override or user not found
      if (!activeUser) {
        const path = window.location.pathname;
        if (path.startsWith('/platform')) activeUser = dbData.users.find(u => u.role === Role.SUPER_ADMIN) || null;
        else if (path.startsWith('/patient')) activeUser = dbData.users.find(u => u.role === Role.PATIENT) || null;
        else activeUser = dbData.users.find(u => u.role === Role.ADMIN) || null;
      }
    }

    return {
      clinics: dbData.clinics,
      users: dbData.users,
      wallets: dbData.wallets,
      transactions: dbData.transactions,
      familyGroups: dbData.familyGroups,
      carePlans: dbData.carePlans,
      appointments: dbData.appointments,
      currentUser: activeUser || dbData.users[0],
      activeClinicId: dbData.clinics[0]?.id || '',
      viewMode: 'DESKTOP_KIOSK'
    };
  });

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

  const handleTransaction = (patientId: string, amount: number, category: TransactionCategory, type: TransactionType, carePlanTemplate?: any) => {
    const result = backendService.processTransaction(data.activeClinicId!, patientId, amount, category, type, carePlanTemplate);
    if (result.success && result.updatedData) {
      setData(prev => ({ ...prev, ...result.updatedData }));
    }
    return result;
  };

  const handleUpdateCarePlan = (carePlanId: string, updates: Partial<CarePlan>) => {
    const result = backendService.updateCarePlan(carePlanId, updates);
    if (result.success && result.updatedData) {
      setData(prev => ({ ...prev, ...result.updatedData }));
    }
    return result;
  };

  const handleLinkFamily = (headUserId: string, memberMobile: string) => {
    const result = backendService.linkFamilyMember(headUserId, memberMobile);
    if (result.success && result.updatedData) {
      setData(prev => ({ ...prev, ...result.updatedData }));
    }
    return result;
  };

  const handleAddPatient = (name: string, mobile: string) => {
    const result = backendService.addPatient(data.activeClinicId!, name, mobile);
    if (result.success && result.updatedData) {
      setData(prev => ({ ...prev, ...result.updatedData }));
    }
    return result;
  };

  const handleOnboardClinic = (name: string, color: string, texture: ThemeTexture, ownerName: string, logoUrl: string) => {
    const result = backendService.createClinic(name, color, texture, ownerName, logoUrl);
    if (result.success && result.updatedData) {
      setData(prev => ({ ...prev, ...result.updatedData }));
    }
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

  const handleDeleteClinic = (clinicId: string) => {
    const result = backendService.deleteClinic(clinicId);
    if (result.success && result.updatedData) {
      setData(prev => ({ ...prev, ...result.updatedData }));
    }
  };

  const handleUpdateGlobalConfig = (updates: any) => {
    const result = backendService.updateSystemConfig(updates);
    if (result.success) {
      // Config is internal to backend service for now in terms of state ref, but we could sync if needed
      // Force re-render if needed or just sync
      setData(prev => ({ ...prev }));
    }
  };

  const handleToggleChecklistItem = (carePlanId: string, itemId: string) => {
    const result = backendService.toggleChecklistItem(carePlanId, itemId);
    if (result.success && result.updatedData) {
      setData(prev => ({ ...prev, ...result.updatedData }));
    }
  };

  const handleScheduleAppointment = (patientId: string, start: string, end: string, type: AppointmentType, notes: string) => {
    const result = backendService.scheduleAppointment(data.activeClinicId!, patientId, undefined, start, end, type, notes);
    if (result.success && result.updatedData) {
      setData(prev => ({ ...prev, ...result.updatedData }));
    }
    return result;
  };

  const handleUpdateAppointmentStatus = (id: string, status: AppointmentStatus) => {
    const result = backendService.updateAppointmentStatus(id, status);
    if (result.success && result.updatedData) {
      setData(prev => ({ ...prev, ...result.updatedData }));
    }
    return result;
  };

  const handleAddFamilyMember = (name: string, relation: string, age: string) => {
    if (!data.currentUser) return;
    const result = backendService.addFamilyMember(data.currentUser.id, name, relation, age);
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
        <AppRouter appState={data} handlers={handlers} />
      </BrowserRouter>
    </div>
  );
};

export default App;
