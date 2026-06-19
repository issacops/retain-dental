/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        clay: {
          50: '#F9F5F0',
          100: '#EFE6DC',
          300: '#C9B8A8',
          500: '#8C6F56',
          700: '#5C4633',
          900: '#2B1D14',
        },
        terracotta: {
          100: '#F6E4D8',
          500: '#D97A4D',
          600: '#C1572D',
        },
        sage: {
          100: '#E4ECE2',
          600: '#5C7A5E',
        },
        cream: {
          50: '#FBF7F1',
          0: '#FFFFFF',
        },
        ink: {
          error: '#B4453B',
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['Fraunces', 'Georgia', 'ui-serif', 'serif'],
      },
      borderRadius: {
        sm: '4px',
        DEFAULT: '4px',
      },
    },
  },
  plugins: [],
};
