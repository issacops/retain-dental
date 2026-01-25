import React, { useState } from 'react';
import { Plus, Minus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';

const FAQ_DATA = [
    {
        category: "Integration & Setup",
        questions: [
            {
                q: "Which Dental Practice Management Systems (PMS) do you integrate with?",
                a: "RetainOS offers native 2-way synchronization with major PMS platforms including Dentrix G6/G7, Eaglesoft 21+, OpenDental, Cloud 9, and Curve Hero."
            },
            {
                q: "How long does implementation take?",
                a: "We targeted a 'Lunch Break Launch'. Most clinics go live in under 20 minutes. You authenticate your PMS, select your protocols, and we background sync your patient database instantly."
            },
            {
                q: "Do I need to replace Weave or RevenueWell?",
                a: "Yes. RetainOS replaces fragmented patient communication tools. We handle 2-way texting, automated recall, forms, and payments in one unified 'Patient OS', saving you 30-40% in software costs."
            },
            {
                q: "Can you migrate existing reward points?",
                a: "Absolutely. We import legacy loyalty balances during onboarding so your patients lose nothing."
            },
            {
                q: "Is there a contract?",
                a: "Single locations are month-to-month. Enterprise/DSO plans (5+ locations) have annual agreements with volume discounts."
            }
        ]
    },
    {
        category: "Patient Experience",
        questions: [
            {
                q: "Do patients need to download an app?",
                a: "No, they can use the mobile-optimized web portal (PWA) via 'Magic Link' SMS. However, 85% of users choose to download the app for FaceID login and push notifications."
            },
            {
                q: "How does FaceID login work?",
                a: "We use WebAuthn standards. Patients log in once via SMS code, then enable Biometrics. Future logins are instant, increasing engagement by 400% vs password-based portals."
            },
            {
                q: "What is Family Pooling?",
                a: "RetainOS links household members (e.g. Mom, Dad, Kids) automatically. Points earned by any member pool into a shared Family Wallet, gamifying the experience for the whole household."
            },
            {
                q: "Does it support multiple languages?",
                a: "Yes. The patient interface auto-detects English, Spanish, French, and Mandarin based on the user's phone settings."
            },
            {
                q: "Can patients reschedule via the app?",
                a: "Yes. Validated patients can reschedule appointments directly, writing back to your PMS in real-time without double-booking."
            }
        ]
    },
    {
        category: "Clinical Compliance",
        questions: [
            {
                q: "How does the Ortho/Aligner tracker work?",
                a: "Patients receive daily prompts to capture a selfie of their aligners fit and log wear-time. AI analyzes the fit gap. If compliance drops, you get a dashboard alert."
            },
            {
                q: "How do you handle emergency triage?",
                a: "The 'SOS' feature asks clinical questions (pain level, swelling, photos) and uses AI to categorize urgency. Your team gets a summarized 'Clinical Card' to decide if an immediate visit is needed."
            },
            {
                q: "Is this HIPAA compliant?",
                a: "Yes. All data is AES-256 encrypted at rest and TLS 1.3 in transit. We sign a BAA with every clinic and host on SOC2-ready AWS infrastructure."
            },
            {
                q: "Can I customize post-op instructions?",
                a: "Yes. You can build 'Care Tracks' for any procedure code (CDT). Trigger video guides or checklists automatically after an appointment is completed."
            }
        ]
    },
    {
        category: "Business & ROI",
        questions: [
            {
                q: "What is the 'Cosmetic Lock'?",
                a: "It's our core retention philosophy. Instead of discounting hygiene, you offer high-value cosmetic rewards (Whitening, Aligners) that require clinic visits to redeem, locking in the patient's future revenue."
            },
            {
                q: "How does the Membership Plan work?",
                a: "You can launch an in-house membership (e.g. $39/mo) in clicks. We handle the recurring Stripe billing and auto-renewals, bypassing insurance PPO limitations."
            },
            {
                q: "What is the typical ROI?",
                a: "Clinics typically see a 15-20% boost in recall show-rates and $120k+ in additional annual revenue per location within the first 6 months."
            },
            {
                q: "Can I use my own clinic branding?",
                a: "Yes. For groups with 20+ locations, we launch a fully custom app with your icon and branding in the App Store."
            }
        ]
    }
];

const FAQSection: React.FC = () => {
    const [openCategory, setOpenCategory] = useState<string | null>("Integration & Setup");
    const [openQuestion, setOpenQuestion] = useState<string | null>(null);

    const toggleCategory = (cat: string) => {
        setOpenCategory(openCategory === cat ? null : cat);
        setOpenQuestion(null);
    };

    const toggleQuestion = (q: string) => {
        setOpenQuestion(openQuestion === q ? null : q);
    };

    // GENERATE FAQ SCHEMA FOR AI/SEO
    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": FAQ_DATA.flatMap(cat =>
            cat.questions.map(q => ({
                "@type": "Question",
                "name": q.q,
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": q.a
                }
            }))
        )
    };

    return (
        <section className="py-32 px-6 bg-slate-950 border-t border-white/5 relative overflow-hidden" id="faq">
            <Helmet>
                <script type="application/ld+json">
                    {JSON.stringify(faqSchema)}
                </script>
            </Helmet>

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
                            <button
                                onClick={() => toggleCategory(category.category)}
                                className="w-full flex items-center justify-between p-8 text-left hover:bg-white/5 transition-colors"
                            >
                                <h3 className="text-xl md:text-2xl font-bold text-white tracking-tight">{category.category}</h3>
                                <div className={`p-2 rounded-full border border-white/10 transition-transform duration-300 ${openCategory === category.category ? 'rotate-180 bg-white text-black border-white' : 'text-slate-400'}`}>
                                    <span className="text-lg">▼</span>
                                </div>
                            </button>

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
            </div>
        </section>
    );
};

export default FAQSection;
