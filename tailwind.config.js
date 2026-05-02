/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: { sans: ['Inter', 'sans-serif'] },
      colors: {
        brand: {
          navy: '#003399',
          blue: '#0066FF',
          light: '#E6F0FF'
        }
      }
    },
  },
  plugins: [],
}
