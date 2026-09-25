import React, { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Home, HeartPulse, Gift, User as UserIcon, Bell } from 'lucide-react';
import {
  Clinic, User, Wallet, Transaction, CarePlan, FamilyGroup, Appointment,
  AppointmentType, TransactionCategory, TransactionType, PatientNotification,
} from '../../types';
import { cn } from '../Doctor/ui/primitives';
import { Avatar, SectionLabel, Sheet } from './ui';
import TodayScreen from './screens/TodayScreen';
import CareScreen from './screens/CareScreen';
import RewardsScreen from './screens/RewardsScreen';
import YouScreen from './screens/YouScreen';
import MessagesSheet from './sheets/MessagesSheet';
import BookingSheet from './sheets/BookingSheet';
import RedeemSheet from './sheets/RedeemSheet';
import AddFamilySheet from './sheets/AddFamilySheet';
import Onboarding from './Onboarding';

export type PatientTab = 'TODAY' | 'CARE' | 'REWARDS' | 'YOU';

export interface PatientAppProps {
  currentUser: User;
  users: User[];
  wallets: Wallet[];
  transactions: Transaction[];
  carePlans: CarePlan[];
  familyGroups: FamilyGroup[];
  clinic: Clinic;
  appointments: Appointment[];
  onToggleChecklistItem: (planId: string, itemId: string) => void | Promise<any>;
  onUpdateCarePlan?: (planId: string, updates: Partial<CarePlan>) => void;
  onSchedule: (patientId: string, date: Date, type: AppointmentType, notes?: string) => Promise<{ success: boolean; error?: string }>;
  onAddFamilyMember: (mainUserId: string, name: string, relationship: string, mobile: string) => Promise<any>;
  onSwitchProfile: (userId: string) => void;
  onRedeem: (patientId: string, amount: number, category: TransactionCategory, type: TransactionType, template?: any) => Promise<any>;
  onLinkFamily: (headUserId: string, memberMobile: string) => Promise<any>;
  onGetNotifications?: (clinicId: string, patientId?: string) => Promise<{ success: boolean; updatedData?: PatientNotification[] }>;
  onMarkNotificationRead?: (id: string) => Promise<{ success: boolean }>;
  onSavePushSubscription?: (userId: string, clinicId: string, sub: any) => Promise<{ success: boolean }>;
  onDeletePushSubscription?: (endpoint: string) => Promise<{ success: boolean }>;
  defaultTab?: PatientTab;
}

const NAV: { id: PatientTab; label: string; icon: React.ElementType }[] = [
  { id: 'TODAY', label: 'Today', icon: Home },
  { id: 'CARE', label: 'Care', icon: HeartPulse },
  { id: 'REWARDS', label: 'Rewards', icon: Gift },
  { id: 'YOU', label: 'You', icon: UserIcon },
];

const PatientApp: React.FC<PatientAppProps> = (props) => {
  const {
    currentUser, users, wallets, transactions, carePlans, familyGroups, clinic, appointments,
    onToggleChecklistItem, onSchedule, onAddFamilyMember, onSwitchProfile, onRedeem, onLinkFamily,
    onGetNotifications, onMarkNotificationRead, onSavePushSubscription, onDeletePushSubscription,
    defaultTab = 'TODAY',
  } = props;

  const reduce = useReducedMotion();
  const [tab, setTab] = useState<PatientTab>(defaultTab);
  const [sheet, setSheet] = useState<null | 'messages' | 'booking' | 'redeem' | 'family'>(null);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [notifications, setNotifications] = useState<PatientNotification[] | null>(null);

  useEffect(() => {
    setShowOnboarding(!localStorage.getItem(`retain_onboarded_v2_${currentUser.id}`));
  }, [currentUser.id]);

  useEffect(() => {
    if (!onGetNotifications) return;
    let mounted = true;
    onGetNotifications(clinic.id, currentUser.id).then((r) => { if (mounted) setNotifications(r.updatedData || []); });
    return () => { mounted = false; };
  }, [clinic.id, currentUser.id, onGetNotifications]);

  // --- household-aware wallet ---
  const wallet = useMemo(() => {
    const own = wallets.find((w) => w.userId === currentUser.id);
    if (own) return own;
    if (currentUser.familyGroupId) {
      const group = familyGroups.find((f) => f.id === currentUser.familyGroupId);
      if (group) return wallets.find((w) => w.userId === group.headUserId);
    }
    return undefined;
  }, [wallets, currentUser, familyGroups]);

  const points = wallet?.balance || 0;

  const household = useMemo(
    () => users.filter((u) => u.clinicId === clinic.id && u.familyGroupId && u.familyGroupId === currentUser.familyGroupId),
    [users, clinic.id, currentUser.familyGroupId],
  );

  const myAppointments = useMemo(
    () => appointments.filter((a) => a.patientId === currentUser.id).sort((a, b) => +new Date(a.startTime) - +new Date(b.startTime)),
    [appointments, currentUser.id],
  );
  const nextAppt = useMemo(() => myAppointments.find((a) => +new Date(a.startTime) >= Date.now()), [myAppointments]);
  const pastAppointments = useMemo(
    () => myAppointments.filter((a) => +new Date(a.startTime) < Date.now()).sort((a, b) => +new Date(b.startTime) - +new Date(a.startTime)),
    [myAppointments],
  );

  const activePlan = useMemo(() => carePlans.find((cp) => cp.userId === currentUser.id && cp.isActive), [carePlans, currentUser.id]);
  const pastPlans = useMemo(() => carePlans.filter((cp) => cp.userId === currentUser.id && !cp.isActive), [carePlans, currentUser.id]);

  const ledger = useMemo(() => {
    if (!wallet) return [];
    return transactions.filter((t) => t.walletId === wallet.id).sort((a, b) => +new Date(b.date) - +new Date(a.date));
  }, [transactions, wallet]);

  const unreadCount = useMemo(() => (notifications || []).filter((n) => n.status !== 'READ').length, [notifications]);

  const toggleTask = async (itemId: string) => {
    if (!activePlan) return;
    await onToggleChecklistItem(activePlan.id, itemId);
  };

  const markRead = async (id: string) => {
    setNotifications((prev) => (prev || []).map((n) => (n.id === id ? { ...n, status: 'READ' } : n)));
    await onMarkNotificationRead?.(id);
  };

  const completeOnboarding = () => {
    localStorage.setItem(`retain_onboarded_v2_${currentUser.id}`, '1');
    setShowOnboarding(false);
  };

  return (
    <>
      {showOnboarding && <Onboarding clinicName={clinic.name} accent={clinic.primaryColor} onDone={completeOnboarding} />}

      <div className="min-h-[100dvh] bg-cream-200 font-sans text-ink-900">
        {/* Header */}
        <header className="sticky top-0 z-30 border-b border-ink-950/[0.06] bg-cream-200/85 backdrop-blur-md">
          <div className="mx-auto flex max-w-md items-center gap-3 px-5 py-3">
            <Avatar name={clinic.name} accent={clinic.primaryColor} size={36} />
            <div className="min-w-0 flex-1">
              <SectionLabel>Patient app</SectionLabel>
              <p className="truncate font-display text-sm font-bold leading-tight text-ink-900">{clinic.name}</p>
            </div>
            <button
              onClick={() => setSheet('messages')}
              aria-label={`Messages${unreadCount ? `, ${unreadCount} unread` : ''}`}
              className="relative flex h-10 w-10 items-center justify-center rounded-full border border-ink-950/10 bg-white text-ink-600"
            >
              <Bell size={17} />
              {unreadCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-[10px] font-bold text-white" style={{ backgroundColor: clinic.primaryColor }}>
                  {unreadCount}
                </span>
              )}
            </button>
          </div>
        </header>

        {/* Screens */}
        <main className="mx-auto max-w-md px-5 pb-32 pt-5">
          <AnimatePresence mode="wait">
            <motion.div
              key={tab}
              initial={reduce ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, y: -8 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            >
              {tab === 'TODAY' && (
                <TodayScreen
                  currentUser={currentUser}
                  clinic={clinic}
                  nextAppt={nextAppt}
                  activePlan={activePlan}
                  points={points}
                  unreadCount={unreadCount}
                  notifications={notifications}
                  onToggleTask={toggleTask}
                  onOpenMessages={() => setSheet('messages')}
                  onOpenBooking={() => setSheet('booking')}
                  onGoCare={() => setTab('CARE')}
                  onGoRewards={() => setTab('REWARDS')}
                />
              )}
              {tab === 'CARE' && (
                <CareScreen
                  clinic={clinic}
                  activePlan={activePlan}
                  pastPlans={pastPlans}
                  onToggleTask={toggleTask}
                  onBooking={() => setSheet('booking')}
                />
              )}
              {tab === 'REWARDS' && (
                <RewardsScreen
                  clinic={clinic}
                  currentUser={currentUser}
                  points={points}
                  ledger={ledger}
                  onRedeem={() => setSheet('redeem')}
                />
              )}
              {tab === 'YOU' && (
                <YouScreen
                  currentUser={currentUser}
                  clinic={clinic}
                  household={household}
                  pastAppointments={pastAppointments}
                  nextAppt={nextAppt}
                  notifications={notifications}
                  onSwitchProfile={onSwitchProfile}
                  onOpenFamily={() => setSheet('family')}
                  onOpenBooking={() => setSheet('booking')}
                  onSavePushSubscription={onSavePushSubscription}
                  onDeletePushSubscription={onDeletePushSubscription}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </main>

        {/* Bottom nav */}
        <nav className="fixed inset-x-0 bottom-0 z-40 px-5 pb-5">
          <div className="mx-auto flex max-w-md items-center justify-between rounded-full border border-ink-950/[0.06] bg-white/95 px-2 py-2 shadow-[0_12px_32px_-12px_rgba(16,24,40,0.28)] backdrop-blur-md">
            {NAV.map((item) => {
              const Icon = item.icon;
              const active = tab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setTab(item.id)}
                  aria-label={item.label}
                  aria-current={active ? 'page' : undefined}
                  className={cn('relative flex flex-1 flex-col items-center justify-center gap-1 rounded-full py-2.5 text-[10px] font-bold transition-colors', active ? 'text-white' : 'text-ink-400')}
                  style={active ? { backgroundColor: clinic.primaryColor } : undefined}
                >
                  <Icon size={19} />
                  {item.label}
                </button>
              );
            })}
          </div>
        </nav>
      </div>

      {/* Sheets */}
      <MessagesSheet
        open={sheet === 'messages'}
        onClose={() => setSheet(null)}
        notifications={notifications}
        onRead={markRead}
      />
      <BookingSheet
        open={sheet === 'booking'}
        onClose={() => setSheet(null)}
        clinic={clinic}
        patientId={currentUser.id}
        onSchedule={onSchedule}
      />
      <RedeemSheet
        open={sheet === 'redeem'}
        onClose={() => setSheet(null)}
        clinic={clinic}
        patientId={currentUser.id}
        points={points}
        onRedeem={onRedeem}
      />
      <AddFamilySheet
        open={sheet === 'family'}
        onClose={() => setSheet(null)}
        clinic={clinic}
        currentUser={currentUser}
        household={household}
        onAddFamilyMember={onAddFamilyMember}
        onLinkFamily={onLinkFamily}
      />
    </>
  );
};

export default PatientApp;
