/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  safelist: [
    // Simon board button colors (prevent purging)
    'bg-red-500',
    'bg-red-600',
    'bg-red-300',
    'bg-blue-500',
    'bg-blue-600',
    'bg-blue-300',
    'bg-yellow-400',
    'bg-yellow-500',
    'bg-yellow-200',
    'bg-green-500',
    'bg-green-600',
    'bg-green-300',
    'hover:bg-red-600',
    'hover:bg-blue-600',
    'hover:bg-yellow-500',
    'hover:bg-green-600',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
