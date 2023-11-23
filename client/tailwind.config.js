/** @type {import('tailwindcss').Config} */
import keepPreset from "keep-react/src/keep-preset.js";
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
    "node_modules/keep-react/**/*.{js,jsx,ts,tsx}"
  ],
  presets: [keepPreset],
  theme: {
    extend: {},
  },
  plugins: [],
}

