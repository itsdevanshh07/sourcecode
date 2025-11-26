

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // Restored Purple & Indigo Palette (Matching logo)
      colors: {
        primary: '#7C3AED',       // Violet-600
        secondary: '#4F46E5',     // Indigo-600
        accent: '#8b5cf6',        // Violet-500

        // Backgrounds
        "dark-bg": "#0f172a",     // Slate-900
        "card-bg": "#1e293b",     // Slate-800
        "light-bg": "#f8fafc",    // Slate-50

        // Mappings for existing class usage
        'navy': '#4c1d95',        // Violet-900 (Deep Purple)
        'navy-dark': '#2e1065',   // Violet-950 (Darkest Purple)
        'sky': '#a78bfa',         // Violet-400 (Light Purple)
        'cream': '#ffffff',       // White
      }
    },
  },
  plugins: [],
}