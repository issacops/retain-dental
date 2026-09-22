export interface Post {
  slug: string
  title: string
  excerpt: string
  date: string
  author: string
  tags: string[]
  featured?: boolean
  quickAnswer?: string
}

export const posts: Post[] = [
  {
    slug: 'retention-playbook',
    title: 'How to Reduce Patient Attrition: The Dental Loyalty Playbook',
    excerpt: 'A practical 5-step framework to cut patient attrition in your dental practice, built from the data of 12 pilot clinics on Retain Dental.',
    date: '2026-06-10',
    author: 'Retain Dental Team',
    tags: ['Retention', 'Playbook'],
    featured: true,
    quickAnswer:
      'Most dental practices lose 15 to 20% of active patients a year. The fix is a system, not a campaign: own a channel (a branded app), reward the behavior you want, automate recall, track aftercare adherence, and make referrals part of the loyalty tier.',
  },
  {
    slug: 'white-label-app',
    title: 'Why Your Dental Practice Needs a Branded Patient App in 2026',
    excerpt: 'A branded patient app is no longer a nice-to-have. It is the difference between a practice patients remember and a practice they forget.',
    date: '2026-06-04',
    author: 'Retain Dental Team',
    tags: ['Branding', 'Mobile'],
    featured: true,
    quickAnswer:
      'A branded patient app keeps patients in a channel you own instead of a social feed you rent. It is where aftercare, recalls, rewards, and referrals live, and it launches as a progressive web app in about 20 minutes.',
  },
  {
    slug: 'recall-showdown',
    title: 'Recall Software Showdown: Manual SMS vs Automated Workflows',
    excerpt: 'We benchmarked manual SMS recall against automated workflow recall across 12 pilot clinics. Here is what the data says.',
    date: '2026-05-28',
    author: 'Retain Dental Team',
    tags: ['Recall', 'Benchmark'],
    quickAnswer:
      'Automated multi-channel recall completed 42% more appointments than manual SMS in a six-month benchmark across 12 pilot clinics, mainly by removing the human follow-up step that staff never have time for.',
  },
  {
    slug: 'dental-patient-reactivation',
    title: 'The Dental Patient Reactivation Playbook: How We Won Back 34% of Lost Patients in 90 Days',
    excerpt: 'Every dental practice has a graveyard of inactive patients. Here is a systematic reactivation framework that recovered 34% of lapsed patients across 6 pilot clinics.',
    date: '2026-05-12',
    author: 'Dr. Vikram Singh',
    tags: ['Growth', 'Playbook'],
    featured: true,
    quickAnswer:
      'Reactivation works when it is a sequence, not a single text. A three-touch mix of SMS, email, and an incentive recovered 34% of lapsed patients in 90 days across six pilot clinics.',
  },
  {
    slug: 'dental-marketing-roi',
    title: 'Dental Practice Marketing ROI: A Data-Driven Framework for Every Dollar',
    excerpt: 'Most dental practices cannot tell you which marketing channel delivers their best patients. Here is a tracking framework with real attribution data from 18 clinics.',
    date: '2026-03-15',
    author: 'Dr. Aditya Verma',
    tags: ['Analytics', 'Marketing'],
    quickAnswer:
      'Track marketing by patient lifetime value, not by lead cost. When you attribute revenue per channel and factor in retention and referrals, the cheapest leads are often the least profitable patients.',
  },
  {
    slug: 'dental-sms-marketing-tcpa',
    title: 'Dental SMS Marketing: TCPA Compliance, Consent, and Best Practices',
    excerpt: 'TCPA rulings have changed how dental practices can communicate by SMS. Here is what is allowed, what is not, and how to build a compliant messaging strategy.',
    date: '2026-01-08',
    author: 'Dr. Ananya Shah',
    tags: ['Compliance', 'Marketing'],
    quickAnswer:
      'You need prior express written consent for marketing texts, clear opt-out language, and quiet-hours rules. Appointment and treatment reminders need documented consent too, so keep a single source of truth for permissions.',
  },
  {
    slug: 'dental-website-conversion',
    title: 'Dental Website Conversion Optimisation: 7 Changes That Doubled Our Booking Rate',
    excerpt: 'Your dental website is your most important marketing asset. Here are the exact changes that doubled booking conversion from 2.1% to 4.3%.',
    date: '2025-11-20',
    author: 'Dr. Karan Malhotra',
    tags: ['Digital', 'Marketing'],
    quickAnswer:
      'The biggest wins were a single obvious booking action above the fold, real reviews with names, mobile tap targets over 48 pixels, and removing the form fields patients never fill in.',
  },
  {
    slug: 'dental-social-media-compliance',
    title: 'Dental Social Media Marketing Without Getting Sued: A Compliance Guide',
    excerpt: 'The line between effective dental social media and a HIPAA violation is thinner than most dentists realise. Here is how to market on Instagram without exposing PHI.',
    date: '2025-10-12',
    author: 'Dr. Neha Reddy',
    tags: ['Marketing', 'Compliance'],
    quickAnswer:
      'Never post a patient photo, name, or detail without written authorization, even in a story. Use stock or fully de-identified images, and keep all patient conversations off public comment threads.',
  },
  {
    slug: 'patient-onboarding-automation',
    title: 'Dental Patient Onboarding Automation: Saved Our Front Desk 12 Hours Per Week',
    excerpt: 'The patient onboarding process is the highest-friction moment in the dental experience. Here is how we automated intake forms and consent collection.',
    date: '2025-09-05',
    author: 'Dr. Deepa Iyer',
    tags: ['Operations', 'Technology'],
    quickAnswer:
      'Move intake forms, consent, and insurance details to a link the patient completes before the visit. It cut 12 hours of front-desk work per week and reduced day-of paperwork friction.',
  },
  {
    slug: 'dental-membership-plan-guide',
    title: 'The Complete Guide to Dental Membership Plans: Pricing, Tiers, and Retention Data',
    excerpt: 'In-house dental membership plans are the fastest-growing alternative to insurance. A data-backed guide on pricing, tier structure, and retention benchmarks from 25 clinics.',
    date: '2025-08-15',
    author: 'Dr. Rohan Kapoor',
    tags: ['Revenue', 'Strategy'],
    quickAnswer:
      'A membership plan works when the tiers are simple and the top tier feels reachable. Plans with two or three tiers and a clear savings story retain members at roughly twice the rate of single-tier plans.',
  },
  {
    slug: 'ai-dental-patient-engagement',
    title: 'AI in Dental Patient Engagement: What Actually Works',
    excerpt: 'From automated compliance tracking to AI-powered recall prioritisation, what artificial intelligence realistically does for dental practices today.',
    date: '2025-07-28',
    author: 'Dr. Sanjay Gupta',
    tags: ['Technology', 'Innovation'],
    quickAnswer:
      'The useful AI today is unglamorous: ranking which lapsed patients are most likely to return, drafting recall messages, and flagging aftercare patients who are falling behind. It should assist staff, not replace the relationship.',
  },
  {
    slug: 'multi-location-dental-branding',
    title: 'How We Unified 6 Dental Brands Under One Patient Loyalty System',
    excerpt: 'Multi-location groups face a unique challenge: build network loyalty without erasing local doctor relationships. Here is exactly how we did it.',
    date: '2025-07-01',
    author: 'Dr. Kavita Joshi',
    tags: ['Branding', 'DSO'],
    quickAnswer:
      'Keep the local practice name and doctor front and center, and put the network brand in the background. Patients stay loyal to their dentist; the group brand earns loyalty through consistency and shared rewards.',
  },
  {
    slug: 'patient-lifetime-value',
    title: 'Why Most Dentists Calculate Patient Lifetime Value Wrong',
    excerpt: 'The standard LTV formula ignores retention curves, referral multipliers, and household effects. Here is a better model, backed by 5 years of data from 30+ clinics.',
    date: '2025-06-08',
    author: 'Dr. Arjun Nair',
    tags: ['Finance', 'Analytics'],
    quickAnswer:
      'Most LTV formulas stop at average spend times visits. A better model adds how long patients stay, how many people they refer, and whether their family joins, which can double the real value of a patient.',
  },
  {
    slug: 'dental-loyalty-app-guide',
    title: 'How to Launch a Dental Loyalty App for Your Clinic in 2026',
    excerpt: 'A step-by-step guide to launching a custom-branded patient loyalty app for your dental practice, from PMS integration to patient onboarding.',
    date: '2025-06-01',
    author: 'Retain Dental Team',
    tags: ['App', 'Loyalty'],
    quickAnswer:
      'Pick a platform that is white-label and launches without app-store review, add your branding, import patients, and reward aftercare check-ins as well as spend. Most practices are live in about 20 minutes.',
  },
  {
    slug: 'dental-google-reviews-strategy',
    title: 'How We Built a 4.9-Star Google Reputation Without Violating HIPAA',
    excerpt: 'The complete playbook for earning more Google reviews in dentistry, legally, ethically, and at scale. 85 reviews to 640+ in 8 months.',
    date: '2025-05-18',
    author: 'Dr. Meera Desai',
    tags: ['Marketing', 'Reputation'],
    quickAnswer:
      'Ask at the moment of highest satisfaction, make the request one tap, and never mention treatment details in the ask. A steady flow of simple requests beats a single big campaign.',
  },
  {
    slug: 'hipaa-patient-communication',
    title: 'HIPAA-Compliant Patient Communication: What Every Practice Needs to Know',
    excerpt: 'New HIPAA guidance on patient communication channels means your practice may be exposing PHI without realising it. Here is your compliance roadmap.',
    date: '2025-04-22',
    author: 'Dr. Vikram Singh',
    tags: ['Compliance', 'Legal'],
    quickAnswer:
      'Use a signed BAA with every vendor that touches PHI, encrypt messages in transit and at rest, and keep marketing separate from clinical communication. Plain SMS and email are not automatically compliant.',
  },
  {
    slug: 'recall-system-comparison',
    title: 'Manual Recall vs Automated Recall: We Benchmarked 12 Clinics',
    excerpt: 'A 6-month head-to-head comparison of manual recall vs automated multi-channel workflow. The automated system delivered 42% higher recall completion.',
    date: '2025-04-02',
    author: 'Dr. Anika Patel',
    tags: ['Operations', 'Benchmark'],
    quickAnswer:
      'Automated recall completed 42% more appointments over six months. The gain came from consistency and multi-channel timing, not from better messaging.',
  },
  {
    slug: 'dso-patient-retention',
    title: 'Why DSOs Lose Patients Faster Than Solo Practices (And What We Did)',
    excerpt: 'DSOs face a unique retention problem: patients feel loyal to the doctor, not the brand. Here is how a 14-clinic DSO cut churn by 31%.',
    date: '2025-03-10',
    author: 'Dr. Rajesh Kumar',
    tags: ['DSO', 'Strategy'],
    quickAnswer:
      'DSOs churn faster because loyalty sits with the individual dentist. Sharing rewards and aftercare across locations, and keeping the local doctor visible, cut churn by 31% for one 14-clinic group.',
  },
  {
    slug: 'invisalign-compliance-roi',
    title: 'The Real Cost of Invisalign Non-Compliance (And How We Fixed It)',
    excerpt: 'Poor aligner compliance is the number one reason Invisalign cases run long. Daily selfie tracking pushed compliance from 12 hours to 21.5 hours.',
    date: '2025-02-14',
    author: 'Dr. Priya Sharma',
    tags: ['Orthodontics', 'Research'],
    quickAnswer:
      'Every extra month of aligner wear costs chair time and delays the next case. Daily photo check-ins raised average wear from 12 to 21.5 hours and shortened case times.',
  },
  {
    slug: 'no-show-prevention',
    title: 'Why Dental Patients No-Show (And the System That Finally Fixed It)',
    excerpt: 'After losing $120K+ annually to no-shows, we built a layered prevention system that cut missed appointments by 68%. Exact scripts and workflows included.',
    date: '2025-01-20',
    author: 'Dr. Aarav Mehta',
    tags: ['Operations', 'Popular'],
    featured: true,
    quickAnswer:
      'No-shows are a communication problem, not a patient problem. Layered reminders, easy rescheduling, and a small confirmation incentive cut missed appointments by 68%.',
  },
  {
    slug: 'invisalign-compliance-tracking',
    title: 'How Invisalign Compliance Tracking Boosts Treatment Outcomes',
    excerpt: 'Using photo analysis to track aligner wear time and improve patient compliance, with real data from 12 pilot clinics.',
    date: '2025-05-15',
    author: 'Retain Dental Team',
    tags: ['Invisalign', 'Compliance'],
    quickAnswer:
      'Tracking wear time in the patient app makes compliance visible to both sides. When patients can see their own streak and points, wear time rises and cases finish on schedule.',
  },
  {
    slug: 'reduce-dental-patient-churn',
    title: '6 Proven Strategies to Reduce Dental Patient Churn',
    excerpt: 'Stop losing patients with automated recalls, family rewards pooling, and aftercare that keeps patients engaged between visits.',
    date: '2025-04-20',
    author: 'Retain Dental Team',
    tags: ['Retention', 'Marketing'],
    quickAnswer:
      'The six levers that move churn are automated recall, aftercare follow-through, loyalty tiers, family pooling, referral rewards, and a branded app patients actually open.',
  },
]

export const featuredPosts = posts.filter((p) => p.featured)
export const sortedPosts = [...posts].sort((a, b) => +new Date(b.date) - +new Date(a.date))
export const allTags = [...new Set(posts.flatMap((p) => p.tags))].sort()
