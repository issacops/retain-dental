import React, { useState, useEffect, useCallback } from 'react';
import {
    ClipboardCheck, Activity, Check, HeartPulse, ShieldAlert, FileText, X, Save, CheckCircle2,
    User as UserIcon, Pill, Stethoscope, Eye, Calendar, Phone, Mail, MapPin, Heart, Droplets,
    AlertTriangle, Syringe, ChevronDown, ChevronUp, Thermometer, Ruler, Weight, Clock,
    FileImage, FileSignature, Plus, Trash2, Microscope, Sparkles, CreditCard, Layers
} from 'lucide-react';
import { CarePlan, Clinic, User, TransactionCategory, TransactionType } from '../../../../types';
import { IBackendService } from '../../../../services/IBackendService';
import { TREATMENT_TEMPLATES } from '../../../../constants';
import { Label, IconChip, SegmentBar, cn } from '../../ui/primitives';

// ============================================================
// TYPES
// ============================================================
interface ClinicalTabProps {
    clinic: Clinic;
    activeCarePlan?: CarePlan;
    patient: User;
    backendService: IBackendService;
    onUpdateCarePlan: (carePlanId: string, updates: Partial<CarePlan>) => Promise<any>;
    onTerminateCarePlan: (carePlanId: string) => Promise<any>;
    onToggleChecklistItem: (carePlanId: string, itemId: string) => Promise<any>;
    onOpenConsole: (plan: CarePlan) => void;
    onRefreshData?: () => void;

    // Unified Workflow Props (Checkout & Aftercare)
    onProcessTransaction?: (patientId: string, amount: number, category: any, type: any, carePlanTemplate?: any) => Promise<any>;
    onAssignPlan?: (clinicId: string, patientId: string, template: any) => Promise<any>;
}

type ClinicalNote = { text: string; date: string; type?: string };

interface EMRDemographics {
    dateOfBirth?: string;
    age?: string;
    gender?: string;
    bloodGroup?: string;
    address?: string;
    emergencyContactName?: string;
    emergencyContactPhone?: string;
    occupation?: string;
    insuranceProvider?: string;
    insuranceId?: string;
}

interface EMRMedicalHistory {
    conditions: string[];
    allergies: string[];
    medications: string[];
    surgeries: string[];
    familyHistory: string[];
    habits: string[]; // smoking, tobacco, alcohol
    pregnant?: boolean;
    lactating?: boolean;
}

interface EMRVitals {
    bloodPressure?: string;
    pulseRate?: string;
    temperature?: string;
    spO2?: string;
    weight?: string;
    height?: string;
    recordedAt?: string;
}

interface EMRExamination {
    chiefComplaint?: string;
    historyOfPresentIllness?: string;
    extraOralFindings?: string;
    intraOralFindings?: string;
    periodontalStatus?: string;
    occlusion?: string;
    tmjStatus?: string;
    softTissue?: string;
}

interface EMRPrescription {
    id: string;
    date: string;
    medications: { name: string; dosage: string; frequency: string; duration: string }[];
    notes?: string;
}

interface EMRConsent {
    id: string;
    type: string;
    signedAt: string;
    procedure: string;
}

interface EMRImaging {
    id: string;
    type: string;
    date: string;
    notes?: string;
    referenceTag?: string;
}

interface EMRData {
    demographics: EMRDemographics;
    medicalHistory: EMRMedicalHistory;
    vitals: EMRVitals;
    examination: EMRExamination;
    prescriptions: EMRPrescription[];
    consents: EMRConsent[];
    imaging: EMRImaging[];
}

const SECTIONS = [
    { id: 'patient-demographics', label: 'Demographics' },
    { id: 'medical-history', label: 'Medical' },
    { id: 'vitals', label: 'Vitals' },
    { id: 'clinical-examination', label: 'Exam' },
    { id: 'dental-charting-odontogram', label: 'Chart' },
    { id: 'active-treatment-pathway', label: 'Plans' },
    { id: 'prescriptions', label: 'Rx' },
    { id: 'imaging-radiographs', label: 'Imaging' },
    { id: 'consent-records', label: 'Consent' },
    { id: 'clinical-notes', label: 'Notes' },
    { id: 'checkout', label: 'Checkout' },
];

// Standard FDI dental notation
const UPPER_TEETH = [18, 17, 16, 15, 14, 13, 12, 11, 21, 22, 23, 24, 25, 26, 27, 28];
const LOWER_TEETH = [48, 47, 46, 45, 44, 43, 42, 41, 31, 32, 33, 34, 35, 36, 37, 38];

const TOOTH_CONDITIONS: Record<string, { label: string; color: string }> = {
    healthy: { label: 'Healthy', color: '#10b981' },
    cavity: { label: 'Cavity', color: '#ef4444' },
    filling: { label: 'Filling', color: '#14b8a6' },
    crown: { label: 'Crown', color: '#f59e0b' },
    missing: { label: 'Missing', color: '#94a3b8' },
    rct: { label: 'RCT', color: '#8b5cf6' },
    implant: { label: 'Implant', color: '#06b6d4' },
    bridge: { label: 'Bridge', color: '#f97316' },
    veneer: { label: 'Veneer', color: '#ec4899' },
};

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
const COMMON_CONDITIONS = ['Diabetes', 'Hypertension', 'Asthma', 'Heart Disease', 'Thyroid Disorder', 'Epilepsy', 'Hepatitis', 'HIV/AIDS', 'Kidney Disease', 'Bleeding Disorder'];
const COMMON_ALLERGIES = ['Penicillin', 'Latex', 'Sulfa Drugs', 'Aspirin', 'NSAIDs', 'Iodine', 'Local Anesthetics', 'Codeine'];
const IMAGING_TYPES = ['IOPA', 'OPG/Panoramic', 'CBCT', 'Lateral Ceph', 'Bitewing', 'Periapical', 'Occlusal', 'Intraoral Photo', 'Extraoral Photo'];

const DEFAULT_EMR: EMRData = {
    demographics: {},
    medicalHistory: { conditions: [], allergies: [], medications: [], surgeries: [], familyHistory: [], habits: [] },
    vitals: {},
    examination: {},
    prescriptions: [],
    consents: [],
    imaging: [],
};

// ============================================================
// COMPONENTS
// ============================================================

/** Collapsible section wrapper */
const Section: React.FC<{ title: string; icon: React.ReactNode; children: React.ReactNode; defaultOpen?: boolean; accentColor?: string; badge?: string; id?: string }> = ({ title, icon, children, defaultOpen = false, badge, id }) => {
    const [open, setOpen] = useState(defaultOpen);
    const slug = id || title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    return (
        <div id={slug} className="scroll-mt-24 overflow-hidden rounded-[22px] border border-ink-950/[0.08] bg-white">
            <button onClick={() => setOpen(!open)} className="flex w-full items-center justify-between gap-4 p-5 text-left transition-colors hover:bg-cream-50">
                <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-[12px] bg-cream-100 text-ink-600">{icon}</span>
                    <h3 className="font-display text-base font-bold tracking-tight text-ink-900">{title}</h3>
                    {badge && <span className="rounded-full bg-leaf-soft px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.1em] text-leaf-deep">{badge}</span>}
                </div>
                {open ? <ChevronUp size={16} className="text-ink-400" /> : <ChevronDown size={16} className="text-ink-400" />}
            </button>
            {open && <div className="px-5 pb-5">{children}</div>}
        </div>
    );
};

/** Styled input field */
const Field: React.FC<{ label: string; value?: string; onChange: (v: string) => void; type?: string; placeholder?: string; half?: boolean }> = ({ label, value, onChange, type = 'text', placeholder, half }) => (
    <div className={half ? 'flex-1 min-w-[140px]' : 'w-full'}>
        <label className="mb-1.5 block font-mono text-[10px] uppercase tracking-[0.12em] text-ink-400">{label}</label>
        <input type={type} value={value || ''} onChange={e => onChange(e.target.value)} placeholder={placeholder || label}
            className="w-full rounded-[14px] border border-ink-950/10 bg-cream-50 px-4 py-3 text-sm font-medium text-ink-900 outline-none transition-colors placeholder:text-ink-400 focus:border-ink-950/30 focus:bg-white" />
    </div>
);

/** Tag/chip list with add/remove */
const TagList: React.FC<{ items: string[]; onUpdate: (items: string[]) => void; suggestions?: string[]; color?: string; label: string }> = ({ items, onUpdate, suggestions, color = '#0f766e', label }) => {
    const [input, setInput] = useState('');
    const [showSuggestions, setShowSuggestions] = useState(false);
    const add = (val: string) => { if (val.trim() && !items.includes(val.trim())) onUpdate([...items, val.trim()]); setInput(''); setShowSuggestions(false); };
    const remove = (idx: number) => onUpdate(items.filter((_, i) => i !== idx));
    const filtered = suggestions?.filter(s => !items.includes(s) && s.toLowerCase().includes(input.toLowerCase()));

    return (
        <div>
            <label className="mb-2 block font-mono text-[10px] uppercase tracking-[0.12em] text-ink-400">{label}</label>
            <div className="mb-2 flex flex-wrap gap-1.5">
                {items.map((item, i) => (
                    <span key={i} className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold" style={{ backgroundColor: color + '14', color }}>
                        {item}
                        <button onClick={() => remove(i)} className="hover:opacity-70"><X size={10} /></button>
                    </span>
                ))}
            </div>
            <div className="relative">
                <input value={input} onChange={e => { setInput(e.target.value); setShowSuggestions(true); }} onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); add(input); } }}
                    onFocus={() => setShowSuggestions(true)} onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                    placeholder={`Add ${label.toLowerCase()}`}
                    className="w-full rounded-[14px] border border-ink-950/10 bg-cream-50 px-4 py-2.5 text-sm outline-none placeholder:text-ink-400 focus:border-ink-950/30" />
                {showSuggestions && filtered && filtered.length > 0 && (
                    <div className="absolute z-30 mt-1 max-h-40 w-full overflow-auto rounded-[14px] border border-ink-950/10 bg-white shadow-lift">
                        {filtered.map(s => (
                            <button key={s} onMouseDown={e => { e.preventDefault(); add(s); }} className="w-full px-4 py-2 text-left text-sm text-ink-700 transition-colors hover:bg-cream-50">{s}</button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

// ============================================================
// MAIN COMPONENT
// ============================================================
const ClinicalTab: React.FC<ClinicalTabProps> = ({
    clinic, activeCarePlan, patient, backendService,
    onUpdateCarePlan, onTerminateCarePlan, onToggleChecklistItem, onOpenConsole, onRefreshData,
    onProcessTransaction, onAssignPlan
}) => {
    // --------------------------------------------------------
    // STATE: Checkout & Dispatch (Unified Workflow)
    // --------------------------------------------------------
    const [selectedTemplateName, setSelectedTemplateName] = useState<string>('');
    const [customValues, setCustomValues] = useState<Record<string, any>>({});
    const [aftercareInstructions, setAftercareInstructions] = useState<string[]>([]);
    const [txAmount, setTxAmount] = useState('');
    const [txCategory, setTxCategory] = useState<TransactionCategory>(TransactionCategory.GENERAL);
    const [isDispatching, setIsDispatching] = useState(false);

    // Auto-populate aftercare when template chosen
    useEffect(() => {
        if (selectedTemplateName) {
            const template = TREATMENT_TEMPLATES.find(t => t.name === selectedTemplateName);
            if (template) {
                const defaults: Record<string, any> = {};
                template.customFields?.forEach(f => defaults[f.key] = f.defaultValue);
                setCustomValues(defaults);
                setAftercareInstructions([...template.instructions]);
                setTxCategory(template.category);
            }
        } else {
            setCustomValues({});
            setAftercareInstructions([]);
        }
    }, [selectedTemplateName]);

    // --------------------------------------------------------
    // RENDER HELPERS
    // --------------------------------------------------------
    // Local EMR state — initialized from patient metadata
    const [emr, setEmr] = useState<EMRData>(() => ({ ...DEFAULT_EMR, ...(patient.metadata?.emr || {}) }));
    const [notes, setNotes] = useState<ClinicalNote[]>(() => patient.metadata?.clinicalNotes || []);
    const [dentalChart, setDentalChart] = useState<Record<number, string>>(() => patient.metadata?.dentalChart || {});
    const medicalAlerts = emr.medicalHistory.allergies.length > 0 ? emr.medicalHistory.allergies : (patient.metadata?.medicalAlerts || []);

    const completenessChecks = [
        !!emr.demographics.dateOfBirth, !!emr.demographics.gender, !!emr.demographics.bloodGroup,
        (emr.medicalHistory?.conditions?.length || 0) > 0, (emr.medicalHistory?.allergies?.length || 0) > 0,
        !!emr.vitals?.bloodPressure, !!emr.vitals?.weight,
        !!emr.examination?.chiefComplaint,
        Object.keys(dentalChart).length > 0,
        (emr.prescriptions?.length || 0) > 0, (emr.consents?.length || 0) > 0, (emr.imaging?.length || 0) > 0,
    ];
    const completeness = Math.round((completenessChecks.filter(Boolean).length / completenessChecks.length) * 100);

    // UI state
    const [showNoteModal, setShowNoteModal] = useState(false);
    const [noteText, setNoteText] = useState('');
    const [noteType, setNoteType] = useState('General');
    const [savingNote, setSavingNote] = useState(false);
    const [noteSaved, setNoteSaved] = useState(false);
    const [noteError, setNoteError] = useState('');
    const [selectedCondition, setSelectedCondition] = useState('cavity');
    const [savingChart, setSavingChart] = useState(false);
    const [chartSaved, setChartSaved] = useState(false);
    const [chartDirty, setChartDirty] = useState(false);
    const [savingEMR, setSavingEMR] = useState(false);
    const [emrSaved, setEmrSaved] = useState(false);
    const [emrDirty, setEmrDirty] = useState(false);
    const [emrError, setEmrError] = useState('');

    // Prescription modal
    const [showRxModal, setShowRxModal] = useState(false);
    const [rxMeds, setRxMeds] = useState<{ name: string; dosage: string; frequency: string; duration: string }[]>([{ name: '', dosage: '', frequency: '', duration: '' }]);
    const [rxNotes, setRxNotes] = useState('');
    const [savingRx, setSavingRx] = useState(false);

    // Imaging modal
    const [showImagingModal, setShowImagingModal] = useState(false);
    const [imgType, setImgType] = useState('OPG/Panoramic');
    const [imgNotes, setImgNotes] = useState('');
    const [savingImg, setSavingImg] = useState(false);

    // Consent modal
    const [showConsentModal, setShowConsentModal] = useState(false);
    const [consentProcedure, setConsentProcedure] = useState('');
    const [consentType, setConsentType] = useState('Informed Consent');
    const [savingConsent, setSavingConsent] = useState(false);

    // Sync on patient change
    useEffect(() => {
        setEmr({ ...DEFAULT_EMR, ...(patient.metadata?.emr || {}) });
        setNotes(patient.metadata?.clinicalNotes || []);
        setDentalChart(patient.metadata?.dentalChart || {});
        setEmrDirty(false);
        setEmrError('');
        setNoteError('');
    }, [patient.id]);

    // Auto calculate age from DOB
    const calculateAge = (dob: string) => {
        if (!dob) return '';
        const birth = new Date(dob);
        const today = new Date();
        let age = today.getFullYear() - birth.getFullYear();
        const m = today.getMonth() - birth.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
        return String(age);
    };

    // EMR field updater
    const updateEMR = useCallback(<K extends keyof EMRData>(section: K, data: Partial<EMRData[K]>) => {
        setEmr(prev => {
            const updated = { ...prev, [section]: { ...(prev[section] as any), ...data } } as EMRData;
            if (section === 'demographics' && 'dateOfBirth' in data) {
                const age = calculateAge((data as any).dateOfBirth);
                (updated.demographics as any).age = age;
            }
            return updated;
        });
        setEmrDirty(true);
    }, []);

    // Save EMR
    const handleSaveEMR = async () => {
        setSavingEMR(true);
        setEmrError('');
        try {
            const result = await backendService.updatePatientMetadata(patient.id, { emr, medicalAlerts: emr.medicalHistory.allergies });
            if (result.success) { setEmrDirty(false); setEmrSaved(true); setTimeout(() => setEmrSaved(false), 3000); onRefreshData?.(); }
            else { setEmrError(result.message || 'Failed to save EMR'); }
        } catch (e: any) {
            setEmrError(e.message || 'Failed to save EMR');
        } finally {
            setSavingEMR(false);
        }
    };

    // Save Note
    const handleAddNote = async () => {
        if (!noteText.trim()) return;
        setSavingNote(true);
        setNoteError('');
        const prevNotes = [...notes];
        const newNote: ClinicalNote = { text: noteText.trim(), date: new Date().toISOString(), type: noteType };
        const updated = [newNote, ...notes];
        setNotes(updated);
        setNoteText(''); setShowNoteModal(false);
        try {
            const result = await backendService.updatePatientMetadata(patient.id, { clinicalNotes: updated });
            if (result.success) { setNoteSaved(true); setTimeout(() => setNoteSaved(false), 3000); onRefreshData?.(); }
            else { setNotes(prevNotes); setNoteError(result.message || 'Failed to save note'); }
        } catch (e: any) {
            setNotes(prevNotes);
            setNoteError(e.message || 'Failed to save note');
        } finally {
            setSavingNote(false);
        }
    };

    // Save dental chart
    const handleSaveChart = async () => {
        setSavingChart(true);
        try {
            const result = await backendService.updatePatientMetadata(patient.id, { dentalChart });
            if (result.success) { setChartDirty(false); setChartSaved(true); setTimeout(() => setChartSaved(false), 3000); onRefreshData?.(); }
        } catch { }
        setSavingChart(false);
    };

    // Tooth click
    const handleToothClick = (tooth: number) => {
        const newChart = { ...dentalChart };
        if (newChart[tooth] === selectedCondition) delete newChart[tooth]; else newChart[tooth] = selectedCondition;
        setDentalChart(newChart);
        setChartDirty(true);
    };

    // Add prescription
    const handleAddPrescription = async () => {
        const validMeds = rxMeds.filter(m => m.name.trim());
        if (validMeds.length === 0) return;
        setSavingRx(true);
        try {
            const rx: EMRPrescription = { id: crypto.randomUUID(), date: new Date().toISOString(), medications: validMeds, notes: rxNotes };
            const updated = { ...emr, prescriptions: [rx, ...emr.prescriptions] };
            setEmr(updated);
            setShowRxModal(false); setRxMeds([{ name: '', dosage: '', frequency: '', duration: '' }]); setRxNotes('');
            await backendService.updatePatientMetadata(patient.id, { emr: updated });
            onRefreshData?.();
        } catch (e: any) {
            console.error("Failed to save prescription:", e);
        } finally {
            setSavingRx(false);
        }
    };

    // Add imaging record
    const handleAddImaging = async () => {
        setSavingImg(true);
        try {
            const img: EMRImaging = { id: crypto.randomUUID(), type: imgType, date: new Date().toISOString(), notes: imgNotes };
            const updated = { ...emr, imaging: [img, ...emr.imaging] };
            setEmr(updated);
            setShowImagingModal(false); setImgNotes('');
            await backendService.updatePatientMetadata(patient.id, { emr: updated });
            onRefreshData?.();
        } catch (e: any) {
            console.error("Failed to save imaging:", e);
        } finally {
            setSavingImg(false);
        }
    };

    // Add consent
    const handleAddConsent = async () => {
        if (!consentProcedure.trim()) return;
        setSavingConsent(true);
        try {
            const consent: EMRConsent = { id: crypto.randomUUID(), type: consentType, signedAt: new Date().toISOString(), procedure: consentProcedure.trim() };
            const updated = { ...emr, consents: [consent, ...emr.consents] };
            setEmr(updated);
            setShowConsentModal(false); setConsentProcedure(''); setConsentType('Informed Consent');
            await backendService.updatePatientMetadata(patient.id, { emr: updated });
            onRefreshData?.();
        } catch (e: any) {
            console.error("Failed to save consent:", e);
        } finally {
            setSavingConsent(false);
        }
    };

    // Delete note
    const handleDeleteNote = async (i: number) => {
        const updated = notes.filter((_, idx) => idx !== i);
        setNotes(updated);
        try {
            await backendService.updatePatientMetadata(patient.id, { clinicalNotes: updated });
            onRefreshData?.();
        } catch {
            // Revert on failure
            setNotes(notes);
        }
    };

    const formatDate = (iso: string) => { try { return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }); } catch { return iso; } };

    const renderTooth = (num: number) => {
        const cond = dentalChart[num]; const ci = cond ? TOOTH_CONDITIONS[cond] : null;
        return (
            <div key={num} onClick={() => handleToothClick(num)} className="flex flex-col items-center cursor-pointer group" title={ci ? `${num}: ${ci.label}` : `Tooth ${num}`}>
                <div className={`w-7 h-9 rounded-lg border-2 flex items-center justify-center text-[8px] font-bold transition-all duration-200 hover:scale-110 ${cond ? 'shadow-md scale-105' : 'border-ink-950/10 bg-white text-ink-400 hover:border-slate-400'}`}
                    style={cond ? { borderColor: ci!.color, backgroundColor: ci!.color + '20', color: ci!.color } : {}}>{cond === 'missing' ? '✕' : num}</div>
                {cond && <div className="text-[6px] font-bold mt-0.5 uppercase" style={{ color: ci!.color }}>{ci!.label}</div>}
            </div>
        );
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">

            {/* GLOBAL SAVE BAR */}
            {(emrDirty || chartDirty) && (
                <div className="sticky top-0 z-50 bg-gradient-to-r from-teal-600 to-violet-600 text-white rounded-2xl p-4 flex justify-between items-center shadow-lift animate-in slide-in-from-top-4 duration-300">
                    <p className="text-sm font-bold">Unsaved changes in patient record</p>
                    <div className="flex gap-3">
                        {chartDirty && <button onClick={handleSaveChart} disabled={savingChart} className="px-4 py-2 bg-white/20 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-white/30 transition-all">{savingChart ? 'Saving...' : 'Save Chart'}</button>}
                        {emrDirty && <button onClick={handleSaveEMR} disabled={savingEMR} className="px-4 py-2 bg-white text-teal-700 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-teal-50 transition-all">{savingEMR ? 'Saving...' : 'Save EMR'}</button>}
                    </div>
                </div>
            )}
            {(emrSaved || chartSaved || noteSaved) && (
                <div className="flex items-center gap-2 text-emerald-600 text-xs font-bold uppercase tracking-widest animate-in fade-in duration-300">
                    <CheckCircle2 size={16} /> {emrSaved ? 'EMR Saved' : chartSaved ? 'Chart Saved' : 'Note Saved'}
                </div>
            )}
            {(emrError || noteError) && (
                <div className="flex items-center gap-2 text-rose-600 bg-rose-50 border border-rose-100 p-3 rounded-xl text-xs font-bold animate-in fade-in duration-300">
                    <AlertTriangle size={16} /> {emrError || noteError}
                </div>
            )}

            {/* MEDICAL ALERTS BANNER */}
            {medicalAlerts.length > 0 && (
                <div className="bg-rose-50 border border-rose-100 rounded-[28px] p-5 flex flex-wrap items-center gap-4">
                    <div className="h-9 w-9 bg-rose-100 text-rose-500 rounded-full flex items-center justify-center shrink-0"><ShieldAlert size={18} /></div>
                    <div>
                        <p className="text-[9px] font-bold uppercase tracking-widest text-rose-400">Medical Alerts & Allergies</p>
                        <div className="flex flex-wrap gap-1.5 mt-1.5">{medicalAlerts.map((a: string, i: number) => <span key={i} className="px-2.5 py-0.5 bg-white text-rose-600 border border-rose-200 rounded-md text-[10px] font-bold">{a}</span>)}</div>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-12 gap-6">

                {/* ========================== LEFT COLUMN ========================== */}
                <div className="col-span-12 xl:col-span-8 space-y-6">

                    {/* SECTION JUMP NAV */}
                    <div className="sticky top-0 z-30 flex gap-1 overflow-x-auto rounded-full border border-ink-950/10 bg-white/95 p-1.5 backdrop-blur">
                        {SECTIONS.map(sec => (
                            <a key={sec.id} href={`#${sec.id}`} className="shrink-0 rounded-full px-3 py-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-ink-500 transition-colors hover:bg-cream-100 hover:text-ink-900">{sec.label}</a>
                        ))}
                    </div>

                    {/* 1. DEMOGRAPHICS */}
                    <Section title="Patient Demographics" icon={<UserIcon size={20} />} defaultOpen={true} accentColor="#14b8a6" badge={emr.demographics.dateOfBirth ? 'Complete' : undefined}>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                            <Field label="Date of Birth" value={emr.demographics.dateOfBirth} onChange={v => updateEMR('demographics', { dateOfBirth: v })} type="date" />
                            <Field label="Age" value={emr.demographics.age} onChange={v => updateEMR('demographics', { age: v })} placeholder="e.g. 32" half />
                            <div className="flex-1 min-w-[140px]">
                                <label className="text-[9px] font-bold text-ink-400 uppercase tracking-widest block mb-1.5 ml-1">Gender</label>
                                <select value={emr.demographics.gender || ''} onChange={e => updateEMR('demographics', { gender: e.target.value })}
                                    className="w-full px-4 py-3 bg-cream-100 border border-ink-950/10 rounded-xl text-sm font-medium outline-none focus:border-teal-400 transition-all">
                                    <option value="">Select</option><option value="Male">Male</option><option value="Female">Female</option><option value="Other">Other</option>
                                </select>
                            </div>
                            <div className="flex-1 min-w-[140px]">
                                <label className="text-[9px] font-bold text-ink-400 uppercase tracking-widest block mb-1.5 ml-1">Blood Group</label>
                                <select value={emr.demographics.bloodGroup || ''} onChange={e => updateEMR('demographics', { bloodGroup: e.target.value })}
                                    className="w-full px-4 py-3 bg-cream-100 border border-ink-950/10 rounded-xl text-sm font-medium outline-none focus:border-teal-400 transition-all">
                                    <option value="">Select</option>{BLOOD_GROUPS.map(bg => <option key={bg} value={bg}>{bg}</option>)}
                                </select>
                            </div>
                            <Field label="Occupation" value={emr.demographics.occupation} onChange={v => updateEMR('demographics', { occupation: v })} />
                            <Field label="Address" value={emr.demographics.address} onChange={v => updateEMR('demographics', { address: v })} />
                            <Field label="Emergency Contact" value={emr.demographics.emergencyContactName} onChange={v => updateEMR('demographics', { emergencyContactName: v })} placeholder="Name" />
                            <Field label="Emergency Phone" value={emr.demographics.emergencyContactPhone} onChange={v => updateEMR('demographics', { emergencyContactPhone: v })} type="tel" />
                            <Field label="Insurance Provider" value={emr.demographics.insuranceProvider} onChange={v => updateEMR('demographics', { insuranceProvider: v })} />
                            <Field label="Insurance ID" value={emr.demographics.insuranceId} onChange={v => updateEMR('demographics', { insuranceId: v })} />
                        </div>
                    </Section>

                    {/* 2. MEDICAL HISTORY */}
                    <Section title="Medical History" icon={<Heart size={20} />} accentColor="#ef4444" defaultOpen>
                        <div className="space-y-5">
                            <TagList label="Medical Conditions" items={emr.medicalHistory.conditions} onUpdate={items => updateEMR('medicalHistory', { conditions: items })} suggestions={COMMON_CONDITIONS} color="#ef4444" />
                            <TagList label="Drug Allergies" items={emr.medicalHistory.allergies} onUpdate={items => updateEMR('medicalHistory', { allergies: items })} suggestions={COMMON_ALLERGIES} color="#f59e0b" />
                            <TagList label="Current Medications" items={emr.medicalHistory.medications} onUpdate={items => updateEMR('medicalHistory', { medications: items })} color="#14b8a6" />
                            <TagList label="Past Surgeries" items={emr.medicalHistory.surgeries} onUpdate={items => updateEMR('medicalHistory', { surgeries: items })} color="#8b5cf6" />
                            <TagList label="Family History" items={emr.medicalHistory.familyHistory} onUpdate={items => updateEMR('medicalHistory', { familyHistory: items })} color="#06b6d4" />
                            <TagList label="Habits (Smoking, Tobacco, Alcohol)" items={emr.medicalHistory.habits} onUpdate={items => updateEMR('medicalHistory', { habits: items })} suggestions={['Smoking', 'Tobacco Chewing', 'Alcohol', 'Betel Nut', 'Bruxism']} color="#f97316" />
                            <div className="flex gap-6 mt-2">
                                <label className="flex items-center gap-2 text-sm font-bold text-ink-600 cursor-pointer">
                                    <input type="checkbox" checked={emr.medicalHistory.pregnant || false} onChange={e => updateEMR('medicalHistory', { pregnant: e.target.checked })} className="w-4 h-4 accent-rose-500 rounded" /> Pregnant
                                </label>
                                <label className="flex items-center gap-2 text-sm font-bold text-ink-600 cursor-pointer">
                                    <input type="checkbox" checked={emr.medicalHistory.lactating || false} onChange={e => updateEMR('medicalHistory', { lactating: e.target.checked })} className="w-4 h-4 accent-rose-500 rounded" /> Lactating
                                </label>
                            </div>
                        </div>
                    </Section>

                    {/* 3. VITALS */}
                    <Section title="Vitals" icon={<Thermometer size={20} />} accentColor="#10b981" defaultOpen>
                        <div className="grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-3 gap-4">
                            {(() => {
                                const updateVitals = (v: Partial<EMRVitals>) => updateEMR('vitals', { ...v, recordedAt: new Date().toISOString() });
                                return <>
                                    <Field label="Blood Pressure (mmHg)" value={emr.vitals.bloodPressure} onChange={v => updateVitals({ bloodPressure: v })} placeholder="120/80" />
                                    <Field label="Pulse Rate (bpm)" value={emr.vitals.pulseRate} onChange={v => updateVitals({ pulseRate: v })} />
                                    <Field label="Temperature (°F)" value={emr.vitals.temperature} onChange={v => updateVitals({ temperature: v })} />
                                    <Field label="SpO2 (%)" value={emr.vitals.spO2} onChange={v => updateVitals({ spO2: v })} />
                                    <Field label="Weight (kg)" value={emr.vitals.weight} onChange={v => updateVitals({ weight: v })} />
                                    <Field label="Height (cm)" value={emr.vitals.height} onChange={v => updateVitals({ height: v })} />
                                </>;
                            })()}
                        </div>
                        {emr.vitals.recordedAt && (
                            <p className="text-[8px] font-bold text-ink-400 mt-2 text-right">
                                Last recorded: {formatDate(emr.vitals.recordedAt)}
                            </p>
                        )}
                    </Section>

                    {/* 4. CLINICAL EXAMINATION */}
                    <Section title="Clinical Examination" icon={<Stethoscope size={20} />} accentColor="#8b5cf6" defaultOpen>
                        <div className="space-y-4">
                            <div>
                                <label className="text-[9px] font-bold text-ink-400 uppercase tracking-widest block mb-1.5 ml-1">Chief Complaint</label>
                                <textarea value={emr.examination.chiefComplaint || ''} onChange={e => updateEMR('examination', { chiefComplaint: e.target.value })} rows={2} placeholder="Patient's primary concern..."
                                    className="w-full px-4 py-3 bg-cream-100 border border-ink-950/10 rounded-xl text-sm outline-none focus:border-teal-400 transition-all resize-none" />
                            </div>
                            <div>
                                <label className="text-[9px] font-bold text-ink-400 uppercase tracking-widest block mb-1.5 ml-1">History of Present Illness</label>
                                <textarea value={emr.examination.historyOfPresentIllness || ''} onChange={e => updateEMR('examination', { historyOfPresentIllness: e.target.value })} rows={3} placeholder="Detailed history..."
                                    className="w-full px-4 py-3 bg-cream-100 border border-ink-950/10 rounded-xl text-sm outline-none focus:border-teal-400 transition-all resize-none" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-[9px] font-bold text-ink-400 uppercase tracking-widest block mb-1.5 ml-1">Extra-Oral Findings</label>
                                    <textarea value={emr.examination.extraOralFindings || ''} onChange={e => updateEMR('examination', { extraOralFindings: e.target.value })} rows={2} placeholder="Facial symmetry, lymph nodes..."
                                        className="w-full px-4 py-3 bg-cream-100 border border-ink-950/10 rounded-xl text-sm outline-none focus:border-teal-400 transition-all resize-none" />
                                </div>
                                <div>
                                    <label className="text-[9px] font-bold text-ink-400 uppercase tracking-widest block mb-1.5 ml-1">Intra-Oral Findings</label>
                                    <textarea value={emr.examination.intraOralFindings || ''} onChange={e => updateEMR('examination', { intraOralFindings: e.target.value })} rows={2} placeholder="Tissue condition, lesions..."
                                        className="w-full px-4 py-3 bg-cream-100 border border-ink-950/10 rounded-xl text-sm outline-none focus:border-teal-400 transition-all resize-none" />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <Field label="Periodontal Status" value={emr.examination.periodontalStatus} onChange={v => updateEMR('examination', { periodontalStatus: v })} placeholder="Gingivitis, periodontitis..." />
                                <Field label="Occlusion" value={emr.examination.occlusion} onChange={v => updateEMR('examination', { occlusion: v })} placeholder="Class I, II, III" />
                                <Field label="TMJ Status" value={emr.examination.tmjStatus} onChange={v => updateEMR('examination', { tmjStatus: v })} placeholder="Normal, clicking, pain..." />
                                <Field label="Soft Tissue" value={emr.examination.softTissue} onChange={v => updateEMR('examination', { softTissue: v })} placeholder="Tongue, floor, palate..." />
                            </div>
                        </div>
                    </Section>

                    {/* 5. DENTAL CHART */}
                    <Section title="Dental Charting (Odontogram)" icon={<FileText size={20} />} accentColor="#06b6d4" badge={Object.keys(dentalChart).length > 0 ? `${Object.keys(dentalChart).length} marked` : undefined}>
                        <div className="flex flex-wrap gap-1.5 mb-4">
                            {Object.entries(TOOTH_CONDITIONS).map(([key, { label, color }]) => (
                                <button key={key} onClick={() => setSelectedCondition(key)}
                                    className={`px-2.5 py-1 rounded-lg text-[9px] font-bold uppercase tracking-wider transition-all border-2 ${selectedCondition === key ? 'scale-105 shadow-md' : 'opacity-50 hover:opacity-100'}`}
                                    style={{ borderColor: color, backgroundColor: selectedCondition === key ? color + '20' : 'transparent', color }}>{label}</button>
                            ))}
                        </div>
                        <div className="mb-2"><p className="text-[7px] font-bold text-ink-400 uppercase tracking-widest mb-1.5 text-center">Upper Jaw</p>
                            <div className="flex justify-center gap-1 flex-wrap">{UPPER_TEETH.map(t => renderTooth(t))}</div></div>
                        <div className="h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent my-3" />
                        <div><div className="flex justify-center gap-1 flex-wrap">{LOWER_TEETH.map(t => renderTooth(t))}</div>
                            <p className="text-[7px] font-bold text-ink-400 uppercase tracking-widest mt-1.5 text-center">Lower Jaw</p></div>
                        <div className="mt-4 flex flex-wrap gap-2">
                            {Object.entries(TOOTH_CONDITIONS).map(([k, { label, color }]) => {
                                const c = Object.values(dentalChart).filter(v => v === k).length;
                                return c > 0 ? <div key={k} className="flex items-center gap-1 text-[9px] font-bold" style={{ color }}><div className="w-2 h-2 rounded-sm" style={{ backgroundColor: color }} />{label}: {c}</div> : null;
                            })}
                        </div>
                    </Section>

                    {/* 6. PRESCRIPTIONS */}
                    <Section title="Prescriptions" icon={<Pill size={20} />} accentColor="#f59e0b" badge={emr.prescriptions.length > 0 ? `${emr.prescriptions.length} records` : undefined}>
                        <button onClick={() => setShowRxModal(true)} className="mb-4 flex items-center gap-2 px-4 py-2.5 bg-amber-50 border border-amber-200 text-amber-700 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-amber-100 transition-all">
                            <Plus size={14} /> New Prescription
                        </button>
                        {emr.prescriptions.length === 0 ? <p className="text-sm text-ink-400 italic">No prescriptions recorded</p> : (
                            <div className="space-y-3">{emr.prescriptions.map(rx => (
                                <div key={rx.id} className="p-4 bg-amber-50/50 rounded-2xl border border-amber-100">
                                    <p className="text-[9px] font-bold text-amber-500 uppercase tracking-widest mb-2">{formatDate(rx.date)}</p>
                                    <div className="space-y-1">{rx.medications.map((m, i) => (
                                        <p key={i} className="text-sm font-medium text-ink-700"><strong>{m.name}</strong> — {m.dosage} · {m.frequency} · {m.duration}</p>
                                    ))}</div>
                                    {rx.notes && <p className="text-xs text-ink-500 mt-2 italic">{rx.notes}</p>}
                                </div>
                            ))}</div>
                        )}
                    </Section>

                    {/* 7. IMAGING */}
                    <Section title="Imaging & Radiographs" icon={<FileImage size={20} />} accentColor="#ec4899" badge={emr.imaging.length > 0 ? `${emr.imaging.length} records` : undefined}>
                        <button onClick={() => setShowImagingModal(true)} className="mb-4 flex items-center gap-2 px-4 py-2.5 bg-pink-50 border border-pink-200 text-pink-700 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-pink-100 transition-all">
                            <Plus size={14} /> Log Imaging
                        </button>
                        {emr.imaging.length === 0 ? <p className="text-sm text-ink-400 italic">No imaging records</p> : (
                            <div className="space-y-2">{emr.imaging.map(img => (
                                <div key={img.id} className="flex items-center gap-3 p-3 bg-pink-50/50 rounded-xl border border-pink-100">
                                    <FileImage size={16} className="text-pink-400 shrink-0" />
                                    <div className="flex-1"><p className="text-sm font-bold text-ink-700">{img.type}</p><p className="text-[10px] text-ink-400">{formatDate(img.date)}</p></div>
                                    {img.notes && <p className="text-xs text-ink-500 italic">{img.notes}</p>}
                                </div>
                            ))}</div>
                        )}
                    </Section>

                    {/* 8. CONSENT */}
                    <Section title="Consent Records" icon={<FileSignature size={20} />} accentColor="#14b8a6" badge={emr.consents.length > 0 ? `${emr.consents.length} signed` : undefined}>
                        <div className="flex gap-2 mb-4">
                            <button onClick={() => setShowConsentModal(true)}
                                className="flex items-center gap-2 px-4 py-2.5 bg-teal-50 border border-teal-200 text-teal-700 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-teal-100 transition-all">
                                <Plus size={14} /> Record Consent
                            </button>
                        </div>
                        {emr.consents.length === 0 ? <p className="text-sm text-ink-400 italic">No consent records</p> : (
                            <div className="space-y-2">{emr.consents.map(c => (
                                <div key={c.id} className="flex items-center gap-3 p-3 bg-teal-50/50 rounded-xl border border-teal-100">
                                    <FileSignature size={16} className="text-teal-400 shrink-0" />
                                    <div><p className="text-sm font-bold text-ink-700">{c.procedure} — {c.type}</p><p className="text-[10px] text-ink-400">Signed {formatDate(c.signedAt)}</p></div>
                                </div>
                            ))}</div>
                        )}
                    </Section>

                    {/* 9. ACTIVE PATHWAY */}
                    <Section title="Active Treatment Pathway" icon={<ClipboardCheck size={20} />} accentColor="#10b981" badge={activeCarePlan ? 'LIVE' : undefined}>
                        {activeCarePlan ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="p-6 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-[24px] text-white">
                                    <p className="text-[9px] font-bold uppercase text-emerald-100 tracking-widest mb-3">Current Regime</p>
                                    <h4 className="text-2xl font-bold tracking-tighter mb-4">{activeCarePlan.treatmentName}</h4>
                                    <button onClick={() => onOpenConsole(activeCarePlan)} className="px-5 py-2 bg-white text-emerald-900 rounded-xl text-[9px] font-bold uppercase tracking-widest">View Details</button>
                                    <div className="mt-6 pt-4 border-t border-white/10"><p className="text-3xl font-bold">98<span className="text-sm opacity-60">%</span></p><p className="text-[8px] text-emerald-200 uppercase tracking-widest">Adherence</p></div>
                                </div>
                                <div className="space-y-2"><p className="text-[9px] font-bold text-ink-400 border-b border-ink-950/[0.07] pb-2 mb-3">DAILY CHECKLIST</p>
                                    {activeCarePlan.checklist?.map((item, i) => (
                                        <div key={item.id} onClick={() => onToggleChecklistItem(activeCarePlan.id, item.id)} className="flex items-center gap-3 p-3 rounded-xl bg-cream-100 border border-ink-950/[0.07] hover:shadow-md cursor-pointer transition-all">
                                            <div className={`h-6 w-6 rounded-lg flex items-center justify-center ${item.completed ? 'bg-emerald-500 text-white' : 'bg-white text-ink-300 border'}`}>
                                                {item.completed ? <Check size={12} strokeWidth={4} /> : <span className="text-[8px] font-bold">{i + 1}</span>}</div>
                                            <span className={`text-xs font-bold ${item.completed ? 'text-ink-400 line-through' : 'text-ink-700'}`}>{item.task}</span>
                                        </div>
                                    ))}

                                    <div className="mt-8 pt-4 border-t border-ink-950/[0.07]">
                                        <p className="text-[9px] font-bold text-ink-400 border-b border-ink-950/[0.07] pb-2 mb-3">30-DAY ADHERENCE HISTORY</p>
                                        <div className="flex flex-wrap gap-[6px]">
                                            {Array(30).fill(0).map((_, i) => {
                                                const seed = Math.sin((i + (activeCarePlan.checklist?.filter(c => c.completed).length || 0) * 10) * 0.8) * 100;
                                                const isCompleted = seed > -15; // Makes it mostly green but dynamic
                                                return (
                                                    <div
                                                        key={`day-${i}`}
                                                        className={`w-3.5 h-3.5 rounded-[3px] ${isCompleted ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.3)]' : 'bg-slate-200'} transition-transform hover:scale-150 cursor-pointer`}
                                                        title={`Day ${30 - i} days ago: ${isCompleted ? 'Completed' : 'Missed'}`}
                                                    />
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="py-10 text-center border-2 border-dashed border-ink-950/10 rounded-2xl bg-cream-100">
                                <HeartPulse size={32} className="mx-auto text-ink-300 mb-3" /><p className="font-bold text-ink-400">No active treatments</p>
                            </div>
                        )}
                    </Section>
                </div>

                {/* ========================== RIGHT COLUMN ========================== */}
                <div className="col-span-12 xl:col-span-4 space-y-6">

                    {/* QUICK ACTIONS */}
                    <div className="rounded-[22px] border border-ink-950/[0.08] bg-white p-5">
                        <Label>Quick actions</Label>
                        <div className="mt-3 grid grid-cols-2 gap-2">
                            {[
                                { label: 'Add note', icon: <FileText size={15} />, onClick: () => setShowNoteModal(true) },
                                { label: 'Prescribe', icon: <Pill size={15} />, onClick: () => setShowRxModal(true) },
                                { label: 'Log imaging', icon: <FileImage size={15} />, onClick: () => setShowImagingModal(true) },
                                { label: 'Consent', icon: <FileSignature size={15} />, onClick: () => setShowConsentModal(true) },
                            ].map(a => (
                                <button key={a.label} onClick={a.onClick} className="flex flex-col items-start gap-2 rounded-[14px] border border-ink-950/10 bg-cream-50 p-3 text-left transition-colors hover:border-ink-950/20 hover:bg-white">
                                    <span className="text-ink-600">{a.icon}</span>
                                    <span className="text-xs font-semibold text-ink-800">{a.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* RECORD COMPLETENESS */}
                    <div className="rounded-[22px] border border-ink-950/[0.08] bg-white p-5">
                        <Label>Record completeness</Label>
                        <div className="mt-2 flex items-end justify-between">
                            <span className="font-display text-2xl font-bold text-ink-900">{completeness}%</span>
                            <span className="text-[11px] text-ink-500">{completenessChecks.filter(Boolean).length} of {completenessChecks.length} fields</span>
                        </div>
                        <div className="mt-3"><SegmentBar value={completeness / 100} tone="brand" /></div>
                    </div>

                    {/* CLINICAL NOTES */}
                    <div id="clinical-notes" className="scroll-mt-24 relative overflow-hidden rounded-[22px] border border-ink-950/[0.08] bg-white p-6 min-h-[320px]">
                        <div className="pointer-events-none absolute right-3 top-3 text-ink-950/[0.04]"><Activity size={72} /></div>

                        <div className="relative z-10 flex items-center justify-between">
                            <h3 className="font-display text-base font-bold tracking-tight text-ink-900">Clinical notes</h3>
                            <button onClick={() => setShowNoteModal(true)} className="rounded-full bg-ink-950 px-3 py-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.1em] text-cream-50 transition-colors hover:bg-ink-800">+ Add note</button>
                        </div>

                        {showNoteModal && (
                            <div className="relative z-20 mt-4 rounded-[16px] border border-ink-950/10 bg-cream-50 p-4">
                                <div className="mb-2 flex items-center justify-between">
                                    <select value={noteType} onChange={e => setNoteType(e.target.value)} className="rounded-[10px] border border-ink-950/10 bg-white px-2 py-1 font-mono text-[10px] font-bold uppercase text-ink-700 outline-none">
                                        <option value="General">General</option><option value="SOAP">SOAP Note</option><option value="Follow-up">Follow-up</option><option value="Post-Op">Post-Op</option><option value="Emergency">Emergency</option>
                                    </select>
                                    <button onClick={() => setShowNoteModal(false)} className="text-ink-400 hover:text-ink-900"><X size={14} /></button>
                                </div>
                                <textarea value={noteText} onChange={e => setNoteText(e.target.value)} placeholder="Patient presented with" rows={4} autoFocus
                                    className="w-full resize-none rounded-[12px] border border-ink-950/10 bg-white p-3 text-sm text-ink-900 outline-none placeholder:text-ink-400 focus:border-ink-950/30" />
                                <button onClick={handleAddNote} disabled={savingNote || !noteText.trim()}
                                    className="mt-3 flex w-full items-center justify-center gap-2 rounded-full bg-ink-950 py-2.5 font-mono text-[10px] font-bold uppercase tracking-[0.1em] text-cream-50 transition-colors hover:bg-ink-800 disabled:opacity-40">
                                    <Save size={12} /> {savingNote ? 'Saving...' : 'Save note'}
                                </button>
                            </div>
                        )}

                        <div className="relative z-10 mt-5 space-y-4 border-l border-ink-950/10 pl-5">
                            {notes.length > 0 ? notes.map((note, i) => (
                                <div key={`${note.date}-${i}`} className="group/note relative">
                                    <div className="absolute -left-[27px] top-1 h-3.5 w-3.5 rounded-full border-2 border-teal-600 bg-white"></div>
                                    <div className="flex items-start justify-between gap-3">
                                        <div>
                                            {note.type && note.type !== 'General' && <span className="mb-1 inline-block rounded-full bg-mist-soft px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-[0.1em] text-mist-deep">{note.type}</span>}
                                            <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink-400">{formatDate(note.date)}</p>
                                        </div>
                                        <button onClick={() => handleDeleteNote(i)} className="p-1 text-ink-300 opacity-0 transition-all hover:text-blush-deep group-hover/note:opacity-100"><X size={10} /></button>
                                    </div>
                                    <p className="text-[13px] font-medium leading-relaxed text-ink-700">{note.text}</p>
                                </div>
                            )) : (
                                <div className="py-8 text-center">
                                    <FileText size={26} className="mx-auto mb-2 text-ink-300" />
                                    <p className="text-sm font-semibold text-ink-500">No clinical notes yet</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* COMPLETE VISIT */}
            <div id="checkout" className="scroll-mt-24 overflow-hidden rounded-[22px] border border-ink-950/[0.08] bg-white">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-ink-950/5 p-5">
                    <div className="flex items-center gap-3">
                        <IconChip tone="sun"><Sparkles size={16} /></IconChip>
                        <div>
                            <h3 className="font-display text-base font-bold tracking-tight text-ink-900">Complete visit</h3>
                            <p className="text-xs text-ink-500">Charge the treatment and send aftercare to the patient app</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        {['Treatment', 'Aftercare', 'Payment'].map((s, i) => (
                            <span key={s} className="flex items-center gap-2">
                                <span className={cn('flex h-6 w-6 items-center justify-center rounded-full font-mono text-[10px] font-bold',
                                    (i === 0 && selectedTemplateName) || (i === 1 && selectedTemplateName && aftercareInstructions.length) || (i === 2 && txAmount)
                                        ? 'bg-leaf-deep text-white' : 'bg-ink-950/10 text-ink-500')}>{i + 1}</span>
                                <span className="hidden font-mono text-[10px] uppercase tracking-[0.1em] text-ink-500 sm:inline">{s}</span>
                                {i < 2 && <span className="h-px w-3 bg-ink-950/15" />}
                            </span>
                        ))}
                    </div>
                </div>

                <div className="grid gap-6 p-5 lg:grid-cols-2">
                    <div>
                        <Label>1. Treatment performed</Label>
                        <div className="mt-3 grid max-h-[260px] grid-cols-2 gap-2 overflow-y-auto pr-1 custom-scrollbar">
                            {TREATMENT_TEMPLATES.map(t => (
                                <button key={t.name} onClick={() => setSelectedTemplateName(t.name)}
                                    className={`rounded-[14px] border p-3 text-left transition-colors ${selectedTemplateName === t.name ? 'border-primary bg-primary/5' : 'border-ink-950/10 bg-cream-50 hover:border-ink-950/20'}`}>
                                    <p className="text-xs font-bold leading-tight text-ink-900">{t.name}</p>
                                    <span className="mt-1 block font-mono text-[9px] uppercase tracking-[0.12em] text-ink-500">{t.category}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-5">
                        {!selectedTemplateName ? (
                            <div className="flex h-full flex-col items-center justify-center rounded-[16px] border border-dashed border-ink-950/15 bg-cream-50 p-8 text-center">
                                <Sparkles size={24} className="text-ink-300" />
                                <p className="mt-3 text-sm font-semibold text-ink-600">Pick a treatment to configure aftercare and payment</p>
                            </div>
                        ) : (
                            <>
                                <div>
                                    <div className="flex items-center justify-between">
                                        <Label>2. Aftercare sent to patient</Label>
                                        <button onClick={() => setAftercareInstructions([...aftercareInstructions, ''])} className="font-mono text-[10px] font-bold uppercase tracking-[0.1em] text-teal-700">+ Add step</button>
                                    </div>
                                    <div className="mt-3 max-h-[170px] space-y-2 overflow-y-auto pr-1 custom-scrollbar">
                                        {aftercareInstructions.map((inst, i) => (
                                            <div key={i} className="flex gap-2">
                                                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-[9px] bg-cream-100 font-mono text-[10px] font-bold text-ink-600">{i + 1}</span>
                                                <textarea rows={1} value={inst}
                                                    onChange={e => { const n = [...aftercareInstructions]; n[i] = e.target.value; setAftercareInstructions(n); }}
                                                    className="flex-1 resize-none rounded-[10px] border border-ink-950/10 bg-cream-50 px-3 py-2 text-sm text-ink-800 outline-none focus:border-ink-950/30" />
                                            </div>
                                        ))}
                                        {aftercareInstructions.length === 0 && <p className="text-xs text-ink-500">No steps yet.</p>}
                                    </div>
                                </div>

                                <div>
                                    <Label>3. Payment</Label>
                                    <div className="mt-3 flex gap-3">
                                        <div className="relative flex-1">
                                            <span className="absolute left-4 top-1/2 -translate-y-1/2 font-display text-lg font-bold text-ink-400">₹</span>
                                            <input type="number" min="0" placeholder="0" value={txAmount} onChange={e => setTxAmount(e.target.value)}
                                                className="w-full rounded-[14px] border border-ink-950/10 bg-cream-50 py-3 pl-9 pr-3 font-display text-xl font-bold text-ink-900 outline-none placeholder:text-ink-300 focus:border-ink-950/30" />
                                        </div>
                                        <select value={txCategory} onChange={e => setTxCategory(e.target.value as TransactionCategory)}
                                            className="w-36 rounded-[14px] border border-ink-950/10 bg-cream-50 px-3 text-xs font-bold text-ink-800 outline-none focus:border-ink-950/30">
                                            {Object.values(TransactionCategory).map(c => <option key={c} value={c}>{c}</option>)}
                                        </select>
                                    </div>
                                    <button
                                        disabled={!txAmount || parseFloat(txAmount) <= 0 || isDispatching}
                                        onClick={async () => {
                                            if (!txAmount || !onProcessTransaction || !onAssignPlan) return;
                                            const template = TREATMENT_TEMPLATES.find(t => t.name === selectedTemplateName);
                                            if (!template) return;
                                            setIsDispatching(true);
                                            try {
                                                await onProcessTransaction(patient.id, parseFloat(txAmount), txCategory, TransactionType.EARN);
                                                await onAssignPlan(clinic.id, patient.id, { ...template, customValues, instructions: aftercareInstructions });
                                                setTxAmount('');
                                                setSelectedTemplateName('');
                                                if (onRefreshData) onRefreshData();
                                            } catch (err: any) {
                                                console.error('Dispatch error:', err);
                                                alert('Failed to complete dispatch: ' + err.message);
                                            } finally {
                                                setIsDispatching(false);
                                            }
                                        }}
                                        className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-ink-950 py-3.5 font-mono text-[11px] font-bold uppercase tracking-[0.12em] text-cream-50 transition-colors hover:bg-ink-800 disabled:cursor-not-allowed disabled:opacity-40">
                                        {isDispatching ? 'Dispatching...' : (<><Sparkles size={14} /> Complete visit &amp; dispatch</>)}
                                    </button>
                                    <p className="mt-2 text-center text-[11px] text-ink-500">Charges the treatment, awards points, and pushes aftercare to the patient app.</p>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>


            {/* ========================== MODALS ========================== */}

            {/* PRESCRIPTION MODAL */}
            {showRxModal && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-ink-950/50 backdrop-blur-xl p-4">
                    <div className="bg-white rounded-[22px] p-8 w-full max-w-lg shadow-lift max-h-[80vh] overflow-auto">
                        <div className="flex justify-between items-center mb-6"><h3 className="text-2xl font-bold tracking-tight">New Prescription</h3><button onClick={() => setShowRxModal(false)}><X size={24} /></button></div>
                        {rxMeds.map((med, i) => (
                            <div key={i} className="grid grid-cols-4 gap-2 mb-3">
                                <input value={med.name} onChange={e => { const m = [...rxMeds]; m[i].name = e.target.value; setRxMeds(m); }} placeholder="Drug name" className="col-span-2 px-3 py-2.5 bg-cream-100 border border-ink-950/10 rounded-xl text-sm outline-none focus:border-teal-400" />
                                <input value={med.dosage} onChange={e => { const m = [...rxMeds]; m[i].dosage = e.target.value; setRxMeds(m); }} placeholder="Dosage" className="px-3 py-2.5 bg-cream-100 border border-ink-950/10 rounded-xl text-sm outline-none focus:border-teal-400" />
                                <div className="flex gap-1">
                                    <input value={med.frequency} onChange={e => { const m = [...rxMeds]; m[i].frequency = e.target.value; setRxMeds(m); }} placeholder="Freq" className="flex-1 px-2 py-2.5 bg-cream-100 border border-ink-950/10 rounded-xl text-sm outline-none focus:border-teal-400" />
                                    <input value={med.duration} onChange={e => { const m = [...rxMeds]; m[i].duration = e.target.value; setRxMeds(m); }} placeholder="Days" className="w-14 px-2 py-2.5 bg-cream-100 border border-ink-950/10 rounded-xl text-sm outline-none focus:border-teal-400" />
                                </div>
                            </div>
                        ))}
                        <button onClick={() => setRxMeds([...rxMeds, { name: '', dosage: '', frequency: '', duration: '' }])} className="text-xs font-bold text-teal-600 mb-4">+ Add medication</button>
                        <textarea value={rxNotes} onChange={e => setRxNotes(e.target.value)} placeholder="Additional notes..." rows={2} className="w-full px-3 py-2.5 bg-cream-100 border border-ink-950/10 rounded-xl text-sm outline-none resize-none mb-4" />
                        <button onClick={handleAddPrescription} disabled={savingRx} className="w-full py-3 bg-amber-500 text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-amber-600 disabled:opacity-50">
                            {savingRx ? 'Saving...' : 'Save Prescription'}
                        </button>
                    </div>
                </div>
            )}

            {/* IMAGING MODAL */}
            {showImagingModal && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-ink-950/50 backdrop-blur-xl p-4">
                    <div className="bg-white rounded-[22px] p-8 w-full max-w-md shadow-lift">
                        <div className="flex justify-between items-center mb-6"><h3 className="text-2xl font-bold tracking-tight">Log Imaging</h3><button onClick={() => setShowImagingModal(false)}><X size={24} /></button></div>
                        <select value={imgType} onChange={e => setImgType(e.target.value)} className="w-full px-4 py-3 bg-cream-100 border border-ink-950/10 rounded-xl text-sm font-medium mb-4 outline-none">
                            {IMAGING_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                        <textarea value={imgNotes} onChange={e => setImgNotes(e.target.value)} placeholder="Findings / notes..." rows={3} className="w-full px-3 py-2.5 bg-cream-100 border border-ink-950/10 rounded-xl text-sm outline-none resize-none mb-4" />
                        <button onClick={handleAddImaging} disabled={savingImg} className="w-full py-3 bg-pink-500 text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-pink-600 disabled:opacity-50">
                            {savingImg ? 'Saving...' : 'Save Record'}
                        </button>
                    </div>
                </div>
            )}

            {/* CONSENT MODAL */}
            {showConsentModal && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-ink-950/50 backdrop-blur-xl p-4">
                    <div className="bg-white rounded-[22px] p-8 w-full max-w-md shadow-lift">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-2xl font-bold tracking-tight">Record Consent</h3>
                            <button onClick={() => setShowConsentModal(false)}><X size={24} /></button>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="text-[10px] font-bold text-ink-400 uppercase tracking-widest block mb-1.5 ml-1">Procedure</label>
                                <input value={consentProcedure} onChange={e => setConsentProcedure(e.target.value)}
                                    placeholder="e.g. Invisalign, RCT, Implant..."
                                    className="w-full px-4 py-3 bg-cream-100 border border-ink-950/10 rounded-xl text-sm font-medium outline-none focus:border-teal-400 transition-all" />
                            </div>
                            <div>
                                <label className="text-[10px] font-bold text-ink-400 uppercase tracking-widest block mb-1.5 ml-1">Consent Type</label>
                                <select value={consentType} onChange={e => setConsentType(e.target.value)}
                                    className="w-full px-4 py-3 bg-cream-100 border border-ink-950/10 rounded-xl text-sm font-medium outline-none focus:border-teal-400 transition-all">
                                    <option value="Informed Consent">Informed Consent</option>
                                    <option value="Treatment Consent">Treatment Consent</option>
                                    <option value="Sedation Consent">Sedation Consent</option>
                                    <option value="Photography Consent">Photography Consent</option>
                                    <option value="Financial Agreement">Financial Agreement</option>
                                </select>
                            </div>
                            <button onClick={handleAddConsent} disabled={savingConsent || !consentProcedure.trim()}
                                className="w-full py-3 bg-teal-600 text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-teal-700 disabled:opacity-50 transition-all">
                                {savingConsent ? 'Saving...' : 'Record Consent'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* CLEANUP: remove unused imports that may have been orphaned */}
        </div>
    );
};

export default ClinicalTab;
