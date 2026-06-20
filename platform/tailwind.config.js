/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        autodev: {
          50: '#e6f7ff',
          100: '#b3efff',
          200: '#80e5ff',
          300: '#4ddbff',
          400: '#1ad1ff',
          500: '#00b8e6',
          600: '#0099cc',
          700: '#007399',
          800: '#004d66',
          900: '#002633',
          accent: '#FFB800',
        },
      },
    },
  },
  plugins: [],
};
