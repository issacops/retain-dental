import React, { useEffect, useId, useRef, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { X, CalendarDays } from 'lucide-react';
import { cn } from '../Doctor/ui/primitives';

/* ------------------------------------------------------------------ *
 * Patient PWA design system — "Aurora" v2.
 * Mesh gradients, frosted glass with specular highlights, grain
 * texture, gradient buttons with shine, springy motion.
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

/** Soft grain, as a tiny inline SVG turbulence. */
export const NOISE_URL =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.55'/%3E%3C/svg%3E\")";

export const Noise: React.FC<{ opacity?: number; className?: string }> = ({ opacity = 0.035, className }) => (
  <div aria-hidden className={cn('pointer-events-none absolute inset-0 mix-blend-soft-light', className)} style={{ backgroundImage: NOISE_URL, opacity }} />
);

/* --- ambient background --- */
export const Aurora: React.FC<{ accent: string }> = ({ accent }) => (
  <div aria-hidden className="pointer-events-none fixed inset-0 -z-10" style={{ background: '#F2F2F7' }}>
    <div className="absolute inset-x-0 top-0 h-80" style={{ background: `radial-gradient(130% 100% at 50% 0%, ${alpha(accent, 0.16)}, transparent 72%)` }} />
    <div className="absolute inset-0 opacity-[0.4]" style={{ backgroundImage: 'radial-gradient(rgba(60,60,67,0.05) 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
  </div>
);

/* --- surfaces --- */
const GLOW = (hex: string, a = 0.5) => `0 18px 40px -18px ${alpha(hex, a)}`;

export const Glass: React.FC<React.HTMLAttributes<HTMLDivElement> & { interactive?: boolean; tint?: string }> = ({ interactive, tint, className, children, ...rest }) => (
  <div
    {...rest}
    className={cn(
      'relative overflow-hidden rounded-[28px] border border-ink-950/[0.05] bg-white/85 backdrop-blur-xl',
      'shadow-[0_14px_34px_-26px_rgba(16,24,40,0.5)]',
      interactive && 'transition-transform duration-200 active:scale-[0.98]',
      className,
    )}
  >
    {tint && <div aria-hidden className="pointer-events-none absolute inset-0" style={{ background: `linear-gradient(150deg, ${alpha(tint, 0.16)}, transparent 60%)` }} />}
    <div aria-hidden className="pointer-events-none absolute inset-0 rounded-[30px] ring-1 ring-inset ring-white/60" />
    <Noise opacity={0.04} />
    <div className="relative">{children}</div>
  </div>
);

export const GradientCard: React.FC<React.HTMLAttributes<HTMLDivElement> & { accent: string; sheen?: boolean }> = ({ accent, sheen = true, className, children, ...rest }) => {
  const reduce = useReducedMotion();
  return (
    <div
      {...rest}
      className={cn('relative overflow-hidden rounded-[30px] text-white', className)}
      style={{
        backgroundImage: [
          `radial-gradient(120% 120% at 12% 8%, ${alpha('#FFFFFF', 0.28)}, transparent 45%)`,
          `radial-gradient(90% 90% at 90% 100%, ${mix(accent, '#000000', 0.42)}, transparent 55%)`,
          `linear-gradient(145deg, ${accent} 0%, ${mix(accent, '#0A0A0A', 0.3)} 60%, ${mix(accent, '#000000', 0.45)} 100%)`,
        ].join(','),
        boxShadow: `${GLOW(accent, 0.55)}, inset 0 1px 0 rgba(255,255,255,0.35)`,
      }}
    >
      <Noise opacity={0.07} />
      <div aria-hidden className="pointer-events-none absolute inset-0 rounded-[30px] ring-1 ring-inset ring-white/25" />
      {sheen && (
        <motion.div
          aria-hidden
          className="pointer-events-none absolute -inset-y-10 -left-1/3 w-1/3 rotate-12 bg-gradient-to-r from-transparent via-white/25 to-transparent"
          initial={reduce ? false : { x: '-140%', opacity: 0 }}
          animate={reduce ? undefined : { x: ['-140%', '420%'], opacity: [0, 0.9, 0] }}
          transition={{ duration: 3.4, repeat: Infinity, repeatDelay: 4.5, ease: 'easeInOut' }}
        />
      )}
      <div className="relative">{children}</div>
    </div>
  );
};

export const Surface: React.FC<React.HTMLAttributes<HTMLDivElement> & { tone?: 'white' | 'cream' | 'dark'; interactive?: boolean }> = ({
  tone = 'white', interactive, className, children, ...rest
}) => (
  <div
    {...rest}
    className={cn(
      'relative overflow-hidden rounded-[28px] border',
      tone === 'white' && 'border-ink-950/[0.05] bg-white shadow-[0_12px_30px_-24px_rgba(16,24,40,0.5)]',
      tone === 'cream' && 'border-ink-950/[0.06] bg-cream-100',
      tone === 'dark' && 'border-white/10 bg-ink-950 text-cream-50',
      interactive && 'transition-transform duration-200 active:scale-[0.98]',
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

/** Animated numeral that counts up when the value changes. */
export const CountUp: React.FC<{ value: number; className?: string; duration?: number }> = ({ value, className, duration = 0.9 }) => {
  const reduce = useReducedMotion();
  const [display, setDisplay] = useState(reduce ? value : 0);
  const fromRef = useRef(0);
  useEffect(() => {
    if (reduce) { setDisplay(value); return; }
    let raf = 0;
    const from = fromRef.current;
    const start = performance.now();
    const step = (t: number) => {
      const p = Math.min(1, (t - start) / (duration * 1000));
      const eased = 1 - Math.pow(1 - p, 3);
      setDisplay(Math.round(from + (value - from) * eased));
      if (p < 1) raf = requestAnimationFrame(step); else fromRef.current = value;
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [value, duration, reduce]);
  return <span className={className}>{display.toLocaleString('en-IN')}</span>;
};

/* --- controls --- */
type ButtonVariant = 'primary' | 'glass' | 'ghost' | 'dark';
export const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: ButtonVariant; accent?: string; block?: boolean; loading?: boolean }> = ({
  variant = 'primary', accent, block, loading, className, children, disabled, style, ...rest
}) => {
  const primary = variant === 'primary';
  const isDisabled = disabled || loading;
  const variants: Record<ButtonVariant, string> = {
    primary: 'text-white',
    glass: 'border border-white/70 bg-white/60 text-ink-800 backdrop-blur-md',
    ghost: 'border border-ink-950/10 bg-white/70 text-ink-700',
    dark: 'bg-ink-950 text-cream-50',
  };
  return (
    <motion.button
      whileTap={isDisabled ? undefined : { scale: 0.96 }}
      whileHover={isDisabled ? undefined : { y: -1.5 }}
      transition={{ type: 'spring', stiffness: 480, damping: 26 }}
      disabled={isDisabled}
      style={primary ? {
        backgroundImage: `linear-gradient(135deg, ${accent || '#0F766E'} 0%, ${mix(accent || '#0F766E', '#000', 0.32)} 100%)`,
        boxShadow: GLOW(accent || '#0F766E', 0.6),
        ...style,
      } : style}
      className={cn(
        'relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full px-5 py-3 text-sm font-bold transition-opacity disabled:opacity-50',
        variants[variant], block && 'w-full', className,
      )}
      {...(rest as any)}
    >
      {primary && <span aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/30 to-transparent" />}
      <span className="relative flex items-center gap-2">
        {loading && <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/40 border-t-white" />}
        {children}
      </span>
    </motion.button>
  );
};

export const PillTabs = <T extends string>({ tabs, value, onChange, accent }: { tabs: { key: T; label: string }[]; value: T; onChange: (v: T) => void; accent: string }) => (
  <div className="relative flex gap-1 overflow-hidden rounded-full border border-white/70 bg-white/55 p-1 backdrop-blur-md">
    <Noise opacity={0.05} />
    {tabs.map((t) => {
      const active = value === t.key;
      return (
        <button key={t.key} onClick={() => onChange(t.key)} className="relative flex-1 rounded-full px-3 py-2 text-xs font-bold transition-colors" style={{ color: active ? '#fff' : undefined }}>
          {active && (
            <motion.span
              layoutId="pilltabs-active"
              className="absolute inset-0 rounded-full"
              style={{ backgroundImage: `linear-gradient(135deg, ${accent}, ${mix(accent, '#000', 0.28)})`, boxShadow: GLOW(accent, 0.5) }}
              transition={{ type: 'spring', stiffness: 420, damping: 32 }}
            />
          )}
          <span className={cn('relative', !active && 'text-ink-500')}>{t.label}</span>
        </button>
      );
    })}
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
export const ProgressRing: React.FC<{ value: number; size?: number; stroke?: number; accent?: string; track?: string; glow?: boolean; children?: React.ReactNode }> = ({
  value, size = 120, stroke = 10, accent = '#0F766E', track = 'rgba(255,255,255,0.35)', glow, children,
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
          style={glow ? { filter: `drop-shadow(0 0 5px ${alpha(accent, 0.6)})` } : undefined}
          initial={reduce ? false : { strokeDashoffset: c }}
          animate={{ strokeDashoffset: c * (1 - pct) }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">{children}</div>
    </div>
  );
};

/* --- day strip --- */
export const DayStrip: React.FC<{ accent: string; markedDays?: Set<number> }> = ({ accent, markedDays }) => {
  const today = new Date();
  const days = Array.from({ length: 7 }, (_, i) => { const d = new Date(today); d.setDate(today.getDate() + i); return d; });
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
            <span className={cn('flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold', active && 'ring-2 ring-white/40')}
              style={active ? { backgroundColor: 'rgba(255,255,255,0.22)', color: '#fff' } : { color: 'rgba(255,255,255,0.85)' }}>
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
      {icon && <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white/70 text-ink-500 shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]">{icon}</span>}
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-bold text-ink-800">{title}</span>
        {sub && <span className="block truncate text-xs text-ink-400">{sub}</span>}
      </span>
      {right}
    </Comp>
  );
};

export const Avatar: React.FC<{ name: string; accent?: string; size?: number }> = ({ name, accent = '#0F766E', size = 40 }) => (
  <span
    className="flex shrink-0 items-center justify-center rounded-full font-display font-bold text-white ring-1 ring-inset ring-white/40"
    style={{ width: size, height: size, fontSize: size * 0.36, backgroundImage: `linear-gradient(140deg, ${accent}, ${mix(accent, '#000', 0.32)})`, boxShadow: GLOW(accent, 0.5) }}
  >
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
          className="fixed inset-0 z-[80] flex items-end justify-center bg-ink-950/50 backdrop-blur-[3px]"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md overflow-hidden rounded-t-[34px] border-t border-white/60 bg-white/85 p-5 pb-8 backdrop-blur-2xl"
            initial={reduce ? { opacity: 0 } : { y: '100%' }}
            animate={reduce ? { opacity: 1 } : { y: 0 }}
            exit={reduce ? { opacity: 0 } : { y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 320 }}
          >
            <Noise opacity={0.03} />
            <div className="relative">
              <div className="mx-auto mb-4 h-1.5 w-10 rounded-full bg-ink-950/15" />
              <div className="mb-4 flex items-center justify-between">
                {title ? <Display as="h2">{title}</Display> : <span />}
                <button onClick={onClose} aria-label="Close" className="flex h-9 w-9 items-center justify-center rounded-full border border-white/60 bg-white/70 text-ink-500">
                  <X size={16} />
                </button>
              </div>
              {children}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

/* --- motion helpers --- */
export const stagger = (delay = 0.06) => ({
  hidden: {},
  show: { transition: { staggerChildren: delay, delayChildren: 0.05 } },
});
export const rise = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] as const } },
};

/* --- iOS-style bento pieces --- */

export const Segmented = <T extends string>({ options, value, onChange, className }: { options: { key: T; label: string }[]; value: T; onChange: (v: T) => void; className?: string }) => {
  const id = useId();
  return (
    <div className={cn('flex rounded-full bg-ink-950/[0.07] p-1', className)}>
      {options.map((o) => {
        const active = o.key === value;
        return (
          <button key={o.key} onClick={() => onChange(o.key)} className="relative flex-1 rounded-full px-3 py-1.5 text-xs font-bold">
            {active && (
              <motion.span layoutId={`seg-${id}`} className="absolute inset-0 rounded-full bg-white shadow-[0_2px_10px_-2px_rgba(16,24,40,0.28)]"
                transition={{ type: 'spring', stiffness: 420, damping: 32 }} />
            )}
            <span className={cn('relative', active ? 'text-ink-900' : 'text-ink-500')}>{o.label}</span>
          </button>
        );
      })}
    </div>
  );
};

export const WeekStrip: React.FC<{ accent: string; markedDays?: Set<number>; className?: string }> = ({ accent, markedDays, className }) => {
  const today = new Date();
  const days = Array.from({ length: 7 }, (_, i) => { const d = new Date(today); d.setDate(today.getDate() + i); return d; });
  return (
    <div className={cn('flex items-center justify-between', className)}>
      {days.map((d, i) => {
        const active = i === 0;
        const marked = markedDays?.has(d.getDate());
        return (
          <div key={i} className="flex flex-1 flex-col items-center gap-1.5">
            <span className="font-mono text-[9px] font-bold uppercase tracking-wider text-ink-400">{d.toLocaleDateString('en-US', { weekday: 'narrow' })}</span>
            <span className="relative flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold"
              style={active ? { backgroundImage: `linear-gradient(140deg, ${accent}, ${mix(accent, '#000', 0.3)})`, color: '#fff', boxShadow: GLOW(accent, 0.5) } : { color: '#333' }}>
              {d.getDate()}
            </span>
            <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: marked ? accent : 'transparent' }} />
          </div>
        );
      })}
    </div>
  );
};

/** Soft gradient slider (Low ↔ High) — e.g. a daily comfort check-in. */
export const GradientSlider: React.FC<{ value: number; min?: number; max?: number; step?: number; onChange: (v: number) => void; className?: string }> = ({ value, min = 0, max = 10, step = 1, onChange, className }) => (
  <input
    type="range" min={min} max={max} step={step} value={value}
    onChange={(e) => onChange(Number(e.target.value))}
    className={cn('retain-slider w-full', className)}
    aria-label="Comfort level"
  />
);

/** Colour tile with a big icon + label (bento category card). */
export const FeatureCard: React.FC<{ gradient: string; icon: React.ReactNode; label: string; sub?: string; onClick?: () => void; className?: string }> = ({ gradient, icon, label, sub, onClick, className }) => (
  <button onClick={onClick} className={cn('relative overflow-hidden rounded-[28px] p-4 text-left text-white', className)}
    style={{ backgroundImage: gradient, boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.35), 0 18px 36px -20px rgba(16,24,40,0.6)' }}>
    <div aria-hidden className="pointer-events-none absolute inset-0 rounded-[28px] ring-1 ring-inset ring-white/20" />
    <Noise opacity={0.08} />
    <span className="relative flex h-10 w-10 items-center justify-center rounded-2xl bg-white/20 ring-1 ring-inset ring-white/25">{icon}</span>
    <span className="relative mt-6 block font-display text-lg font-bold tracking-tight text-white">{label}</span>
    {sub && <span className="relative mt-0.5 block text-xs font-medium text-white/80">{sub}</span>}
  </button>
);

/* --- iOS bento pieces (light) --- */

/** Inset "well" used inside white cards (reference: the budget slider well). */
export const Well: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, children, ...rest }) => (
  <div {...rest} className={cn('rounded-[22px] bg-ink-950/[0.045] p-4', className)}>{children}</div>
);

export const StatCard: React.FC<{ icon?: React.ReactNode; value: React.ReactNode; unit?: string; label: string; accent?: string; onClick?: () => void; className?: string }> = ({ icon, value, unit, label, accent = '#0F766E', onClick, className }) => {
  const Comp: any = onClick ? 'button' : 'div';
  return (
    <Comp onClick={onClick} className={cn('relative overflow-hidden rounded-[28px] border border-ink-950/[0.05] bg-white p-4 text-left shadow-[0_10px_30px_-22px_rgba(16,24,40,0.4)]', onClick && 'transition-transform active:scale-[0.98]', className)}>
      {icon && (
        <span className="flex h-9 w-9 items-center justify-center rounded-2xl text-white" style={{ backgroundImage: `linear-gradient(140deg, ${accent}, ${mix(accent, '#000', 0.28)})` }}>{icon}</span>
      )}
      <p className="mt-3 flex items-end gap-1 font-display font-bold tracking-tight text-ink-900">
        <span className="text-3xl leading-none">{value}</span>
        {unit && <span className="mb-0.5 text-sm font-semibold text-ink-400">{unit}</span>}
      </p>
      <p className="mt-1 text-xs font-semibold text-ink-500">{label}</p>
    </Comp>
  );
};

/** Gradient slider whose knob is a white pill showing the current value. */
export const PillSlider: React.FC<{ value: number; min?: number; max?: number; step?: number; onChange: (v: number) => void; label: (v: number) => string; className?: string }> = ({ value, min = 0, max = 10, step = 1, onChange, label, className }) => {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div className={cn('relative h-9', className)}>
      <div className="absolute inset-0 rounded-full" style={{ background: 'linear-gradient(90deg,#F6A5C0 0%,#F5E27B 50%,#B7CE86 100%)', boxShadow: 'inset 0 1px 3px rgba(16,24,40,0.18)' }} />
      <div className="absolute top-1/2 flex h-7 -translate-x-1/2 -translate-y-1/2 items-center rounded-full bg-white px-3 text-[11px] font-bold text-ink-800 shadow-[0_6px_16px_-6px_rgba(16,24,40,0.5)]" style={{ left: `calc(${pct}% + ${(50 - pct) * 0.28}px)` }}>
        {label(value)}
      </div>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))}
        className="absolute inset-0 h-full w-full cursor-pointer opacity-0" aria-label="Value" />
    </div>
  );
};

/** Week calendar: big selected day + Mon–Sun strip (reference calendar card). */
export const WeekCalendar: React.FC<{ accent: string; markedDays?: Set<number>; onPick?: (d: Date) => void }> = ({ accent, markedDays, onPick }) => {
  const [selected, setSelected] = useState(() => new Date());
  const monday = new Date(selected);
  const dow = (monday.getDay() + 6) % 7;
  monday.setDate(monday.getDate() - dow);
  const days = Array.from({ length: 7 }, (_, i) => { const d = new Date(monday); d.setDate(monday.getDate() + i); return d; });
  const same = (a: Date, b: Date) => a.toDateString() === b.toDateString();
  const today = new Date();
  return (
    <div>
      <div className="flex items-center justify-between">
        <div className="flex items-baseline gap-3">
          <span className="font-display text-4xl font-bold leading-none tracking-tighter text-ink-900">{selected.getDate()}</span>
          <div>
            <p className="font-display text-base font-bold text-ink-900">{selected.toLocaleDateString('en-US', { weekday: 'long' })}</p>
            <p className="text-xs font-semibold text-ink-400">{selected.toLocaleDateString('en-US', { month: 'long' })}</p>
          </div>
        </div>
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-ink-950 text-cream-50"><CalendarDays size={16} /></span>
      </div>
      <div className="mt-4 flex items-center justify-between">
        {days.map((d, i) => {
          const active = same(d, selected);
          const isToday = same(d, today);
          const marked = markedDays?.has(d.getDate());
          return (
            <button key={i} onClick={() => { setSelected(d); onPick?.(d); }} className="flex flex-1 flex-col items-center gap-1.5">
              <span className="font-mono text-[9px] font-bold uppercase tracking-wider text-ink-400">{d.toLocaleDateString('en-US', { weekday: 'narrow' })}</span>
              <span className="relative flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold"
                style={active ? { backgroundImage: `linear-gradient(140deg, ${accent}, ${mix(accent, '#000', 0.3)})`, color: '#fff' } : isToday ? { backgroundColor: alpha(accent, 0.14), color: accent } : { color: '#3A3A3C' }}>
                {d.getDate()}
              </span>
              <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: marked ? accent : 'transparent' }} />
            </button>
          );
        })}
      </div>
    </div>
  );
};

export const AvatarStack: React.FC<{ names: string[]; accent: string; max?: number; size?: number }> = ({ names, accent, max = 4, size = 34 }) => {
  const shown = names.slice(0, max);
  const extra = names.length - shown.length;
  return (
    <div className="flex items-center">
      {shown.map((n, i) => (
        <span key={i} style={{ marginLeft: i === 0 ? 0 : -10, zIndex: shown.length - i }}>
          <Avatar name={n} accent={i === 0 ? accent : mix(accent, '#7A7A7A', 0.4)} size={size} />
        </span>
      ))}
      {extra > 0 && (
        <span className="flex items-center justify-center rounded-full bg-ink-950 text-[11px] font-bold text-cream-50 ring-2 ring-white" style={{ width: size, height: size, marginLeft: -10 }}>
          +{extra}
        </span>
      )}
    </div>
  );
};

/** Vivid event block (the reference's violet timeline event). */
export const EventCard: React.FC<{ accent: string; eyebrow: string; title: string; meta?: string; people?: string[]; onClick?: () => void }> = ({ accent, eyebrow, title, meta, people, onClick }) => (
  <button onClick={onClick} className="relative w-full overflow-hidden rounded-[26px] p-4 text-left text-white"
    style={{ backgroundImage: `linear-gradient(150deg, ${accent} 0%, ${mix(accent, '#000', 0.4)} 100%)`, boxShadow: `0 22px 44px -22px ${alpha(accent, 0.9)}` }}>
    <div aria-hidden className="pointer-events-none absolute inset-0 rounded-[26px] ring-1 ring-inset ring-white/20" />
    <Noise opacity={0.07} />
    <p className="relative font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-white/75">{eyebrow}</p>
    <p className="relative mt-1 font-display text-lg font-bold tracking-tight">{title}</p>
    {meta && <p className="relative mt-0.5 text-xs font-medium text-white/75">{meta}</p>}
    {people && people.length > 0 && <div className="relative mt-3"><AvatarStack names={people} accent={mix(accent, '#FFFFFF', 0.2)} size={28} max={3} /></div>}
  </button>
);

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
