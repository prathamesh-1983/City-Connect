/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#07111f',
        panel: '#101d2d',
        accent: '#42d6c5',
      },
    },
  },
  plugins: [],
};
