/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,jsx}", "./pages/*.{html,js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        ubuntur: ["ubuntur", "sans-serif"],
        ubuntub: ["ubuntub", "sans-serif"],
        judson: ["judson", "sans-serif"],
        sanchez: ["sanchez", "sans-serif"],
        inter: ["inter", "sans-serif"],
        inter_regular: ["inter-regular", "sans-serif"]
      },
      colors: {
        'onyx': '#303633',
        'degisikgri': '#A5907E',
        'red' : '#FF0000'
      }
    },
  },
  plugins: [],
}

