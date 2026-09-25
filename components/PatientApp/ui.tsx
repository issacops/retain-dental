import React from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '../Doctor/ui/primitives';

/* ------------------------------------------------------------------ *
 * Patient PWA design system — "Aurora".
 * Soft aurora gradients, frosted glass, bento cards, big display
 * numerals. Warm and calm on purpose: dental visits are anxious.
 * ------------------------------------------------------------------ */

/* --- colour helpers --- */
const clamp = (n: number) => Math.max(0, Math.min(255, n));
const parseHex = (h: string): [number, number, number] => {
  let s = (h || '#0F766E').replace('#', '');
  if (s.length === 3) s = s.split('').map((c) => c + c).join('');
  return [parseInt(s.slice(0, 2), 16) || 0, parseInt(s.slice(2, 4), 16) || 0, parseInt(s.slice(4, 6), 16) || 0];
};
/** Blend two hex colours (t = 0 → a, 1 → b). */
export const mix = (a: string, b: string, t: number) => {
  const A = parseHex(a); const B = parseHex(b);
  const c = A.map((v, i) => clamp(Math.round(v + (B[i] - v) * t)));
  return `#${c.map((v) => v.toString(16).padStart(2, '0')).join('')}`;
};
/** Append alpha to a 6-digit hex. */
export const alpha = (hex: string, a: number) => {
  const h = (hex || '#0F766E').replace('#', '').padEnd(6, '0').slice(0, 6);
  return `#${h}${Math.round(clamp(a * 255)).toString(16).padStart(2, '0')}`;
};

/* --- ambient background --- */
export const Aurora: React.FC<{ accent: string }> = ({ accent }) => {
  const reduce = useReducedMotion();
  const blob = (color: string, style: React.CSSProperties, dur: number) => (
    <motion.div
      className="absolute rounded-full blur-[80px]"
      style={{ background: color, opacity: 0.22, ...style }}
      animate={reduce ? undefined : { x: [0, 22, -12, 0], y: [0, -18, 14, 0] }}
      transition={{ duration: dur, repeat: Infinity, ease: 'easeInOut' }}
    />
  );
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-cream-50">
      {blob(accent, { width: 360, height: 360, left: -80, top: -90 }, 16)}
      {blob('#F6C9DC', { width: 300, height: 300, right: -70, top: 40 }, 19)}
      {blob('#BBD7EE', { width: 340, height: 340, left: -60, bottom: -80 }, 22)}
      {blob('#F5E27B', { width: 250, height: 250, right: -40, bottom: 60 }, 18)}
      <div
        className="absolute inset-0 opacity-[0.5]"
        style={{ backgroundImage: 'radial-gradient(rgba(10,10,10,0.055) 1px, transparent 1px)', backgroundSize: '22px 22px' }}
      />
    </div>
  );
};

/* --- surfaces --- */
export const Glass: React.FC<React.HTMLAttributes<HTMLDivElement> & { interactive?: boolean }> = ({ interactive, className, children, ...rest }) => (
  <div
    {...rest}
    className={cn(
      'rounded-[30px] border border-white/60 bg-white/55 backdrop-blur-xl',
      'shadow-[0_10px_34px_-16px_rgba(16,24,40,0.28)]',
      interactive && 'transition-transform duration-200 active:scale-[0.985]',
      className,
    )}
  >
    {children}
  </div>
);

export const GradientCard: React.FC<React.HTMLAttributes<HTMLDivElement> & { accent: string; deep?: boolean }> = ({ accent, deep = true, className, children, ...rest }) => (
  <div
    {...rest}
    className={cn('relative overflow-hidden rounded-[30px] text-white shadow-[0_18px_44px_-20px_rgba(16,24,40,0.55)]', className)}
    style={{ backgroundImage: `linear-gradient(145deg, ${accent} 0%, ${mix(accent, deep ? '#0A0A0A' : '#FFFFFF', deep ? 0.32 : 0.12)} 100%)` }}
  >
    <div className="pointer-events-none absolute -right-12 -top-16 h-48 w-48 rounded-full bg-white/25 blur-2xl" />
    <div className="pointer-events-none absolute -left-10 bottom-0 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
    <div className="relative">{children}</div>
  </div>
);

export const Surface: React.FC<React.HTMLAttributes<HTMLDivElement> & { tone?: 'white' | 'cream' | 'dark'; interactive?: boolean }> = ({
  tone = 'white', interactive, className, children, ...rest
}) => (
  <div
    {...rest}
    className={cn(
      'rounded-[30px] border',
      tone === 'white' && 'border-ink-950/[0.06] bg-white/80 backdrop-blur-sm',
      tone === 'cream' && 'border-ink-950/[0.06] bg-cream-100',
      tone === 'dark' && 'border-white/10 bg-ink-950 text-cream-50',
      interactive && 'transition-transform duration-200 active:scale-[0.985]',
      className,
    )}
  >
    {children}
  </div>
);

/* --- type --- */
export const SectionLabel: React.FC<React.HTMLAttributes<HTMLSpanElement> & { onDark?: boolean }> = ({ className, children, onDark, ...rest }) => (
  <span {...rest} className={cn('font-mono text-[10px] font-bold uppercase tracking-[0.16em]', onDark ? 'text-white/60' : 'text-ink-400', className)}>
    {children}
  </span>
);

export const Display: React.FC<React.HTMLAttributes<HTMLHeadingElement> & { as?: 'h1' | 'h2' | 'h3'; onDark?: boolean }> = ({ className, children, as = 'h2', onDark, ...rest }) => {
  const Tag = as;
  return (
    <Tag {...rest} className={cn('font-display font-bold tracking-tight', as === 'h1' ? 'text-2xl' : as === 'h2' ? 'text-xl' : 'text-base', onDark ? 'text-white' : 'text-ink-900', className)}>
      {children}
    </Tag>
  );
};

export const BigNumber: React.FC<{ value: React.ReactNode; unit?: string; label?: string; onDark?: boolean; className?: string }> = ({ value, unit, label, onDark, className }) => (
  <div className={className}>
    <div className="flex items-end gap-2">
      <span className={cn('font-display font-bold leading-[0.9] tracking-tighter', onDark ? 'text-white' : 'text-ink-900')} style={{ fontSize: 'clamp(2.75rem, 14vw, 4rem)' }}>
        {value}
      </span>
      {unit && <span className={cn('mb-1.5 text-sm font-semibold', onDark ? 'text-white/70' : 'text-ink-400')}>{unit}</span>}
    </div>
    {label && <SectionLabel onDark={onDark} className="mt-1 block">{label}</SectionLabel>}
  </div>
);

/* --- controls --- */
type ButtonVariant = 'primary' | 'glass' | 'ghost' | 'dark';
export const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: ButtonVariant; accent?: string; block?: boolean; loading?: boolean }> = ({
  variant = 'primary', accent, block, loading, className, children, disabled, style, ...rest
}) => {
  const base = 'inline-flex items-center justify-center gap-2 rounded-full text-sm font-bold transition-all active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100';
  const pad = 'px-5 py-3';
  const variants: Record<ButtonVariant, string> = {
    primary: 'text-white shadow-[0_10px_24px_-12px_rgba(16,24,40,0.6)]',
    glass: 'border border-white/60 bg-white/60 text-ink-800 backdrop-blur-md',
    ghost: 'border border-ink-950/10 bg-white/70 text-ink-700',
    dark: 'bg-ink-950 text-cream-50',
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

export const PillTabs = <T extends string>({ tabs, value, onChange, accent }: { tabs: { key: T; label: string }[]; value: T; onChange: (v: T) => void; accent: string }) => (
  <div className="flex gap-1 rounded-full border border-white/60 bg-white/50 p-1 backdrop-blur-md">
    {tabs.map((t) => (
      <button
        key={t.key}
        onClick={() => onChange(t.key)}
        className={cn('flex-1 rounded-full px-3 py-2 text-xs font-bold transition-colors', value === t.key ? 'text-white shadow-sm' : 'text-ink-500')}
        style={value === t.key ? { backgroundColor: accent } : undefined}
      >
        {t.label}
      </button>
    ))}
  </div>
);

type ChipTone = 'neutral' | 'leaf' | 'sun' | 'blush' | 'mist' | 'dark' | 'glass';
const CHIP: Record<ChipTone, string> = {
  neutral: 'bg-ink-950/[0.06] text-ink-600',
  leaf: 'bg-leaf-soft text-leaf-deep',
  sun: 'bg-sun-soft text-sun-deep',
  blush: 'bg-blush-soft text-blush-deep',
  mist: 'bg-mist-soft text-mist-deep',
  dark: 'bg-ink-950 text-cream-50',
  glass: 'border border-white/50 bg-white/25 text-white backdrop-blur-md',
};
export const Chip: React.FC<{ tone?: ChipTone; className?: string; children: React.ReactNode }> = ({ tone = 'neutral', className, children }) => (
  <span className={cn('inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.1em]', CHIP[tone], className)}>{children}</span>
);

/* --- progress --- */
export const ProgressRing: React.FC<{ value: number; size?: number; stroke?: number; accent?: string; track?: string; children?: React.ReactNode }> = ({
  value, size = 120, stroke = 10, accent = '#0F766E', track = 'rgba(255,255,255,0.35)', children,
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

/* --- day strip (reference: horizontal week picker with dots) --- */
export const DayStrip: React.FC<{ accent: string; markedDays?: Set<number> }> = ({ accent, markedDays }) => {
  const today = new Date();
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    return d;
  });
  return (
    <div className="flex items-center justify-between gap-1">
      {days.map((d, i) => {
        const active = i === 0;
        const marked = markedDays?.has(d.getDate());
        return (
          <div key={i} className="flex flex-1 flex-col items-center gap-1.5">
            <span className={cn('font-mono text-[9px] font-bold uppercase tracking-wider', active ? 'text-white/80' : 'text-white/50')}>
              {d.toLocaleDateString('en-US', { weekday: 'narrow' })}
            </span>
            <span
              className={cn('flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold', active && 'ring-2 ring-white/40')}
              style={active ? { backgroundColor: 'rgba(255,255,255,0.22)', color: '#fff' } : { color: 'rgba(255,255,255,0.85)' }}
            >
              {d.getDate()}
            </span>
            <span className={cn('h-1.5 w-1.5 rounded-full', marked ? 'bg-white' : 'bg-white/0')} />
          </div>
        );
      })}
    </div>
  );
};

/* --- list + misc --- */
export const ListRow: React.FC<{ icon?: React.ReactNode; title: string; sub?: string; right?: React.ReactNode; onClick?: () => void }> = ({ icon, title, sub, right, onClick }) => {
  const Comp: any = onClick ? 'button' : 'div';
  return (
    <Comp onClick={onClick} className={cn('flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left', onClick && 'transition-colors hover:bg-white/50')}>
      {icon && <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white/60 text-ink-500">{icon}</span>}
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

export const Skeleton: React.FC<{ className?: string }> = ({ className }) => (
  <div className={cn('animate-pulse rounded-2xl bg-white/50', className)} />
);

export const EmptyState: React.FC<{ icon?: React.ReactNode; title: string; hint?: string; action?: React.ReactNode }> = ({ icon, title, hint, action }) => (
  <div className="flex flex-col items-center justify-center px-6 py-10 text-center">
    {icon && <div className="mb-3 text-ink-300">{icon}</div>}
    <p className="font-display text-base font-bold text-ink-700">{title}</p>
    {hint && <p className="mt-1 max-w-[16rem] text-sm text-ink-400">{hint}</p>}
    {action && <div className="mt-4">{action}</div>}
  </div>
);

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
            className="w-full max-w-md rounded-t-[34px] border-t border-white/50 bg-white/85 p-5 pb-8 backdrop-blur-2xl"
            initial={reduce ? { opacity: 0 } : { y: '100%' }}
            animate={reduce ? { opacity: 1 } : { y: 0 }}
            exit={reduce ? { opacity: 0 } : { y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 320 }}
          >
            <div className="mx-auto mb-4 h-1.5 w-10 rounded-full bg-ink-950/15" />
            <div className="mb-4 flex items-center justify-between">
              {title ? <Display as="h2">{title}</Display> : <span />}
              <button onClick={onClose} aria-label="Close" className="flex h-9 w-9 items-center justify-center rounded-full border border-ink-950/10 bg-white/70 text-ink-500">
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

/* --- helpers --- */
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
  if (days > 1) return `In ${days} days`;
  return target.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
};

export const daysUntil = (iso: string) => {
  const target = new Date(iso);
  const now = new Date();
  const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
  return Math.round((startOfDay(target) - startOfDay(now)) / 86400000);
};
