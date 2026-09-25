import confetti from 'canvas-confetti';

/** A short, tasteful celebration. Respects reduced-motion. */
export const celebrate = (accent = '#0F766E') => {
  const reduce = typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce) return;
  const colors = [accent, '#F5E27B', '#F6C9DC', '#B7CE86', '#BBD7EE', '#FFFFFF'];
  confetti({ particleCount: 70, spread: 74, startVelocity: 34, origin: { y: 0.72 }, colors, scalar: 0.9, ticks: 140, disableForReducedMotion: true });
  setTimeout(() => confetti({ particleCount: 46, spread: 100, startVelocity: 26, origin: { y: 0.66 }, colors, scalar: 0.75, ticks: 120, disableForReducedMotion: true }), 160);
};
