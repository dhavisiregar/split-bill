/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["Syne", "sans-serif"],
        mono: ['"DM Mono"', "monospace"],
      },
      colors: {
        bg: "#0a0a0a",
        surface: "#111111",
        card: "#161616",
        border: "#222222",
        lime: "#c8f04e",
        coral: "#f04e7a",
        sky: "#4ec8f0",
        amber: "#f0c14e",
        muted: "#555555",
        "text-main": "#ede9e0",
      },
      animation: {
        "fade-up": "fadeUp 0.35s ease both",
        "slide-in": "slideIn 0.3s ease both",
      },
      keyframes: {
        fadeUp: {
          from: { opacity: "0", transform: "translateY(14px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        slideIn: {
          from: { opacity: "0", transform: "translateX(16px)" },
          to: { opacity: "1", transform: "translateX(0)" },
        },
      },
    },
  },
  plugins: [],
};
