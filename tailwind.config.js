/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['index.html', 'live.html'],
  theme: {
    extend: {},
  },
  plugins: [
    require("@tailwindcss/typography"),
    require("daisyui")
  ],
}

