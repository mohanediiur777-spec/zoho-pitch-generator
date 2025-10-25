/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        zohoRed: '#E42527',
        zohoDark: '#1A1A1A',
        zohoGold: '#FFB81C',
        zohoGray: '#F5F5F5'
      }
    },
  },
  plugins: [],
}
