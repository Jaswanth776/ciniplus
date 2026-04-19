/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'cinema-bg': '#0f172a',    // slate-900
        'cinema-card': '#1e293b',  // slate-800
        'cinema-primary': '#6366f1', // indigo-500
        'cinema-accent': '#a855f7',  // purple-500
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
