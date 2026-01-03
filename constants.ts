
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
  // --- ORTHODONTICS & ALIGNERS (COSMETIC/GENERAL) ---
  {
    name: 'Invisalign / Clear Aligners',
    category: TransactionCategory.COSMETIC,
    instructions: [
      'Wear trays for 22+ hours daily.',
      'Rinse trays with lukewarm water only.',
      'Use "Chewies" for 5 minutes twice daily to seat trays.',
      'Remove only for eating, drinking (except water), and brushing.'
    ],
    customFields: [
      { key: 'currentTray', label: 'Start Tray #', type: 'number', defaultValue: 1 },
      { key: 'totalTrays', label: 'Total Trays', type: 'number', defaultValue: 24 },
      { key: 'changeInterval', label: 'Days Per Tray', type: 'number', defaultValue: 10 }
    ]
  },
  {
    name: 'Metal / Ceramic Braces',
    category: TransactionCategory.GENERAL,
    instructions: [
      'Avoid sticky, hard, or crunchy foods (carrots, nuts, ice).',
      'Use interdental brushes to clean around brackets.',
      'Apply orthodontic wax to sharp areas if irritation occurs.'
    ],
    customFields: [
      { key: 'adjustmentCount', label: 'Adjustment #', type: 'number', defaultValue: 1 },
      { key: 'nextTightening', label: 'Weeks until next', type: 'number', defaultValue: 4 }
    ]
  },

  // --- AESTHETICS (COSMETIC - 1.8x REWARDS) ---
  {
    name: 'E-Max Porcelain Veneers',
    category: TransactionCategory.COSMETIC,
    instructions: [
      'Avoid biting into hard objects (apples, pens).',
      'Wear night guard strictly to prevent nocturnal chipping.',
      'Maintain 6-month professional cleaning schedule.'
    ],
    customFields: [
      { key: 'units', label: 'Units Placed', type: 'number', defaultValue: 6 },
      { key: 'shadeCode', label: 'Shade (VITA)', type: 'text', defaultValue: 'BL2' }
    ]
  },
  {
    name: 'Laser Teeth Whitening',
    category: TransactionCategory.COSMETIC,
    instructions: [
      'Follow the "White Diet" for 48 hours (no turmeric, coffee, red wine).',
      'Avoid smoking for 48 hours.',
      'Use desensitizing gel if mild sensitivity occurs.'
    ],
    customFields: [
      { key: 'shadeBefore', label: 'Initial Shade', type: 'text', defaultValue: 'A3' },
      { key: 'shadeAfter', label: 'Final Shade', type: 'text', defaultValue: 'B1' }
    ]
  },
  {
    name: 'Gum Contouring (Gingivectomy)',
    category: TransactionCategory.COSMETIC,
    instructions: [
      'Avoid spicy or acidic foods for 3 days.',
      'Gently brush the area with a soft brush.',
      'Use prescribed chlorhexidine rinse twice daily.'
    ]
  },

  // --- ENDODONTICS (GENERAL - 1.3x REWARDS) ---
  {
    name: 'Single Sitting Root Canal (RCT)',
    category: TransactionCategory.GENERAL,
    instructions: [
      'Do not chew on the treated side until the permanent crown is fitted.',
      'Return in 7 days for permanent core build-up/capping.',
      'Take Ibuprofen/Paracetamol if mild throbbing occurs.'
    ],
    customFields: [
      { key: 'toothNum', label: 'Tooth #', type: 'number', defaultValue: 46 },
      { key: 'fillingMaterial', label: 'Obturation', type: 'text', defaultValue: 'Gutta Percha' }
    ]
  },
  {
    name: 'Post & Core Build-up',
    category: TransactionCategory.GENERAL,
    instructions: [
      'Avoid sticky foods that could dislodge the temporary crown.',
      'Maintain regular flossing around the base.'
    ]
  },

  // --- ORAL SURGERY (GENERAL - 1.3x REWARDS) ---
  {
    name: 'Wisdom Tooth Extraction (Surgical)',
    category: TransactionCategory.GENERAL,
    instructions: [
      'Bite on gauze firmly for 60 minutes.',
      'No spitting, smoking, or using straws for 24 hours.',
      'Apply cold compress: 20 mins on, 20 mins off for the first day.',
      'Eat only soft, cold foods (yogurt, ice cream) today.'
    ],
    customFields: [
      { key: 'sutureRemoval', label: 'Suture Removal (Days)', type: 'number', defaultValue: 7 },
      { key: 'difficulty', label: 'Impaction Grade', type: 'text', defaultValue: 'Class II' }
    ]
  },
  {
    name: 'Dental Implant (Placement)',
    category: TransactionCategory.GENERAL,
    instructions: [
      'Avoid vigorous rinsing for 24 hours.',
      'Take the full course of prescribed antibiotics.',
      'Soft diet for 2 weeks during initial healing.'
    ],
    customFields: [
      { key: 'implantBrand', label: 'System', type: 'text', defaultValue: 'Straumann BLX' },
      { key: 'healingWeeks', label: 'Osseointegration (Wks)', type: 'number', defaultValue: 12 }
    ]
  },
  {
    name: 'Sinus Lift / Bone Graft',
    category: TransactionCategory.GENERAL,
    instructions: [
      'Do not blow your nose for 2 weeks.',
      'Sneeze with your mouth open to prevent pressure.',
      'Avoid air travel for 10 days.'
    ]
  },

  // --- PROSTHODONTICS ---
  {
    name: 'Full Mouth Rehabilitation',
    category: TransactionCategory.GENERAL,
    instructions: [
      'You may experience muscle fatigue for a few days.',
      'Check your bite; if any point feels "high," visit us immediately.',
      'Speech will adjust to new teeth within 7-10 days.'
    ],
    customFields: [
      { key: 'phase', label: 'Current Phase', type: 'text', defaultValue: 'Temporaries' }
    ]
  },
  {
    name: 'Complete / Partial Denture',
    category: TransactionCategory.GENERAL,
    instructions: [
      'Clean dentures over a sink filled with water to avoid breakage if dropped.',
      'Soak dentures in water/solution overnight.',
      'Brush gums and tongue daily even without natural teeth.'
    ]
  },

  // --- PERIODONTICS & HYGIENE (HYGIENE - 1.0x REWARDS) ---
  {
    name: 'Scaling & Polishing (Hygiene)',
    category: TransactionCategory.HYGIENE,
    instructions: [
      'Mild gum bleeding is normal for 24 hours.',
      'Use a soft toothbrush for 2 days.',
      'Return for check-up in 6 months.'
    ],
    customFields: [
      { key: 'calculusIndex', label: 'Calculus Level', type: 'text', defaultValue: 'Moderate' }
    ]
  },
  {
    name: 'Deep Scaling (Root Planing)',
    category: TransactionCategory.HYGIENE,
    instructions: [
      'Rinse with warm salt water twice daily.',
      'Avoid very hot or very cold foods for 48 hours.',
      'Sensitivity to cold is normal for 1 week.'
    ],
    customFields: [
      { key: 'pocketsDepth', label: 'Avg Pocket Depth', type: 'number', defaultValue: 5 }
    ]
  },

  // --- PEDIATRIC DENTISTRY ---
  {
    name: 'Pulpectomy / Kids Root Canal',
    category: TransactionCategory.GENERAL,
    instructions: [
      'Monitor child to ensure they don\'t bite their numb lip/cheek.',
      'No hard candy for 24 hours.',
      'Normal activities can resume after numbness wears off.'
    ]
  },
  {
    name: 'Fluoride Therapy / Sealants',
    category: TransactionCategory.HYGIENE,
    instructions: [
      'No eating or drinking for 30 minutes.',
      'No hard, sticky foods for 4 hours.',
      'No brushing until tomorrow morning.'
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
