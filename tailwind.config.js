/** @type {import('tailwindcss').Config} */
export default {
content: ["./index.html", "./src/**/*.{js,jsx}"],  theme: {
    extend: {
      screens: {
        sm: "375px",
        md: "768px",  
        lg: "1280px",
      },
      colors: {
        bg: {
          base: "#0b0f14",
          card: "#121820",
          elevated: "#1a222d",
        },
        accent: {
          DEFAULT: "#5b8def",
          muted: "#3b6fd4",
        },
        text: {
          primary: "#e8eef7",
          secondary: "#8a97a8",
          muted: "#5a6678",
        },
        border: {
          DEFAULT: "#1f2833",
          focus: "#5b8def",
        },
      },
      minHeight: { touch: "44px" },
      minWidth: { touch: "44px" },
    },
  },
  plugins: [],
};