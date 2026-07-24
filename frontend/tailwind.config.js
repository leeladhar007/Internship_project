/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          lavender: '#A78BFA',
          sky: '#38BDF8',
          mint: '#6EE7B7',
        },
      },
      backgroundImage: {
        'pastel-gradient': 'linear-gradient(135deg, #A78BFA, #38BDF8, #6EE7B7)',
      },
      boxShadow: {
        glow: '0 0 20px rgba(167,139,250,0.35)',
        'glow-lg': '0 0 40px rgba(167,139,250,0.45)',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
    },
  },
  plugins: [],
}