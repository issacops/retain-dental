
import {
  User, Wallet, Transaction, Tier, Role,
  TransactionType, TransactionCategory,
  FamilyGroup, Clinic, CarePlan, ThemeTexture,
  Appointment, AppointmentStatus, AppointmentType
} from '../types';
import { TIER_THRESHOLDS, TIER_REWARDS, REWARD_MULTIPLIERS, INITIAL_CLINICS, INITIAL_USERS, INITIAL_WALLETS, INITIAL_TRANSACTIONS, INITIAL_FAMILIES } from '../constants';

export interface GlobalActivityLog {
  id: string;
  clinicName: string;
  userName: string;
  action: string;
  timestamp: string;
  type: 'INFO' | 'SUCCESS' | 'UPGRADE' | 'REVENUE' | 'SECURITY' | 'DEPLOYMENT';
}

export interface SystemConfig {
  platformName: string;
  baseCurrency: string;
  globalMfaEnabled: boolean;
  maintenanceMode: boolean;
  referralBonusPoints: number;
}

export class MockBackendService {
  private static instance: MockBackendService;

  private clinics: Clinic[];
  private users: User[];
  private wallets: Wallet[];
  private transactions: Transaction[];
  private familyGroups: FamilyGroup[];
  private carePlans: CarePlan[];
  private appointments: Appointment[];
  private activityLogs: GlobalActivityLog[] = [];
  private systemConfig: SystemConfig;

  private constructor() {
    const savedState = typeof window !== 'undefined' ? localStorage.getItem('dentalOS_db_v2') : null;

    if (savedState) {
      const parsed = JSON.parse(savedState);
      this.clinics = parsed.clinics;
      this.users = parsed.users;
      this.wallets = parsed.wallets;
      this.transactions = parsed.transactions;
      this.familyGroups = parsed.familyGroups;
      this.carePlans = parsed.carePlans || [];
      this.appointments = parsed.appointments || [];
      this.systemConfig = parsed.systemConfig || {
        platformName: 'PracticePrime OS',
        baseCurrency: 'INR',
        globalMfaEnabled: true,
        maintenanceMode: false,
        referralBonusPoints: 500
      };
      this.activityLogs = parsed.activityLogs || [];
    } else {
      // Load from constants if no persistence
      this.clinics = [...INITIAL_CLINICS];
      this.users = [...INITIAL_USERS];
      this.wallets = [...INITIAL_WALLETS];
      this.transactions = [...INITIAL_TRANSACTIONS];
      this.familyGroups = [...INITIAL_FAMILIES];
      this.carePlans = [];
      this.appointments = [];
      this.systemConfig = {
        platformName: 'PracticePrime OS',
        baseCurrency: 'INR',
        globalMfaEnabled: true,
        maintenanceMode: false,
        referralBonusPoints: 500
      };
      this.generateInitialLogs();
    }
  }

  public static getInstance(): MockBackendService {
    if (!MockBackendService.instance) {
      MockBackendService.instance = new MockBackendService();
    }
    return MockBackendService.instance;
  }

  private persist() {
    if (typeof window === 'undefined') return;

    const state = {
      clinics: this.clinics,
      users: this.users,
      wallets: this.wallets,
      transactions: this.transactions,
      familyGroups: this.familyGroups,
      carePlans: this.carePlans,
      appointments: this.appointments,
      systemConfig: this.systemConfig,
      activityLogs: this.activityLogs
    };
    localStorage.setItem('dentalOS_db_v2', JSON.stringify(state));
  }

  private generateInitialLogs() {
    this.activityLogs = [
      { id: 'l1', clinicName: 'System', userName: 'Admin', action: 'Global security audit completed', timestamp: new Date(Date.now() - 7200000).toISOString(), type: 'SECURITY' },
      { id: 'l2', clinicName: 'System', userName: 'DevOps', action: 'Shard-B performance optimization', timestamp: new Date(Date.now() - 3600000).toISOString(), type: 'DEPLOYMENT' },
      { id: 'l3', clinicName: 'City Dental', userName: 'Rahul S.', action: 'Earned 300 Smile Points', timestamp: new Date(Date.now() - 1800000).toISOString(), type: 'REVENUE' }
    ];
    this.persist();
  }

  private logActivity(clinicName: string, userName: string, action: string, type: GlobalActivityLog['type']) {
    this.activityLogs.unshift({
      id: `l-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      clinicName,
      userName,
      action,
      timestamp: new Date().toISOString(),
      type
    });
    if (this.activityLogs.length > 100) this.activityLogs.pop();
    this.persist();
  }

  public processTransaction(
    clinicId: string,
    patientId: string,
    amount: number,
    category: TransactionCategory,
    type: TransactionType,
    carePlanTemplate?: { name: string; instructions: string[]; metadata?: Record<string, any> }
  ): { success: boolean; message: string; updatedData?: any } {
    const user = this.users.find(u => u.id === patientId);
    const clinic = this.clinics.find(c => c.id === clinicId);
    if (!user || !clinic) return { success: false, message: 'Identity not verified' };

    const wallet = this.getEffectiveWallet(patientId);
    if (!wallet) return { success: false, message: 'Wallet mapping failed' };

    let pointsChange = 0;
    let newCarePlanId: string | undefined = undefined;

    if (type === TransactionType.EARN) {
      const headUser = this.getHeadUser(patientId);
      headUser!.lifetimeSpend += amount;

      if (headUser!.lifetimeSpend >= TIER_THRESHOLDS[Tier.PLATINUM]) headUser!.currentTier = Tier.PLATINUM;
      else if (headUser!.lifetimeSpend >= TIER_THRESHOLDS[Tier.GOLD]) headUser!.currentTier = Tier.GOLD;

      const baseRate = TIER_REWARDS[headUser!.currentTier];
      const multiplier = REWARD_MULTIPLIERS[category];
      pointsChange = Math.floor(amount * baseRate * multiplier);

      wallet.balance += pointsChange;

      if (carePlanTemplate) {
        newCarePlanId = `care-${Date.now()}`;
        this.carePlans = this.carePlans.map(cp => cp.userId === patientId ? { ...cp, isActive: false } : cp);
        this.carePlans.unshift({
          id: newCarePlanId,
          userId: patientId,
          clinicId: clinicId,
          treatmentName: carePlanTemplate.name,
          category,
          instructions: carePlanTemplate.instructions,
          checklist: carePlanTemplate.instructions.map(ins => ({ id: Math.random().toString(36).substr(2, 9), task: ins, completed: false })),
          assignedAt: new Date().toISOString(),
          isActive: true,
          metadata: carePlanTemplate.metadata || {}
        });
      }

      this.logActivity(clinic.name, user.name, `Recorded ₹${amount.toLocaleString()} ${category} treatment`, 'REVENUE');
    } else {
      // REDEMPTION LOGIC
      let actualRedeem = 0;

      if (category === TransactionCategory.REWARD) {
        // Direct Reward (e.g. 5000 pts for Whitening)
        actualRedeem = amount; // Here 'amount' is the point cost
      } else {
        // Bill Discount (cap at 25% of bill value via points)
        actualRedeem = Math.min(wallet.balance, Math.floor(amount * 0.25));
      }

      if (wallet.balance < actualRedeem) return { success: false, message: 'Insufficient Smile Points' };
      if (actualRedeem <= 0) return { success: false, message: 'Invalid redemption amount' };

      pointsChange = -actualRedeem;
      wallet.balance -= actualRedeem;
      this.logActivity(clinic.name, user.name, `Redeemed ${actualRedeem} points for ${category === TransactionCategory.REWARD ? 'Reward' : 'Discount'}`, 'SUCCESS');
    }

    this.transactions.unshift({
      id: `tx-${Date.now()}`,
      walletId: wallet.id,
      clinicId,
      amountPaid: type === TransactionType.EARN ? amount : 0,
      pointsEarned: pointsChange,
      category,
      type,
      date: new Date().toISOString(),
      description: carePlanTemplate ? carePlanTemplate.name : `${category} Visit`,
      carePlanId: newCarePlanId
    });

    this.persist();
    return { success: true, message: 'Ledger updated', updatedData: this.getData() };
  }

  public toggleChecklistItem(carePlanId: string, itemId: string) {
    const plan = this.carePlans.find(p => p.id === carePlanId);
    if (plan && plan.checklist) {
      const item = plan.checklist.find(i => i.id === itemId);
      if (item) {
        item.completed = !item.completed;
        this.persist();
        return { success: true, updatedData: this.getData() };
      }
    }
    return { success: false };
  }

  public createClinic(name: string, color: string, texture: ThemeTexture, ownerName: string, logoUrl: string): { success: boolean; message: string; updatedData?: any } {
    const newClinicId = `clinic-${Date.now()}`;
    const newAdminId = `doc-${Date.now()}`;

    const newClinic: Clinic = {
      id: newClinicId,
      name,
      ownerName,
      logoUrl,
      themeTexture: texture,
      slug: name.toLowerCase().replace(/\s+/g, '-'),
      primaryColor: color,
      subscriptionTier: Math.random() > 0.5 ? 'PRO' : 'STARTER',
      createdAt: new Date().toISOString(),
      adminUserId: newAdminId
    };

    const newAdmin: User = {
      id: newAdminId, clinicId: newClinicId, mobile: `admin-${newClinicId}`, name: ownerName,
      role: Role.ADMIN, lifetimeSpend: 0, currentTier: Tier.MEMBER, joinedAt: new Date().toISOString()
    };

    // Create a default patient for this clinic so Patient App is accessible immediately
    const newPatientId = `patient-${Date.now()}`;
    const newPatient: User = {
      id: newPatientId, clinicId: newClinicId, mobile: '9999999999', name: 'Guest Patient',
      role: Role.PATIENT, lifetimeSpend: 0, currentTier: Tier.MEMBER, joinedAt: new Date().toISOString()
    };

    this.clinics.push(newClinic);
    this.users.push(newAdmin);
    this.users.push(newPatient); // Add patient

    // Wallet for patient
    this.wallets.push({
      id: `wallet-${newPatientId}`,
      userId: newPatientId,
      balance: 0,
      lastTransactionAt: new Date().toISOString()
    });

    this.logActivity(name, ownerName, 'Joined the platform (Subscription: ' + newClinic.subscriptionTier + ')', 'UPGRADE');
    this.persist();

    return { success: true, message: 'Network expanded', updatedData: this.getData() };
  }

  public deleteClinic(clinicId: string): { success: boolean; message: string; updatedData?: any } {
    const clinicIndex = this.clinics.findIndex(c => c.id === clinicId);
    if (clinicIndex === -1) return { success: false, message: 'Node not found' };

    const clinicName = this.clinics[clinicIndex].name;

    // Filter out clinic-specific data
    this.clinics = this.clinics.filter(c => c.id !== clinicId);
    const usersToDelete = this.users.filter(u => u.clinicId === clinicId);
    this.users = this.users.filter(u => u.clinicId !== clinicId);

    const userIds = usersToDelete.map(u => u.id);
    this.wallets = this.wallets.filter(w => !userIds.includes(w.userId));
    this.transactions = this.transactions.filter(t => t.clinicId !== clinicId);
    this.appointments = this.appointments.filter(a => a.clinicId !== clinicId);
    // Note: Family groups logic is complex, for MVP just leaving orphaned groups or filtering if Head User is gone.
    this.familyGroups = this.familyGroups.filter(fg => this.users.find(u => u.id === fg.headUserId));

    this.logActivity('Platform', 'Super Admin', `Decommissioned Node: ${clinicName}`, 'SECURITY');
    this.persist();

    return { success: true, message: 'Node decommissioned', updatedData: this.getData() };
  }

  public getPlatformStats() {
    const activePatients = this.users.filter(u => u.role === Role.PATIENT);
    const totalGTV = this.transactions.filter(t => t.type === TransactionType.EARN).reduce((a, b) => a + b.amountPaid, 0);
    const mrr = this.clinics.reduce((sum, c) => sum + (c.subscriptionTier === 'PRO' ? 4999 : 1999), 0);

    const clinicPerformance = this.clinics.map(c => {
      const clinicTxs = this.transactions.filter(t => t.clinicId === c.id && t.type === TransactionType.EARN);
      const rev = clinicTxs.reduce((a, b) => a + b.amountPaid, 0);
      const patients = this.users.filter(u => u.clinicId === c.id && u.role === Role.PATIENT).length;
      return {
        id: c.id, name: c.name, revenue: rev, patients, slug: c.slug,
        rpp: patients > 0 ? rev / patients : 0,
        tier: c.subscriptionTier, color: c.primaryColor, logo: c.logoUrl, createdAt: c.createdAt
      };
    }).sort((a, b) => b.revenue - a.revenue);

    return {
      totalClinics: this.clinics.length,
      totalPatients: activePatients.length,
      mrr,
      totalSystemRevenue: totalGTV,
      subscriptionMix: [
        { name: 'Starter', value: this.clinics.filter(c => c.subscriptionTier === 'STARTER').length },
        { name: 'Pro', value: this.clinics.filter(c => c.subscriptionTier === 'PRO').length }
      ],
      clinicPerformance,
      recentActivity: this.activityLogs,
      config: this.systemConfig,
      shards: [
        { id: 'SHARD-A', region: 'Mumbai (South)', health: 98, load: 34, latency: '12ms' },
        { id: 'SHARD-B', region: 'Delhi (NCR)', health: 100, load: 12, latency: '8ms' },
        { id: 'SHARD-C', region: 'Bangalore', health: 95, load: 67, latency: '18ms' }
      ]
    };
  }

  public updateSystemConfig(updates: Partial<SystemConfig>): { success: boolean; message: string } {
    this.systemConfig = { ...this.systemConfig, ...updates };
    this.logActivity('Platform', 'Admin', 'Updated system configuration', 'INFO');
    this.persist();
    return { success: true, message: 'Configuration deployed globally' };
  }

  private getEffectiveWallet(userId: string): Wallet | undefined {
    const user = this.users.find(u => u.id === userId);
    if (user?.familyGroupId) {
      const fam = this.familyGroups.find(f => f.id === user.familyGroupId);
      return this.wallets.find(w => w.userId === fam?.headUserId);
    }
    return this.wallets.find(w => w.userId === userId);
  }

  private getHeadUser(userId: string): User | undefined {
    const user = this.users.find(u => u.id === userId);
    if (user?.familyGroupId) {
      const f = this.familyGroups.find(fg => fg.id === user.familyGroupId);
      return this.users.find(u => u.id === f?.headUserId);
    }
    return user;
  }

  public getData() {
    return {
      clinics: [...this.clinics],
      users: [...this.users],
      wallets: [...this.wallets],
      transactions: [...this.transactions],
      familyGroups: [...this.familyGroups],
      carePlans: [...this.carePlans],
      appointments: [...this.appointments]
    };
  }

  // --- APPOINTMENT MODULE ---

  public scheduleAppointment(clinicId: string, patientId: string, doctorId: string | undefined, startTime: string, endTime: string, type: AppointmentType, notes?: string) {
    // Basic validation: Check for overlaps (simplified for MVP)
    const overlap = this.appointments.find(a =>
      a.clinicId === clinicId &&
      a.status !== AppointmentStatus.CANCELLED &&
      ((new Date(startTime) >= new Date(a.startTime) && new Date(startTime) < new Date(a.endTime)) ||
        (new Date(endTime) > new Date(a.startTime) && new Date(endTime) <= new Date(a.endTime)))
    );

    if (overlap) return { success: false, message: 'Time slot unavailable' };

    const newAppt: Appointment = {
      id: `appt-${Date.now()}`,
      clinicId,
      patientId,
      doctorId,
      startTime,
      endTime,
      type,
      status: AppointmentStatus.SCHEDULED,
      notes,
      createdAt: new Date().toISOString()
    };

    this.appointments.push(newAppt);
    const patientName = this.users.find(u => u.id === patientId)?.name || 'Unknown';
    this.logActivity(this.clinics.find(c => c.id === clinicId)?.name || 'Clinic', patientName, `Scheduled ${type} appointment`, 'INFO');

    this.persist();
    return { success: true, message: 'Appointment locked', updatedData: this.getData() };
  }

  public updateAppointmentStatus(appointmentId: string, status: AppointmentStatus) {
    const appt = this.appointments.find(a => a.id === appointmentId);
    if (!appt) return { success: false, message: 'Appointment not found' };

    appt.status = status;
    this.persist();
    return { success: true, message: `Status updated to ${status}`, updatedData: this.getData() };
  }

  // --- FAMILY MODULE ---

  public addFamilyMember(headUserId: string, name: string, relation: string, age: string) {
    const headUser = this.users.find(u => u.id === headUserId);
    if (!headUser) return { success: false, message: 'Head user not found' };

    let familyGroup = this.familyGroups.find(fg => fg.headUserId === headUserId || fg.id === headUser.familyGroupId);

    // Create group if doesn't exist
    if (!familyGroup) {
      familyGroup = {
        id: `fam-${Date.now()}`,
        clinicId: headUser.clinicId,
        headUserId: headUser.id,
        familyName: headUser.name.split(' ')[1] || headUser.name
      };
      this.familyGroups.push(familyGroup);
      headUser.familyGroupId = familyGroup.id;
    }

    const newMember: User = {
      id: `user-${Date.now()}`,
      clinicId: headUser.clinicId,
      mobile: `linked-${Date.now()}`, // Placeholder logic
      name: name,
      role: Role.PATIENT,
      familyGroupId: familyGroup.id,
      lifetimeSpend: 0,
      currentTier: Tier.MEMBER,
      joinedAt: new Date().toISOString(),
      metadata: { relation, age }
    };

    this.users.push(newMember);

    // Create wallet for new member (or shared? - plan said individual wallets for now)
    this.wallets.push({
      id: `wallet-${newMember.id}`,
      userId: newMember.id,
      balance: 0,
      lastTransactionAt: new Date().toISOString()
    });

    this.persist();
    return { success: true, message: 'Family member added', updatedData: this.getData() };
  }

  public updateCarePlan(carePlanId: string, updates: Partial<CarePlan>) {
    const index = this.carePlans.findIndex(cp => cp.id === carePlanId);
    if (index === -1) return { success: false, message: 'Protocol not found' };
    this.carePlans[index] = { ...this.carePlans[index], ...updates };
    this.persist();
    return { success: true, message: 'Protocol synchronized', updatedData: this.getData() };
  }

  public addPatient(clinicId: string, name: string, mobile: string) {
    if (this.users.find(u => u.mobile === mobile && u.clinicId === clinicId)) return { success: false, message: 'Identity exists' };
    const newUserId = `user-${Date.now()}`;
    const newUser: User = {
      id: newUserId, clinicId, name, mobile, role: Role.PATIENT,
      lifetimeSpend: 0, currentTier: Tier.MEMBER, joinedAt: new Date().toISOString()
    };
    this.users.push(newUser);
    this.wallets.push({ id: `w-${Date.now()}`, userId: newUserId, balance: 0, lastTransactionAt: new Date().toISOString() });

    // Also save new state
    this.persist();

    return { success: true, message: 'Patient onboarded', user: newUser, updatedData: this.getData() };
  }

  public linkFamilyMember(headUserId: string, memberMobile: string) {
    const headUser = this.users.find(u => u.id === headUserId);
    if (!headUser) return { success: false, message: 'Head not found' };
    const memberUser = this.users.find(u => u.mobile === memberMobile && u.clinicId === headUser.clinicId);
    if (!memberUser) return { success: false, message: 'Member not found' };
    let familyGroup = this.familyGroups.find(f => f.headUserId === headUserId);
    if (!familyGroup) {
      familyGroup = { id: `fam-${Date.now()}`, clinicId: headUser.clinicId, headUserId: headUserId, familyName: `${headUser.name}'s Family` };
      this.familyGroups.push(familyGroup);
      headUser.familyGroupId = familyGroup.id;
    }
    memberUser.familyGroupId = familyGroup.id;
    // Save state
    this.persist();

    return { success: true, message: 'Household linked', updatedData: this.getData() };
  }

  public getDashboardStats(clinicId: string) {
    const txs = this.transactions.filter(t => t.clinicId === clinicId);
    return {
      totalLiability: this.wallets.filter(w => this.users.find(u => u.id === w.userId)?.clinicId === clinicId).reduce((a, b) => a + b.balance, 0),
      totalRevenue: txs.filter(t => t.type === TransactionType.EARN).reduce((a, b) => a + b.amountPaid, 0),
      upgradingSoon: this.users.filter(u => u.clinicId === clinicId && u.role === Role.PATIENT && u.currentTier !== Tier.PLATINUM).length,
      staffPerformance: this.users.filter(u => u.clinicId === clinicId && u.role === Role.ADMIN).map(doc => ({ name: doc.name, rev: txs.length * 500 }))
    };
  }
}
