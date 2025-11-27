

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // Restored Blue & Beige Palette (Matching screenshots)
      colors: {
        primary: '#2563EB',       // Blue-600
        secondary: '#1D4ED8',     // Blue-700
        accent: '#60A5FA',        // Blue-400

        // Backgrounds
        "dark-bg": "#0f172a",     // Slate-900
        "card-bg": "#1e293b",     // Slate-800
        "light-bg": "#f8fafc",    // Slate-50

        // Mappings for existing class usage
        'navy': '#1e3a8a',        // Blue-900
        'navy-dark': '#020617',   // Slate-950
        'sky': '#93c5fd',         // Blue-300
        'cream': '#EAECC6',       // Beige/Cream from screenshot
      }
    },
  },
  plugins: [],
}