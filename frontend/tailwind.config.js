/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#E05A10", // Heritage Orange
        secondary: "#1E1B4B", // Deep Indigo
        background: "#FFFFFF",
        surface: "#FCFBF9",
      }
    },
  },
  plugins: [],
}
