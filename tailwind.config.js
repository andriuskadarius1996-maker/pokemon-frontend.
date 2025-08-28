/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html","./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: { bg:"#0b1220", card:"#111a2e", accent:"#00ffa3" },
      boxShadow: { soft:"0 8px 30px rgba(0,0,0,0.35)" }
    },
  },
  plugins: [],
};