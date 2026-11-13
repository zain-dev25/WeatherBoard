/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      screens: { 
        sm: "375px", 
        md: "768px", 
        lg: "1280px" 
      },
      colors: {
        bg: {
          base: "var(--bg-base)",
          card: "var(--bg-card)",
          elevated: "var(--bg-elevated)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          muted: "var(--accent-muted)",
        },
        text: {
          primary: "var(--text-primary)",
          secondary: "var(--text-secondary)",
          muted: "var(--text-muted)",
        },
        border: {
          DEFAULT: "var(--border-color)",
          focus: "var(--accent)",
        },
      },
      minHeight: { touch: "44px" },
      minWidth: { touch: "44px" },
    },
  },
  plugins: [],
};