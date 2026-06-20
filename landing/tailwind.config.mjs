/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        ink: {
          950: '#08060A',
          900: '#0F0D14',
          800: '#1A1625',
          border: '#2A2440',
        },
        violet: {
          200: '#C7D2FE',
          400: '#818CF8',
          600: '#6366F1',
          glow: 'rgba(99,102,241,0.25)',
        },
        emerald: {
          400: '#34D399',
          500: '#10B981',
          600: '#059669',
        },
        paper: {
          50: '#F5F3FF',
          0: '#FFFFFF',
          line: '#E6E0F0',
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
      },
      boxShadow: {
        'soft': '0 2px 8px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.06)',
        'card': '0 4px 16px rgba(0,0,0,0.12), 0 1px 4px rgba(0,0,0,0.08)',
        'glow': '0 0 24px rgba(99,102,241,0.25)',
      },
    },
  },
  plugins: [],
};
