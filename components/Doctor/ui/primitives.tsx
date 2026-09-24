import React from 'react';

export const cn = (...parts: (string | false | null | undefined)[]) => parts.filter(Boolean).join(' ');

/* ------------------------------------------------------------------ *
 * Card — the single surface primitive. Colour carries meaning:
 * sun = time / attention, blush = needs you now, leaf = healthy,
 * mist = money, neutral = plain data, dark = the one anchor block.
 * ------------------------------------------------------------------ */
type Tone = 'neutral' | 'white' | 'sun' | 'blush' | 'leaf' | 'mist' | 'dark';

const TONE: Record<Tone, string> = {
  neutral: 'bg-cream-100 text-ink-900 border-ink-950/5',
  white: 'bg-white text-ink-900 border-ink-950/5',
  sun: 'bg-sun text-ink-900 border-ink-950/5',
  blush: 'bg-blush text-ink-900 border-ink-950/5',
  leaf: 'bg-leaf text-ink-900 border-ink-950/5',
  mist: 'bg-mist text-ink-900 border-ink-950/5',
  dark: 'bg-ink-950 text-cream-50 border-white/10',
};

export const Card: React.FC<
  React.HTMLAttributes<HTMLDivElement> & { tone?: Tone; padded?: boolean; interactive?: boolean }
> = ({ tone = 'neutral', padded = true, interactive = false, className, children, ...rest }) => (
  <div
    {...rest}
    className={cn(
      'rounded-[22px] border',
      TONE[tone],
      padded && 'p-5',
      interactive && 'transition-transform duration-200 hover:-translate-y-0.5 cursor-pointer',
      className,
    )}
  >
    {children}
  </div>
);

/* Small caps label used everywhere for metadata */
export const Label: React.FC<React.HTMLAttributes<HTMLSpanElement> & { onDark?: boolean }> = ({
  className,
  children,
  onDark,
  ...rest
}) => (
  <span
    {...rest}
    className={cn(
      'font-mono text-[10px] uppercase tracking-[0.14em]',
      onDark ? 'text-cream-50/50' : 'text-ink-500',
      className,
    )}
  >
    {children}
  </span>
);

/* Big number + label */
export const Stat: React.FC<{
  value: React.ReactNode;
  label: string;
  sub?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
  onDark?: boolean;
}> = ({ value, label, sub, size = 'md', onDark }) => (
  <div>
    <Label onDark={onDark}>{label}</Label>
    <div
      className={cn(
        'font-display font-bold tracking-tight leading-none mt-2',
        size === 'lg' ? 'text-5xl' : size === 'sm' ? 'text-2xl' : 'text-3xl',
        onDark ? 'text-cream-50' : 'text-ink-900',
      )}
    >
      {value}
    </div>
    {sub && <div className={cn('mt-2 text-xs font-medium', onDark ? 'text-cream-50/60' : 'text-ink-500')}>{sub}</div>}
  </div>
);

/* Status pill */
type PillTone = 'neutral' | 'leaf' | 'sun' | 'blush' | 'mist' | 'dark' | 'brand';
const PILL: Record<PillTone, string> = {
  neutral: 'bg-ink-950/[0.06] text-ink-700',
  leaf: 'bg-leaf-soft text-leaf-deep',
  sun: 'bg-sun-soft text-sun-deep',
  blush: 'bg-blush-soft text-blush-deep',
  mist: 'bg-mist-soft text-mist-deep',
  dark: 'bg-ink-950 text-cream-50',
  brand: 'text-white',
};

export const Pill: React.FC<{
  tone?: PillTone;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}> = ({ tone = 'neutral', children, className, style }) => (
  <span
    style={style}
    className={cn(
      'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.1em] font-bold',
      PILL[tone],
      className,
    )}
  >
    {children}
  </span>
);

/* Icon chip */
export const IconChip: React.FC<{
  children: React.ReactNode;
  tone?: Tone;
  size?: 'sm' | 'md';
  className?: string;
}> = ({ children, tone = 'neutral', size = 'md', className }) => (
  <span
    className={cn(
      'inline-flex shrink-0 items-center justify-center rounded-[14px] border',
      TONE[tone],
      size === 'sm' ? 'h-8 w-8' : 'h-10 w-10',
      className,
    )}
  >
    {children}
  </span>
);

/* Multi-segment bar (like the reference's system scores) */
export const SegmentBar: React.FC<{
  value: number; // 0..1
  tone?: 'leaf' | 'sun' | 'blush' | 'mist' | 'brand';
  segments?: number;
  className?: string;
}> = ({ value, tone = 'brand', segments = 1, className }) => {
  const fill =
    tone === 'leaf' ? 'bg-leaf-deep' : tone === 'sun' ? 'bg-sun-deep' : tone === 'blush' ? 'bg-blush-deep' : tone === 'mist' ? 'bg-mist-deep' : 'bg-primary';
  return (
    <div className={cn('flex gap-1', className)}>
      {Array.from({ length: segments }).map((_, i) => {
        const start = i / segments;
        const local = Math.max(0, Math.min(1, (value - start) * segments));
        return (
          <div key={i} className="h-1.5 flex-1 overflow-hidden rounded-full bg-ink-950/[0.08]">
            <div className={cn('h-full rounded-full transition-all duration-700', fill)} style={{ width: `${local * 100}%` }} />
          </div>
        );
      })}
    </div>
  );
};

/* Section header */
export const SectionHeader: React.FC<{
  title: string;
  eyebrow?: string;
  action?: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
}> = ({ title, eyebrow, action, icon, className }) => (
  <div className={cn('flex items-end justify-between gap-4', className)}>
    <div>
      {eyebrow && <Label>{eyebrow}</Label>}
      <h2 className="mt-1 flex items-center gap-2 font-display text-xl font-bold tracking-tight text-ink-900">
        {icon && <span className="text-ink-400">{icon}</span>}
        {title}
      </h2>
    </div>
    {action}
  </div>
);

/* Avatar with initials */
export const Avatar: React.FC<{ name: string; tone?: Tone; className?: string }> = ({ name, tone = 'neutral', className }) => {
  const initials = (name || '?')
    .split(' ')
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase();
  return (
    <span className={cn('inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border font-display text-xs font-bold', TONE[tone], className)}>
      {initials}
    </span>
  );
};

/* Empty state */
export const Empty: React.FC<{ title: string; hint?: string; icon?: React.ReactNode }> = ({ title, hint, icon }) => (
  <div className="flex flex-col items-center justify-center py-10 text-center">
    {icon && <div className="mb-3 text-ink-300">{icon}</div>}
    <p className="font-display text-sm font-semibold text-ink-600">{title}</p>
    {hint && <p className="mt-1 text-xs text-ink-400">{hint}</p>}
  </div>
);
