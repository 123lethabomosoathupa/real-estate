/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#f1f1f1",
        foreground: "#2d2d2d",
        card: "#ffffff",
        border: "#d1d5db",
        muted: "#6b7280",
        primary: "#4b5563",
        "primary-dark": "#374151",
      },
    },
  },
  plugins: [],
};
