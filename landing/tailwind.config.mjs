/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        // Warm, editorial canvas (Lassie-style calm)
        cream: {
          50: '#FBF9F5',
          100: '#F7F4EE',
          200: '#EFEAE1',
          300: '#E3DDCF',
        },
        // Deep teal-ink text
        ink: {
          950: '#0E1A22',
          900: '#12212B',
          800: '#1D2F3A',
          700: '#2C414E',
          600: '#5A6B76',
          500: '#8A98A1',
          400: '#AEB9C0',
          border: '#E3DDCF',
        },
        // Brand teal (matches the logo)
        teal: {
          50: '#ECFDF9',
          100: '#D3F7EE',
          200: '#A6EFDF',
          300: '#5EEAD4',
          400: '#2DD4BF',
          500: '#14B8A6',
          600: '#0D9488',
          700: '#0F766E',
          800: '#115E59',
          900: '#0B4A45',
        },
        // Secondary sky (matches the logo gradient)
        sky: {
          100: '#E0F2FE',
          300: '#7DD3FC',
          400: '#38BDF8',
          500: '#0EA5E9',
          600: '#0284C7',
        },
        // Warm accent, used sparingly
        amber: {
          100: '#FEF3E2',
          400: '#F0A860',
          500: '#E8873A',
          600: '#D97706',
        },

        /* ---- Legacy aliases (kept so existing pages adopt the new palette) ---- */
        // Old "violet" was actually amber; now maps to brand teal.
        violet: {
          200: '#A6EFDF',
          400: '#2DD4BF',
          600: '#0D9488',
          glow: 'rgba(13,148,136,0.25)',
        },
        // Old "dark-blue" was actually brown; now maps to ink.
        'dark-blue': {
          DEFAULT: '#12212B',
          50: '#F7F4EE',
          100: '#EFEAE1',
          200: '#E3DDCF',
          300: '#AEB9C0',
          400: '#8A98A1',
          500: '#5A6B76',
          600: '#2C414E',
          700: '#1D2F3A',
          800: '#12212B',
          900: '#0E1A22',
        },
        beige: '#EFEAE1',
        paper: { 50: '#FBF9F5', line: '#E3DDCF' },
        text: { 900: '#12212B', 600: '#5A6B76' },
        emerald: {
          400: '#34D399',
          500: '#10B981',
          600: '#059669',
        },
      },
      fontFamily: {
        heading: ['Geist', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        sans: ['Geist', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['"Geist Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      boxShadow: {
        soft: '0 2px 8px rgba(18,33,43,0.05), 0 1px 2px rgba(18,33,43,0.04)',
        card: '0 12px 32px -12px rgba(18,33,43,0.16), 0 2px 8px -4px rgba(18,33,43,0.08)',
        lift: '0 40px 80px -32px rgba(18,33,43,0.32)',
        ring: '0 0 0 1px rgba(18,33,43,0.06)',
        layer: '0 35px 60px -15px rgba(18,33,43,0.28)',
        glow: '0 0 24px rgba(13,148,136,0.25)',
      },
      maxWidth: {
        '8xl': '88rem',
      },
    },
  },
  plugins: [],
};
