/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        bison: ['Bison', 'Bebas Neue', 'sans-serif'],
        memphis: ['Memphis', 'Roboto Slab', 'serif'],
      },
    },
  },
  plugins: [],
}