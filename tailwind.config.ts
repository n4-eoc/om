import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: { DEFAULT: '#0F1B2D', 700: '#1B2C47', 50: '#EEF2F8' },
        accent: { DEFAULT: '#2F8CFF', 600: '#1F6FD6' },
        teal: { DEFAULT: '#00C2A8', 700: '#008C79' },
        tamara: '#F9A8C9',
      },
      fontFamily: { sans: ['var(--font-arabic)', 'system-ui', 'sans-serif'] },
      boxShadow: {
        card: '0 6px 24px rgba(15,27,45,.08)',
        lift: '0 14px 34px rgba(15,27,45,.16)',
      },
    },
  },
  plugins: [],
};
export default config;
