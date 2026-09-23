export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
        "./components/**/*.{js,ts,jsx,tsx}",
        "./pages/**/*.{js,ts,jsx,tsx}",
        "./App.tsx",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['"Plus Jakarta Sans"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
                display: ['"Space Grotesk"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
                mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
            },
            colors: {
                // Warm canvas
                cream: {
                    50: '#FCFAF4',
                    100: '#F6F1E7',
                    200: '#EFE9DC',
                    300: '#E4DBC7',
                },
                // Near-black anchor
                ink: {
                    950: '#0A0A0A',
                    900: '#121212',
                    800: '#1E1E1E',
                    700: '#333333',
                    600: '#585858',
                    500: '#7A7A7A',
                    400: '#A3A3A3',
                    300: '#C7C7C7',
                },
                // Semantic pastels (information colour, not decoration)
                sun: { DEFAULT: '#F5E27B', soft: '#FBF2C0', deep: '#B39A1F' },
                blush: { DEFAULT: '#F6C9DC', soft: '#FBE4EE', deep: '#B5527E' },
                leaf: { DEFAULT: '#B7CE86', soft: '#DFEAC7', deep: '#5F7A2E' },
                mist: { DEFAULT: '#BBD7EE', soft: '#DFEEF9', deep: '#3E6C93' },

                // Tenant brand accent (kept for pills, charts, active states)
                primary: {
                    DEFAULT: '#0f766e',
                    50: '#f0fdfa',
                    100: '#ccfbf1',
                    200: '#99f6e4',
                    300: '#5eead4',
                    400: '#2dd4bf',
                    500: '#14b8a6',
                    600: '#0d9488',
                    700: '#0f766e',
                    800: '#115e59',
                    900: '#134e4a',
                    950: '#042f2e',
                },
                secondary: {
                    DEFAULT: '#f97316',
                    50: '#fff7ed',
                    100: '#ffedd5',
                    200: '#fed7aa',
                    300: '#fdba74',
                    400: '#fb923c',
                    500: '#f97316',
                    600: '#ea580c',
                    700: '#c2410c',
                    800: '#9a3412',
                    900: '#7c2d12',
                    950: '#431407',
                },
            },
            borderRadius: {
                '4xl': '2rem',
            },
            boxShadow: {
                soft: '0 1px 2px rgba(18,18,18,0.04), 0 8px 24px -16px rgba(18,18,18,0.18)',
                lift: '0 24px 48px -28px rgba(18,18,18,0.28)',
            },
            backgroundImage: {
                'mesh-light': 'radial-gradient(at 0% 0%, rgba(15, 118, 110, 0.10) 0px, transparent 50%), radial-gradient(at 100% 0%, rgba(249, 115, 22, 0.06) 0px, transparent 50%)',
            },
        },
    },
    plugins: [],
}
