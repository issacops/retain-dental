
export enum Role {
  PATIENT = 'PATIENT',
  ADMIN = 'ADMIN', // Doctor/Receptionist
  SUPER_ADMIN = 'SUPER_ADMIN' // Platform Owner
}

export enum Tier {
  MEMBER = 'MEMBER',
  GOLD = 'GOLD',
  PLATINUM = 'PLATINUM'
}

export enum TransactionCategory {
  GENERAL = 'GENERAL',
  COSMETIC = 'COSMETIC',
  HYGIENE = 'HYGIENE',
  REWARD = 'REWARD'
}

export enum TransactionType {
  EARN = 'EARN',
  REDEEM = 'REDEEM'
}

export type ThemeTexture = 'minimal' | 'grain' | 'aurora' | 'glass';

export interface Clinic {
  id: string;
  name: string;
  primaryColor: string; // Hex code
  themeTexture: ThemeTexture;
  slug: string; // URL-friendly name
  logoUrl?: string;
  ownerName?: string;
  subscriptionTier: 'STARTER' | 'PRO' | 'ENTERPRISE';
  createdAt: string;
  adminUserId: string;
}

export interface User {
  id: string;
  clinicId: string; // Multi-tenant isolation
  mobile: string;
  email?: string; // Auth mapping
  name: string;
  role: Role;
  familyGroupId?: string;
  lifetimeSpend: number;
  currentTier: Tier;
  joinedAt: string;
  metadata?: Record<string, any>; // For family relation, age, etc.
}

export interface Wallet {
  id: string;
  userId: string;
  balance: number; // Cosmetic Credit
  lastTransactionAt: string;
}

export interface Transaction {
  id: string;
  walletId: string;
  clinicId: string; // Isolated records
  amountPaid: number;
  pointsEarned: number; // Positive for earn, negative for redeem
  category: TransactionCategory;
  type: TransactionType;
  date: string;
  description: string;
  carePlanId?: string; // Linked clinical protocol
}

export interface FamilyGroup {
  id: string;
  clinicId: string;
  headUserId: string;
  familyName: string;
}

export interface CarePlan {
  id: string;
  userId: string;
  clinicId: string;
  treatmentName: string;
  category: TransactionCategory;
  instructions: string[];
  checklist?: { id: string; task: string; completed: boolean }[];
  assignedAt: string;
  isActive: boolean;
  metadata?: Record<string, any>; // Used for Aligner Trays, Unit counts, etc.
}

// Appointment Types
export enum AppointmentStatus {
  SCHEDULED = 'SCHEDULED',
  CONFIRMED = 'CONFIRMED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  NO_SHOW = 'NO_SHOW'
}

export enum AppointmentType {
  CHECKUP = 'CHECKUP',
  CLEANING = 'CLEANING',
  TREATMENT = 'TREATMENT',
  CONSULTATION = 'CONSULTATION'
}

export interface Appointment {
  id: string;
  clinicId: string;
  patientId: string;
  doctorId?: string; // Optional, assigned doctor
  startTime: string; // ISO
  endTime: string; // ISO
  status: AppointmentStatus;
  type: AppointmentType;
  notes?: string;
  createdAt: string;
}

// UI State Types
export type ViewMode = 'PLATFORM_MASTER' | 'MOBILE_PATIENT' | 'DESKTOP_KIOSK';

export interface SystemConfig {
  platformName: string;
  baseCurrency: string;
  globalMfaEnabled: boolean;
  maintenanceMode: boolean;
  referralBonusPoints: number;
}

export interface DatabaseState {
  clinics: Clinic[];
  users: User[];
  wallets: Wallet[];
  transactions: Transaction[];
  familyGroups: FamilyGroup[];
  carePlans: CarePlan[];
  appointments: Appointment[];
}

export interface AppState extends DatabaseState {
  activeClinicId: string | null;
  currentUser: User | null;
  viewMode: ViewMode; // UI state only
}
