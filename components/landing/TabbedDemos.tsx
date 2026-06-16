import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ScanFace, Activity, Trophy, ChevronRight } from 'lucide-react';
import { LandingPatientView } from './demos/visuals/LandingPatientView';
import { LandingDoctorView } from './demos/visuals/LandingDoctorView';

const TABS = [
    {
        id: 'patient',
        label: 'Patient App',
        icon: <ScanFace size={20} />,
        visual: <LandingPatientView initialTab='HOME' />,
        description: 'Your clinic-branded 24/7 patient companion for appointments, care plans, and rewards.'
    },
    {
        id: 'doctor',
        label: 'Doctor Dashboard',
        icon: <Activity size={20} />,
        visual: <LandingDoctorView />,
        description: 'Real-time retention analytics, clinical protocols, and team coordination in one cockpit.'
    },
    {
        id: 'loyalty',
        label: 'Loyalty Engine',
        icon: <Trophy size={20} />,
        visual: <LandingPatientView initialTab='WALLET' />,
        description: 'Gamified tiers, household pooling, and automated rewards that lock patients into your brand.'
    }
];

const TabbedDemos: React.FC = () => {
    const [activeTab, setActiveTab] = useState('patient');

    return (
        <section className="py-32 px-6 bg-white overflow-hidden">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16 space-y-4">
                    <span className="text-teal-600 font-bold tracking-widest uppercase text-sm flex items-center justify-center gap-2">
                        <Activity size={16} /> Product Suite
                    </span>
                    <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter">
                        See it in action.
                    </h2>
                    <p className="text-xl text-slate-500 max-w-2xl mx-auto">
                        Click through each module to see how RetainOS transforms your practice.
                    </p>
                </div>

                {/* Tab Buttons */}
                <div className="flex justify-center mb-12">
                    <div className="inline-flex bg-slate-100 rounded-2xl p-1.5 gap-1">
                        {TABS.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2.5 px-6 py-3 rounded-xl font-bold text-sm transition-all ${
                                    activeTab === tab.id
                                        ? 'bg-white text-teal-700 shadow-sm border border-slate-200'
                                        : 'text-slate-500 hover:text-slate-700'
                                }`}
                            >
                                <span className={activeTab === tab.id ? 'text-teal-600' : 'text-slate-400'}>{tab.icon}</span>
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Demo Content */}
                <div className="relative">
                    <AnimatePresence mode="wait">
                        {TABS.map(tab => {
                            if (tab.id !== activeTab) return null;
                            const isPatientTab = tab.id === 'patient' || tab.id === 'loyalty';
                            return (
                                <motion.div
                                    key={tab.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ duration: 0.3 }}
                                    className="flex flex-col lg:flex-row items-center gap-16"
                                >
                                    <div className="flex-1 w-full max-w-md lg:max-w-none">
                                        <div className={`${isPatientTab ? 'max-w-[320px] mx-auto' : ''}`}>
                                            <div className={`${isPatientTab ? 'rounded-[2.5rem] border-[6px] border-slate-900 shadow-2xl overflow-hidden' : 'rounded-3xl shadow-2xl border border-slate-200 overflow-hidden'}`}>
                                                <div className={isPatientTab ? '' : 'h-[500px]'}>
                                                    {tab.visual}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex-1 max-w-lg space-y-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center text-teal-600">
                                                {tab.icon}
                                            </div>
                                            <h3 className="text-2xl font-black text-slate-900">{tab.label}</h3>
                                        </div>
                                        <p className="text-lg text-slate-600 leading-relaxed">
                                            {tab.description}
                                        </p>
                                        <ul className="space-y-4 pt-4">
                                            {tab.id === 'patient' && (
                                                <>
                                                    <li className="flex items-center gap-3 text-slate-700 font-medium"><ChevronRight size={16} className="text-teal-500 shrink-0" /> Biometric FaceID login — zero friction</li>
                                                    <li className="flex items-center gap-3 text-slate-700 font-medium"><ChevronRight size={16} className="text-teal-500 shrink-0" /> Real-time appointment booking with PMS write-back</li>
                                                    <li className="flex items-center gap-3 text-slate-700 font-medium"><ChevronRight size={16} className="text-teal-500 shrink-0" /> Custom care tracks for Invisalign, implants, veneers</li>
                                                </>
                                            )}
                                            {tab.id === 'doctor' && (
                                                <>
                                                    <li className="flex items-center gap-3 text-slate-700 font-medium"><ChevronRight size={16} className="text-teal-500 shrink-0" /> Live retention velocity chart across all locations</li>
                                                    <li className="flex items-center gap-3 text-slate-700 font-medium"><ChevronRight size={16} className="text-teal-500 shrink-0" /> Automated recall campaigns that fill hygiene</li>
                                                    <li className="flex items-center gap-3 text-slate-700 font-medium"><ChevronRight size={16} className="text-teal-500 shrink-0" /> Centralized billing & ledger reconciliation</li>
                                                </>
                                            )}
                                            {tab.id === 'loyalty' && (
                                                <>
                                                    <li className="flex items-center gap-3 text-slate-700 font-medium"><ChevronRight size={16} className="text-teal-500 shrink-0" /> Gold/Platinum status tiers drive adherence</li>
                                                    <li className="flex items-center gap-3 text-slate-700 font-medium"><ChevronRight size={16} className="text-teal-500 shrink-0" /> Family household pooling — Mom brings Dad & Kids</li>
                                                    <li className="flex items-center gap-3 text-slate-700 font-medium"><ChevronRight size={16} className="text-teal-500 shrink-0" /> Cosmetic Lock: high-value rewards that require visits</li>
                                                </>
                                            )}
                                        </ul>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                </div>
            </div>
        </section>
    );
};

export default TabbedDemos;
