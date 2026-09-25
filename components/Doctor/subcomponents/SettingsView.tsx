import React, { useEffect, useMemo, useState } from 'react';
import {
  Building2, Percent, BellRing, ShieldCheck, Download, Save, Users2,
  Clock, MapPin, Phone, Mail, Check, ScrollText, AlertTriangle, Receipt,
} from 'lucide-react';
import { Clinic, User, Wallet, Transaction, CarePlan, Appointment, AuditLog, TransactionCategory, TIER_THRESHOLDS } from '../../../types';
import { Card, Label, SectionHeader, Pill, cn } from '../ui/primitives';
import { useToast } from '../../../context/ToastContext';

interface Props {
  clinic: Clinic;
  currentUser: User;
  allUsers: User[];
  wallets: Wallet[];
  transactions: Transaction[];
  carePlans: CarePlan[];
  appointments: Appointment[];
  onUpdateClinic: (clinicId: string, updates: Partial<Clinic>) => Promise<any>;
  onGetAuditLog: (clinicId: string, limit?: number) => Promise<{ success: boolean; updatedData?: AuditLog[] }>;
}

const AUDIT_TONE: Record<string, 'leaf' | 'sun' | 'mist' | 'blush' | 'neutral'> = {
  SUCCESS: 'leaf', FINANCE: 'leaf', CLINICAL: 'mist', INFO: 'neutral', SECURITY: 'blush',
};

const timeAgo = (iso: string) => {
  const diff = Date.now() - +new Date(iso);
  const mins = Math.round(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.round(hrs / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

const SettingsView: React.FC<Props> = ({
  clinic, currentUser, allUsers, wallets, transactions, carePlans, appointments,
  onUpdateClinic, onGetAuditLog,
}) => {
  const { addToast } = useToast();

  // --- Clinic profile (local draft) ---
  const [profile, setProfile] = useState({
    name: clinic.name || '',
    ownerName: clinic.ownerName || '',
    adminEmail: clinic.adminEmail || '',
    emergencyPhone: clinic.emergencyPhone || '',
    address: clinic.settings?.address || '',
    openingHours: clinic.settings?.openingHours || '',
  });
  useEffect(() => {
    setProfile({
      name: clinic.name || '',
      ownerName: clinic.ownerName || '',
      adminEmail: clinic.adminEmail || '',
      emergencyPhone: clinic.emergencyPhone || '',
      address: clinic.settings?.address || '',
      openingHours: clinic.settings?.openingHours || '',
    });
  }, [clinic.id, clinic.name, clinic.ownerName, clinic.adminEmail, clinic.emergencyPhone, clinic.settings?.address, clinic.settings?.openingHours]);

  const [savingProfile, setSavingProfile] = useState(false);
  const profileDirty = useMemo(() => (
    profile.name !== (clinic.name || '') ||
    profile.ownerName !== (clinic.ownerName || '') ||
    profile.adminEmail !== (clinic.adminEmail || '') ||
    profile.emergencyPhone !== (clinic.emergencyPhone || '') ||
    profile.address !== (clinic.settings?.address || '') ||
    profile.openingHours !== (clinic.settings?.openingHours || '')
  ), [profile, clinic]);

  const saveProfile = async () => {
    setSavingProfile(true);
    await onUpdateClinic(clinic.id, {
      name: profile.name,
      ownerName: profile.ownerName,
      adminEmail: profile.adminEmail,
      emergencyPhone: profile.emergencyPhone,
      settings: { ...clinic.settings, address: profile.address, openingHours: profile.openingHours },
    });
    setSavingProfile(false);
  };

  // --- Loyalty economics ---
  const [loyalty, setLoyalty] = useState({
    defaultRate: String(clinic.loyaltyConfig?.defaultRate ?? 10),
    redemptionRate: String(clinic.loyaltyConfig?.redemptionRate ?? 1),
    categoryRates: { ...(clinic.loyaltyConfig?.categoryRates || {}) } as Record<string, number | undefined>,
  });
  useEffect(() => {
    setLoyalty({
      defaultRate: String(clinic.loyaltyConfig?.defaultRate ?? 10),
      redemptionRate: String(clinic.loyaltyConfig?.redemptionRate ?? 1),
      categoryRates: { ...(clinic.loyaltyConfig?.categoryRates || {}) },
    });
  }, [clinic.id, clinic.loyaltyConfig?.defaultRate, clinic.loyaltyConfig?.redemptionRate, clinic.loyaltyConfig?.categoryRates]);

  const saveLoyalty = () => onUpdateClinic(clinic.id, {
    loyaltyConfig: {
      defaultRate: Number(loyalty.defaultRate) || 0,
      redemptionRate: Number(loyalty.redemptionRate) || 0,
      categoryRates: loyalty.categoryRates,
    },
  });

  // --- Recall & reminders ---
  const nc = clinic.settings?.notificationConfig;
  const [notify, setNotify] = useState({
    recallMonths: String(nc?.recallMonths ?? 6),
    reminderLeadDays: String(nc?.reminderLeadDays ?? 2),
    smsEnabled: nc?.smsEnabled ?? true,
    whatsappEnabled: nc?.whatsappEnabled ?? false,
    emailEnabled: nc?.emailEnabled ?? true,
  });
  useEffect(() => {
    const c = clinic.settings?.notificationConfig;
    setNotify({
      recallMonths: String(c?.recallMonths ?? 6),
      reminderLeadDays: String(c?.reminderLeadDays ?? 2),
      smsEnabled: c?.smsEnabled ?? true,
      whatsappEnabled: c?.whatsappEnabled ?? false,
      emailEnabled: c?.emailEnabled ?? true,
    });
  }, [clinic.id, clinic.settings?.notificationConfig]);

  // --- Billing & tax ---
  const tc = clinic.settings?.tax;
  const [tax, setTax] = useState({
    enabled: tc?.enabled ?? false,
    label: tc?.label ?? 'GST',
    rate: String(tc?.rate ?? 18),
    taxId: tc?.taxId ?? '',
    invoicePrefix: tc?.invoicePrefix ?? 'INV',
  });
  useEffect(() => {
    const t = clinic.settings?.tax;
    setTax({
      enabled: t?.enabled ?? false,
      label: t?.label ?? 'GST',
      rate: String(t?.rate ?? 18),
      taxId: t?.taxId ?? '',
      invoicePrefix: t?.invoicePrefix ?? 'INV',
    });
  }, [clinic.id, clinic.settings?.tax]);

  const saveTax = () => onUpdateClinic(clinic.id, {
    settings: {
      ...clinic.settings,
      tax: {
        enabled: tax.enabled,
        label: tax.label || 'Tax',
        rate: Number(tax.rate) || 0,
        taxId: tax.taxId,
        invoicePrefix: tax.invoicePrefix || 'INV',
      },
    },
  });

  const saveNotify = () => onUpdateClinic(clinic.id, {
    settings: {
      ...clinic.settings,
      notificationConfig: {
        recallMonths: Number(notify.recallMonths) || 6,
        reminderLeadDays: Number(notify.reminderLeadDays) || 2,
        smsEnabled: notify.smsEnabled,
        whatsappEnabled: notify.whatsappEnabled,
        emailEnabled: notify.emailEnabled,
      },
    },
  });

  // --- Audit log ---
  const [audit, setAudit] = useState<AuditLog[] | null>(null);
  useEffect(() => {
    let mounted = true;
    onGetAuditLog(clinic.id, 60).then((res) => {
      if (mounted) setAudit(res.updatedData || []);
    });
    return () => { mounted = false; };
  }, [clinic.id, onGetAuditLog]);

  // --- Team ---
  const team = useMemo(
    () => allUsers.filter((u) => u.clinicId === clinic.id && u.role === 'ADMIN'),
    [allUsers, clinic.id],
  );

  // --- Data export ---
  const exportData = () => {
    const patientIds = new Set(allUsers.filter((u) => u.clinicId === clinic.id && u.role === 'PATIENT').map((u) => u.id));
    const clinicWallets = wallets.filter((w) => patientIds.has(w.userId));
    const payload = {
      exportedAt: new Date().toISOString(),
      clinic: { id: clinic.id, name: clinic.name, slug: clinic.slug },
      patients: allUsers.filter((u) => u.clinicId === clinic.id),
      wallets: clinicWallets,
      transactions: transactions.filter((t) => t.clinicId === clinic.id),
      carePlans: carePlans.filter((cp) => cp.clinicId === clinic.id),
      appointments: appointments.filter((a) => a.clinicId === clinic.id),
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${clinic.slug}-export-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
    addToast('Clinic data exported', 'success');
  };

  const inputCls = 'mt-2 w-full rounded-[14px] border border-ink-950/10 bg-white p-3.5 text-sm font-semibold text-ink-900 outline-none transition-colors focus:border-ink-950/30';

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-[clamp(1.5rem,2.4vw,2.1rem)] font-bold tracking-tight text-ink-900">Settings</h1>
        <p className="mt-2 text-sm font-medium text-ink-500">Clinic profile, loyalty rules, reminders, team and compliance.</p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-6">
          {/* Clinic profile */}
          <Card tone="white">
            <div className="flex items-start justify-between gap-4">
              <SectionHeader eyebrow="Profile" title="Clinic identity" icon={<Building2 size={16} />} />
              <button
                onClick={saveProfile}
                disabled={!profileDirty || savingProfile}
                className={cn(
                  'inline-flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-xs font-bold uppercase tracking-[0.08em] transition-colors',
                  profileDirty ? 'bg-ink-950 text-cream-50 hover:bg-ink-800' : 'cursor-not-allowed bg-ink-950/10 text-ink-400',
                )}
              >
                <Save size={14} /> {savingProfile ? 'Saving' : 'Save'}
              </button>
            </div>
            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <div>
                <Label>Clinic name</Label>
                <input className={inputCls} value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} />
              </div>
              <div>
                <Label>Lead dentist / owner</Label>
                <input className={inputCls} value={profile.ownerName} onChange={(e) => setProfile({ ...profile, ownerName: e.target.value })} />
              </div>
              <div>
                <Label><Mail size={11} className="mr-1 inline" />Contact email</Label>
                <input type="email" className={inputCls} value={profile.adminEmail} onChange={(e) => setProfile({ ...profile, adminEmail: e.target.value })} />
              </div>
              <div>
                <Label><Phone size={11} className="mr-1 inline" />Emergency phone</Label>
                <input className={inputCls} value={profile.emergencyPhone} onChange={(e) => setProfile({ ...profile, emergencyPhone: e.target.value })} placeholder="Shown to patients in emergencies" />
              </div>
              <div>
                <Label><MapPin size={11} className="mr-1 inline" />Address</Label>
                <input className={inputCls} value={profile.address} onChange={(e) => setProfile({ ...profile, address: e.target.value })} placeholder="Street, area, city" />
              </div>
              <div>
                <Label><Clock size={11} className="mr-1 inline" />Opening hours</Label>
                <input className={inputCls} value={profile.openingHours} onChange={(e) => setProfile({ ...profile, openingHours: e.target.value })} placeholder="Mon–Sat, 10:00–19:00" />
              </div>
            </div>
          </Card>

          {/* Loyalty economics */}
          <Card tone="white">
            <div className="flex items-start justify-between gap-4">
              <SectionHeader eyebrow="Loyalty" title="Point economics" icon={<Percent size={16} />} />
              <button onClick={saveLoyalty} className="inline-flex shrink-0 items-center gap-2 rounded-full bg-ink-950 px-4 py-2 text-xs font-bold uppercase tracking-[0.08em] text-cream-50 transition-colors hover:bg-ink-800">
                <Save size={14} /> Save
              </button>
            </div>
            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <div>
                <Label>Default earn rate (%)</Label>
                <input type="number" className={inputCls} value={loyalty.defaultRate} onChange={(e) => setLoyalty({ ...loyalty, defaultRate: e.target.value })} />
                <p className="mt-1.5 text-xs text-ink-400">Points a patient earns per ₹100 spent, before category multipliers.</p>
              </div>
              <div>
                <Label>Redemption value (₹ per point)</Label>
                <input type="number" className={inputCls} value={loyalty.redemptionRate} onChange={(e) => setLoyalty({ ...loyalty, redemptionRate: e.target.value })} />
                <p className="mt-1.5 text-xs text-ink-400">What one Smile Point is worth when a patient redeems.</p>
              </div>
            </div>
            <div className="mt-6 border-t border-ink-950/5 pt-6">
              <Label>Category multipliers (%)</Label>
              <p className="mt-1 text-xs text-ink-400">Leave blank to use the default rate.</p>
              <div className="mt-3 grid gap-3 sm:grid-cols-3">
                {Object.values(TransactionCategory).map((cat) => (
                  <div key={cat} className="rounded-[14px] border border-ink-950/10 bg-cream-50 p-3.5">
                    <Label>{cat}</Label>
                    <div className="mt-2 flex items-center gap-2">
                      <input
                        type="number"
                        placeholder="Default"
                        value={loyalty.categoryRates[cat] ?? ''}
                        onChange={(e) => {
                          const val = e.target.value ? Number(e.target.value) : undefined;
                          setLoyalty((prev) => ({ ...prev, categoryRates: { ...prev.categoryRates, [cat]: val } }));
                        }}
                        className="w-full bg-transparent font-display text-lg font-bold outline-none"
                      />
                      <span className="text-xs font-bold text-ink-400">%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* Billing & tax */}
          <Card tone="white">
            <div className="flex items-start justify-between gap-4">
              <SectionHeader eyebrow="Billing" title="Invoices & tax" icon={<Receipt size={16} />} />
              <button onClick={saveTax} className="inline-flex shrink-0 items-center gap-2 rounded-full bg-ink-950 px-4 py-2 text-xs font-bold uppercase tracking-[0.08em] text-cream-50 transition-colors hover:bg-ink-800">
                <Save size={14} /> Save
              </button>
            </div>
            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <div>
                <Label>Tax label</Label>
                <input className={inputCls} value={tax.label} onChange={(e) => setTax({ ...tax, label: e.target.value })} placeholder="GST / VAT / Sales Tax" />
              </div>
              <div>
                <Label>Tax rate (%)</Label>
                <input type="number" className={inputCls} value={tax.rate} onChange={(e) => setTax({ ...tax, rate: e.target.value })} />
              </div>
              <div>
                <Label>Tax ID / registration</Label>
                <input className={inputCls} value={tax.taxId} onChange={(e) => setTax({ ...tax, taxId: e.target.value })} placeholder="Shown on every invoice" />
              </div>
              <div>
                <Label>Invoice prefix</Label>
                <input className={inputCls} value={tax.invoicePrefix} onChange={(e) => setTax({ ...tax, invoicePrefix: e.target.value })} placeholder="INV" />
              </div>
            </div>
            <button onClick={() => setTax((prev) => ({ ...prev, enabled: !prev.enabled }))}
              className={cn('mt-6 inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-bold transition-colors',
                tax.enabled ? 'border-primary/30 bg-primary/10 text-primary' : 'border-ink-950/10 bg-white text-ink-400')}>
              {tax.enabled ? <Check size={13} /> : <AlertTriangle size={13} />} Add tax line to invoices
            </button>
          </Card>

          {/* Recall & reminders */}
          <Card tone="white">
            <div className="flex items-start justify-between gap-4">
              <SectionHeader eyebrow="Automation" title="Recall & reminders" icon={<BellRing size={16} />} />
              <button onClick={saveNotify} className="inline-flex shrink-0 items-center gap-2 rounded-full bg-ink-950 px-4 py-2 text-xs font-bold uppercase tracking-[0.08em] text-cream-50 transition-colors hover:bg-ink-800">
                <Save size={14} /> Save
              </button>
            </div>
            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <div>
                <Label>Recall interval (months)</Label>
                <input type="number" className={inputCls} value={notify.recallMonths} onChange={(e) => setNotify({ ...notify, recallMonths: e.target.value })} />
                <p className="mt-1.5 text-xs text-ink-400">A patient with no visit in this window appears as overdue for recall.</p>
              </div>
              <div>
                <Label>Reminder lead time (days)</Label>
                <input type="number" className={inputCls} value={notify.reminderLeadDays} onChange={(e) => setNotify({ ...notify, reminderLeadDays: e.target.value })} />
                <p className="mt-1.5 text-xs text-ink-400">How far ahead to remind patients about upcoming appointments.</p>
              </div>
            </div>
            <div className="mt-6 flex flex-wrap gap-3 border-t border-ink-950/5 pt-6">
              {([
                ['smsEnabled', 'SMS'],
                ['whatsappEnabled', 'WhatsApp'],
                ['emailEnabled', 'Email'],
              ] as const).map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => setNotify((prev) => ({ ...prev, [key]: !prev[key] }))}
                  className={cn(
                    'inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-bold transition-colors',
                    notify[key] ? 'border-primary/30 bg-primary/10 text-primary' : 'border-ink-950/10 bg-white text-ink-400',
                  )}
                >
                  {notify[key] ? <Check size={13} /> : <AlertTriangle size={13} />} {label}
                </button>
              ))}
            </div>
          </Card>

          {/* Compliance & data */}
          <Card tone="white">
            <SectionHeader eyebrow="Compliance" title="Activity & data" icon={<ShieldCheck size={16} />} />
            <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-[16px] border border-ink-950/10 bg-cream-50 p-4">
              <div className="flex items-start gap-3">
                <ShieldCheck size={16} className="mt-0.5 text-leaf-deep" />
                <div>
                  <p className="text-sm font-bold text-ink-800">Data export</p>
                  <p className="text-xs text-ink-500">Download a full JSON copy of this clinic's records for backup or migration.</p>
                </div>
              </div>
              <button onClick={exportData} className="inline-flex items-center gap-2 rounded-full border border-ink-950/10 bg-white px-4 py-2 text-xs font-bold uppercase tracking-[0.08em] text-ink-700 transition-colors hover:border-ink-950/30">
                <Download size={14} /> Export
              </button>
            </div>

            <div className="mt-6">
              <div className="flex items-center gap-2">
                <ScrollText size={14} className="text-ink-400" />
                <Label>Audit trail</Label>
              </div>
              <div className="mt-3 max-h-[320px] space-y-1.5 overflow-y-auto custom-scrollbar">
                {audit === null ? (
                  <p className="py-6 text-center text-sm text-ink-400">Loading activity…</p>
                ) : audit.length === 0 ? (
                  <p className="py-6 text-center text-sm text-ink-400">No recorded activity yet. Actions like adding a patient or recording a payment will appear here.</p>
                ) : (
                  audit.map((entry) => (
                    <div key={entry.id} className="flex items-start gap-3 rounded-[14px] border border-ink-950/[0.06] bg-white px-3.5 py-2.5">
                      <Pill tone={AUDIT_TONE[entry.type] || 'neutral'}>{entry.type}</Pill>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-ink-800">{entry.action}</p>
                        {entry.detail && <p className="truncate text-xs text-ink-500">{entry.detail}</p>}
                      </div>
                      <span className="shrink-0 font-mono text-[10px] uppercase tracking-wider text-ink-400">{timeAgo(entry.timestamp)}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </Card>
        </div>

        {/* Right rail */}
        <div className="space-y-6">
          <Card tone="white">
            <SectionHeader eyebrow="Team" title="Access" icon={<Users2 size={16} />} />
            <div className="mt-5 space-y-2">
              {team.length === 0 ? (
                <p className="text-sm text-ink-400">No staff accounts yet.</p>
              ) : (
                team.map((member) => (
                  <div key={member.id} className="flex items-center gap-3 rounded-[14px] border border-ink-950/10 bg-cream-50 p-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-ink-950 font-display text-[11px] font-bold text-cream-50">
                      {(member.name || 'A').split(' ').map((w) => w[0]).slice(0, 2).join('')}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-bold text-ink-800">{member.name}</p>
                      <p className="truncate font-mono text-[10px] uppercase tracking-wider text-ink-400">
                        {member.id === currentUser.id ? 'You · Admin' : 'Admin'}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>

          <Card tone="white">
            <SectionHeader eyebrow="Plan" title={`${clinic.subscriptionTier} subscription`} />
            <div className="mt-4 space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-ink-500">Tier upgrades</span>
                <span className="font-bold text-ink-800">Gold {`₹${TIER_THRESHOLDS.GOLD.toLocaleString()}`} · Platinum {`₹${TIER_THRESHOLDS.PLATINUM.toLocaleString()}`}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-ink-500">Clinic since</span>
                <span className="font-bold text-ink-800">{new Date(clinic.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</span>
              </div>
            </div>
            <button className="mt-5 w-full rounded-full bg-ink-950 px-5 py-3 text-xs font-bold uppercase tracking-[0.08em] text-cream-50 transition-colors hover:bg-ink-800">
              Manage subscription
            </button>
          </Card>

          <Card tone="dark">
            <Label onDark>Multi-location & API</Label>
            <h3 className="mt-3 font-display text-xl font-bold tracking-tight text-cream-50">Running more than one chair?</h3>
            <p className="mt-2 text-sm text-cream-50/60">Groups, single sign-on and integrations are available on the Enterprise plan.</p>
            <button className="mt-5 w-full rounded-full bg-cream-50 px-5 py-2.5 text-xs font-bold uppercase tracking-[0.08em] text-ink-950 transition-colors hover:bg-white">
              Contact support
            </button>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SettingsView;
