/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                primary: {
                    50: '#f0f9ff',
                    100: '#e0f2fe',
                    200: '#bae6fd',
                    300: '#7dd3fc',
                    400: '#38bdf8',
                    500: '#0ea5e9',
                    600: '#0284c7',
                    700: '#0369a1',
                    800: '#075985',
                    900: '#0c3d66',
                },
                accent: {
                    50: '#faf5ff',
                    100: '#f3e8ff',
                    200: '#e9d5ff',
                    300: '#d8b4fe',
                    400: '#c084fc',
                    500: '#a855f7',
                    600: '#9333ea',
                    700: '#7e22ce',
                    800: '#6b21a8',
                    900: '#581c87',
                },
            },
            fontFamily: {
                sans: [
                    'Inter',
                    'ui-sans-serif',
                    'system-ui',
                    'sans-serif',
                    'Apple Color Emoji',
                    'Segoe UI Emoji',
                    'Segoe UI Symbol',
                    'Noto Color Emoji',
                ],
            },
            animation: {
                'fade-in': 'fadeIn 0.3s ease-in-out',
                'slide-up': 'slideUp 0.3s ease-out',
                'slide-down': 'slideDown 0.3s ease-out',
                'pulse-soft': 'pulseSoft 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'bounce-soft': 'bounceSoft 1.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) infinite',
            },
            keyframes: {
                fadeIn: {
                    '0%': {opacity: '0'},
                    '100%': {opacity: '1'},
                },
                slideUp: {
                    '0%': {transform: 'translateY(10px)', opacity: '0'},
                    '100%': {transform: 'translateY(0)', opacity: '1'},
                },
                slideDown: {
                    '0%': {transform: 'translateY(-10px)', opacity: '0'},
                    '100%': {transform: 'translateY(0)', opacity: '1'},
                },
                pulseSoft: {
                    '0%, 100%': {opacity: '1'},
                    '50%': {opacity: '0.5'},
                },
                bounceSoft: {
                    '0%, 100%': {transform: 'translateY(0)'},
                    '50%': {transform: 'translateY(-4px)'},
                },
            },
            backdropBlur: {
                xs: '2px',
            },
            boxShadow: {
                'soft-sm': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                'soft-md': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                'soft-lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                'soft-xl': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            },
            typography: {
                DEFAULT: {
                    css: {
                        color: 'rgb(var(--color-text))',
                        'code::before': {
                            content: '""',
                        },
                        'code::after': {
                            content: '""',
                        },
                    },
                },
            },
        },
    },
    plugins: [
        require('@tailwindcss/typography'),
    ],
};
