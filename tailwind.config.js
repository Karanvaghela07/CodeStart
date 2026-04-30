/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#1a1a2e",
        surface: "#1f1f3a",
        accent: "#e94560",
        highlight: "#00d4ff"
      },
      fontFamily: {
        heading: ['Syne', 'sans-serif'],
        code: ['Space Mono', 'monospace'],
        body: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      keyframes: {
        dropIn: {
          "0%":   { opacity: "0", transform: "translateX(-50%) translateY(-10px) scale(0.95)" },
          "100%": { opacity: "1", transform: "translateX(-50%) translateY(0)     scale(1)" },
        },
      },
      animation: {
        dropIn: "dropIn 0.18s cubic-bezier(0.34,1.56,0.64,1) both",
      },
    },
  },
  plugins: [],
}
