/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Modern Design System - Electric Blue Accent
        background: '#FAFAFA',
        foreground: '#0F172A',
        muted: '#F1F5F9',
        'muted-foreground': '#64748B',
        accent: {
          DEFAULT: '#0052FF',
          secondary: '#4D7CFF',
          foreground: '#FFFFFF',
        },
        border: '#E2E8F0',
        card: '#FFFFFF',
        ring: '#0052FF',

        // Primary colors updated to Electric Blue
        primary: {
          DEFAULT: '#0052FF',
          dark: '#0041CC',
          light: '#4D7CFF',
        },
        bp: {
          teal: '#0052FF',
          'teal-dark': '#0041CC',
          cyan: '#4D7CFF',
          'sky-blue': '#4D7CFF',
          'grey-light': '#F5F5F5',
          'grey-medium': '#E0E0E0',
          'grey-dark': '#424242',
          black: '#212121',
        }
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
        display: ['Calistoga', 'Georgia', 'serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      spacing: {
        'xs': '8px',
        'sm': '16px',
        'md': '24px',
        'lg': '48px',
        'xl': '72px',
        'xxl': '120px',
      },
      borderRadius: {
        'bp': '2px',
        'pill': '50px',
      },
      boxShadow: {
        'sm': '0 1px 3px rgba(0,0,0,0.06)',
        'md': '0 4px 6px rgba(0,0,0,0.07)',
        'lg': '0 10px 15px rgba(0,0,0,0.08)',
        'xl': '0 20px 25px rgba(0,0,0,0.1)',
        'accent': '0 4px 14px rgba(0,82,255,0.25)',
        'accent-lg': '0 8px 24px rgba(0,82,255,0.35)',
      },
    },
  },
  plugins: [],
}
