import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0b617e',        // Azul petróleo
        secondary: '#e47c90',      // Palo de rosa
        bg: '#fcffff',             // Blanco ligeramente cálido
        beige: '#ccb28b',          // Beige para acentos
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
};

export default config;
