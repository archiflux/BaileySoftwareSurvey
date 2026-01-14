/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Bailey Partnership Brand Colors
        primary: {
          DEFAULT: '#00838F',  // Main brand teal
          dark: '#006064',     // Darker teal for headers
          light: '#00BCD4',    // Lighter cyan for highlights
        },
        accent: {
          DEFAULT: '#03A9F4',  // Sky blue for overlays
        },
        bp: {
          teal: '#00838F',
          'teal-dark': '#006064',
          cyan: '#00BCD4',
          'sky-blue': '#03A9F4',
          'grey-light': '#F5F5F5',
          'grey-medium': '#E0E0E0',
          'grey-dark': '#424242',
          black: '#212121',
        }
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
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
    },
  },
  plugins: [],
}
