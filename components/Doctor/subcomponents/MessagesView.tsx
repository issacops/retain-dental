import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  MessageSquare, Send, Search, Users, Plus, Pencil, Trash2, Check, Smartphone,
  Info, X, BellRing, Sparkles, Clock,
} from 'lucide-react';
import {
  Clinic, User, Wallet, Transaction, Appointment, CarePlan,
  NotificationTemplate, NotificationCategory, PatientNotification, TransactionType,
} from '../../../types';
import { Card, Label, SectionHeader, Pill, Empty, cn } from '../ui/primitives';
import { useToast } from '../../../context/ToastContext';
import { NOTIFICATION_TOKENS, NOTIFICATION_CATEGORIES, OPT_OUT_CATEGORIES } from '../../../constants/notificationTemplates';

interface Props {
  clinic: Clinic;
  currentUser: User;
  allUsers: User[];
  wallets: Wallet[];
  transactions: Transaction[];
  appointments: Appointment[];
  carePlans: CarePlan[];
  onGetNotificationTemplates: (clinicId: string) => Promise<{ success: boolean; updatedData?: NotificationTemplate[] }>;
  onSaveNotificationTemplate: (clinicId: string, t: any) => Promise<{ success: boolean; updatedData?: NotificationTemplate[]; message?: string }>;
  onDeleteNotificationTemplate: (id: string) => Promise<{ success: boolean; updatedData?: NotificationTemplate[] }>;
  onSendNotifications: (clinicId: string, patientIds: string[], payload: any, actorName: string) => Promise<{ success: boolean; message?: string }>;
  onGetNotifications: (clinicId: string) => Promise<{ success: boolean; updatedData?: PatientNotification[] }>;
  onGetPushSubscriptionCount: (clinicId: string) => Promise<{ success: boolean; updatedData?: number }>;
}

const CAT_TONE: Record<NotificationCategory, 'leaf' | 'sun' | 'mist' | 'blush' | 'neutral'> = {
  Appointment: 'sun', Recall: 'blush', Clinical: 'mist', Financial: 'leaf', Loyalty: 'leaf', Retention: 'neutral',
};

const isSameDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

const timeAgo = (iso: string) => {
  const mins = Math.round((Date.now() - +new Date(iso)) / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.round(hrs / 24)}d ago`;
};

const MessagesView: React.FC<Props> = ({
  clinic, currentUser, allUsers, wallets, transactions, appointments, carePlans,
  onGetNotificationTemplates, onSaveNotificationTemplate, onDeleteNotificationTemplate,
  onSendNotifications, onGetNotifications, onGetPushSubscriptionCount,
}) => {
  const { addToast } = useToast();

  const [templates, setTemplates] = useState<NotificationTemplate[] | null>(null);
  const [history, setHistory] = useState<PatientNotification[] | null>(null);
  const [pushCount, setPushCount] = useState<number | null>(null);

  const [catFilter, setCatFilter] = useState<'All' | NotificationCategory>('All');
  const [tplSearch, setTplSearch] = useState('');
  const [activeTplId, setActiveTplId] = useState<string | null>(null);

  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [category, setCategory] = useState<NotificationCategory>('Appointment');

  const [recipientIds, setRecipientIds] = useState<Set<string>>(new Set());
  const [patientSearch, setPatientSearch] = useState('');
  const [sending, setSending] = useState(false);

  const [editor, setEditor] = useState<null | { id?: string; name: string; category: NotificationCategory; title: string; body: string }>(null);
  const bodyRef = useRef<HTMLTextAreaElement>(null);

  const patients = useMemo(
    () => allUsers.filter((u) => u.clinicId === clinic.id && u.role === 'PATIENT').sort((a, b) => a.name.localeCompare(b.name)),
    [allUsers, clinic.id],
  );

  const walletByUser = useMemo(() => new Map<string, Wallet>(wallets.map((w) => [w.userId, w] as const)), [wallets]);
  const recallMonths = clinic.settings?.notificationConfig?.recallMonths ?? 6;

  const lastVisitByPatient = useMemo(() => {
    const walletOwner = new Map<string, string>(wallets.map((w) => [w.id, w.userId] as const));
    const map = new Map<string, number>();
    for (const t of transactions) {
      if (t.clinicId !== clinic.id || t.type !== TransactionType.EARN) continue;
      const uid = walletOwner.get(t.walletId);
      if (!uid) continue;
      const at = +new Date(t.date);
      if (!map.has(uid) || at > map.get(uid)!) map.set(uid, at);
    }
    return map;
  }, [transactions, wallets, clinic.id]);

  const nextApptByPatient = useMemo(() => {
    const now = Date.now();
    const map = new Map<string, Appointment>();
    for (const a of appointments) {
      if (a.clinicId !== clinic.id || +new Date(a.startTime) < now) continue;
      const prev = map.get(a.patientId);
      if (!prev || +new Date(a.startTime) < +new Date(prev.startTime)) map.set(a.patientId, a);
    }
    return map;
  }, [appointments, clinic.id]);

  const refreshHistory = () => onGetNotifications(clinic.id).then((r) => setHistory(r.updatedData || []));

  useEffect(() => {
    let mounted = true;
    onGetNotificationTemplates(clinic.id).then((r) => { if (mounted) setTemplates(r.updatedData || []); });
    refreshHistory();
    onGetPushSubscriptionCount(clinic.id).then((r) => { if (mounted) setPushCount(r.updatedData ?? 0); });
    return () => { mounted = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clinic.id]);

  const loadTemplate = (t: NotificationTemplate) => {
    setActiveTplId(t.id);
    setTitle(t.title);
    setBody(t.body);
    setCategory(t.category);
  };

  const insertToken = (token: string) => {
    const el = bodyRef.current;
    if (!el) { setBody((b) => b + token); return; }
    const start = el.selectionStart ?? body.length;
    const end = el.selectionEnd ?? body.length;
    const next = body.slice(0, start) + token + body.slice(end);
    setBody(next);
    requestAnimationFrame(() => { el.focus(); el.selectionStart = el.selectionEnd = start + token.length; });
  };

  const buildContext = (patient: User) => {
    const appt = nextApptByPatient.get(patient.id);
    const wallet = walletByUser.get(patient.id);
    const plan = carePlans.find((cp) => cp.userId === patient.id && cp.isActive);
    return {
      first_name: (patient.name || 'there').split(' ')[0],
      patient: patient.name || 'there',
      clinic: clinic.name,
      provider: currentUser.name || clinic.ownerName || 'your dentist',
      procedure: plan?.treatmentName || appt?.type || 'appointment',
      day: appt ? new Date(appt.startTime).toLocaleDateString('en-US', { weekday: 'long' }) : 'your next visit',
      date: appt ? new Date(appt.startTime).toLocaleDateString('en-US', { month: 'long', day: 'numeric' }) : '',
      time: appt ? new Date(appt.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '',
      phone: clinic.emergencyPhone || clinic.name,
      balance: String((patient.metadata as any)?.outstandingBalance ?? ''),
      points: (wallet?.balance || 0).toLocaleString('en-IN'),
    } as Record<string, string>;
  };

  const resolve = (text: string, ctx: Record<string, string>) =>
    text.replace(/\{(\w+)\}/g, (_m, k) => (ctx[k] !== undefined && ctx[k] !== '' ? ctx[k] : `{${k}}`));

  const previewPatient = useMemo(
    () => patients.find((p) => recipientIds.has(p.id)) || patients[0],
    [patients, recipientIds],
  );
  const previewCtx = previewPatient ? buildContext(previewPatient) : {};
  const previewTitle = resolve(title, previewCtx);
  const previewBody = resolve(body, previewCtx);

  // --- Audience segments ---
  const segments = useMemo(() => {
    const today = new Date();
    const dueToday = patients.filter((p) => appointments.some((a) => a.patientId === p.id && a.clinicId === clinic.id && isSameDay(new Date(a.startTime), today)));
    const cutoff = Date.now() - recallMonths * 30 * 24 * 60 * 60 * 1000;
    const overdue = patients.filter((p) => {
      const last = lastVisitByPatient.get(p.id);
      return !last || last < cutoff;
    });
    return [
      { key: 'all', label: `All patients`, count: patients.length, ids: patients.map((p) => p.id) },
      { key: 'today', label: 'In today', count: dueToday.length, ids: dueToday.map((p) => p.id) },
      { key: 'overdue', label: `Overdue recall`, count: overdue.length, ids: overdue.map((p) => p.id) },
    ];
  }, [patients, appointments, clinic.id, recallMonths, lastVisitByPatient]);

  const toggleRecipient = (id: string) => {
    setRecipientIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const selectSegment = (ids: string[]) => setRecipientIds(new Set(ids));

  const visiblePatients = useMemo(() => {
    const q = patientSearch.trim().toLowerCase();
    return patients.filter((p) => !q || p.name.toLowerCase().includes(q) || (p.mobile || '').includes(q));
  }, [patients, patientSearch]);

  const send = async () => {
    const ids = [...recipientIds];
    if (!ids.length) { addToast('Choose at least one patient', 'warning'); return; }
    if (!title.trim() || !body.trim()) { addToast('Add a title and a message', 'warning'); return; }
    setSending(true);
    const res = await onSendNotifications(clinic.id, ids, { title: title.trim(), body: body.trim(), category }, currentUser.name);
    setSending(false);
    if (res.success) {
      addToast(`Sent to ${ids.length} patient${ids.length === 1 ? '' : 's'}`, 'success');
      setRecipientIds(new Set());
      refreshHistory();
    } else {
      addToast(res.message || 'Could not send', 'error');
    }
  };

  const saveTemplate = async () => {
    if (!editor) return;
    if (!editor.name.trim() || !editor.title.trim() || !editor.body.trim()) {
      addToast('Fill in a name, title and message', 'warning');
      return;
    }
    const res = await onSaveNotificationTemplate(clinic.id, editor);
    if (res.success) {
      setTemplates(res.updatedData || templates);
      setEditor(null);
      addToast('Template saved', 'success');
    } else {
      addToast(res.message || 'Could not save template', 'error');
    }
  };

  const removeTemplate = async (t: NotificationTemplate) => {
    const res = await onDeleteNotificationTemplate(t.id);
    if (res.success) { setTemplates(res.updatedData || templates); addToast('Template removed', 'success'); }
  };

  const filteredTemplates = useMemo(() => {
    const list = templates || [];
    const q = tplSearch.trim().toLowerCase();
    return list.filter((t) =>
      (catFilter === 'All' || t.category === catFilter) &&
      (!q || t.name.toLowerCase().includes(q) || t.body.toLowerCase().includes(q)),
    );
  }, [templates, catFilter, tplSearch]);

  const inputCls = 'w-full rounded-[14px] border border-ink-950/10 bg-white p-3.5 text-sm font-semibold text-ink-900 outline-none transition-colors focus:border-ink-950/30';

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-[clamp(1.5rem,2.4vw,2.1rem)] font-bold tracking-tight text-ink-900">Messages</h1>
          <p className="mt-2 text-sm font-medium text-ink-500">
            Send appointment reminders, recalls and follow-ups straight to the patient app.
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-full border border-ink-950/10 bg-white px-4 py-2.5">
          <Smartphone size={15} className={cn(pushCount ? 'text-leaf-deep' : 'text-ink-400')} />
          <span className="text-xs font-bold text-ink-700">
            {pushCount === null ? 'Checking devices…' : `${pushCount} device${pushCount === 1 ? '' : 's'} on push`}
          </span>
        </div>
      </div>

      <div className="flex items-start gap-2.5 rounded-[16px] border border-ink-950/10 bg-mist-soft px-4 py-3 text-xs font-medium text-ink-600">
        <Info size={14} className="mt-0.5 shrink-0 text-mist-deep" />
        <p>
          Every message lands in the patient's app feed immediately. When a patient has enabled notifications, it also
          arrives on their phone as a push — no SMS or WhatsApp needed.
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[300px_minmax(0,1fr)]">
        {/* Template library */}
        <Card tone="white" className="h-fit">
          <div className="flex items-center justify-between gap-3">
            <SectionHeader eyebrow="Library" title="Templates" />
            <button
              onClick={() => setEditor({ name: '', category: 'Appointment', title: '', body: '' })}
              className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-ink-950 px-3.5 py-2 text-[11px] font-bold uppercase tracking-[0.06em] text-cream-50 hover:bg-ink-800"
            >
              <Plus size={13} /> New
            </button>
          </div>

          <div className="relative mt-4">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" />
            <input value={tplSearch} onChange={(e) => setTplSearch(e.target.value)} placeholder="Search templates"
              className="w-full rounded-full border border-ink-950/10 bg-cream-50 py-2 pl-9 pr-3 text-xs font-semibold outline-none focus:border-ink-950/30" />
          </div>

          <div className="mt-3 flex flex-wrap gap-1.5">
            <button onClick={() => setCatFilter('All')}
              className={cn('rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider', catFilter === 'All' ? 'bg-ink-950 text-cream-50' : 'bg-ink-950/5 text-ink-500')}>
              All
            </button>
            {NOTIFICATION_CATEGORIES.map((c) => (
              <button key={c.key} onClick={() => setCatFilter(c.key)}
                className={cn('rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider', catFilter === c.key ? 'bg-ink-950 text-cream-50' : 'bg-ink-950/5 text-ink-500')}>
                {c.label}
              </button>
            ))}
          </div>

          <div className="mt-4 max-h-[520px] space-y-1.5 overflow-y-auto custom-scrollbar pr-1">
            {templates === null ? (
              <p className="py-6 text-center text-xs text-ink-400">Loading…</p>
            ) : filteredTemplates.length === 0 ? (
              <p className="py-6 text-center text-xs text-ink-400">No templates match.</p>
            ) : (
              filteredTemplates.map((t) => (
                <div key={t.id}
                  className={cn('group relative rounded-[14px] border p-3 transition-colors',
                    activeTplId === t.id ? 'border-primary bg-primary/5' : 'border-ink-950/10 bg-cream-50 hover:border-primary/40')}>
                  <button onClick={() => loadTemplate(t)} className="block w-full text-left">
                    <div className="flex items-center gap-2">
                      <Pill tone={CAT_TONE[t.category]}>{t.category}</Pill>
                      {t.builtIn && <span className="font-mono text-[9px] uppercase tracking-wider text-ink-300">Built-in</span>}
                    </div>
                    <p className="mt-2 text-sm font-bold text-ink-800">{t.name}</p>
                    <p className="mt-1 line-clamp-2 text-[11px] leading-relaxed text-ink-500">{t.body}</p>
                  </button>
                  {!t.builtIn && (
                    <div className="absolute right-2 top-2 hidden gap-1 group-hover:flex">
                      <button onClick={() => setEditor({ id: t.id, name: t.name, category: t.category, title: t.title, body: t.body })}
                        className="rounded-lg bg-white p-1.5 text-ink-500 ring-1 ring-ink-950/10 hover:text-ink-900" aria-label="Edit template"><Pencil size={12} /></button>
                      <button onClick={() => removeTemplate(t)}
                        className="rounded-lg bg-white p-1.5 text-ink-400 ring-1 ring-ink-950/10 hover:text-blush-deep" aria-label="Delete template"><Trash2 size={12} /></button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </Card>

        {/* Composer + audience */}
        <div className="space-y-6">
          <Card tone="white">
            <SectionHeader eyebrow="Compose" title="Message" icon={<MessageSquare size={16} />} />

            <div className="mt-5 grid gap-4 sm:grid-cols-[160px_minmax(0,1fr)]">
              <div>
                <Label>Category</Label>
                <select value={category} onChange={(e) => setCategory(e.target.value as NotificationCategory)} className={cn(inputCls, 'mt-2 appearance-none')}>
                  {NOTIFICATION_CATEGORIES.map((c) => <option key={c.key} value={c.key}>{c.label}</option>)}
                </select>
              </div>
              <div>
                <Label>Title</Label>
                <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. See you tomorrow" className={cn(inputCls, 'mt-2')} />
              </div>
            </div>

            <div className="mt-4">
              <Label>Message</Label>
              <textarea ref={bodyRef} value={body} onChange={(e) => setBody(e.target.value)} placeholder="Write your message, or pick a template."
                className={cn(inputCls, 'mt-2 h-28 resize-none leading-relaxed')} />
            </div>

            <div className="mt-3">
              <Label>Insert a detail</Label>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {NOTIFICATION_TOKENS.map((t) => (
                  <button key={t.token} onClick={() => insertToken(t.token)}
                    className="rounded-full border border-ink-950/10 bg-cream-50 px-2.5 py-1 font-mono text-[10px] font-bold text-ink-500 hover:border-primary/40 hover:text-primary">
                    {t.token}
                  </button>
                ))}
              </div>
            </div>

            {(title || body) && (
              <div className="mt-5 rounded-[16px] border border-ink-950/10 bg-ink-950 p-4">
                <div className="flex items-center gap-2">
                  <BellRing size={13} className="text-cream-50/60" />
                  <Label onDark>Preview · {previewPatient?.name || 'sample patient'}</Label>
                </div>
                <p className="mt-3 text-sm font-bold text-cream-50">{previewTitle || 'Notification title'}</p>
                <p className="mt-1 whitespace-pre-wrap text-sm text-cream-50/70">{previewBody || 'Your message preview appears here.'}</p>
                {OPT_OUT_CATEGORIES.includes(category) && (
                  <p className="mt-3 border-t border-white/10 pt-3 text-[11px] text-cream-50/40">Opt-out line added automatically.</p>
                )}
              </div>
            )}
          </Card>

          <Card tone="white">
            <SectionHeader eyebrow="Audience" title={`Recipients · ${recipientIds.size}`} icon={<Users size={16} />} />

            <div className="mt-4 flex flex-wrap gap-2">
              {segments.map((s) => (
                <button key={s.key} onClick={() => selectSegment(s.ids)}
                  className="inline-flex items-center gap-2 rounded-full border border-ink-950/10 bg-cream-50 px-3.5 py-2 text-xs font-bold text-ink-700 hover:border-primary/40">
                  {s.label} <span className="font-mono text-ink-400">{s.count}</span>
                </button>
              ))}
              <button onClick={() => setRecipientIds(new Set())}
                className="inline-flex items-center gap-2 rounded-full border border-ink-950/10 bg-white px-3.5 py-2 text-xs font-bold text-ink-400 hover:text-ink-700">
                Clear
              </button>
            </div>

            <div className="relative mt-4">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" />
              <input value={patientSearch} onChange={(e) => setPatientSearch(e.target.value)} placeholder="Search patients"
                className="w-full rounded-full border border-ink-950/10 bg-cream-50 py-2 pl-9 pr-3 text-xs font-semibold outline-none focus:border-ink-950/30" />
            </div>

            <div className="mt-3 max-h-[220px] space-y-1 overflow-y-auto custom-scrollbar pr-1">
              {visiblePatients.length === 0 ? (
                <p className="py-6 text-center text-xs text-ink-400">No patients found.</p>
              ) : visiblePatients.map((p) => {
                const checked = recipientIds.has(p.id);
                const wallet = walletByUser.get(p.id);
                return (
                  <button key={p.id} onClick={() => toggleRecipient(p.id)}
                    className={cn('flex w-full items-center gap-3 rounded-[14px] border px-3 py-2 text-left transition-colors',
                      checked ? 'border-primary bg-primary/5' : 'border-ink-950/[0.06] bg-white hover:border-primary/30')}>
                    <span className={cn('flex h-5 w-5 items-center justify-center rounded-md border', checked ? 'border-primary bg-primary text-white' : 'border-ink-950/20')}>
                      {checked && <Check size={12} />}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-bold text-ink-800">{p.name}</span>
                      <span className="block truncate font-mono text-[10px] text-ink-400">{p.mobile} · {wallet?.balance || 0} pts</span>
                    </span>
                  </button>
                );
              })}
            </div>

            <button onClick={send} disabled={sending || recipientIds.size === 0}
              className={cn('mt-4 flex w-full items-center justify-center gap-2 rounded-full py-3.5 text-sm font-bold uppercase tracking-[0.08em] transition-colors',
                sending || recipientIds.size === 0 ? 'cursor-not-allowed bg-ink-950/10 text-ink-400' : 'bg-ink-950 text-cream-50 hover:bg-ink-800')}>
              <Send size={16} /> {sending ? 'Sending…' : `Send to ${recipientIds.size || 0}`}
            </button>
          </Card>

          <Card tone="white">
            <SectionHeader eyebrow="Activity" title="Recently sent" icon={<Clock size={16} />} />
            <div className="mt-4 space-y-1.5">
              {history === null ? (
                <p className="py-6 text-center text-xs text-ink-400">Loading…</p>
              ) : history.length === 0 ? (
                <Empty title="Nothing sent yet" hint="Your sent messages will appear here." icon={<Send size={20} />} />
              ) : history.slice(0, 12).map((n) => {
                const p = patients.find((x) => x.id === n.patientId);
                return (
                  <div key={n.id} className="flex items-start gap-3 rounded-[14px] border border-ink-950/[0.06] bg-white px-3.5 py-2.5">
                    <Pill tone={CAT_TONE[n.category] || 'neutral'}>{n.category}</Pill>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-bold text-ink-800">{n.title}</p>
                      <p className="truncate text-xs text-ink-500">To {p?.name || 'patient'} · {timeAgo(n.createdAt)}</p>
                    </div>
                    <span className="shrink-0 font-mono text-[10px] uppercase tracking-wider text-leaf-deep">{n.status}</span>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      </div>

      {/* Template editor */}
      {editor && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-ink-950/50 p-4 backdrop-blur-sm" onClick={() => setEditor(null)}>
          <div className="w-full max-w-lg rounded-[24px] border border-ink-950/10 bg-cream-50 p-6 shadow-lift" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between">
              <div>
                <Label>Template</Label>
                <h3 className="mt-1 font-display text-xl font-bold tracking-tight text-ink-900">{editor.id ? 'Edit template' : 'New template'}</h3>
              </div>
              <button onClick={() => setEditor(null)} aria-label="Close" className="flex h-9 w-9 items-center justify-center rounded-full border border-ink-950/10 text-ink-500 hover:text-ink-900"><X size={16} /></button>
            </div>
            <div className="mt-5 space-y-4">
              <div className="grid gap-4 sm:grid-cols-[160px_minmax(0,1fr)]">
                <div>
                  <Label>Category</Label>
                  <select value={editor.category} onChange={(e) => setEditor({ ...editor, category: e.target.value as NotificationCategory })} className={cn(inputCls, 'mt-2 appearance-none')}>
                    {NOTIFICATION_CATEGORIES.map((c) => <option key={c.key} value={c.key}>{c.label}</option>)}
                  </select>
                </div>
                <div>
                  <Label>Name</Label>
                  <input value={editor.name} onChange={(e) => setEditor({ ...editor, name: e.target.value })} placeholder="e.g. Post-op check-in" className={cn(inputCls, 'mt-2')} />
                </div>
              </div>
              <div>
                <Label>Title</Label>
                <input value={editor.title} onChange={(e) => setEditor({ ...editor, title: e.target.value })} className={cn(inputCls, 'mt-2')} />
              </div>
              <div>
                <Label>Message</Label>
                <textarea value={editor.body} onChange={(e) => setEditor({ ...editor, body: e.target.value })} className={cn(inputCls, 'mt-2 h-28 resize-none leading-relaxed')} />
              </div>
              <div className="flex flex-wrap gap-1.5">
                {NOTIFICATION_TOKENS.map((t) => (
                  <button key={t.token} onClick={() => setEditor({ ...editor, body: editor.body + ' ' + t.token })}
                    className="rounded-full border border-ink-950/10 bg-white px-2.5 py-1 font-mono text-[10px] font-bold text-ink-500 hover:text-primary">
                    {t.token}
                  </button>
                ))}
              </div>
              <button onClick={saveTemplate} className="w-full rounded-full bg-ink-950 py-3.5 text-sm font-bold uppercase tracking-[0.08em] text-cream-50 hover:bg-ink-800">
                {editor.id ? 'Save changes' : 'Create template'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessagesView;
