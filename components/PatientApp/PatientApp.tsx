import React, { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Home, HeartPulse, Gift, User as UserIcon, Bell, Plus } from 'lucide-react';
import {
  Clinic, User, Wallet, Transaction, CarePlan, FamilyGroup, Appointment,
  AppointmentType, TransactionCategory, TransactionType, PatientNotification,
} from '../../types';
import { cn } from '../Doctor/ui/primitives';
import { haptic } from '../../lib/haptics';
import { Aurora, Avatar, SectionLabel } from './ui';
import TodayScreen from './screens/TodayScreen';
import CareScreen from './screens/CareScreen';
import RewardsScreen from './screens/RewardsScreen';
import YouScreen from './screens/YouScreen';
import NotificationsScreen from './screens/NotificationsScreen';
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
  onAddFamilyMember: (mainUserId: string, name: string, relationship: string, age: string) => Promise<any>;
  onSwitchProfile: (userId: string) => void;
  onRedeem: (patientId: string, amount: number, category: TransactionCategory, type: TransactionType, template?: any) => Promise<any>;
  onLinkFamily: (headUserId: string, memberMobile: string) => Promise<any>;
  onGetNotifications?: (clinicId: string, patientId?: string) => Promise<{ success: boolean; updatedData?: PatientNotification[] }>;
  onMarkNotificationRead?: (id: string) => Promise<{ success: boolean }>;
  onSavePushSubscription?: (userId: string, clinicId: string, sub: any) => Promise<{ success: boolean }>;
  onDeletePushSubscription?: (endpoint: string) => Promise<{ success: boolean }>;
  defaultTab?: PatientTab;
}

const LEFT: { id: PatientTab; label: string; icon: React.ElementType }[] = [
  { id: 'TODAY', label: 'Today', icon: Home },
  { id: 'CARE', label: 'Care', icon: HeartPulse },
];
const RIGHT: { id: PatientTab; label: string; icon: React.ElementType }[] = [
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
  const [sheet, setSheet] = useState<null | 'booking' | 'redeem' | 'family'>(null);
  const [showNotifications, setShowNotifications] = useState(false);
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
    const completesAll = (activePlan.checklist || []).every((t) => t.completed || t.id === itemId);
    haptic(completesAll ? 'success' : 'light');
    await onToggleChecklistItem(activePlan.id, itemId);
  };

  const markRead = async (id: string) => {
    haptic('light');
    setNotifications((prev) => (prev || []).map((n) => (n.id === id ? { ...n, status: 'READ' } : n)));
    await onMarkNotificationRead?.(id);
  };

  const readAll = async () => {
    const unreadIds = (notifications || []).filter((n) => n.status !== 'READ').map((n) => n.id);
    setNotifications((prev) => (prev || []).map((n) => ({ ...n, status: 'READ' })));
    await Promise.all(unreadIds.map((id) => onMarkNotificationRead?.(id)));
  };

  const completeOnboarding = () => {
    localStorage.setItem(`retain_onboarded_v2_${currentUser.id}`, '1');
    setShowOnboarding(false);
  };

  const NavButton: React.FC<{ item: { id: PatientTab; label: string; icon: React.ElementType } }> = ({ item }) => {
    const Icon = item.icon;
    const active = tab === item.id;
    return (
      <button
        onClick={() => { haptic('selection'); setTab(item.id); }}
        aria-label={item.label}
        aria-current={active ? 'page' : undefined}
        className="relative flex flex-1 flex-col items-center justify-center gap-1 rounded-full py-2.5 text-[10px] font-bold text-ink-400 transition-colors"
        style={active ? { color: clinic.primaryColor } : undefined}
      >
        <Icon size={19} />
        {item.label}
        {active && <span className="absolute -bottom-0.5 h-1 w-1 rounded-full" style={{ backgroundColor: clinic.primaryColor }} />}
      </button>
    );
  };

  return (
    <>
      <Aurora accent={clinic.primaryColor} />
      {showOnboarding && <Onboarding clinicName={clinic.name} accent={clinic.primaryColor} onDone={completeOnboarding} />}

      <div className="min-h-[100dvh] font-sans text-ink-900">
        {/* Header */}
        <header className="sticky top-0 z-30 border-b border-white/40 bg-cream-50/70 backdrop-blur-xl">
          <div className="mx-auto flex max-w-md items-center gap-3 px-5 py-3">
            <Avatar name={clinic.name} accent={clinic.primaryColor} size={36} />
            <div className="min-w-0 flex-1">
              <SectionLabel>Patient app</SectionLabel>
              <p className="truncate font-display text-sm font-bold leading-tight text-ink-900">{clinic.name}</p>
            </div>
            <button
              onClick={() => { haptic('light'); setShowNotifications(true); }}
              aria-label={`Messages${unreadCount ? `, ${unreadCount} unread` : ''}`}
              className="relative flex h-10 w-10 items-center justify-center rounded-full border border-white/60 bg-white/60 text-ink-600 backdrop-blur-md"
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
                  appointments={myAppointments}
                  nextAppt={nextAppt}
                  activePlan={activePlan}
                  points={points}
                  unreadCount={unreadCount}
                  notifications={notifications}
                  onToggleTask={toggleTask}
                  onOpenMessages={() => setShowNotifications(true)}
                  onOpenBooking={() => setSheet('booking')}
                  onGoCare={() => setTab('CARE')}
                  onGoRewards={() => setTab('REWARDS')}
                />
              )}
              {tab === 'CARE' && (
                <CareScreen clinic={clinic} activePlan={activePlan} pastPlans={pastPlans} onToggleTask={toggleTask} onBooking={() => setSheet('booking')} />
              )}
              {tab === 'REWARDS' && (
                <RewardsScreen clinic={clinic} currentUser={currentUser} points={points} ledger={ledger} onRedeem={() => setSheet('redeem')} />
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

        {/* Floating nav */}
        <nav className="fixed inset-x-0 bottom-0 z-40 px-5 pb-5">
          <div className="relative mx-auto flex max-w-md items-center justify-between rounded-full border border-white/60 bg-white/75 px-2 py-2 shadow-[0_16px_40px_-16px_rgba(16,24,40,0.35)] backdrop-blur-2xl">
            {LEFT.map((i) => <NavButton key={i.id} item={i} />)}
            <div className="w-14" />
            {RIGHT.map((i) => <NavButton key={i.id} item={i} />)}
            <button
              onClick={() => { haptic('medium'); setSheet('booking'); }}
              aria-label="Book a visit"
              className="absolute left-1/2 top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full text-white shadow-[0_12px_26px_-10px_rgba(16,24,40,0.7)] transition-transform active:scale-95"
              style={{ backgroundColor: clinic.primaryColor }}
            >
              <Plus size={24} />
            </button>
          </div>
        </nav>
      </div>

      <NotificationsScreen open={showNotifications} onClose={() => setShowNotifications(false)} accent={clinic.primaryColor} notifications={notifications} onRead={markRead} onReadAll={readAll} />
      <BookingSheet open={sheet === 'booking'} onClose={() => setSheet(null)} clinic={clinic} patientId={currentUser.id} onSchedule={onSchedule} />
      <RedeemSheet open={sheet === 'redeem'} onClose={() => setSheet(null)} clinic={clinic} patientId={currentUser.id} points={points} onRedeem={onRedeem} />
      <AddFamilySheet open={sheet === 'family'} onClose={() => setSheet(null)} clinic={clinic} currentUser={currentUser} household={household} onAddFamilyMember={onAddFamilyMember} onLinkFamily={onLinkFamily} />
    </>
  );
};

export default PatientApp;
