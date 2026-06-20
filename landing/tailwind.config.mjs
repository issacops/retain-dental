/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        ink: {
          950: '#06222F',
          900: '#072a3b',
          800: '#0a3347',
          border: '#1a4a5e',
        },
        'dark-blue': {
          DEFAULT: '#072a3b',
          50: '#e6f0f3',
          100: '#cddbe2',
          200: '#9bb7c5',
          300: '#6993a8',
          400: '#376f8b',
          500: '#072a3b',
          600: '#06222f',
          700: '#051a23',
          800: '#031117',
          900: '#02090c',
        },
        beige: '#fafaf5',
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
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'layer': '0 35px 60px -15px rgba(0,0,0,0.3)',
        'soft': '0 2px 8px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.06)',
        'card': '0 4px 16px rgba(0,0,0,0.12), 0 1px 4px rgba(0,0,0,0.08)',
        'glow': '0 0 24px rgba(99,102,241,0.25)',
      },
    },
  },
  plugins: [],
};
