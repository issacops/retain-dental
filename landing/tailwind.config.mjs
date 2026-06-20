/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        ink: {
          950: '#08060A',
          900: '#100A18',
          800: '#1A1028',
          border: '#2E1E40',
        },
        violet: {
          200: '#D9CCFF',
          400: '#A78BFA',
          600: '#7C5CFF',
          glow: 'rgba(124,92,255,0.25)',
        },
        paper: {
          50: '#F8F6F2',
          0: '#FFFFFF',
          line: '#E6E0D6',
        },
        text: {
          900: '#16131A',
          600: '#57515E',
        },
        'text-onDark': {
          100: '#F0EDF5',
          500: '#948BA8',
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        serif: ['Newsreader', 'Georgia', 'ui-serif', 'serif'],
      },
      boxShadow: {
        'soft': '0 2px 8px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.06)',
        'card': '0 4px 16px rgba(0,0,0,0.12), 0 1px 4px rgba(0,0,0,0.08)',
        'glow': '0 0 24px rgba(124,92,255,0.15)',
      },
    },
  },
  plugins: [],
};
