/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'brand-purple': '#531B93',
        'brand-teal': '#009193',
      },
    },
  },
  plugins: [],
};
