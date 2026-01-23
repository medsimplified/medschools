// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}', // If using app router
    './pages/**/*.{js,ts,jsx,tsx,mdx}', // If using pages router
    './components/**/*.{js,ts,jsx,tsx,mdx}', // Your components
    './src/**/*.{js,ts,jsx,tsx,mdx}', // If you have a src directory
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};