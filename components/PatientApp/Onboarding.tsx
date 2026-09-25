import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { CalendarHeart, ListChecks, Sparkles, Share, ArrowRight } from 'lucide-react';
import { Avatar, Button, Display, SectionLabel } from './ui';
import { isIOS, isStandalone } from '../../lib/push';

interface Props {
  clinicName: string;
  accent: string;
  onDone: () => void;
}

const POINTS = [
  { icon: CalendarHeart, title: 'Your next visit, at a glance', body: 'See when to come in, and get there prepared.' },
  { icon: ListChecks, title: 'Aftercare made simple', body: 'A short daily routine you can tick off in seconds.' },
  { icon: Sparkles, title: 'Rewards as you go', body: 'Earn Smile Points on every visit and redeem them for care.' },
];

const Onboarding: React.FC<Props> = ({ clinicName, accent, onDone }) => {
  const reduce = useReducedMotion();
  const iosNeedsInstall = isIOS() && !isStandalone();

  return (
    <div className="fixed inset-0 z-[120] flex flex-col bg-cream-50 font-sans">
      <div className="mx-auto flex w-full max-w-md flex-1 flex-col px-6 pb-8 pt-16">
        <motion.div initial={reduce ? false : { opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <Avatar name={clinicName} accent={accent} size={56} />
          <SectionLabel className="mt-5 block">Welcome</SectionLabel>
          <Display as="h1" className="mt-2 text-3xl">{clinicName}</Display>
          <p className="mt-2 text-sm text-ink-500">Your dental care, in your pocket.</p>
        </motion.div>

        <div className="mt-9 space-y-5">
          {POINTS.map((p, i) => {
            const Icon = p.icon;
            return (
              <motion.div
                key={p.title}
                initial={reduce ? false : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: reduce ? 0 : 0.1 + i * 0.08 }}
                className="flex items-start gap-4"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl" style={{ backgroundColor: `${accent}14`, color: accent }}>
                  <Icon size={20} />
                </span>
                <div>
                  <p className="font-display text-base font-bold text-ink-900">{p.title}</p>
                  <p className="mt-0.5 text-sm text-ink-500">{p.body}</p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {iosNeedsInstall && (
          <div className="mt-8 flex items-start gap-3 rounded-[24px] border border-ink-950/[0.07] bg-white p-4">
            <Share size={16} className="mt-0.5 shrink-0 text-ink-400" />
            <p className="text-xs leading-relaxed text-ink-500">
              To get reminders on your phone, add this app to your Home Screen: tap <span className="font-bold text-ink-700">Share</span> then <span className="font-bold text-ink-700">Add to Home Screen</span>.
            </p>
          </div>
        )}

        <div className="mt-auto pt-10">
          <Button accent={accent} block className="!py-4" onClick={onDone}>
            Get started <ArrowRight size={16} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
