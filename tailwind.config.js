/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./popup.html",
    "./src/**/*.{js,jsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        'days-one': ['"Days One"', 'cursive'],
      },
    },
  },
  plugins: [],
}