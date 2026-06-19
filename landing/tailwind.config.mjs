/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        ink: {
          950: '#0F0712',
          900: '#170B1C',
          800: '#211029',
          border: '#3A2640',
        },
        violet: {
          200: '#D9CCFF',
          400: '#A78BFA',
          600: '#7C5CFF',
          glow: 'rgba(124,92,255,0.35)',
        },
        paper: {
          50: '#FAF8F3',
          0: '#FFFFFF',
          line: '#E8E3D9',
        },
        text: {
          900: '#16131A',
          600: '#57515E',
        },
        'text-onDark': {
          100: '#F5F2FA',
          500: '#9C93A8',
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        serif: ['Newsreader', 'Georgia', 'ui-serif', 'serif'],
      },
    },
  },
  plugins: [],
};
