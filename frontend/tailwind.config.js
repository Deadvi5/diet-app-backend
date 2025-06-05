import daisyui from 'daisyui'

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [daisyui],
  daisyui: {
    themes: [
      {
        mytheme: {
          primary: '#2563eb',
          secondary: '#d946ef',
          accent: '#14b8a6',
          neutral: '#3d4451',
          'base-100': '#ffffff',
        },
      },
      'dark',
    ],
  },
}
