module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        sepia: {
          50: '#FCF9F3',
          200: '#E6DCC8',
          300: '#D4C5A9',
          400: '#C2AE8A',
          500: '#B0976B',
          600: '#9E804C',
          700: '#8C692D',
          800: '#7A520E',
        },
      },
      fontFamily: {
        'playfair': ['Playfair Display', 'serif'],
        'great-vibes': ['Great Vibes', 'cursive'],
        'cormorant': ['Cormorant Garamond', 'serif'],
        'handwriting': ['Dancing Script', 'cursive'],
      },
    },
  },
  plugins: [],
}
