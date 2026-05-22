/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx,js,jsx,html}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  '#f3f7ee',
          100: '#e2ecd3',
          200: '#c5d9a8',
          300: '#a0c074',
          400: '#7ea54a',
          500: '#62893a',
          600: '#4a6c2c',
          700: '#3a5524',
          800: '#2d4220',
          900: '#26361d',
        },
        ember: {
          500: '#e0651b',
          600: '#c2521a',
          700: '#9a3f15',
        },
        ink: {
          900: '#0e1410',
          800: '#161f18',
          700: '#1f2c22',
        },
      },
      fontFamily: {
        display: ['"Oswald"', 'system-ui', 'sans-serif'],
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 6px 24px -8px rgba(0,0,0,0.35)',
      },
    },
  },
  plugins: [],
};
