/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Medium-inspired neutrals
        ink: {
          950: '#000000',
          900: '#0d0d0d',
          800: '#1a1a1a',
          700: '#292929',
          600: '#3d3d3d',
          500: '#6b6b6b',
          400: '#9e9e9e',
          300: '#bdbdbd',
          200: '#e0e0e0',
          150: '#f0efeb',
          100: '#f7f7f7',
          50: '#ffffff',
        },
        // ZAIB ATTIRE brand accent — elegant gold kept but more restrained
        brand: {
          DEFAULT: '#1a1a1a',
          accent: '#d4af37',
          light: '#e5c07b',
          muted: '#8a6e1e',
        },
        // Keep legacy aliases for backward compat
        luxury: {
          950: '#0d0d0d',
          900: '#1a1a1a',
          850: '#222222',
          800: '#292929',
          700: '#3d3d3d',
          600: '#6b6b6b',
          400: '#9e9e9e',
          300: '#bdbdbd',
          200: '#e0e0e0',
          100: '#f7f7f7',
          50: '#ffffff',
        },
        gold: {
          300: '#f3dfa2',
          400: '#e5c07b',
          500: '#d4af37',
          600: '#b89628',
          700: '#94781d',
        },
        champagne: {
          50: '#fafafa',
          100: '#f7f7f7',
          200: '#f0f0f0',
          300: '#e0e0e0',
        },
        rosewood: '#1a1a1a',
        editorial: '#1a1a1a',
      },
      fontFamily: {
        // Medium uses Georgia for display, system UI for body
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Inter"', '"DM Sans"', 'system-ui', 'sans-serif'],
        editorial: ['Georgia', '"Playfair Display"', 'serif'],
        cinzel: ['Cinzel', 'serif'],
        cormorant: ['"Cormorant Garamond"', 'serif'],
        body: ['"Source Serif 4"', '"Noto Serif"', 'Georgia', 'serif'],
      },
      letterSpacing: {
        'luxury': '0.05em',
        'ultra-wide': '0.1em',
        'tight': '-0.02em',
      },
      boxShadow: {
        'glow-gold': '0 0 25px -5px rgba(212, 175, 55, 0.15)',
        'editorial': '0 2px 8px rgba(0,0,0,0.08)',
        'luxury-card': '0 1px 4px rgba(0,0,0,0.06)',
        'card-hover': '0 4px 16px rgba(0,0,0,0.12)',
      },
      maxWidth: {
        'reading': '728px',
        'content': '1072px',
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            color: theme('colors.ink.800'),
            fontFamily: theme('fontFamily.body').join(', '),
            lineHeight: '1.8',
            fontSize: '1.1rem',
            'h1,h2,h3,h4': {
              fontFamily: theme('fontFamily.serif').join(', '),
              color: theme('colors.ink.900'),
            },
          },
        },
      }),
    },
  },
  plugins: [],
}
