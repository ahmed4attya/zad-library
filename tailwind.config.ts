import type { Config } from 'tailwindcss';

// كل الألوان مربوطة بمتغيرات CSS (في globals.css) لدعم الثيم الداكن.
// استبدل قيم brand/gold/sand في globals.css بقيم tailwind.config الحقيقية لمشروع قُدراتي.
const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: 'var(--b50)',
          100: 'var(--b100)',
          600: 'var(--b600)',
          700: 'var(--b700)',
          800: 'var(--b800)',
        },
        sand: { DEFAULT: 'var(--sand)', 200: 'var(--sand2)' },
        gold: { DEFAULT: 'var(--gold)', 700: 'var(--gold2)' },
        surface: 'var(--bg)',
        card: 'var(--card)',
        ink: 'var(--ink)',
        mut: 'var(--mut)',
        line: 'var(--bd)',
        pri: 'var(--pri)',
      },
    },
  },
  plugins: [],
};
export default config;
