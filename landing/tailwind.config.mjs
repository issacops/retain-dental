/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        ink: {
          950: '#1C0F08',
          900: '#2C1810',
          800: '#4A3728',
          border: '#6B5848',
        },
        'dark-blue': {
          DEFAULT: '#4A3728',
          50: '#F5EDE0',
          100: '#EDE3D3',
          200: '#D4C4B0',
          300: '#B8A08C',
          400: '#8B7355',
          500: '#4A3728',
          600: '#3D2E1E',
          700: '#2C1810',
          800: '#1A0F0A',
          900: '#0F0805',
        },
        beige: '#F8F3EA',
        violet: {
          200: '#FDE68A',
          400: '#FBBF24',
          600: '#D97706',
          glow: 'rgba(217,119,6,0.25)',
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
        'glow': '0 0 24px rgba(217,119,6,0.25)',
      },
    },
  },
  plugins: [],
};
