import React, { useMemo, useState } from 'react';
import { Shield, Sparkles, FolderLock, CreditCard } from 'lucide-react';
import { User, Wallet, Transaction, CarePlan, Clinic, FamilyGroup, TransactionCategory, TransactionType } from '../../../types';
import DoctorTreatmentDetail from './DoctorTreatmentDetail';

// Import Tabs
import ClinicalTab from './profile_tabs/ClinicalTab';
import TreatmentTab from './profile_tabs/TreatmentTab';
import LedgerTab from './profile_tabs/LedgerTab';

interface Props {
    selectedPatient: User;
    clinic: Clinic;
    wallets: Wallet[];
    carePlans: CarePlan[];
    transactions: Transaction[];
    allUsers: User[];
    familyGroups: FamilyGroup[];
    onProcessTransaction: (patientId: string, amount: number, category: TransactionCategory, type: TransactionType, carePlanTemplate?: any) => any;
    onAssignPlan: (clinicId: string, patientId: string, template: any) => Promise<any>;
    onTerminateCarePlan: (carePlanId: string) => Promise<any>;
    onToggleChecklistItem: (carePlanId: string, itemId: string) => Promise<any>;
    onUpdateCarePlan: (carePlanId: string, updates: Partial<CarePlan>) => Promise<any>;
    onDeletePatient: (patientId: string) => Promise<any>;
}

type ProfileTab = 'CLINICAL' | 'PLANNER' | 'LEDGER' | 'VAULT';

const PatientProfile: React.FC<Props> = ({
    selectedPatient, clinic, wallets, carePlans, transactions, allUsers, familyGroups,
    onProcessTransaction, onAssignPlan, onTerminateCarePlan, onToggleChecklistItem, onUpdateCarePlan, onDeletePatient
}) => {
    const [activeTab, setActiveTab] = useState<ProfileTab>('CLINICAL');
    const [viewingPlan, setViewingPlan] = useState<CarePlan | null>(null);

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


    return (
        <div className="w-full max-w-[1600px] mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20 px-8">

            {/* 1. UNIFIED HEADER: IDENTITY & FINANCE */}
            <div className="bg-white p-10 rounded-[48px] shadow-sm border border-slate-100 relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-full h-2" style={{ backgroundColor: clinic.primaryColor }}></div>
                <div className="flex flex-col md:flex-row flex-wrap justify-between items-start md:items-center gap-8 relative z-10">
                    {/* LEFT: IDENTITY & HEADER CONTENT */}
                    <div className="flex-1 space-y-6">
                        <div className="flex items-center gap-4">
                            <div className={`h-3 w-3 rounded-full ${selectedPatient.currentTier === 'GOLD' ? 'bg-amber-400' : 'bg-emerald-400'} animate-pulse`}></div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 bg-slate-50 px-4 py-2 rounded-full border border-slate-100">Status: Active</span>
                        </div>
                        <div>
                            <h1 className="text-6xl font-black tracking-tighter text-slate-900 leading-none mb-3">{selectedPatient.name}</h1>
                            <p className="text-lg font-bold text-slate-400 tracking-tight font-mono">{selectedPatient.mobile}</p>
                        </div>
                        <div className="flex gap-4 pt-2">
                            <button onClick={() => {
                                if (confirm("DANGER: Are you sure you want to permanently delete this patient identity? This cannot be undone.")) {
                                    onDeletePatient(selectedPatient.id);
                                }
                            }} className="px-8 py-4 bg-rose-50 border border-rose-100 text-rose-500 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-rose-500 hover:text-white transition-all">Delete Identity</button>
                        </div>
                    </div>
                    {/* RIGHT: SMILE CREDITS */}
                    <div className="p-8 bg-slate-50 rounded-[32px] border border-slate-100 min-w-[300px] text-center">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Smile Credits Available</p>
                        <h2 className="text-7xl font-black tracking-tighter" style={{ color: clinic.primaryColor }}>
                            {wallets.find(w => w.userId === selectedPatient.id)?.balance || 0}
                        </h2>
                    </div>
                </div>
            </div>

            {/* TAB NAVIGATION */}
            <div className="flex gap-2 p-2 bg-slate-50 border border-slate-200/60 rounded-[32px] w-fit shadow-sm overflow-x-auto custom-scrollbar">
                <button
                    onClick={() => setActiveTab('CLINICAL')}
                    className={`px-8 py-4 flex items-center gap-3 rounded-[24px] font-black text-xs uppercase tracking-widest transition-all duration-300 ${activeTab === 'CLINICAL' ? 'bg-white text-slate-900 shadow-md scale-100' : 'text-slate-400 hover:text-slate-700 scale-95 hover:bg-slate-100'}`}>
                    <Shield size={16} className={activeTab === 'CLINICAL' ? 'text-emerald-500' : ''} /> Clinical Overview
                </button>
                <button
                    onClick={() => setActiveTab('PLANNER')}
                    className={`px-8 py-4 flex items-center gap-3 rounded-[24px] font-black text-xs uppercase tracking-widest transition-all duration-300 ${activeTab === 'PLANNER' ? 'bg-white text-slate-900 shadow-md scale-100' : 'text-slate-400 hover:text-slate-700 scale-95 hover:bg-slate-100'}`}>
                    <Sparkles size={16} className={activeTab === 'PLANNER' ? 'text-indigo-500' : ''} /> Treatment Planner
                </button>
                <button
                    onClick={() => setActiveTab('LEDGER')}
                    className={`px-8 py-4 flex items-center gap-3 rounded-[24px] font-black text-xs uppercase tracking-widest transition-all duration-300 ${activeTab === 'LEDGER' ? 'bg-white text-slate-900 shadow-md scale-100' : 'text-slate-400 hover:text-slate-700 scale-95 hover:bg-slate-100'}`}>
                    <CreditCard size={16} className={activeTab === 'LEDGER' ? 'text-rose-500' : ''} /> Financial Ledger
                </button>
                <button
                    disabled
                    className={`px-8 py-4 flex items-center gap-3 rounded-[24px] font-black text-xs uppercase tracking-widest transition-all duration-300 opacity-50 cursor-not-allowed text-slate-400 scale-95`}>
                    <FolderLock size={16} /> Secure Vault (Soon)
                </button>
            </div>

            {/* TAB WORKSPACE CONTENT */}
            <div className="min-h-[600px] transition-all">
                {activeTab === 'CLINICAL' && (
                    <ClinicalTab
                        clinic={clinic}
                        patient={selectedPatient}
                        activeCarePlan={activeCarePlan}
                        onUpdateCarePlan={onUpdateCarePlan}
                        onTerminateCarePlan={onTerminateCarePlan}
                        onToggleChecklistItem={onToggleChecklistItem}
                        onOpenConsole={(plan) => setViewingPlan(plan)}
                    />
                )}
                {activeTab === 'PLANNER' && (
                    <TreatmentTab
                        clinic={clinic}
                        patient={selectedPatient}
                        onAssignPlan={onAssignPlan}
                    />
                )}
                {activeTab === 'LEDGER' && (
                    <LedgerTab
                        clinic={clinic}
                        selectedPatient={selectedPatient}
                        patientTransactions={patientTransactions}
                        onProcessTransaction={onProcessTransaction}
                    />
                )}
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
