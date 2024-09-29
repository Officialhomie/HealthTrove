module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}', // Adjust this based on your file structure
  ],
  darkMode: ['class'], 
  safelist: ['dark'], 
  safelist: [
    'bg-red-500',
    'bg-red-600',
    'bg-indigo-500',
    'hover:bg-indigo-700',
    'text-white',
    'font-bold',
    'py-3',
    'px-6',
    'rounded-lg',
    'shadow-md',
    'transition',
    'duration-300',
    'ease-in-out',
    'transform',
    'hover:scale-105',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};