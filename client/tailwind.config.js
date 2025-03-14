
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "scale(0)" },
          "100%": { opacity: "1", transform: "scale(1) translate(-50%, -50%)" },
        },
      },
      animation: {
        "fade-in": "fadeIn 0.2s ease-in forwards",
      },
    },
  },
  plugins: [],
}

