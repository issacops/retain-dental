import { NotificationCategory, NotificationTemplate } from '../types';

/**
 * Merge tokens available to every template. Resolved at send time from the
 * patient, clinic, and appointment context. Kept intentionally small so the
 * composer stays approachable.
 */
export const NOTIFICATION_TOKENS: { token: string; label: string }[] = [
  { token: '{first_name}', label: 'First name' },
  { token: '{patient}', label: 'Full name' },
  { token: '{clinic}', label: 'Clinic name' },
  { token: '{provider}', label: 'Provider' },
  { token: '{procedure}', label: 'Procedure' },
  { token: '{day}', label: 'Day' },
  { token: '{date}', label: 'Date' },
  { token: '{time}', label: 'Time' },
  { token: '{phone}', label: 'Phone' },
  { token: '{balance}', label: 'Balance' },
  { token: '{points}', label: 'Points' },
];

export const NOTIFICATION_CATEGORIES: { key: NotificationCategory; label: string; tone: 'leaf' | 'sun' | 'mist' | 'blush' | 'neutral' }[] = [
  { key: 'Appointment', label: 'Appointments', tone: 'sun' },
  { key: 'Recall', label: 'Recall', tone: 'blush' },
  { key: 'Clinical', label: 'Clinical care', tone: 'mist' },
  { key: 'Financial', label: 'Billing', tone: 'leaf' },
  { key: 'Loyalty', label: 'Rewards', tone: 'leaf' },
  { key: 'Retention', label: 'Retention', tone: 'neutral' },
  { key: 'Greeting', label: 'Greetings', tone: 'blush' },
];

/** Categories that count as marketing and therefore carry an opt-out line. */
export const OPT_OUT_CATEGORIES: NotificationCategory[] = ['Recall', 'Loyalty', 'Retention', 'Greeting'];
export const OPT_OUT_LINE = 'You can turn these off any time in the app.';

/**
 * Built-in template library, grounded in dental patient-communication best
 * practice: short, personal (name + specific day/date/time + procedure), one
 * clear action, and no clinical detail (HIPAA).
 */
export const BUILT_IN_TEMPLATES: NotificationTemplate[] = [
  // --- Appointments ---
  {
    id: 'tpl-appt-confirmed', name: 'Booking confirmed', category: 'Appointment', builtIn: true,
    title: 'Appointment confirmed',
    body: 'Hi {first_name}, your appointment at {clinic} is confirmed for {day}, {date} at {time}. Please arrive 10 minutes early. To reschedule, call {phone}.',
  },
  {
    id: 'tpl-appt-confirm-request', name: 'Please confirm your visit', category: 'Appointment', builtIn: true,
    title: 'Please confirm your visit',
    body: 'Hi {first_name}, please confirm your appointment at {clinic} on {day}, {date} at {time}. If it no longer works, call {phone} so we can offer the slot to someone else.',
  },
  {
    id: 'tpl-appt-reminder-24h', name: 'Reminder — day before', category: 'Appointment', builtIn: true,
    title: 'See you tomorrow',
    body: 'Hi {first_name}, a reminder that your appointment at {clinic} is tomorrow at {time}. Reply here if you need to change it.',
  },
  {
    id: 'tpl-appt-reminder-day', name: 'Reminder — morning of', category: 'Appointment', builtIn: true,
    title: 'Your appointment is today',
    body: 'Hi {first_name}, your appointment at {clinic} is today at {time}. We look forward to seeing you!',
  },
  {
    id: 'tpl-appt-missed', name: 'We missed you (no-show)', category: 'Appointment', builtIn: true,
    title: 'We missed you today',
    body: 'Hi {first_name}, we missed you at your {time} appointment today. We hope everything is okay. Would you like to rebook? Call {phone} and we will find a time that works.',
  },

  // --- Recall ---
  {
    id: 'tpl-recall-due', name: 'Cleaning due', category: 'Recall', builtIn: true,
    title: 'Time for your next visit',
    body: 'Hi {first_name}, your {procedure} is due at {clinic}. Regular visits catch small issues early. Call {phone} or reply to book.',
  },
  {
    id: 'tpl-recall-overdue', name: 'Check-up overdue', category: 'Recall', builtIn: true,
    title: 'Your check-up is overdue',
    body: 'Hi {first_name}, we noticed it has been a while since your last visit to {clinic}. We would love to get you back on track. Call {phone} or reply to book a time.',
  },
  {
    id: 'tpl-recall-winback', name: 'Win-back (12+ months)', category: 'Recall', builtIn: true,
    title: 'We have missed you, {first_name}',
    body: 'Hi {first_name}, it has been over a year since your last visit to {clinic}. A lot can change in your oral health in that time, and we would love to see you again. Call {phone} whenever you are ready.',
  },
  {
    id: 'tpl-recall-benefits', name: 'Benefits expiring', category: 'Recall', builtIn: true,
    title: 'Use your dental benefits',
    body: 'Hi {first_name}, if you have dental insurance, your benefits may reset soon. A cleaning and exam is often fully covered. Call {phone} to use them before they expire.',
  },

  // --- Clinical ---
  {
    id: 'tpl-clin-preop', name: 'Pre-op instructions', category: 'Clinical', builtIn: true,
    title: 'Before your {procedure}',
    body: 'Hi {first_name}, your {procedure} at {clinic} is coming up. Please eat a light meal beforehand and arrange a ride if sedation is planned. Questions? Call {phone}.',
  },
  {
    id: 'tpl-clin-postop', name: 'Post-op check-in', category: 'Clinical', builtIn: true,
    title: 'Checking in after your visit',
    body: 'Hi {first_name}, {provider} wanted to check in after your {procedure}. Some sensitivity is normal for the first day or two. If anything concerns you, call {phone}.',
  },
  {
    id: 'tpl-clin-aftercare', name: 'Aftercare reminder', category: 'Clinical', builtIn: true,
    title: 'A gentle reminder for your recovery',
    body: 'Hi {first_name}, a quick reminder to follow your aftercare instructions after your {procedure}. Take it easy today, and reach us at {phone} with any questions.',
  },
  {
    id: 'tpl-clin-aligner', name: 'Aligner check-in', category: 'Clinical', builtIn: true,
    title: 'How are your aligners going?',
    body: 'Hi {first_name}, checking in on your aligner treatment. Remember to wear them 22 hours a day and keep your trays clean. Reply if you have any concerns.',
  },

  // --- Financial ---
  {
    id: 'tpl-fin-balance', name: 'Balance due', category: 'Financial', builtIn: true,
    title: 'A friendly reminder about your balance',
    body: 'Hi {first_name}, your account at {clinic} has an outstanding balance of {balance}. You can settle it at your next visit or call {phone}.',
  },
  {
    id: 'tpl-fin-received', name: 'Payment received', category: 'Financial', builtIn: true,
    title: 'Thank you for your payment',
    body: 'Hi {first_name}, we have received your payment at {clinic}. Your Smile Points balance is now {points}. Thank you!',
  },

  // --- Loyalty ---
  {
    id: 'tpl-loy-points', name: 'Points earned', category: 'Loyalty', builtIn: true,
    title: 'You have earned Smile Points',
    body: 'Hi {first_name}, you have earned {points} Smile Points at {clinic}. Redeem them on your next visit!',
  },
  {
    id: 'tpl-loy-review', name: 'Review request', category: 'Loyalty', builtIn: true,
    title: 'Would you leave us a review?',
    body: 'Hi {first_name}, thank you for visiting {clinic}. If you have a moment, a short review would mean a lot to our team and help other patients find us.',
  },
  {
    id: 'tpl-loy-birthday', name: 'Birthday wish', category: 'Loyalty', builtIn: true,
    title: 'Happy birthday, {first_name}!',
    body: 'Wishing you a happy birthday from all of us at {clinic}. We would love to see your smile this month. Call {phone} to book.',
  },

  // --- Retention ---
  {
    id: 'tpl-ret-next-step', name: 'Next treatment step', category: 'Retention', builtIn: true,
    title: 'Ready for the next step?',
    body: 'Hi {first_name}, now that your {procedure} is complete, the next step is ready whenever you are. Call {phone} to plan it in.',
  },
  {
    id: 'tpl-ret-referral', name: 'Referral invite', category: 'Retention', builtIn: true,
    title: 'Share {clinic} with a friend',
    body: 'Hi {first_name}, thank you for trusting us with your smile. If you refer a friend, you both earn bonus Smile Points. Just have them mention your name.',
  },
  // --- Greetings (festive + seasonal engagement) ---
  {
    id: 'tpl-greet-diwali', name: 'Diwali wishes', category: 'Greeting', builtIn: true,
    title: 'Happy Diwali, {first_name}!',
    body: 'Wishing you and your family a bright and happy Diwali from all of us at {clinic}. Enjoy the celebrations — and if your smile needs a little care afterwards, we are here.',
  },
  {
    id: 'tpl-greet-christmas', name: 'Christmas wishes', category: 'Greeting', builtIn: true,
    title: 'Merry Christmas, {first_name}!',
    body: 'Warm wishes from everyone at {clinic}. Have a lovely Christmas, enjoy the treats, and we will help with the aftercare.',
  },
  {
    id: 'tpl-greet-newyear', name: 'New Year wishes', category: 'Greeting', builtIn: true,
    title: 'Happy New Year, {first_name}!',
    body: 'From all of us at {clinic}, wishing you a healthy and happy new year. If a fresh smile is on your list this year, we would love to help.',
  },
  {
    id: 'tpl-greet-holi', name: 'Holi wishes', category: 'Greeting', builtIn: true,
    title: 'Happy Holi, {first_name}!',
    body: 'Have a joyful and colourful Holi from all of us at {clinic}. Take care of your smile, and see you soon.',
  },
  {
    id: 'tpl-greet-eid', name: 'Eid wishes', category: 'Greeting', builtIn: true,
    title: 'Eid Mubarak, {first_name}!',
    body: 'Eid Mubarak from everyone at {clinic}. Wishing you and your family a joyful celebration.',
  },
  {
    id: 'tpl-greet-thanksgiving', name: 'Thanksgiving', category: 'Greeting', builtIn: true,
    title: 'Happy Thanksgiving, {first_name}',
    body: 'We are grateful you trust us with your smile. Warm wishes from all of us at {clinic}.',
  },
  {
    id: 'tpl-greet-easter', name: 'Easter wishes', category: 'Greeting', builtIn: true,
    title: 'Happy Easter, {first_name}!',
    body: 'Wishing you a happy Easter from {clinic}. Enjoy the day — and the chocolate in moderation.',
  },
  {
    id: 'tpl-greet-anniversary', name: 'Patient anniversary', category: 'Greeting', builtIn: true,
    title: 'A year of smiles, {first_name}',
    body: 'It has been a year since you joined {clinic}. Thank you for trusting us with your smile — here is to many more healthy years.',
  },
  {
    id: 'tpl-greet-monsoon', name: 'Seasonal care tip', category: 'Greeting', builtIn: true,
    title: 'A small tip for the season',
    body: 'Hi {first_name}, a quick seasonal tip from {clinic}: rinse after street food and keep your brush dry to protect your enamel. Stay well!',
  },
  {
    id: 'tpl-greet-treat', name: 'Treat yourself nudge', category: 'Greeting', builtIn: true,
    title: 'Time to treat yourself, {first_name}',
    body: 'Hi {first_name}, it has been a busy season. If your smile could use a little care, we have openings this week. Call {phone} and we will find a time that suits you.',
  },
];
