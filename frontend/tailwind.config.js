/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],  theme: {
    extend: {
      colors:{
        background:'#F8F9FC',
        text_unfocus:' #D0D1D2',
        text_focus:' #FFFFFF',
        text_purple:'#551FFF',
        button_background:'#F3F0FF',
        profile_bg:'#D0D0D2',
        test1:'#F1D2FD'
      },
      height: {
        '11/12': '91.666667%', // 11/12 expressed as a percentage
        '2/10': '20%',
      },
      flex: {
        'dynamic': '1 1 0%', // flex-grow: 1; flex-shrink: 1; flex-basis: 0%;
      },
    },
  },
  plugins: [],
}

