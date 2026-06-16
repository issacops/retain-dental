import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gift, Bell, Sparkles, ChevronRight, CheckCircle2 } from 'lucide-react';
import { Clinic, User } from '../../../types';

interface UnboxingFlowProps {
    clinic: Clinic;
    user: User;
    onComplete: () => void;
}

const slideVariants = {
    initial: { opacity: 0, scale: 0.9, y: 20 },
    animate: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
    exit: { opacity: 0, scale: 1.05, y: -20, transition: { duration: 0.4 } }
};

export default function UnboxingFlow({ clinic, user, onComplete }: UnboxingFlowProps) {
    const [step, setStep] = useState(0);
    const [notificationsGranted, setNotificationsGranted] = useState(false);

    const requestNotifications = async () => {
        if (!('Notification' in window)) {
            console.warn("Notifications not supported");
            nextStep();
            return;
        }

        try {
            const permission = await Notification.requestPermission();
            if (permission === 'granted') {
                setNotificationsGranted(true);
                new Notification(`Welcome to ${clinic.name}`, {
                    body: "We'll send you reminders about your daily dental habits!",
                    icon: clinic.logoUrl || '/icon-192.png'
                });
            }
        } catch (error) {
            console.error("Error asking for permission", error);
        }
        nextStep();
    };

    const nextStep = () => {
        if (step === 2) {
            localStorage.setItem(`retend_onboarded_${user.id}`, 'true');
            onComplete();
        } else {
            setStep(prev => prev + 1);
        }
    };

    return (
        <div className="fixed inset-0 z-[200] bg-gradient-to-b from-teal-50 to-white flex flex-col pt-12">
            <div className="absolute top-[-20%] left-[-20%] w-[140%] h-[140%] bg-teal-500/5 blur-[120px] pointer-events-none"></div>

            <main className="flex-1 flex flex-col justify-center px-8 relative z-10 pb-20">
                <AnimatePresence mode="wait">
                    {step === 0 && (
                        <motion.div key="step0" variants={slideVariants} initial="initial" animate="animate" exit="exit" className="text-center space-y-8">
                            <div className="h-32 w-32 bg-teal-50 rounded-full flex flex-col items-center justify-center mx-auto border border-teal-100 relative shadow-lg shadow-teal-100/50">
                                <div className="absolute inset-0 rounded-full border border-teal-200 scale-110 animate-ping opacity-20"></div>
                                <Gift size={48} className="text-teal-600" />
                            </div>
                            <div>
                                <h1 className="text-5xl font-black text-slate-800 tracking-tighter leading-none mb-4">Welcome<br />to <span style={{ color: clinic.primaryColor || '#0d9488' }}>{clinic.name}</span>.</h1>
                                <p className="text-lg text-slate-500 font-medium">Your premium digital wallet for dental health and rewards.</p>
                            </div>
                            <div className="pt-4">
                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Your Starting Tier</p>
                                <div className="inline-block px-6 py-3 bg-teal-50 rounded-full border border-teal-100 text-teal-700 font-black tracking-widest uppercase">
                                    {user.currentTier} MEMBER
                                </div>
                            </div>
                            <div className="space-y-4 pt-8">
                                <button onClick={nextStep} className="w-full py-5 bg-teal-600 text-white rounded-[32px] font-black text-lg shadow-lg shadow-teal-200 flex items-center justify-center gap-3 active:scale-95 transition-all hover:bg-teal-700">
                                    Get Started <ChevronRight size={20} />
                                </button>
                                <button onClick={() => { localStorage.setItem(`retend_onboarded_${user.id}`, 'true'); onComplete(); }} className="w-full py-4 text-slate-400 text-sm font-bold uppercase tracking-widest active:scale-95 transition-all hover:text-slate-600">
                                    Skip Tour
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {step === 1 && (
                        <motion.div key="step1" variants={slideVariants} initial="initial" animate="animate" exit="exit" className="text-center space-y-8">
                            <div className="h-40 w-full max-w-[280px] bg-teal-50 rounded-3xl flex flex-col items-center justify-center mx-auto border border-teal-100 shadow-lg shadow-teal-100/30">
                                <Bell size={56} className="text-teal-500 mb-4 animate-bounce" />
                                <div className="bg-white px-4 py-2 rounded-xl border border-teal-100 shadow-sm">
                                    <p className="text-xs font-bold text-teal-700">Time to wear your aligners!</p>
                                </div>
                            </div>
                            <div>
                                <h2 className="text-4xl font-black text-slate-800 tracking-tighter mb-4">Stay on Track</h2>
                                <p className="text-lg text-slate-500 font-medium leading-relaxed">Turn on notifications to receive smart reminders for your daily dental habits and earn points for consistency.</p>
                            </div>
                            <div className="space-y-4 pt-8">
                                <button onClick={requestNotifications} className="w-full py-5 bg-teal-600 text-white rounded-[32px] font-black text-lg shadow-lg shadow-teal-200 active:scale-95 transition-all hover:bg-teal-700">
                                    Allow Notifications
                                </button>
                                <button onClick={nextStep} className="w-full py-4 text-slate-400 text-sm font-bold uppercase tracking-widest active:scale-95 transition-all hover:text-slate-600">
                                    Maybe Later
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {step === 2 && (
                        <motion.div key="step2" variants={slideVariants} initial="initial" animate="animate" exit="exit" className="text-center space-y-8">
                            <div className="relative h-40 w-40 mx-auto">
                                <motion.div
                                    initial={{ scale: 0, rotate: -180 }}
                                    animate={{ scale: 1, rotate: 0 }}
                                    transition={{ type: 'spring', damping: 15, stiffness: 100 }}
                                    className="absolute inset-0 bg-teal-500 rounded-[40px] shadow-lg shadow-teal-200 flex items-center justify-center rotate-3"
                                >
                                    <CheckCircle2 size={64} className="text-white" />
                                </motion.div>
                                <motion.div animate={{ rotate: 360 }} transition={{ duration: 10, repeat: Infinity, ease: "linear" }} className="absolute inset-0 border-2 border-dashed border-teal-300/50 rounded-[40px] -z-10"></motion.div>
                            </div>

                            <div>
                                <h2 className="text-4xl font-black text-slate-800 tracking-tighter mb-4">You're All Set!</h2>
                                <p className="text-lg text-slate-500 font-medium">Your profile is configured. Let's start building healthy habits together.</p>
                            </div>

                            <button onClick={nextStep} className="w-full py-5 bg-teal-600 text-white rounded-[32px] font-black text-lg shadow-lg shadow-teal-200 flex items-center justify-center gap-3 active:scale-95 transition-all mt-12 hover:bg-teal-700">
                                Enter Portal <ChevronRight size={20} />
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>

            <div className="fixed bottom-12 left-0 w-full flex justify-center gap-2">
                {[0, 1, 2].map((i) => (
                    <div key={i} className={`h-1.5 rounded-full transition-all duration-500 ${step === i ? 'bg-teal-600 w-6' : 'bg-teal-200 w-1.5'}`}></div>
                ))}
            </div>
        </div>
    );
}
