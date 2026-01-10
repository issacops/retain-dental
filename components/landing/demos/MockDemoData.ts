import {
    User, Role, Tier, Clinic, Wallet, Transaction, TransactionCategory, TransactionType,
    CarePlan, FamilyGroup, Appointment, AppointmentStatus, AppointmentType, ThemeTexture
} from '../../../types';

export const MOCK_CLINIC: Clinic = {
    id: 'demo-clinic',
    name: 'Roots & Co.',
    primaryColor: '#6366f1',
    themeTexture: 'glass',
    slug: 'demo',
    subscriptionTier: 'PRO',
    createdAt: new Date().toISOString(),
    adminUserId: 'demo-doc',
    logoUrl: 'https://cdn-icons-png.flaticon.com/512/3063/3063822.png', // Temporary placeholder
    ownerName: 'Dr. Sarah Smith'
};

export const MOCK_USER: User = {
    id: 'demo-patient',
    clinicId: MOCK_CLINIC.id,
    name: 'Sarah Johnson',
    mobile: '+15550001234',
    role: Role.PATIENT,
    status: 'ACTIVE',
    familyGroupId: 'demo-family',
    lifetimeSpend: 12500,
    currentTier: Tier.GOLD,
    joinedAt: new Date().toISOString(),
    metadata: { relation: 'Self' }
};

export const MOCK_WALLET: Wallet = {
    id: 'demo-wallet',
    userId: MOCK_USER.id,
    balance: 2450,
    lastTransactionAt: new Date().toISOString()
};

export const MOCK_TRANSACTIONS: Transaction[] = [
    {
        id: 'tx1',
        walletId: MOCK_WALLET.id,
        clinicId: MOCK_CLINIC.id,
        amountPaid: 0,
        pointsEarned: 500,
        category: TransactionCategory.REWARD,
        type: TransactionType.EARN,
        date: new Date().toISOString(),
        description: 'Referral Bonus: Mike J.'
    },
    {
        id: 'tx2',
        walletId: MOCK_WALLET.id,
        clinicId: MOCK_CLINIC.id,
        amountPaid: 150,
        pointsEarned: 15,
        category: TransactionCategory.HYGIENE,
        type: TransactionType.EARN,
        date: new Date(Date.now() - 86400000).toISOString(),
        description: 'Routine Cleaning'
    }
];

export const MOCK_CARE_PLAN: CarePlan = {
    id: 'cp1',
    userId: MOCK_USER.id,
    clinicId: MOCK_CLINIC.id,
    treatmentName: 'Invisalign Gold',
    category: TransactionCategory.COSMETIC,
    instructions: ['Wear for 22h/day', 'Scan weekly'],
    checklist: [
        { id: 'c1', task: 'Morning Scan', completed: true },
        { id: 'c2', task: 'Evening Floss', completed: false }
    ],
    status: 'ACTIVE',
    assignedAt: new Date().toISOString(),
    isActive: true
};

export const MOCK_APPOINTMENTS: Appointment[] = [
    {
        id: 'apt1',
        clinicId: MOCK_CLINIC.id,
        patientId: MOCK_USER.id,
        startTime: new Date(Date.now() + 86400000 * 2).toISOString(), // 2 days later
        endTime: new Date(Date.now() + 86400000 * 2 + 3600000).toISOString(),
        status: AppointmentStatus.CONFIRMED,
        type: AppointmentType.CHECKUP,
        createdAt: new Date().toISOString()
    }
];

export const MOCK_ALL_USERS: User[] = [
    MOCK_USER,
    {
        id: 'demo-child',
        clinicId: MOCK_CLINIC.id,
        name: 'Leo Johnson',
        mobile: 'CHILD-1',
        role: Role.PATIENT,
        familyGroupId: 'demo-family',
        lifetimeSpend: 0,
        currentTier: Tier.MEMBER,
        joinedAt: new Date().toISOString(),
        metadata: { relation: 'Child' }
    }
];

export const MOCK_FAMILY_GROUPS: FamilyGroup[] = [
    {
        id: 'demo-family',
        clinicId: MOCK_CLINIC.id,
        headUserId: MOCK_USER.id,
        familyName: 'Johnson Family'
    }
];

// Mock Backend Service
export const mockBackendService = {
    getData: async () => ({
        clinics: [MOCK_CLINIC],
        users: MOCK_ALL_USERS,
        wallets: [MOCK_WALLET],
        transactions: MOCK_TRANSACTIONS,
        familyGroups: MOCK_FAMILY_GROUPS,
        carePlans: [MOCK_CARE_PLAN],
        appointments: MOCK_APPOINTMENTS
    }),
    processTransaction: async () => ({ success: true, updatedData: {} }),
    updateCarePlan: async () => ({ success: true, updatedData: {} }),
    linkFamilyMember: async () => ({ success: true, updatedData: {} }),
    addPatient: async () => ({ success: true, message: 'Success', user: MOCK_USER }),
    createClinic: async () => ({ success: true, updatedData: {} }),
    updateClinic: async () => ({ success: true, updatedData: {} }),
    updateSystemConfig: async () => ({ success: true }),
    toggleChecklistItem: async () => ({ success: true, updatedData: {} }),
    scheduleAppointment: async () => ({ success: true, updatedData: {} }),
    assignCarePlan: async () => ({ success: true, updatedData: {} }),
    terminateCarePlan: async () => ({ success: true, updatedData: {} }),
    updateAppointmentStatus: async () => ({ success: true, updatedData: {} }),
    addFamilyMember: async () => ({ success: true, updatedData: {} }),
    getDashboardStats: async () => ({ totalRevenue: 154000, activePatients: 124, treatments: 45 }),
    deleteClinic: async () => ({ success: true, updatedData: {} }),
    updateAdminAuth: async () => ({ success: true, message: 'Auth updated' }),
    deletePatient: async () => ({ success: true, updatedData: {} }),
    updateUser: async () => ({ success: true, updatedData: {} }),
    joinWaitlist: async () => ({ success: true, message: 'Added' })
};
