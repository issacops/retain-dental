import React, { useState } from 'react';
import { Plus, Minus, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const FAQ_DATA = [
    {
        category: "Integration & Setup",
        questions: [
            {
                q: "Which Dental Practice Management Systems (PMS) do you integrate with?",
                a: "RetainOS offers native 2-way synchronization with major PMS platforms including Dentrix G6/G7, Eaglesoft 21+, OpenDental, Cloud 9, and Curve Hero. We read your schedule, patient demographics, and treatment plans in real-time, and write back confirmed appointments and communication logs."
            },
            {
                q: "Do I need to replace my existing patient communication software (e.g., Weave, RevenueWell)?",
                a: "Yes. RetainOS is a complete replacement for fragmented tools like Weave, Solutionreach, or RevenueWell. By consolidating recall, two-way texting, reputation management, and payments into one 'Patient OS', you eliminate duplicate costs and disjointed patient experiences."
            },
            {
                q: "How long does the implementation process take?",
                a: "We get you live in under 20 minutes. It's a simple 3-step wizard: Authenticate your PMS, Select your Protocols, and Click 'Sync'. The system automatically backfills your patient data in the background."
            },
            {
                q: "Can you migrate my existing patient reward points or membership plans?",
                a: "Absolutely. During onboarding, we import your existing patient ledger. If you have a manual loyalty program or third-party membership data, we migrate those distinct values into the RetainOS Wallet so patients lose nothing."
            }
        ]
    },
    {
        category: "Patient Experience & App",
        questions: [
            {
                q: "Do patients have to download an app to book appointments?",
                a: "They don't *have* to, but they will want to. We use a 'Magic Link' system via SMS for first-time access (no password needed). Once they see their treatment plan, rewards, and family pooling features, we see an 85% app download conversion rate within 90 days. For older patients, standard SMS/Web booking remains fully functional."
            },
            {
                q: "How does the 'Family Pooling' feature work for households?",
                a: "RetainOS identifies households based on your PMS data. A 'Head of Household' (e.g., Mom) can log in once via FaceID and manage appointments, forms, and payments for herself, her spouse, and her children from a single dashboard. Points earned by any family member are pooled into a shared 'Household Wallet' for faster redemption."
            },
            {
                q: "What happens if a patient ignores the app notifications?",
                a: "We have an omnichannel fallback system. If a push notification for a recall is ignored, we automatically trigger an SMS after 24 hours, followed by an email after 48 hours. If there is still no response, the patient is flagged in the 'Call List' on your Clinic Dashboard for manual outreach."
            }
        ]
    },
    {
        category: "Clinical & Treatment",
        questions: [
            {
                q: "How does RetainOS help with Invisalign or Aligner compliance?",
                a: "We have a dedicated 'Ortho Track'. Patients receive daily push notifications to switch trays, upload selfies for AI monitoring, and track their wear-time. Doctors can monitor this adherence in real-time and intervene only when compliance drops below 80%."
            },
            {
                q: "Can I customize the aftercare instructions for specific procedures?",
                a: "Yes. Our 'Protocol Engine' allows you to create custom aftercare tracks for procedures like Implants, Wisdom Teeth Extraction, or Veneers. You can attach video guides, PDF instructions, and daily checklist items (e.g., 'Salt water rinse') that the patient must check off."
            },
            {
                q: "Does the app handle emergency triage?",
                a: "Yes. The 'SOS' button in the patient app launches an AI-guided triage flow. Patients upload photos and describe symptoms. Our system categorizes the urgency (e.g., 'Cosmetic' vs 'Infection') and alerts your on-call doctor with a summarized clinical card."
            }
        ]
    },
    {
        category: "ROI & Business Model",
        questions: [
            {
                q: "What is the typical ROI for a single location clinic?",
                a: "Most clinics see a 15-20% increase in hygiene re-appointment rates within the first 6 months. For a $1.5M practice, this translates to roughly $120k-$180k in additional annual revenue, not including the savings from cancelling other software subscriptions."
            },
            {
                q: "How does the 'Membership' model replace insurance PPO write-offs?",
                a: "RetainOS makes it effortless to launch and manage an in-house membership plan. By offering 'Prime Status' (e.g., $39/mo for 2 cleanings + 15% off tx), you build recurring revenue that isn't subject to insurance adjudications or delays. We handle the automated billing and renewals."
            },
            {
                q: "Is there a contract or setup fee?",
                a: "For single locations, we operate on a month-to-month SaaS model with a one-time onboarding fee. For DSOs and multi-location groups (5+ locations), we offer annual enterprise contracts with volume pricing and dedicated customer success managers."
            }
        ]
    },
    {
        category: "Security & Compliance",
        questions: [
            {
                q: "Is RetainOS HIPAA compliant?",
                a: "Yes, fully. We sign a Business Associate Agreement (BAA) with every clinic. All data is encrypted at rest (AES-256) and in transit (TLS 1.3). Our infrastructure is hosted on AWS with strict access controls and regular penetration testing."
            },
            {
                q: "Who owns the patient data?",
                a: "You do. Always. RetainOS acts as the data processor. If you ever decide to leave, we provide a full SQL export or CSV dump of all your patient logs, appointment history, and communication data within 48 hours."
            }
        ]
    }
];

const FAQSection: React.FC = () => {
    const [openCategory, setOpenCategory] = useState<string | null>("Integration & Setup");
    const [openQuestion, setOpenQuestion] = useState<string | null>(null);

    const toggleCategory = (cat: string) => {
        setOpenCategory(openCategory === cat ? null : cat);
        setOpenQuestion(null); // Reset inner accordion
    };

    const toggleQuestion = (q: string) => {
        setOpenQuestion(openQuestion === q ? null : q);
    };

    return (
        <section className="py-32 px-6 bg-slate-950 border-t border-white/5 relative overflow-hidden" id="faq">
            {/* Background glow */}
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/10 via-slate-950 to-slate-950 pointer-events-none"></div>

            <div className="max-w-5xl mx-auto relative z-10">
                <div className="text-center mb-20 space-y-6">
                    <span className="text-indigo-500 font-bold tracking-widest uppercase text-sm">Knowledge Base</span>
                    <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter">
                        Everything you need to know.
                    </h2>
                    <p className="text-xl text-slate-400 max-w-2xl mx-auto">
                        Designed for modern dental entreprenuers, DSOs, and private practices scaling to $5M+.
                    </p>
                </div>

                <div className="space-y-4">
                    {FAQ_DATA.map((category) => (
                        <div key={category.category} className="rounded-[2rem] border border-white/5 bg-white/5 overflow-hidden">
                            {/* Category Header */}
                            <button
                                onClick={() => toggleCategory(category.category)}
                                className="w-full flex items-center justify-between p-8 text-left hover:bg-white/5 transition-colors"
                            >
                                <h3 className="text-xl md:text-2xl font-bold text-white tracking-tight">{category.category}</h3>
                                <div className={`p-2 rounded-full border border-white/10 transition-transform duration-300 ${openCategory === category.category ? 'rotate-180 bg-white text-black border-white' : 'text-slate-400'}`}>
                                    <span className="text-lg">▼</span>
                                </div>
                            </button>

                            {/* Questions */}
                            <AnimatePresence>
                                {openCategory === category.category && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="border-t border-white/5"
                                    >
                                        <div className="p-4 md:p-8 space-y-2">
                                            {category.questions.map((item, index) => (
                                                <div key={index} className="rounded-xl overflow-hidden bg-slate-900/50 border border-white/5 hover:border-indigo-500/30 transition-colors">
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); toggleQuestion(item.q); }}
                                                        className="w-full flex items-start text-left p-6 gap-4"
                                                    >
                                                        <div className={`mt-1 transition-colors ${openQuestion === item.q ? 'text-indigo-400' : 'text-slate-500'}`}>
                                                            {openQuestion === item.q ? <Minus size={18} /> : <Plus size={18} />}
                                                        </div>
                                                        <span className={`text-lg font-bold transition-colors ${openQuestion === item.q ? 'text-indigo-400' : 'text-slate-200'}`}>
                                                            {item.q}
                                                        </span>
                                                    </button>

                                                    <AnimatePresence>
                                                        {openQuestion === item.q && (
                                                            <motion.div
                                                                initial={{ height: 0, opacity: 0 }}
                                                                animate={{ height: "auto", opacity: 1 }}
                                                                exit={{ height: 0, opacity: 0 }}
                                                            >
                                                                <div className="px-6 pb-6 pl-14 text-slate-400 leading-relaxed">
                                                                    {item.a}
                                                                </div>
                                                            </motion.div>
                                                        )}
                                                    </AnimatePresence>
                                                </div>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ))}
                </div>

                {/* SEO Keyword Salad (Hidden visibly but structurally present for bots? No, that's black hat. 
                    Better to just have a footer section or 'Related Capabilities'.)
                    Actually, the extensive content above is sufficient for LLM understanding. 
                */}
            </div>
        </section>
    );
};

export default FAQSection;
