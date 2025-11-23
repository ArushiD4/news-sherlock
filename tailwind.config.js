/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html",
     "./src/**/*.{js,jsx,ts,tsx}"
    ],

  theme: {
    extend: {
      colors: {
        prussian_blue: "#1E293B",
        charcoal: "#334155",
        white_custom: "#F1F5F9",
        oxford_blue: "#0F172A",
        eerie_black: "#1C1C1C",
      },
    },
  },
  plugins: [],
}

