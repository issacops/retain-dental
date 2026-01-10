
import { Role, Tier, User, FamilyGroup, Wallet, Transaction, TransactionCategory, TransactionType, Clinic } from './types';

// Business Logic Configuration
export const TIER_THRESHOLDS = {
  [Tier.MEMBER]: 0,
  [Tier.GOLD]: 25000,
  [Tier.PLATINUM]: 100000,
};

// Base earnings percentage by tier
export const TIER_REWARDS = {
  [Tier.MEMBER]: 0.02,   // 2% back
  [Tier.GOLD]: 0.05,     // 5% back
  [Tier.PLATINUM]: 0.10, // 10% back
};

// Economic Multipliers: Higher margin treatments reward more to encourage elective spend
export const REWARD_MULTIPLIERS = {
  [TransactionCategory.HYGIENE]: 1.0,
  [TransactionCategory.GENERAL]: 1.3,
  [TransactionCategory.COSMETIC]: 1.8, // 80% bonus points for high-margin elective work
};

export interface TreatmentTemplate {
  name: string;
  category: TransactionCategory;
  instructions: string[];
  customFields?: { key: string; label: string; type: 'number' | 'text' | 'date'; defaultValue: any }[];
}


export const TREATMENT_TEMPLATES: TreatmentTemplate[] = [
  // --- ALIGNERS & ORTHO (SPECIFIC) ---
  {
    name: 'Invisalign / Clear Aligners',
    category: TransactionCategory.COSMETIC,
    instructions: [
      'Wear trays for 22+ hours daily.',
      'Use "Chewies" for 5 minutes twice daily to seat trays.',
      'Clean trays with cold water and soft brush only.',
      'Switch to next tray only after completing full wear days.',
      'Keep previous tray as backup.'
    ],
    customFields: [
      { key: 'currentTray', label: 'Start Tray #', type: 'number', defaultValue: 1 },
      { key: 'totalTrays', label: 'Total Trays', type: 'number', defaultValue: 24 },
      { key: 'changeInterval', label: 'Days Per Tray', type: 'number', defaultValue: 10 },
      { key: 'nextApptWeeks', label: 'Review In (Weeks)', type: 'number', defaultValue: 6 }
    ]
  },
  {
    name: 'Retainer Maintenance',
    category: TransactionCategory.GENERAL,
    instructions: [
      'Wear retainers strictly every night.',
      'Store in the provided case when not in use.',
      'Soak in denture cleaner once a week.'
    ],
    customFields: [
      { key: 'retainerType', label: 'Type', type: 'text', defaultValue: 'Vivera' }
    ]
  },

  // --- AESTHETICS ---
  {
    name: 'Composite Bonding',
    category: TransactionCategory.COSMETIC,
    instructions: [
      'Avoid coffee, tea, and red wine for 48 hours to prevent staining.',
      'Do not bite fingernails or open packages with teeth.',
      'Floss carefully; pull floss out laterally, not up.'
    ],
    customFields: [
      { key: 'surfaces', label: 'Surfaces Treated', type: 'text', defaultValue: 'Fa' },
      { key: 'warrantyYears', label: 'Warranty (Yrs)', type: 'number', defaultValue: 2 }
    ]
  },
  {
    name: 'Laser Teeth Whitening',
    category: TransactionCategory.COSMETIC,
    instructions: [
      'Strict "White Diet" for 48 hours (Rice, Chicken, Water only).',
      'Use the desensitizing gel if electric shocks occur.',
      'Avoid colored toothpaste.'
    ],
    customFields: [
      { key: 'shadeStart', label: 'Start Shade', type: 'text', defaultValue: 'A3' },
      { key: 'shadeEnd', label: 'Achieved Shade', type: 'text', defaultValue: 'B1' }
    ]
  },

  // --- SURGICAL / IMPLANTS ---
  {
    name: 'Dental Implant (Placement)',
    category: TransactionCategory.GENERAL,
    instructions: [
      'Ice pack usage: 10 mins on, 10 mins off.',
      'Do not disturb the surgical site with tongue or fingers.',
      'Soft diet for 7 days. No seeds or nuts.',
      'Complete full course of antibiotics.'
    ],
    customFields: [
      { key: 'implantSystem', label: 'System', type: 'text', defaultValue: 'Nobel Biocare' },
      { key: 'implantSize', label: 'Size (mm)', type: 'text', defaultValue: '4.3 x 10' },
      { key: 'torque', label: 'Torque (Ncm)', type: 'number', defaultValue: 35 }
    ]
  },
  {
    name: 'Wisdom Tooth Extraction',
    category: TransactionCategory.GENERAL,
    instructions: [
      'Bite on gauze for 45 mins to stop bleeding.',
      'Do not spit, rinse vigorously, or use a straw (prevents Dry Socket).',
      'Sleep with head elevated.',
      'Salt water rinse after 24 hours only.'
    ],
    customFields: [
      { key: 'sutures', label: 'Sutures Placed', type: 'text', defaultValue: 'Resorbable' }
    ]
  },

  // --- RESTORATIVE ---
  {
    name: 'Root Canal Treatment',
    category: TransactionCategory.GENERAL,
    instructions: [
      'Avoid chewing on the treated tooth until crown is placed.',
      'Take painkillers before anesthesia wears off.',
      'Contact clinic if swelling occurs.'
    ],
    customFields: [
      { key: 'canals', label: 'Canals Found', type: 'number', defaultValue: 3 },
      { key: 'tempFilling', label: 'Temp Material', type: 'text', defaultValue: 'Cavit' }
    ]
  },
  {
    name: 'Crown Prep / Bridge',
    category: TransactionCategory.GENERAL,
    instructions: [
      'Avoid sticky foods (gum, caramel) that can pull off temporary.',
      'Sensitivity to cold is normal for a few days.',
      'Floss carefully around the temporary.'
    ],
    customFields: [
      { key: 'material', label: 'Material', type: 'text', defaultValue: 'Zirconia' },
      { key: 'shade', label: 'Shade', type: 'text', defaultValue: 'A2' }
    ]
  }
];

export const INITIAL_CLINICS: Clinic[] = [
  {
    id: 'clinic-1',
    name: 'City Dental Care',
    slug: 'city-dental',
    primaryColor: '#0ea5e9',
    // Fix: Added missing themeTexture property
    themeTexture: 'minimal',
    logoUrl: 'https://cdn-icons-png.flaticon.com/512/3063/3063321.png',
    subscriptionTier: 'PRO',
    createdAt: '2023-01-01T00:00:00Z',
    adminUserId: 'doc-1'
  }
];

export const INITIAL_USERS: User[] = [
  {
    id: 'super-1',
    clinicId: 'platform',
    mobile: 'super',
    name: 'Platform Master',
    role: Role.SUPER_ADMIN,
    lifetimeSpend: 0,
    currentTier: Tier.MEMBER,
    joinedAt: '2022-01-01T00:00:00Z',
  },
  {
    id: 'doc-1',
    clinicId: 'clinic-1',
    mobile: 'admin-1',
    name: 'Dr. Ayesha Gupta',
    role: Role.ADMIN,
    lifetimeSpend: 0,
    currentTier: Tier.MEMBER,
    joinedAt: '2022-11-01T09:00:00Z',
  },
  {
    id: 'user-1',
    clinicId: 'clinic-1',
    mobile: '9876543210',
    name: 'Rahul Sharma',
    role: Role.PATIENT,
    lifetimeSpend: 15000,
    currentTier: Tier.MEMBER,
    joinedAt: '2023-01-15T10:00:00Z',
  }
];

export const INITIAL_WALLETS: Wallet[] = [
  {
    id: 'wallet-1',
    userId: 'user-1',
    balance: 300,
    lastTransactionAt: '2023-10-05T16:30:00Z',
  }
];

export const INITIAL_TRANSACTIONS: Transaction[] = [];
export const INITIAL_FAMILIES: FamilyGroup[] = [];
