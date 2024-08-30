/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: "#4B40EE",
        secondary: "#1A243A",
        secondaryDark: "#4B40EE",
        tertiary: "#6F7177",
        success: "#67BF6B",
        error: "#E74C3C",
        gray50: "#EFF1F3",
        darkGray: "#1f1f1f",
        gray100: "#E6E8EB",
        gray200: "#BDBEBF",
        textLight: "#6F7177",
        textDark: "#EFF1F3",
        mainBg: {
          dark: "#1E1E1E",
          light: "#FFFFFF"
        },
        appbg: {
          dark: "#404040",
          light: "#EFF1F3"
        }
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