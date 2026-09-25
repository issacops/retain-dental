import React, { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { cn } from '../Doctor/ui/primitives';
import { Noise } from './ui';

export interface StackItem {
  id: string;
  label: string;
  sub?: string;
  icon?: React.ReactNode;
  gradient: string;
  content: React.ReactNode;
}

/**
 * A stack of vivid gradient cards that peek and expand — the reference
 * "Analytics" deck. The active card grows and sits on top; the rest show a
 * bold header strip. Pure layout animation, so reordering/expansion is fluid.
 */
const CardStack: React.FC<{ items: StackItem[]; initial?: string; className?: string }> = ({ items, initial, className }) => {
  const reduce = useReducedMotion();
  const [active, setActive] = useState<string>(initial || items[0]?.id);

  return (
    <div className={cn('px-1', className)}>
      {items.map((item, i) => {
        const isActive = active === item.id;
        return (
          <motion.div
            key={item.id}
            layout={!reduce}
            transition={{ type: 'spring', stiffness: 360, damping: 34 }}
            onClick={() => !isActive && setActive(item.id)}
            className={cn('relative overflow-hidden rounded-[30px] border border-white/10', !isActive && 'cursor-pointer')}
            style={{
              backgroundImage: item.gradient,
              boxShadow: isActive ? '0 30px 60px -24px rgba(0,0,0,0.75)' : '0 10px 24px -14px rgba(0,0,0,0.6)',
              marginTop: i === 0 ? 0 : -18,
              zIndex: isActive ? 50 : i + 1,
            }}
          >
            <div className="pointer-events-none absolute inset-0 rounded-[30px] ring-1 ring-inset ring-white/15" />
            <div className="pointer-events-none absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/20 to-transparent" />
            <Noise opacity={0.08} />

            {/* Header — always visible */}
            <button
              onClick={(e) => { e.stopPropagation(); setActive(item.id); }}
              className="relative flex w-full items-center gap-3 px-5 py-[18px] text-left"
              aria-expanded={isActive}
            >
              {item.icon && (
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-white/20 text-white ring-1 ring-inset ring-white/25">
                  {item.icon}
                </span>
              )}
              <span className="min-w-0 flex-1">
                <span className="block truncate font-display text-xl font-bold tracking-tight text-white">{item.label}</span>
                {item.sub && <span className="block truncate text-xs font-medium text-white/65">{item.sub}</span>}
              </span>
              <motion.span animate={{ rotate: isActive ? 180 : 0 }} transition={{ duration: 0.25 }} className="text-white/70">
                <ChevronDown size={18} />
              </motion.span>
            </button>

            {/* Body */}
            <AnimatePresence initial={false}>
              {isActive && (
                <motion.div
                  key="body"
                  initial={reduce ? { opacity: 0 } : { height: 0, opacity: 0 }}
                  animate={reduce ? { opacity: 1 } : { height: 'auto', opacity: 1 }}
                  exit={reduce ? { opacity: 0 } : { height: 0, opacity: 0 }}
                  transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                  className="relative overflow-hidden"
                >
                  <div className="px-5 pb-5">{item.content}</div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}
    </div>
  );
};

export default CardStack;
