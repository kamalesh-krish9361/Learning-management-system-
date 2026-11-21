/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f5f3ff',
          100: '#ede9fe',
          200: '#ddd6fe',
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#7c3aed',
          700: '#6d28d9',
          800: '#5b21b6',
          900: '#4c1d95',
        },
        accent: {
          amber: '#f59e0b',
          orange: '#ea580c',
          sunset: '#f97316',
          purple: '#9333ea',
          violet: '#7c3aed',
          cyan: '#06b6d4',
          emerald: '#10b981',
          rose: '#f43f5e'
        },
        surface: {
          50: '#f8fafc',
          100: '#f1f5f9',
          800: '#1e1b4b',
          900: '#0f111a',
          950: '#090a10',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'glow-violet': '0 0 25px -5px rgba(139, 92, 246, 0.35)',
        'glow-orange': '0 0 25px -5px rgba(249, 115, 22, 0.35)',
        'glow-cyan': '0 0 25px -5px rgba(6, 182, 212, 0.35)',
        'card-hover': '0 20px 30px -10px rgba(0, 0, 0, 0.1)',
      }
    },
  },
  plugins: [],
}
