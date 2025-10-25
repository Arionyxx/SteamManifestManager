/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      "dark",
      "light",
      "synthwave",
      "cyberpunk",
      {
        mew: {
          "primary": "#e879f9",
          "secondary": "#c084fc",
          "accent": "#f0abfc",
          "neutral": "#2d1b3d",
          "base-100": "#1a0d25",
          "base-200": "#2d1b3d",
          "base-300": "#3d2550",
          "info": "#a78bfa",
          "success": "#f9a8d4",
          "warning": "#fbbf24",
          "error": "#f87171",
        },
      },
      {
        halloween: {
          "primary": "#fb923c",
          "secondary": "#a855f7",
          "accent": "#fbbf24",
          "neutral": "#1c1917",
          "base-100": "#0a0a0a",
          "base-200": "#1c1917",
          "base-300": "#292524",
          "info": "#60a5fa",
          "success": "#34d399",
          "warning": "#fb923c",
          "error": "#ef4444",
        },
      },
      {
        "90s": {
          "primary": "#ff00ff",
          "secondary": "#00ffff",
          "accent": "#ffff00",
          "neutral": "#2a2a2a",
          "base-100": "#1a1a2e",
          "base-200": "#16213e",
          "base-300": "#0f3460",
          "info": "#00d9ff",
          "success": "#00ff00",
          "warning": "#ffaa00",
          "error": "#ff0055",
        },
      },
    ],
  },
}
