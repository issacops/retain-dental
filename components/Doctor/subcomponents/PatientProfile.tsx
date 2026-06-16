import React, { useMemo, useState } from 'react';
import { Shield, Sparkles, FolderLock, CreditCard, Activity, Calendar, AlertTriangle, ChevronDown, ChevronUp, User as UserIcon, Printer } from 'lucide-react';
import { User, Wallet, Transaction, CarePlan, Clinic, FamilyGroup, TransactionCategory, TransactionType } from '../../../types';
import { IBackendService } from '../../../services/IBackendService';
import DoctorTreatmentDetail from './DoctorTreatmentDetail';

// Unified Workspace Flow
import ClinicalTab from './profile_tabs/ClinicalTab';
// Treatment and Ledger will be absorbed into ClinicalTab/Workspace in the next steps.

interface Props {
    selectedPatient: User;
    clinic: Clinic;
    wallets: Wallet[];
    carePlans: CarePlan[];
    transactions: Transaction[];
    allUsers: User[];
    familyGroups: FamilyGroup[];
    backendService: IBackendService;
    onProcessTransaction: (patientId: string, amount: number, category: TransactionCategory, type: TransactionType, carePlanTemplate?: any) => any;
    onAssignPlan: (clinicId: string, patientId: string, template: any) => Promise<any>;
    onTerminateCarePlan: (carePlanId: string) => Promise<any>;
    onToggleChecklistItem: (carePlanId: string, itemId: string) => Promise<any>;
    onUpdateCarePlan: (carePlanId: string, updates: Partial<CarePlan>) => Promise<any>;
    onDeletePatient: (patientId: string) => Promise<any>;
    onRefreshData?: () => void;
}

type ViewSection = 'OVERVIEW'; // We'll expand this if we need jump links, but it's a single page now.

const PatientProfile: React.FC<Props> = ({
    selectedPatient, clinic, wallets, carePlans, transactions, allUsers, familyGroups,
    backendService, onProcessTransaction, onAssignPlan, onTerminateCarePlan, onToggleChecklistItem, onUpdateCarePlan, onDeletePatient, onRefreshData
}) => {
    const [viewingPlan, setViewingPlan] = useState<CarePlan | null>(null);
    const [showDemographics, setShowDemographics] = useState(false);

    // Computed data
    const activeCarePlan = useMemo(() => {
        return carePlans.find(cp => cp.userId === selectedPatient?.id && cp.isActive && cp.clinicId === clinic.id);
    }, [carePlans, selectedPatient, clinic.id]);

    const patientTransactions = useMemo(() => {
        const wallet = wallets.find(w => w.userId === selectedPatient.id);
        return transactions
            .filter(t => t.walletId === wallet?.id && t.clinicId === clinic.id)
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }, [selectedPatient, transactions, wallets, clinic.id]);

    const emrData = selectedPatient.metadata?.emr;

    // Quick helpers for header
    const patientAge = useMemo(() => {
        if (!emrData?.demographics?.dateOfBirth) return null;
        const dob = new Date(emrData.demographics.dateOfBirth);
        const ageDifMs = Date.now() - dob.getTime();
        const ageDate = new Date(ageDifMs);
        return Math.abs(ageDate.getUTCFullYear() - 1970);
    }, [emrData?.demographics?.dateOfBirth]);

    const bloodGroup = emrData?.demographics?.bloodGroup;
    const medicalAlerts = selectedPatient.metadata?.medicalAlerts || [];


    return (
        <div className="w-full max-w-[1600px] mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20 px-8">

            {/* 1. UNIFIED HEADER: PATIENT IDENTITY & ALERTS */}
            <div className="bg-white p-8 rounded-[40px] shadow-sm border border-slate-100 relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-full h-1.5" style={{ backgroundColor: clinic.primaryColor }}></div>

                <div className="flex flex-col xl:flex-row justify-between items-start gap-8 relative z-10">

                    {/* LEFT: Identity */}
                    <div className="flex-1 space-y-4">
                        <div className="flex flex-wrap items-center gap-3">
                            <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border shadow-sm ${selectedPatient.currentTier === 'GOLD' ? 'bg-amber-50 text-amber-600 border-amber-200' : selectedPatient.currentTier === 'PLATINUM' ? 'bg-slate-800 text-slate-100 border-slate-700' : 'bg-slate-50 text-slate-500 border-slate-200'}`}>
                                {selectedPatient.currentTier} Tier
                            </span>
                            {patientAge && <span className="px-3 py-1.5 bg-teal-50 text-teal-600 rounded-full text-[11px] font-bold border border-teal-100">{patientAge} yrs</span>}
                            {bloodGroup && <span className="px-3 py-1.5 bg-rose-50 text-rose-600 rounded-full text-[11px] font-bold border border-rose-100 flex items-center gap-1"><Activity size={12} /> {bloodGroup}</span>}
                        </div>

                        <div>
                            <h1 className="text-5xl font-black tracking-tighter text-slate-900 leading-tight flex items-center gap-4">
                                {selectedPatient.name}
                                {medicalAlerts.length > 0 && (
                                    <div className="flex -space-x-2">
                                        <div className="h-8 w-8 rounded-full bg-rose-100 border-2 border-white flex items-center justify-center text-rose-500 shadow-sm" title="Medical Alerts Present">
                                            <AlertTriangle size={16} strokeWidth={3} />
                                        </div>
                                    </div>
                                )}
                            </h1>
                            <div className="flex items-center gap-4 mt-2">
                                <p className="text-lg font-bold text-slate-500 font-mono bg-slate-50 px-3 py-1 rounded-lg inline-block border border-slate-100">{selectedPatient.mobile}</p>
                                <button
                                    onClick={() => setShowDemographics(!showDemographics)}
                                    className="text-xs font-bold text-teal-500 hover:text-teal-600 flex items-center gap-1 transition-colors"
                                >
                                    {showDemographics ? 'Hide' : 'View'} Full Demographics {showDemographics ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                                </button>
                            </div>
                        </div>

                        {medicalAlerts.length > 0 && (
                            <div className="flex flex-wrap gap-2 pt-2">
                                {medicalAlerts.map((alert: string, i: number) => (
                                    <span key={i} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black bg-rose-50 text-rose-600 border border-rose-100">
                                        <AlertTriangle size={12} /> {alert}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* RIGHT: Financials & Quick Actions */}
                    <div className="flex flex-row xl:flex-col gap-4 min-w-[300px]">
                        <div className="p-6 bg-slate-50 rounded-[28px] border border-slate-200 shadow-inner flex-1 flex flex-col justify-center">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Smile Credits</p>
                            <h2 className="text-5xl font-black tracking-tighter" style={{ color: clinic.primaryColor }}>
                                {wallets.find(w => w.userId === selectedPatient.id)?.balance || 0}
                            </h2>
                        </div>
                        <div className="flex gap-2">
                            <button onClick={() => window.print()} className="p-3 bg-teal-50 border border-teal-200 text-teal-600 rounded-2xl hover:bg-teal-100 transition-all shadow-sm title='Export PDF'">
                                <Printer size={18} />
                            </button>
                            <button className="flex-1 py-3 bg-white border border-slate-200 text-slate-600 rounded-2xl font-black text-xs uppercase tracking-widest hover:border-slate-300 hover:bg-slate-50 transition-all shadow-sm">
                                Book Review
                            </button>
                            <button onClick={() => {
                                if (confirm("DANGER: Are you sure you want to permanently delete this identity?")) onDeletePatient(selectedPatient.id);
                            }} className="p-3 bg-white border border-rose-100 text-rose-500 rounded-2xl hover:bg-rose-50 transition-all shadow-sm">
                                <AlertTriangle size={18} />
                            </button>
                        </div>
                    </div>

                </div>

                {/* EXPANDABLE DEMOGRAPHICS BAR */}
                {showDemographics && (
                    <div className="mt-8 pt-8 border-t border-slate-100 animate-in slide-in-from-top-4 fade-in duration-300">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Gender</p>
                                <p className="text-sm font-bold text-slate-800">{emrData?.demographics?.gender || 'Not specified'}</p>
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Occupation</p>
                                <p className="text-sm font-bold text-slate-800">{emrData?.demographics?.occupation || 'Not specified'}</p>
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Emergency Contact</p>
                                <p className="text-sm font-bold text-slate-800">{emrData?.demographics?.emergencyContactName ? `${emrData.demographics.emergencyContactName} (${emrData.demographics.emergencyContactPhone})` : 'Not specified'}</p>
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Insurance Provider</p>
                                <p className="text-sm font-bold text-slate-800">{emrData?.demographics?.insuranceProvider || 'Self-pay'}</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* UNIFIED CLINICAL WORKSPACE */}
            {/* The ClinicalTab is now the main body of the patient file, not a tab */}
            <div className="transition-all block">
                <ClinicalTab
                    clinic={clinic}
                    patient={selectedPatient}
                    activeCarePlan={activeCarePlan}
                    backendService={backendService}
                    onUpdateCarePlan={onUpdateCarePlan}
                    onTerminateCarePlan={onTerminateCarePlan}
                    onToggleChecklistItem={onToggleChecklistItem}
                    onOpenConsole={(plan) => setViewingPlan(plan)}
                    onRefreshData={onRefreshData}
                    // We will thread Treatment & Payment handlers into ClinicalTab next
                    onProcessTransaction={onProcessTransaction}
                    onAssignPlan={onAssignPlan}
                />
            </div>

            {/* Treatment Detail Overlay (Used by Clinical Tab) */}
            {viewingPlan && (
                <DoctorTreatmentDetail
                    plan={viewingPlan}
                    patient={selectedPatient}
                    clinic={clinic}
                    onClose={() => setViewingPlan(null)}
                    onUpdatePlan={onUpdateCarePlan}
                />
            )}
        </div>
    );
};

export default React.memo(PatientProfile);
