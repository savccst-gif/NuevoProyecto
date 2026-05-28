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
        },
        spark: {
          cyan: '#06B6D4',
          violet: '#8B5CF6',
          glass: 'rgba(255, 255, 255, 0.7)',
        }
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'pulse-glow': {
          '0%, 100%': { 
            opacity: 1, 
            boxShadow: '0 0 15px 2px rgba(6, 182, 212, 0.4)' 
          },
          '50%': { 
            opacity: .8, 
            boxShadow: '0 0 25px 5px rgba(139, 92, 246, 0.6)' 
          },
        }
      }

    },
  },
  plugins: [],
}
