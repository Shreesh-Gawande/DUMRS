/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",                       // Main HTML file (if applicable)
    "./src/**/*.{js,jsx,ts,tsx}",         // All JS/TS files in src, including components, containers, pages, etc.
    "./public/**/*.{html}",               // Include HTML files in public, if necessary
  ],  
  theme: {
    extend: {
      colors: {
        background: '#F8F9FC',
        text_unfocus: '#D0D1D2',
        text_focus: '#FFFFFF',
        text_purple: '#551FFF',
        button_background: '#F3F0FF',
        profile_bg: '#D0D0D2',
        test1: '#F1D2FD'
      },
      fontFamily: {
        'nunito': ['Nunito', 'sans-serif'],
      },
      height: {
        '11/12': '91.666667%',
        '2/10': '20%'
      },
      flex: {
        'dynamic': '1 1 0%'
      },
    },
  },
  plugins: [],
}