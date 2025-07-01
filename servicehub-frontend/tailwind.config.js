/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      animation: {
        blueBackground: 'blueBackground 5s ease infinite',
      },
      keyframes: {
        blueBackground: {
          '0%, 100%': { backgroundColor: '#3b82f6' }, // Blue-500
          '50%': { backgroundColor: '#1e40af' }, // Blue-900
        },
      },
    },
  },
  plugins: [],
}

