
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
  /** Daily habits shown as a tappable checklist in the patient app. */
  checklist?: string[];
  /** Pre-fills the checkout amount so the front desk doesn't retype it. */
  defaultCost?: number;
  /** Recommended recall interval for this procedure (months). */
  recallMonths?: number;
  customFields?: { key: string; label: string; type: 'number' | 'text' | 'date'; defaultValue: any }[];
}


export const TREATMENT_TEMPLATES: TreatmentTemplate[] = [
  // --- MOST POPULAR / COSMETIC ---
  {
    name: 'Invisalign / Clear Aligners',
    category: TransactionCategory.COSMETIC,
    defaultCost: 150000,
    recallMonths: 2,
    checklist: ['Wear aligners 22+ hours', 'Clean trays each morning', 'Use chewies twice daily', 'Switch tray on schedule'],
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
    defaultCost: 15000,
    checklist: ['Apply gel as directed', 'Avoid staining food for 48h', 'Use sensitivity toothpaste'],
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
    defaultCost: 45000,
    recallMonths: 3,
    checklist: ['Ice pack 10 min on / 10 off', 'Salt-water rinses from day 2', 'Soft diet for 7 days', 'No smoking'],
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
    defaultCost: 8000,
    recallMonths: 6,
    checklist: ['Avoid chewing on the tooth', 'Take medication as advised', 'Salt-water rinses', 'Report swelling or fever'],
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
    defaultCost: 3000,
    checklist: ['Bite on gauze for 30 min', 'Ice pack 10 min on / 10 off', 'No straws or smoking for 24h', 'Soft diet today'],
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
    defaultCost: 2000,
    recallMonths: 6,
    checklist: ['Brush twice daily', 'Floss every night', 'Use mouthwash'],
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
    defaultCost: 6000,
    recallMonths: 3,
    checklist: ['Brush gently twice daily', 'Use the prescribed rinse', 'Soft foods for 3 days', 'Floss as shown'],
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
  },
  {
    name: 'Fluoride Application',
    category: TransactionCategory.HYGIENE,
    defaultCost: 1500,
    recallMonths: 6,
    checklist: ['Avoid eating or drinking for 30 min', 'Brush gently tonight'],
    instructions: [
      'Do not eat or drink for 30 minutes after the application.',
      'Avoid hot drinks and brushing for the rest of the day.',
      'This strengthens enamel and helps prevent cavities.'
    ],
    customFields: [{ key: 'agent', label: 'Agent', type: 'text', defaultValue: '5% NaF Varnish' }]
  },
  {
    name: 'Dental Sealants',
    category: TransactionCategory.GENERAL,
    defaultCost: 1200,
    recallMonths: 12,
    checklist: ['Brush twice daily', 'Avoid very hard foods for 24h'],
    instructions: [
      'Avoid chewing very hard or sticky foods for 24 hours.',
      'Sealants protect the grooves of back teeth from decay.',
      'Sealants are checked at every routine visit.'
    ],
    customFields: [{ key: 'teeth', label: 'Teeth Sealed', type: 'text', defaultValue: '36, 46' }]
  },
  {
    name: 'Denture (Complete / Partial)',
    category: TransactionCategory.GENERAL,
    defaultCost: 35000,
    recallMonths: 12,
    checklist: ['Clean denture daily', 'Remove at night', 'Rinse after meals'],
    instructions: [
      'Clean the denture daily with a soft brush and denture cleaner.',
      'Remove it at night to let your gums rest.',
      'Expect a short adjustment period; report any sore spots.',
      'Do not use hot water, which can warp the denture.'
    ],
    customFields: [
      { key: 'type', label: 'Type', type: 'text', defaultValue: 'Complete Upper' },
      { key: 'material', label: 'Material', type: 'text', defaultValue: 'Acrylic' }
    ]
  },
  {
    name: 'Orthodontic Braces',
    category: TransactionCategory.COSMETIC,
    defaultCost: 120000,
    recallMonths: 1,
    checklist: ['Brush after every meal', 'Avoid hard and sticky foods', 'Wear elastics as instructed', 'Use interdental brush'],
    instructions: [
      'Avoid hard, sticky, and chewy foods that can break brackets.',
      'Brush after every meal and use an interdental brush.',
      'Wear elastics exactly as instructed to stay on schedule.',
      'A little soreness after adjustments is normal for a few days.'
    ],
    customFields: [
      { key: 'system', label: 'System', type: 'text', defaultValue: 'Metal' },
      { key: 'estimatedMonths', label: 'Est. Duration (Mos)', type: 'number', defaultValue: 18 }
    ]
  },
  {
    name: 'Emergency Pain Relief',
    category: TransactionCategory.GENERAL,
    defaultCost: 1500,
    checklist: ['Take medication as advised', 'Avoid very hot or cold foods', 'Call us if pain worsens'],
    instructions: [
      'Take the prescribed medication exactly as advised.',
      'Avoid very hot, cold, or sweet foods until reviewed.',
      'If pain or swelling gets worse, contact the clinic immediately.',
      'This is a temporary measure; definitive treatment will be planned.'
    ],
    customFields: [{ key: 'tooth', label: 'Tooth / Area', type: 'text', defaultValue: '' }]
  },
  {
    name: 'Periodontal Maintenance',
    category: TransactionCategory.HYGIENE,
    defaultCost: 3500,
    recallMonths: 3,
    checklist: ['Brush twice daily', 'Floss every night', 'Use interdental brushes'],
    instructions: [
      'Keep up excellent daily hygiene between visits.',
      'Use the interdental brushes shown to you at the clinic.',
      'Report any bleeding, swelling, or loose teeth promptly.'
    ],
    customFields: [{ key: 'pockets', label: 'Deepest Pocket (mm)', type: 'number', defaultValue: 4 }]
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
