export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        mono: ['"Fira Code"', '"Space Mono"', 'monospace'],
      },
      colors: {
        crt: {
          bg: '#000000',
          text: '#39ff14',
          amber: '#ffb000',
        },
        blueprint: {
          bg: '#f4ebd8',
          text: '#0b3954',
          accent: '#e66a38',
        }
      },
      boxShadow: {
        'brutal': '4px 4px 0px 0px rgba(0,0,0,1)',
        'brutal-light': '4px 4px 0px 0px rgba(11,57,84,1)',
      }
    },
  },
  plugins: [],
}
