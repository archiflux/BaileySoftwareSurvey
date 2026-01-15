/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Modern Design System - Bailey Teal Accent
        background: '#FAFAFA',
        foreground: '#0F172A',
        muted: '#F1F5F9',
        'muted-foreground': '#64748B',
        accent: {
          DEFAULT: '#1e6c93',
          secondary: '#2a8ab8',
          foreground: '#FFFFFF',
        },
        border: '#E2E8F0',
        card: '#FFFFFF',
        ring: '#1e6c93',

        // Primary colors - Bailey Teal
        primary: {
          DEFAULT: '#1e6c93',
          dark: '#165573',
          light: '#2a8ab8',
        },
        bp: {
          teal: '#1e6c93',
          'teal-dark': '#165573',
          'teal-light': '#2a8ab8',
          cyan: '#3aa0cc',
          'sky-blue': '#5bb8db',
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
        'accent': '0 4px 14px rgba(30,108,147,0.25)',
        'accent-lg': '0 8px 24px rgba(30,108,147,0.35)',
      },
    },
  },
  plugins: [],
}
