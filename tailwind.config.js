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
          "primary": "#ffc0cb",
          "secondary": "#ffb3d9",
          "accent": "#ffd4e5",
          "neutral": "#2a2a2a",
          "base-100": "#1a1a1a",
          "base-200": "#252525",
          "base-300": "#303030",
          "info": "#ffc0cb",
          "success": "#ffb3d9",
          "warning": "#ffd4a3",
          "error": "#ff9999",
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
