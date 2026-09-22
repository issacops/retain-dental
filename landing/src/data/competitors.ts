export interface Competitor {
  slug: string
  name: string
  tagline: string
  intro: string
  theirStrength: string
  ourAngle: string
  rows: { feature: string; retain: string | boolean; them: string | boolean }[]
  faqs: { question: string; answer: string }[]
}

const na = false

export const competitors: Competitor[] = [
  {
    slug: 'solutionreach',
    name: 'Solutionreach',
    tagline: 'Patient communication and engagement software',
    intro:
      'Solutionreach is a long-standing patient communication platform for dental and medical practices. It focuses on reminders, two-way texting, and reputation management.',
    theirStrength:
      'Solutionreach is strong at communication: appointment reminders, two-way texting, and review requests. If your only problem is "we need to text patients", it covers that.',
    ourAngle:
      'Retain Dental is not a messaging tool. It is the patient relationship between visits: aftercare in your own branded app, loyalty points, family pooling, and referral rewards. Messaging is a feature inside it, not the whole product.',
    rows: [
      { feature: 'Branded patient app (your logo and colours)', retain: true, them: na },
      { feature: 'Aftercare checklists with adherence tracking', retain: true, them: na },
      { feature: 'Loyalty points and membership tiers', retain: true, them: na },
      { feature: 'Household points pooling for families', retain: true, them: na },
      { feature: 'Referral rewards', retain: true, them: na },
      { feature: 'Two-way texting and reminders', retain: true, them: true },
      { feature: 'Review requests', retain: true, them: true },
      { feature: 'Multi-location dashboard', retain: true, them: true },
      { feature: 'Works alongside your PMS', retain: true, them: true },
      { feature: 'Time to live', retain: 'About 20 minutes', them: '1 to 2 weeks' },
    ],
    faqs: [
      {
        question: 'Is Retain Dental a replacement for Solutionreach?',
        answer:
          'For some practices, yes. Retain Dental covers reminders, recall, and review requests, and adds the branded app, aftercare, loyalty, and referrals that communication tools do not. Many practices run Retain Dental alongside their existing comms vendor while they transition.',
      },
      {
        question: 'Can I keep my existing texting number?',
        answer:
          'In most cases, yes. We port or forward your existing number as part of onboarding, so patients keep getting messages from the number they already know.',
      },
    ],
  },
  {
    slug: 'weave',
    name: 'Weave',
    tagline: 'Phone, texting, and reminders for dental practices',
    intro:
      'Weave is a communications suite built around the front desk: VoIP phones, texting, appointment reminders, and payments, often paired with hardware.',
    theirStrength:
      'Weave is genuinely good at the phones. If you want one vendor for your phone system, texting, and reminders, it is a sensible choice.',
    ourAngle:
      'Weave stops at the front desk. Retain Dental follows the patient home: aftercare in your branded app, points they keep, family pooling, and referral rewards that bring new patients in.',
    rows: [
      { feature: 'Branded patient app (your logo and colours)', retain: true, them: na },
      { feature: 'Aftercare checklists with adherence tracking', retain: true, them: na },
      { feature: 'Loyalty points and membership tiers', retain: true, them: na },
      { feature: 'Household points pooling for families', retain: true, them: na },
      { feature: 'Referral rewards', retain: true, them: na },
      { feature: 'Phone system (VoIP)', retain: na, them: true },
      { feature: 'Two-way texting and reminders', retain: true, them: true },
      { feature: 'In-app patient payments', retain: true, them: true },
      { feature: 'Works alongside your PMS', retain: true, them: true },
      { feature: 'Time to live', retain: 'About 20 minutes', them: 'Varies with hardware install' },
    ],
    faqs: [
      {
        question: 'Do I have to give up my phone system?',
        answer:
          'No. Retain Dental is not a phone system, so it does not replace Weave or your desk phones. It replaces the retention layer: aftercare, loyalty, and referrals.',
      },
      {
        question: 'Does Retain Dental do payments?',
        answer:
          'Yes. Patients can pay balances and treatment costs in your branded app, which reduces outstanding balances without extra hardware.',
      },
    ],
  },
  {
    slug: 'podium',
    name: 'Podium',
    tagline: 'Reviews, messaging, and payments',
    intro:
      'Podium is a reputation and messaging platform used across many local industries. Dental practices use it to collect reviews and manage texts and payments.',
    theirStrength:
      'Podium is excellent at reputation. If your number one problem is your Google rating, it will help, and it does it across every industry, not just dentistry.',
    ourAngle:
      'Podium helps you get found and get rated. Retain Dental helps you keep the patient: aftercare delivered in your own app, points and tiers, family pooling, and referrals. Reviews are one output, not the product.',
    rows: [
      { feature: 'Branded patient app (your logo and colours)', retain: true, them: na },
      { feature: 'Aftercare checklists with adherence tracking', retain: true, them: na },
      { feature: 'Loyalty points and membership tiers', retain: true, them: na },
      { feature: 'Household points pooling for families', retain: true, them: na },
      { feature: 'Referral rewards', retain: true, them: na },
      { feature: 'Review collection and reputation tools', retain: true, them: true },
      { feature: 'Two-way texting and reminders', retain: true, them: true },
      { feature: 'In-app payments', retain: true, them: true },
      { feature: 'Built specifically for dental workflows', retain: true, them: na },
      { feature: 'Time to live', retain: 'About 20 minutes', them: 'Days to weeks' },
    ],
    faqs: [
      {
        question: 'Can I use Podium for reviews and Retain Dental for retention?',
        answer:
          'Yes. Many practices run both. Retain Dental includes review requests triggered by aftercare, but if you already pay for Podium you can keep it and add Retain Dental for the app, aftercare, loyalty, and referrals.',
      },
      {
        question: 'Is Retain Dental only for dentistry?',
        answer:
          'Yes. Retain Dental is built specifically for dental practices: aftercare protocols for aligners, implants, and post-op care, plus dental-specific loyalty and recall workflows.',
      },
    ],
  },
]
