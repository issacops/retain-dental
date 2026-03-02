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

// Standard FDI dental notation
const UPPER_TEETH = [18, 17, 16, 15, 14, 13, 12, 11, 21, 22, 23, 24, 25, 26, 27, 28];
const LOWER_TEETH = [48, 47, 46, 45, 44, 43, 42, 41, 31, 32, 33, 34, 35, 36, 37, 38];

const TOOTH_CONDITIONS: Record<string, { label: string; color: string }> = {
    healthy: { label: 'Healthy', color: '#10b981' },
    cavity: { label: 'Cavity', color: '#ef4444' },
    filling: { label: 'Filling', color: '#6366f1' },
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
const Section: React.FC<{ title: string; icon: React.ReactNode; children: React.ReactNode; defaultOpen?: boolean; accentColor?: string; badge?: string }> = ({ title, icon, children, defaultOpen = false, accentColor = '#6366f1', badge }) => {
    const [open, setOpen] = useState(defaultOpen);
    return (
        <div className="rounded-[32px] border border-slate-100 bg-white shadow-lg shadow-slate-100/50 overflow-hidden transition-all duration-300">
            <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between p-6 hover:bg-slate-50/50 transition-colors cursor-pointer">
                <div className="flex items-center gap-4">
                    <div className="p-2.5 rounded-xl" style={{ backgroundColor: accentColor + '15', color: accentColor }}>{icon}</div>
                    <h3 className="font-black text-lg tracking-tight text-slate-800">{title}</h3>
                    {badge && <span className="text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100">{badge}</span>}
                </div>
                {open ? <ChevronUp size={18} className="text-slate-400" /> : <ChevronDown size={18} className="text-slate-400" />}
            </button>
            {open && <div className="px-6 pb-6 animate-in fade-in slide-in-from-top-2 duration-200">{children}</div>}
        </div>
    );
};

/** Styled input field */
const Field: React.FC<{ label: string; value?: string; onChange: (v: string) => void; type?: string; placeholder?: string; half?: boolean }> = ({ label, value, onChange, type = 'text', placeholder, half }) => (
    <div className={half ? 'flex-1 min-w-[140px]' : 'w-full'}>
        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1.5 ml-1">{label}</label>
        <input type={type} value={value || ''} onChange={e => onChange(e.target.value)} placeholder={placeholder || label}
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 outline-none focus:border-indigo-400 focus:bg-white focus:ring-1 focus:ring-indigo-100 transition-all" />
    </div>
);

/** Tag/chip list with add/remove */
const TagList: React.FC<{ items: string[]; onUpdate: (items: string[]) => void; suggestions?: string[]; color?: string; label: string }> = ({ items, onUpdate, suggestions, color = '#6366f1', label }) => {
    const [input, setInput] = useState('');
    const [showSuggestions, setShowSuggestions] = useState(false);
    const add = (val: string) => { if (val.trim() && !items.includes(val.trim())) onUpdate([...items, val.trim()]); setInput(''); setShowSuggestions(false); };
    const remove = (idx: number) => onUpdate(items.filter((_, i) => i !== idx));
    const filtered = suggestions?.filter(s => !items.includes(s) && s.toLowerCase().includes(input.toLowerCase()));

    return (
        <div>
            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-2 ml-1">{label}</label>
            <div className="flex flex-wrap gap-1.5 mb-2">
                {items.map((item, i) => (
                    <span key={i} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold border" style={{ borderColor: color + '40', backgroundColor: color + '10', color }}>
                        {item}
                        <button onClick={() => remove(i)} className="hover:opacity-70"><X size={10} /></button>
                    </span>
                ))}
            </div>
            <div className="relative">
                <input value={input} onChange={e => { setInput(e.target.value); setShowSuggestions(true); }} onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); add(input); } }}
                    onFocus={() => setShowSuggestions(true)} onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                    placeholder={`Add ${label.toLowerCase()}...`}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-indigo-400 transition-all" />
                {showSuggestions && filtered && filtered.length > 0 && (
                    <div className="absolute z-30 mt-1 w-full bg-white border border-slate-200 rounded-xl shadow-xl max-h-40 overflow-auto">
                        {filtered.map(s => (
                            <button key={s} onMouseDown={e => { e.preventDefault(); add(s); }} className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-indigo-50 transition-colors">{s}</button>
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

    // UI state
    const [showNoteModal, setShowNoteModal] = useState(false);
    const [noteText, setNoteText] = useState('');
    const [noteType, setNoteType] = useState('General');
    const [savingNote, setSavingNote] = useState(false);
    const [noteSaved, setNoteSaved] = useState(false);
    const [selectedCondition, setSelectedCondition] = useState('cavity');
    const [savingChart, setSavingChart] = useState(false);
    const [chartSaved, setChartSaved] = useState(false);
    const [chartDirty, setChartDirty] = useState(false);
    const [savingEMR, setSavingEMR] = useState(false);
    const [emrSaved, setEmrSaved] = useState(false);
    const [emrDirty, setEmrDirty] = useState(false);

    // Prescription modal
    const [showRxModal, setShowRxModal] = useState(false);
    const [rxMeds, setRxMeds] = useState<{ name: string; dosage: string; frequency: string; duration: string }[]>([{ name: '', dosage: '', frequency: '', duration: '' }]);
    const [rxNotes, setRxNotes] = useState('');

    // Imaging modal
    const [showImagingModal, setShowImagingModal] = useState(false);
    const [imgType, setImgType] = useState('OPG/Panoramic');
    const [imgNotes, setImgNotes] = useState('');

    // Sync on patient change
    useEffect(() => {
        setEmr({ ...DEFAULT_EMR, ...(patient.metadata?.emr || {}) });
        setNotes(patient.metadata?.clinicalNotes || []);
        setDentalChart(patient.metadata?.dentalChart || {});
        setEmrDirty(false);
    }, [patient.id]);

    // EMR field updater
    const updateEMR = useCallback(<K extends keyof EMRData>(section: K, data: Partial<EMRData[K]>) => {
        setEmr(prev => ({ ...prev, [section]: { ...(prev[section] as any), ...data } }));
        setEmrDirty(true);
    }, []);

    // Save EMR
    const handleSaveEMR = async () => {
        setSavingEMR(true);
        const result = await backendService.updatePatientMetadata(patient.id, { emr, medicalAlerts: emr.medicalHistory.allergies });
        if (result.success) { setEmrDirty(false); setEmrSaved(true); setTimeout(() => setEmrSaved(false), 3000); onRefreshData?.(); }
        setSavingEMR(false);
    };

    // Save Note
    const handleAddNote = async () => {
        if (!noteText.trim()) return;
        setSavingNote(true);
        const newNote: ClinicalNote = { text: noteText.trim(), date: new Date().toISOString(), type: noteType };
        const updated = [newNote, ...notes];
        setNotes(updated);
        setNoteText(''); setShowNoteModal(false);
        const result = await backendService.updatePatientMetadata(patient.id, { clinicalNotes: updated });
        if (result.success) { setNoteSaved(true); setTimeout(() => setNoteSaved(false), 3000); onRefreshData?.(); }
        else { setNotes(notes); }
        setSavingNote(false);
    };

    // Save dental chart
    const handleSaveChart = async () => {
        setSavingChart(true);
        const result = await backendService.updatePatientMetadata(patient.id, { dentalChart });
        if (result.success) { setChartDirty(false); setChartSaved(true); setTimeout(() => setChartSaved(false), 3000); onRefreshData?.(); }
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
        const rx: EMRPrescription = { id: crypto.randomUUID(), date: new Date().toISOString(), medications: validMeds, notes: rxNotes };
        const updated = { ...emr, prescriptions: [rx, ...emr.prescriptions] };
        setEmr(updated);
        setShowRxModal(false); setRxMeds([{ name: '', dosage: '', frequency: '', duration: '' }]); setRxNotes('');
        await backendService.updatePatientMetadata(patient.id, { emr: updated });
        onRefreshData?.();
    };

    // Add imaging record
    const handleAddImaging = async () => {
        const img: EMRImaging = { id: crypto.randomUUID(), type: imgType, date: new Date().toISOString(), notes: imgNotes };
        const updated = { ...emr, imaging: [img, ...emr.imaging] };
        setEmr(updated);
        setShowImagingModal(false); setImgNotes('');
        await backendService.updatePatientMetadata(patient.id, { emr: updated });
        onRefreshData?.();
    };

    // Add consent
    const handleAddConsent = async (procedure: string, type: string) => {
        const consent: EMRConsent = { id: crypto.randomUUID(), type, signedAt: new Date().toISOString(), procedure };
        const updated = { ...emr, consents: [consent, ...emr.consents] };
        setEmr(updated);
        await backendService.updatePatientMetadata(patient.id, { emr: updated });
        onRefreshData?.();
    };

    // Delete note
    const handleDeleteNote = async (i: number) => {
        const updated = notes.filter((_, idx) => idx !== i);
        setNotes(updated);
        await backendService.updatePatientMetadata(patient.id, { clinicalNotes: updated });
        onRefreshData?.();
    };

    const formatDate = (iso: string) => { try { return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }); } catch { return iso; } };

    const renderTooth = (num: number) => {
        const cond = dentalChart[num]; const ci = cond ? TOOTH_CONDITIONS[cond] : null;
        return (
            <div key={num} onClick={() => handleToothClick(num)} className="flex flex-col items-center cursor-pointer group" title={ci ? `${num}: ${ci.label}` : `Tooth ${num}`}>
                <div className={`w-7 h-9 rounded-lg border-2 flex items-center justify-center text-[8px] font-black transition-all duration-200 hover:scale-110 ${cond ? 'shadow-md scale-105' : 'border-slate-200 bg-white text-slate-400 hover:border-slate-400'}`}
                    style={cond ? { borderColor: ci!.color, backgroundColor: ci!.color + '20', color: ci!.color } : {}}>{cond === 'missing' ? '✕' : num}</div>
                {cond && <div className="text-[6px] font-bold mt-0.5 uppercase" style={{ color: ci!.color }}>{ci!.label}</div>}
            </div>
        );
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">

            {/* GLOBAL SAVE BAR */}
            {(emrDirty || chartDirty) && (
                <div className="sticky top-0 z-50 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-2xl p-4 flex justify-between items-center shadow-2xl shadow-indigo-500/30 animate-in slide-in-from-top-4 duration-300">
                    <p className="text-sm font-bold">Unsaved changes in patient record</p>
                    <div className="flex gap-3">
                        {chartDirty && <button onClick={handleSaveChart} disabled={savingChart} className="px-4 py-2 bg-white/20 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-white/30 transition-all">{savingChart ? 'Saving...' : 'Save Chart'}</button>}
                        {emrDirty && <button onClick={handleSaveEMR} disabled={savingEMR} className="px-4 py-2 bg-white text-indigo-700 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-indigo-50 transition-all">{savingEMR ? 'Saving...' : 'Save EMR'}</button>}
                    </div>
                </div>
            )}
            {(emrSaved || chartSaved || noteSaved) && (
                <div className="flex items-center gap-2 text-emerald-600 text-xs font-black uppercase tracking-widest animate-in fade-in duration-300">
                    <CheckCircle2 size={16} /> {emrSaved ? 'EMR Saved' : chartSaved ? 'Chart Saved' : 'Note Saved'}
                </div>
            )}

            {/* MEDICAL ALERTS BANNER */}
            {medicalAlerts.length > 0 && (
                <div className="bg-rose-50 border border-rose-100 rounded-[28px] p-5 flex flex-wrap items-center gap-4">
                    <div className="h-9 w-9 bg-rose-100 text-rose-500 rounded-full flex items-center justify-center shrink-0"><ShieldAlert size={18} /></div>
                    <div>
                        <p className="text-[9px] font-black uppercase tracking-widest text-rose-400">Medical Alerts & Allergies</p>
                        <div className="flex flex-wrap gap-1.5 mt-1.5">{medicalAlerts.map((a: string, i: number) => <span key={i} className="px-2.5 py-0.5 bg-white text-rose-600 border border-rose-200 rounded-md text-[10px] font-bold">{a}</span>)}</div>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-12 gap-6">

                {/* ========================== LEFT COLUMN ========================== */}
                <div className="col-span-12 xl:col-span-8 space-y-6">

                    {/* 1. DEMOGRAPHICS */}
                    <Section title="Patient Demographics" icon={<UserIcon size={20} />} defaultOpen={true} accentColor="#6366f1" badge={emr.demographics.dateOfBirth ? 'Complete' : undefined}>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            <Field label="Date of Birth" value={emr.demographics.dateOfBirth} onChange={v => updateEMR('demographics', { dateOfBirth: v })} type="date" />
                            <Field label="Age" value={emr.demographics.age} onChange={v => updateEMR('demographics', { age: v })} placeholder="e.g. 32" half />
                            <div className="flex-1 min-w-[140px]">
                                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1.5 ml-1">Gender</label>
                                <select value={emr.demographics.gender || ''} onChange={e => updateEMR('demographics', { gender: e.target.value })}
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium outline-none focus:border-indigo-400 transition-all">
                                    <option value="">Select</option><option value="Male">Male</option><option value="Female">Female</option><option value="Other">Other</option>
                                </select>
                            </div>
                            <div className="flex-1 min-w-[140px]">
                                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1.5 ml-1">Blood Group</label>
                                <select value={emr.demographics.bloodGroup || ''} onChange={e => updateEMR('demographics', { bloodGroup: e.target.value })}
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium outline-none focus:border-indigo-400 transition-all">
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
                    <Section title="Medical History" icon={<Heart size={20} />} accentColor="#ef4444">
                        <div className="space-y-5">
                            <TagList label="Medical Conditions" items={emr.medicalHistory.conditions} onUpdate={items => updateEMR('medicalHistory', { conditions: items })} suggestions={COMMON_CONDITIONS} color="#ef4444" />
                            <TagList label="Drug Allergies" items={emr.medicalHistory.allergies} onUpdate={items => updateEMR('medicalHistory', { allergies: items })} suggestions={COMMON_ALLERGIES} color="#f59e0b" />
                            <TagList label="Current Medications" items={emr.medicalHistory.medications} onUpdate={items => updateEMR('medicalHistory', { medications: items })} color="#6366f1" />
                            <TagList label="Past Surgeries" items={emr.medicalHistory.surgeries} onUpdate={items => updateEMR('medicalHistory', { surgeries: items })} color="#8b5cf6" />
                            <TagList label="Family History" items={emr.medicalHistory.familyHistory} onUpdate={items => updateEMR('medicalHistory', { familyHistory: items })} color="#06b6d4" />
                            <TagList label="Habits (Smoking, Tobacco, Alcohol)" items={emr.medicalHistory.habits} onUpdate={items => updateEMR('medicalHistory', { habits: items })} suggestions={['Smoking', 'Tobacco Chewing', 'Alcohol', 'Betel Nut', 'Bruxism']} color="#f97316" />
                            <div className="flex gap-6 mt-2">
                                <label className="flex items-center gap-2 text-sm font-bold text-slate-600 cursor-pointer">
                                    <input type="checkbox" checked={emr.medicalHistory.pregnant || false} onChange={e => updateEMR('medicalHistory', { pregnant: e.target.checked })} className="w-4 h-4 accent-rose-500 rounded" /> Pregnant
                                </label>
                                <label className="flex items-center gap-2 text-sm font-bold text-slate-600 cursor-pointer">
                                    <input type="checkbox" checked={emr.medicalHistory.lactating || false} onChange={e => updateEMR('medicalHistory', { lactating: e.target.checked })} className="w-4 h-4 accent-rose-500 rounded" /> Lactating
                                </label>
                            </div>
                        </div>
                    </Section>

                    {/* 3. VITALS */}
                    <Section title="Vitals" icon={<Thermometer size={20} />} accentColor="#10b981">
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            <Field label="Blood Pressure (mmHg)" value={emr.vitals.bloodPressure} onChange={v => updateEMR('vitals', { bloodPressure: v })} placeholder="120/80" />
                            <Field label="Pulse Rate (bpm)" value={emr.vitals.pulseRate} onChange={v => updateEMR('vitals', { pulseRate: v })} />
                            <Field label="Temperature (°F)" value={emr.vitals.temperature} onChange={v => updateEMR('vitals', { temperature: v })} />
                            <Field label="SpO2 (%)" value={emr.vitals.spO2} onChange={v => updateEMR('vitals', { spO2: v })} />
                            <Field label="Weight (kg)" value={emr.vitals.weight} onChange={v => updateEMR('vitals', { weight: v })} />
                            <Field label="Height (cm)" value={emr.vitals.height} onChange={v => updateEMR('vitals', { height: v })} />
                        </div>
                    </Section>

                    {/* 4. CLINICAL EXAMINATION */}
                    <Section title="Clinical Examination" icon={<Stethoscope size={20} />} accentColor="#8b5cf6">
                        <div className="space-y-4">
                            <div>
                                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1.5 ml-1">Chief Complaint</label>
                                <textarea value={emr.examination.chiefComplaint || ''} onChange={e => updateEMR('examination', { chiefComplaint: e.target.value })} rows={2} placeholder="Patient's primary concern..."
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-indigo-400 transition-all resize-none" />
                            </div>
                            <div>
                                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1.5 ml-1">History of Present Illness</label>
                                <textarea value={emr.examination.historyOfPresentIllness || ''} onChange={e => updateEMR('examination', { historyOfPresentIllness: e.target.value })} rows={3} placeholder="Detailed history..."
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-indigo-400 transition-all resize-none" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1.5 ml-1">Extra-Oral Findings</label>
                                    <textarea value={emr.examination.extraOralFindings || ''} onChange={e => updateEMR('examination', { extraOralFindings: e.target.value })} rows={2} placeholder="Facial symmetry, lymph nodes..."
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-indigo-400 transition-all resize-none" />
                                </div>
                                <div>
                                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1.5 ml-1">Intra-Oral Findings</label>
                                    <textarea value={emr.examination.intraOralFindings || ''} onChange={e => updateEMR('examination', { intraOralFindings: e.target.value })} rows={2} placeholder="Tissue condition, lesions..."
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-indigo-400 transition-all resize-none" />
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
                                    className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all border-2 ${selectedCondition === key ? 'scale-105 shadow-md' : 'opacity-50 hover:opacity-100'}`}
                                    style={{ borderColor: color, backgroundColor: selectedCondition === key ? color + '20' : 'transparent', color }}>{label}</button>
                            ))}
                        </div>
                        <div className="mb-2"><p className="text-[7px] font-black text-slate-400 uppercase tracking-widest mb-1.5 text-center">Upper Jaw</p>
                            <div className="flex justify-center gap-1 flex-wrap">{UPPER_TEETH.map(t => renderTooth(t))}</div></div>
                        <div className="h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent my-3" />
                        <div><div className="flex justify-center gap-1 flex-wrap">{LOWER_TEETH.map(t => renderTooth(t))}</div>
                            <p className="text-[7px] font-black text-slate-400 uppercase tracking-widest mt-1.5 text-center">Lower Jaw</p></div>
                        <div className="mt-4 flex flex-wrap gap-2">
                            {Object.entries(TOOTH_CONDITIONS).map(([k, { label, color }]) => {
                                const c = Object.values(dentalChart).filter(v => v === k).length;
                                return c > 0 ? <div key={k} className="flex items-center gap-1 text-[9px] font-bold" style={{ color }}><div className="w-2 h-2 rounded-sm" style={{ backgroundColor: color }} />{label}: {c}</div> : null;
                            })}
                        </div>
                    </Section>

                    {/* 6. PRESCRIPTIONS */}
                    <Section title="Prescriptions" icon={<Pill size={20} />} accentColor="#f59e0b" badge={emr.prescriptions.length > 0 ? `${emr.prescriptions.length} records` : undefined}>
                        <button onClick={() => setShowRxModal(true)} className="mb-4 flex items-center gap-2 px-4 py-2.5 bg-amber-50 border border-amber-200 text-amber-700 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-amber-100 transition-all">
                            <Plus size={14} /> New Prescription
                        </button>
                        {emr.prescriptions.length === 0 ? <p className="text-sm text-slate-400 italic">No prescriptions recorded</p> : (
                            <div className="space-y-3">{emr.prescriptions.map(rx => (
                                <div key={rx.id} className="p-4 bg-amber-50/50 rounded-2xl border border-amber-100">
                                    <p className="text-[9px] font-black text-amber-500 uppercase tracking-widest mb-2">{formatDate(rx.date)}</p>
                                    <div className="space-y-1">{rx.medications.map((m, i) => (
                                        <p key={i} className="text-sm font-medium text-slate-700"><strong>{m.name}</strong> — {m.dosage} · {m.frequency} · {m.duration}</p>
                                    ))}</div>
                                    {rx.notes && <p className="text-xs text-slate-500 mt-2 italic">{rx.notes}</p>}
                                </div>
                            ))}</div>
                        )}
                    </Section>

                    {/* 7. IMAGING */}
                    <Section title="Imaging & Radiographs" icon={<FileImage size={20} />} accentColor="#ec4899" badge={emr.imaging.length > 0 ? `${emr.imaging.length} records` : undefined}>
                        <button onClick={() => setShowImagingModal(true)} className="mb-4 flex items-center gap-2 px-4 py-2.5 bg-pink-50 border border-pink-200 text-pink-700 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-pink-100 transition-all">
                            <Plus size={14} /> Log Imaging
                        </button>
                        {emr.imaging.length === 0 ? <p className="text-sm text-slate-400 italic">No imaging records</p> : (
                            <div className="space-y-2">{emr.imaging.map(img => (
                                <div key={img.id} className="flex items-center gap-3 p-3 bg-pink-50/50 rounded-xl border border-pink-100">
                                    <FileImage size={16} className="text-pink-400 shrink-0" />
                                    <div className="flex-1"><p className="text-sm font-bold text-slate-700">{img.type}</p><p className="text-[10px] text-slate-400">{formatDate(img.date)}</p></div>
                                    {img.notes && <p className="text-xs text-slate-500 italic">{img.notes}</p>}
                                </div>
                            ))}</div>
                        )}
                    </Section>

                    {/* 8. CONSENT */}
                    <Section title="Consent Records" icon={<FileSignature size={20} />} accentColor="#14b8a6" badge={emr.consents.length > 0 ? `${emr.consents.length} signed` : undefined}>
                        <div className="flex gap-2 mb-4">
                            <button onClick={() => { const proc = prompt('Procedure name for consent:'); if (proc) handleAddConsent(proc, 'Informed Consent'); }}
                                className="flex items-center gap-2 px-4 py-2.5 bg-teal-50 border border-teal-200 text-teal-700 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-teal-100 transition-all">
                                <Plus size={14} /> Record Consent
                            </button>
                        </div>
                        {emr.consents.length === 0 ? <p className="text-sm text-slate-400 italic">No consent records</p> : (
                            <div className="space-y-2">{emr.consents.map(c => (
                                <div key={c.id} className="flex items-center gap-3 p-3 bg-teal-50/50 rounded-xl border border-teal-100">
                                    <FileSignature size={16} className="text-teal-400 shrink-0" />
                                    <div><p className="text-sm font-bold text-slate-700">{c.procedure} — {c.type}</p><p className="text-[10px] text-slate-400">Signed {formatDate(c.signedAt)}</p></div>
                                </div>
                            ))}</div>
                        )}
                    </Section>

                    {/* 9. ACTIVE PATHWAY */}
                    <Section title="Active Treatment Pathway" icon={<ClipboardCheck size={20} />} accentColor="#10b981" badge={activeCarePlan ? 'LIVE' : undefined}>
                        {activeCarePlan ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="p-6 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-[24px] text-white">
                                    <p className="text-[9px] font-black uppercase text-emerald-100 tracking-widest mb-3">Current Regime</p>
                                    <h4 className="text-2xl font-black tracking-tighter mb-4">{activeCarePlan.treatmentName}</h4>
                                    <button onClick={() => onOpenConsole(activeCarePlan)} className="px-5 py-2 bg-white text-emerald-900 rounded-xl text-[9px] font-black uppercase tracking-widest">View Details</button>
                                    <div className="mt-6 pt-4 border-t border-white/10"><p className="text-3xl font-black">98<span className="text-sm opacity-60">%</span></p><p className="text-[8px] text-emerald-200 uppercase tracking-widest">Adherence</p></div>
                                </div>
                                <div className="space-y-2"><p className="text-[9px] font-black text-slate-400 border-b border-slate-100 pb-2 mb-3">DAILY CHECKLIST</p>
                                    {activeCarePlan.checklist?.map((item, i) => (
                                        <div key={item.id} onClick={() => onToggleChecklistItem(activeCarePlan.id, item.id)} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100 hover:shadow-md cursor-pointer transition-all">
                                            <div className={`h-6 w-6 rounded-lg flex items-center justify-center ${item.completed ? 'bg-emerald-500 text-white' : 'bg-white text-slate-300 border'}`}>
                                                {item.completed ? <Check size={12} strokeWidth={4} /> : <span className="text-[8px] font-black">{i + 1}</span>}</div>
                                            <span className={`text-xs font-bold ${item.completed ? 'text-slate-400 line-through' : 'text-slate-700'}`}>{item.task}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="py-10 text-center border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50">
                                <HeartPulse size={32} className="mx-auto text-slate-300 mb-3" /><p className="font-bold text-slate-400">No active treatments</p>
                            </div>
                        )}
                    </Section>
                </div>

                {/* ========================== RIGHT COLUMN ========================== */}
                <div className="col-span-12 xl:col-span-4 space-y-6">

                    {/* CLINICAL NOTES TIMELINE */}
                    <div className="bg-slate-900 rounded-[32px] p-6 text-white relative overflow-hidden shadow-2xl min-h-[400px]">
                        <div className="absolute top-0 right-0 p-6 opacity-5"><Activity size={80} /></div>
                        <div className="flex items-center justify-between mb-5 relative z-10">
                            <h3 className="font-black text-lg">Clinical Notes</h3>
                            <button onClick={() => setShowNoteModal(true)} className="text-[9px] uppercase font-bold text-emerald-400 tracking-widest bg-emerald-400/10 px-3 py-1.5 rounded-lg hover:bg-emerald-400/20 transition-colors cursor-pointer">+ Add Note</button>
                        </div>

                        {showNoteModal && (
                            <div className="relative z-20 mb-5 bg-slate-800 rounded-xl p-4 border border-slate-700 animate-in fade-in duration-200">
                                <div className="flex justify-between items-center mb-2">
                                    <select value={noteType} onChange={e => setNoteType(e.target.value)} className="bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-[10px] font-bold text-emerald-400 uppercase">
                                        <option value="General">General</option><option value="SOAP">SOAP Note</option><option value="Follow-up">Follow-up</option><option value="Post-Op">Post-Op</option><option value="Emergency">Emergency</option>
                                    </select>
                                    <button onClick={() => setShowNoteModal(false)} className="text-slate-500 hover:text-white"><X size={14} /></button>
                                </div>
                                <textarea value={noteText} onChange={e => setNoteText(e.target.value)} placeholder="Patient presented with..." rows={4} autoFocus
                                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-sm text-white placeholder-slate-600 focus:border-emerald-500 outline-none resize-none" />
                                <button onClick={handleAddNote} disabled={savingNote || !noteText.trim()}
                                    className="mt-2 w-full py-2.5 bg-emerald-500 text-white rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-emerald-600 disabled:opacity-40 flex items-center justify-center gap-2">
                                    <Save size={12} /> {savingNote ? 'Saving...' : 'Save Note'}
                                </button>
                            </div>
                        )}

                        <div className="space-y-4 relative z-10 border-l-2 border-slate-800 pl-5 ml-2 mt-4">
                            {notes.length > 0 ? notes.map((note, i) => (
                                <div key={`${note.date}-${i}`} className="relative group/note">
                                    <div className="absolute -left-[27px] top-1 h-3.5 w-3.5 rounded-full bg-slate-900 border-2 border-emerald-500"></div>
                                    <div className="flex justify-between items-start">
                                        <div>
                                            {note.type && note.type !== 'General' && <span className="text-[8px] font-black text-indigo-400 uppercase tracking-widest bg-indigo-400/10 px-2 py-0.5 rounded mb-1 inline-block">{note.type}</span>}
                                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">{formatDate(note.date)}</p>
                                        </div>
                                        <button onClick={() => handleDeleteNote(i)} className="opacity-0 group-hover/note:opacity-100 text-slate-600 hover:text-rose-400 p-1"><X size={10} /></button>
                                    </div>
                                    <p className="text-[13px] font-medium text-slate-200 leading-relaxed">{note.text}</p>
                                </div>
                            )) : (
                                <div className="py-8 text-center"><FileText size={28} className="mx-auto text-slate-700 mb-2" /><p className="text-slate-500 font-bold text-sm">No clinical notes</p></div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* ========================== MODALS ========================== */}

            {/* PRESCRIPTION MODAL */}
            {showRxModal && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/60 backdrop-blur-xl p-4">
                    <div className="bg-white rounded-[32px] p-8 w-full max-w-lg shadow-2xl max-h-[80vh] overflow-auto">
                        <div className="flex justify-between items-center mb-6"><h3 className="text-2xl font-black tracking-tight">New Prescription</h3><button onClick={() => setShowRxModal(false)}><X size={24} /></button></div>
                        {rxMeds.map((med, i) => (
                            <div key={i} className="grid grid-cols-4 gap-2 mb-3">
                                <input value={med.name} onChange={e => { const m = [...rxMeds]; m[i].name = e.target.value; setRxMeds(m); }} placeholder="Drug name" className="col-span-2 px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-indigo-400" />
                                <input value={med.dosage} onChange={e => { const m = [...rxMeds]; m[i].dosage = e.target.value; setRxMeds(m); }} placeholder="Dosage" className="px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-indigo-400" />
                                <div className="flex gap-1">
                                    <input value={med.frequency} onChange={e => { const m = [...rxMeds]; m[i].frequency = e.target.value; setRxMeds(m); }} placeholder="Freq" className="flex-1 px-2 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-indigo-400" />
                                    <input value={med.duration} onChange={e => { const m = [...rxMeds]; m[i].duration = e.target.value; setRxMeds(m); }} placeholder="Days" className="w-14 px-2 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-indigo-400" />
                                </div>
                            </div>
                        ))}
                        <button onClick={() => setRxMeds([...rxMeds, { name: '', dosage: '', frequency: '', duration: '' }])} className="text-xs font-bold text-indigo-600 mb-4">+ Add medication</button>
                        <textarea value={rxNotes} onChange={e => setRxNotes(e.target.value)} placeholder="Additional notes..." rows={2} className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none resize-none mb-4" />
                        <button onClick={handleAddPrescription} className="w-full py-3 bg-amber-500 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-amber-600">Save Prescription</button>
                    </div>
                </div>
            )}

            {/* IMAGING MODAL */}
            {showImagingModal && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/60 backdrop-blur-xl p-4">
                    <div className="bg-white rounded-[32px] p-8 w-full max-w-md shadow-2xl">
                        <div className="flex justify-between items-center mb-6"><h3 className="text-2xl font-black tracking-tight">Log Imaging</h3><button onClick={() => setShowImagingModal(false)}><X size={24} /></button></div>
                        <select value={imgType} onChange={e => setImgType(e.target.value)} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium mb-4 outline-none">
                            {IMAGING_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                        <textarea value={imgNotes} onChange={e => setImgNotes(e.target.value)} placeholder="Findings / notes..." rows={3} className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none resize-none mb-4" />
                        <button onClick={handleAddImaging} className="w-full py-3 bg-pink-500 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-pink-600">Save Record</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ClinicalTab;
