/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        luxury: {
          950: '#070708',
          900: '#0f0f11',
          850: '#151518',
          800: '#1e1e24',
          700: '#2d2d35',
          600: '#484855',
          400: '#8b8b9e',
          300: '#b4b4c4',
          200: '#dedee6',
          100: '#f3f3f6',
          50: '#fafafb',
        },
        gold: {
          300: '#f3dfa2',
          400: '#e5c07b',
          500: '#d4af37',
          600: '#b89628',
          700: '#94781d',
        },
        champagne: {
          50: '#fbf9f4',
          100: '#f6f1e6',
          200: '#ebe0cb',
          300: '#dccea8',
        },
        rosewood: '#9c4146',
        editorial: '#111111',
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        cinzel: ['Cinzel', 'serif'],
        cormorant: ['"Cormorant Garamond"', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'Inter', 'sans-serif'],
      },
      letterSpacing: {
        'luxury': '0.25em',
        'ultra-wide': '0.35em',
      },
      boxShadow: {
        'glow-gold': '0 0 25px -5px rgba(212, 175, 55, 0.25)',
        'editorial': '0 20px 40px -15px rgba(0, 0, 0, 0.12)',
        'luxury-card': '0 10px 30px -10px rgba(0, 0, 0, 0.08), 0 0 1px 1px rgba(0,0,0,0.04)',
      }
    },
  },
  plugins: [],
}
