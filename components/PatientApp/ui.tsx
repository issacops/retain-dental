import React from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '../Doctor/ui/primitives';

/* ------------------------------------------------------------------ *
 * Patient PWA primitives — warm, calm, generous. One accent (the
 * clinic colour) plus the shared pastel semantics.
 * ------------------------------------------------------------------ */

export const Surface: React.FC<React.HTMLAttributes<HTMLDivElement> & { tone?: 'white' | 'cream' | 'dark'; interactive?: boolean }> = ({
  tone = 'white', interactive, className, children, ...rest
}) => (
  <div
    {...rest}
    className={cn(
      'rounded-[28px] border',
      tone === 'white' && 'border-ink-950/[0.06] bg-white shadow-[0_1px_2px_rgba(16,24,40,0.04)]',
      tone === 'cream' && 'border-ink-950/[0.06] bg-cream-100',
      tone === 'dark' && 'border-white/10 bg-ink-950 text-cream-50',
      interactive && 'transition-transform duration-200 active:scale-[0.985]',
      className,
    )}
  >
    {children}
  </div>
);

export const SectionLabel: React.FC<React.HTMLAttributes<HTMLSpanElement> & { onDark?: boolean }> = ({ className, children, onDark, ...rest }) => (
  <span {...rest} className={cn('font-mono text-[10px] font-bold uppercase tracking-[0.16em]', onDark ? 'text-cream-50/50' : 'text-ink-400', className)}>
    {children}
  </span>
);

export const Display: React.FC<React.HTMLAttributes<HTMLHeadingElement> & { as?: 'h1' | 'h2' | 'h3'; onDark?: boolean }> = ({
  className, children, as = 'h2', onDark, ...rest
}) => {
  const Tag = as;
  return (
    <Tag {...rest} className={cn('font-display font-bold tracking-tight', as === 'h1' ? 'text-2xl' : as === 'h2' ? 'text-xl' : 'text-base', onDark ? 'text-cream-50' : 'text-ink-900', className)}>
      {children}
    </Tag>
  );
};

type ButtonVariant = 'primary' | 'soft' | 'ghost' | 'dark';
export const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: ButtonVariant; accent?: string; block?: boolean; loading?: boolean }> = ({
  variant = 'primary', accent, block, loading, className, children, disabled, style, ...rest
}) => {
  const base = 'inline-flex items-center justify-center gap-2 rounded-full text-sm font-bold transition-all active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100';
  const pad = 'px-5 py-3';
  const variants: Record<ButtonVariant, string> = {
    primary: 'text-white shadow-[0_6px_16px_-8px_rgba(16,24,40,0.5)]',
    soft: 'bg-ink-950/[0.05] text-ink-800 hover:bg-ink-950/[0.08]',
    ghost: 'border border-ink-950/10 bg-white text-ink-700 hover:border-ink-950/25',
    dark: 'bg-ink-950 text-cream-50 hover:bg-ink-800',
  };
  return (
    <button
      {...rest}
      disabled={disabled || loading}
      style={variant === 'primary' ? { backgroundColor: accent || '#0F766E', ...style } : style}
      className={cn(base, pad, variants[variant], block && 'w-full', className)}
    >
      {loading && <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/40 border-t-white" />}
      {children}
    </button>
  );
};

type ChipTone = 'neutral' | 'leaf' | 'sun' | 'blush' | 'mist' | 'dark';
const CHIP: Record<ChipTone, string> = {
  neutral: 'bg-ink-950/[0.06] text-ink-600',
  leaf: 'bg-leaf-soft text-leaf-deep',
  sun: 'bg-sun-soft text-sun-deep',
  blush: 'bg-blush-soft text-blush-deep',
  mist: 'bg-mist-soft text-mist-deep',
  dark: 'bg-ink-950 text-cream-50',
};
export const Chip: React.FC<{ tone?: ChipTone; className?: string; children: React.ReactNode }> = ({ tone = 'neutral', className, children }) => (
  <span className={cn('inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.1em]', CHIP[tone], className)}>{children}</span>
);

export const ProgressRing: React.FC<{ value: number; size?: number; stroke?: number; accent?: string; track?: string; children?: React.ReactNode }> = ({
  value, size = 120, stroke = 10, accent = '#0F766E', track = 'rgba(0,0,0,0.08)', children,
}) => {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const pct = Math.max(0, Math.min(1, value));
  const reduce = useReducedMotion();
  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={track} strokeWidth={stroke} />
        <motion.circle
          cx={size / 2} cy={size / 2} r={r} fill="none" stroke={accent} strokeWidth={stroke} strokeLinecap="round"
          strokeDasharray={c}
          initial={reduce ? false : { strokeDashoffset: c }}
          animate={{ strokeDashoffset: c * (1 - pct) }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">{children}</div>
    </div>
  );
};

export const Sheet: React.FC<{ open: boolean; onClose: () => void; title?: string; children: React.ReactNode }> = ({ open, onClose, title, children }) => {
  const reduce = useReducedMotion();
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[80] flex items-end justify-center bg-ink-950/50 backdrop-blur-[2px]"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md rounded-t-[32px] border-t border-ink-950/[0.06] bg-cream-50 p-5 pb-8"
            initial={reduce ? { opacity: 0 } : { y: '100%' }}
            animate={reduce ? { opacity: 1 } : { y: 0 }}
            exit={reduce ? { opacity: 0 } : { y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 320 }}
          >
            <div className="mx-auto mb-4 h-1.5 w-10 rounded-full bg-ink-950/15" />
            <div className="mb-4 flex items-center justify-between">
              {title ? <Display as="h2">{title}</Display> : <span />}
              <button onClick={onClose} aria-label="Close" className="flex h-9 w-9 items-center justify-center rounded-full border border-ink-950/10 bg-white text-ink-500">
                <X size={16} />
              </button>
            </div>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export const Skeleton: React.FC<{ className?: string }> = ({ className }) => (
  <div className={cn('animate-pulse rounded-2xl bg-ink-950/[0.06]', className)} />
);

export const EmptyState: React.FC<{ icon?: React.ReactNode; title: string; hint?: string; action?: React.ReactNode }> = ({ icon, title, hint, action }) => (
  <div className="flex flex-col items-center justify-center px-6 py-10 text-center">
    {icon && <div className="mb-3 text-ink-300">{icon}</div>}
    <p className="font-display text-base font-bold text-ink-700">{title}</p>
    {hint && <p className="mt-1 max-w-[16rem] text-sm text-ink-400">{hint}</p>}
    {action && <div className="mt-4">{action}</div>}
  </div>
);

export const ListRow: React.FC<{ icon?: React.ReactNode; title: string; sub?: string; right?: React.ReactNode; onClick?: () => void }> = ({ icon, title, sub, right, onClick }) => {
  const Comp: any = onClick ? 'button' : 'div';
  return (
    <Comp onClick={onClick} className={cn('flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left', onClick && 'transition-colors hover:bg-cream-100')}>
      {icon && <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-ink-950/[0.05] text-ink-500">{icon}</span>}
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-bold text-ink-800">{title}</span>
        {sub && <span className="block truncate text-xs text-ink-400">{sub}</span>}
      </span>
      {right}
    </Comp>
  );
};

export const Avatar: React.FC<{ name: string; accent?: string; size?: number }> = ({ name, accent = '#0F766E', size = 40 }) => (
  <span className="flex shrink-0 items-center justify-center rounded-full font-display font-bold text-white" style={{ width: size, height: size, backgroundColor: accent, fontSize: size * 0.36 }}>
    {(name || '?').split(' ').map((w) => w[0]).filter(Boolean).slice(0, 2).join('').toUpperCase()}
  </span>
);

export const money = (n: number) => `₹${Math.round(n || 0).toLocaleString('en-IN')}`;

export const relTime = (iso: string) => {
  const mins = Math.round((Date.now() - +new Date(iso)) / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.round(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

export const dayGreeting = () => {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
};

export const countdown = (iso: string) => {
  const target = new Date(iso);
  const now = new Date();
  const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
  const days = Math.round((startOfDay(target) - startOfDay(now)) / 86400000);
  if (days === 0) return 'Today';
  if (days === 1) return 'Tomorrow';
  if (days > 1 && days < 7) return `In ${days} days`;
  return target.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
};
