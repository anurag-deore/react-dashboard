/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#4B40EE",
        secondary: "#1A243A",
        tertiary: "#6F7177",
        success: "#67BF6B",
        gray50: "#EFF1F3",
        gray100: "#E6E8EB",
        gray200: "#BDBEBF"
      },
      fontSize: {
        huge: "70px",
        normal: "18px",
      },
      spacing: {
        60: "60px",
        100: "100px",
      }
    },
  },
  plugins: [],
}