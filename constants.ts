
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
  // --- MOST POPULAR / COSMETIC ---
  {
    name: 'Invisalign / Clear Aligners',
    category: TransactionCategory.COSMETIC,
    instructions: [
      'Wear trays for 22+ hours daily. Only remove for eating and brushing.',
      'Use "Chewies" for 5 minutes twice daily to ensure trays are fully seated.',
      'Clean trays with cold water and soft brush only. Do not use hot water.',
      'Switch to next tray only after completing the full prescribed days.',
      'Keep your previous tray in the packet as a backup.'
    ],
    customFields: [
      { key: 'currentTray', label: 'Start Tray #', type: 'number', defaultValue: 1 },
      { key: 'totalTrays', label: 'Total Trays', type: 'number', defaultValue: 24 },
      { key: 'changeInterval', label: 'Days Per Tray', type: 'number', defaultValue: 10 },
      { key: 'nextApptWeeks', label: 'Review In (Weeks)', type: 'number', defaultValue: 6 }
    ]
  },
  {
    name: 'Teeth Whitening (Home Kit)',
    category: TransactionCategory.COSMETIC,
    instructions: [
      'Apply a small drop of gel into each tooth compartment of the tray.',
      'Wear for the prescribed time (usually 2-4 hours or overnight).',
      'Wipe away excess gel from gums immediately to prevent burning.',
      'Avoid "staining" foods (coffee, tea, curry, wine) for 48 hours.',
      'Use sensitivity toothpaste if you experience "zings".'
    ],
    customFields: [
      { key: 'shadeStart', label: 'Start Shade', type: 'text', defaultValue: 'A3' },
      { key: 'targetShade', label: 'Target Shade', type: 'text', defaultValue: 'B1' },
      { key: 'concentration', label: 'Gel %', type: 'text', defaultValue: '10% CP' }
    ]
  },
  {
    name: 'Composite Bonding',
    category: TransactionCategory.COSMETIC,
    instructions: [
      'Avoid coffee, tea, and red wine for 48 hours to prevent potential staining.',
      'Do not bite fingernails, pens, or open packages with your front teeth.',
      'Floss carefully; pull floss out laterally, not popping it up.',
      'Attend polish appointments every 6 months to maintain shine.'
    ],
    customFields: [
      { key: 'surfaces', label: 'Surfaces Treated', type: 'text', defaultValue: 'Unknown' },
      { key: 'warrantyYears', label: 'Warranty (Yrs)', type: 'number', defaultValue: 2 }
    ]
  },
  {
    name: 'Porcelain Veneers',
    category: TransactionCategory.COSMETIC,
    instructions: [
      'It is normal for gums to be slightly sore for a few days.',
      'Sensitivity to hot/cold is common for 1-2 weeks.',
      'Wear your night guard every night to protect the porcelain.',
      'Maintain excellent hygiene; veneers cannot decay but the tooth under them can.'
    ],
    customFields: [
      { key: 'veneerCount', label: 'Unit Count', type: 'number', defaultValue: 1 },
      { key: 'cementShade', label: 'Cement Shade', type: 'text', defaultValue: 'Translucent' }
    ]
  },

  // --- GENERAL / RESTORATIVE ---
  {
    name: 'Dental Implant',
    category: TransactionCategory.GENERAL,
    instructions: [
      'Apply ice pack to face: 10 mins on, 10 mins off for first 24 hours.',
      'Do not disturb the surgical site with tongue or fingers.',
      'Soft diet for 7 days. Absolutely no seeds, nuts, or popcorn.',
      'Rinse gently with warm salt water starting from Day 2.',
      'Avoid smoking for at least 7 days as it causes failure.'
    ],
    customFields: [
      { key: 'site', label: 'Implant Site', type: 'text', defaultValue: 'UR1' },
      { key: 'implantBrand', label: 'System', type: 'text', defaultValue: 'Straumann' },
      { key: 'healingTime', label: 'Integration (Mos)', type: 'number', defaultValue: 3 }
    ]
  },
  {
    name: 'Root Canal Treatment',
    category: TransactionCategory.GENERAL,
    instructions: [
      'Avoid chewing on the treated tooth until the permanent crown is placed.',
      'The tooth may feel tender for 3-5 days; taking ibuprofen helps.',
      'If you develop visible swelling or a fever, contact the clinic immediately.',
      'Be gentle when brushing around the temporary filling.'
    ],
    customFields: [
      { key: 'tooth', label: 'Tooth #', type: 'text', defaultValue: '' },
      { key: 'canals', label: 'Canals Found', type: 'number', defaultValue: 1 },
      { key: 'visitStage', label: 'Stage', type: 'text', defaultValue: 'Obturation' }
    ]
  },
  {
    name: 'Dental Crown',
    category: TransactionCategory.GENERAL,
    instructions: [
      'Avoid sticky foods (gum, toffee) while waiting for the permanent crown.',
      'Floss by pulling the floss through the side rather than popping it up.',
      'Sensitivity is normal for a few days after placement.',
      'If the bite feels "high" (hitting first), call us for an adjustment.'
    ],
    customFields: [
      { key: 'material', label: 'Material', type: 'text', defaultValue: 'Zirconia' },
      { key: 'glaze', label: 'Shade', type: 'text', defaultValue: 'A2' }
    ]
  },
  {
    name: 'White Filling (Composite)',
    category: TransactionCategory.GENERAL,
    instructions: [
      'You can chew as soon as the numbness wears off (composite sets instantly).',
      'The tooth may be sensitive to cold for a few days.',
      'If the bite feels uneven or "high", return for an adjustment.',
      'Maintain regular flossing to prevent decay around the edges.'
    ],
    customFields: [
      { key: 'surfaces', label: 'Surfaces', type: 'text', defaultValue: 'MO' },
      { key: 'bondingAgent', label: 'Bond', type: 'text', defaultValue: 'Scotchbond' }
    ]
  },
  {
    name: 'Wisdom Tooth Extraction',
    category: TransactionCategory.GENERAL,
    instructions: [
      'Bite firmly on gauze for 30 minutes to stop bleeding.',
      'Do NOT rinse, spit, or use a straw for 24 hours (prevents Dry Socket).',
      'Soft foods only (yogurt, mash, soup) for 2-3 days.',
      'No smoking for at least 48-72 hours.',
      'Use painkillers as prescribed before the numbness wears off.'
    ],
    customFields: [
      { key: 'difficulty', label: 'Difficulty', type: 'text', defaultValue: 'Surgical' },
      { key: 'sutures', label: 'Sutures Placed', type: 'number', defaultValue: 0 }
    ]
  },
  {
    name: 'Simple Tooth Extraction',
    category: TransactionCategory.GENERAL,
    instructions: [
      'Keep the gauze pack in place with pressure for 20 minutes.',
      'Avoid hot drinks and alcohol for 24 hours.',
      'Do not disturb the clot with your tongue.',
      'Take painkillers if needed, but avoid aspirin.'
    ],
    customFields: [
      { key: 'tooth', label: 'Tooth #', type: 'text', defaultValue: '' },
      { key: 'comments', label: 'Notes', type: 'text', defaultValue: '' }
    ]
  },

  // --- HYGIENE / PREVENTIVE ---
  {
    name: 'Scale & Polish (Cleaning)',
    category: TransactionCategory.HYGIENE,
    instructions: [
      'Gums may feel slightly tender or bleed slightly today.',
      'Use warm salt water rinses if gums are sore.',
      'Avoid staining foods (curry, wine) for 2 hours as pores are open.',
      'Resume normal brushing and flossing tonight.'
    ],
    customFields: [
      { key: 'recall', label: 'Recall (Months)', type: 'number', defaultValue: 6 },
      { key: 'gumHealth', label: 'Gum Score', type: 'text', defaultValue: 'Healthy' }
    ]
  },
  {
    name: 'Deep Cleaning (Perio)',
    category: TransactionCategory.HYGIENE,
    instructions: [
      'Numbness may last for a few hours; chew carefully.',
      'Sensitivity to cold is common as roots heal.',
      'Use the prescribed mouthwash or salt water rinses.',
      'Use interdental brushes strictly as advised.'
    ],
    customFields: [
      { key: 'quadrants', label: 'Quadrants', type: 'text', defaultValue: 'UR, LR' },
      { key: 'nextVisit', label: 'Review', type: 'text', defaultValue: '3 Months' }
    ]
  },
  {
    name: 'Night Guard / Splint',
    category: TransactionCategory.GENERAL,
    instructions: [
      'Wear every night to protect teeth from grinding.',
      'Bring the guard to every check-up for adjustment.',
      'Clean with cold water and soap; do not use hot water.',
      'If it feels too tight, run it under warm water before inserting.'
    ],
    customFields: [
      { key: 'type', label: 'Design', type: 'text', defaultValue: 'Michigan' },
      { key: 'material', label: 'Material', type: 'text', defaultValue: 'Hard/Soft' }
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
