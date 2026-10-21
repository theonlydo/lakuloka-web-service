/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/contexts/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        // Themeable via CSS vars — values are injected per module by ThemeStyle.
        // Only the shades actually used by shared components are var-driven;
        // the rest stay as static fallbacks. Verify with:
        // rg -o '\b(bg|text|border|ring)-…(primary|secondary|accent)(-[0-9]+)?' src/
        primary: {
          DEFAULT: 'hsl(var(--primary) / <alpha-value>)',
          50: '#eeeefa',
          100: '#d9d9f5',
          200: 'hsl(var(--primary-200) / <alpha-value>)',
          300: '#8d8de2',
          400: '#6767d8',
          500: '#4f4ec7',
          600: 'hsl(var(--primary-600) / <alpha-value>)',
          700: 'hsl(var(--primary-700) / <alpha-value>)',
          800: '#2b2a5a',
          900: '#1e1d3e',
          foreground: 'hsl(var(--primary-foreground))',
        },
        // Lakuloka secondary purple #5A5AA3
        secondary: {
          DEFAULT: 'hsl(var(--secondary) / <alpha-value>)',
          50: '#f0f0fa',
          100: '#dcdcf4',
          200: '#b8b8e9',
          300: '#9494de',
          400: '#7070d3',
          500: '#5A5AA3',
          600: '#4a4a88',
          700: '#3a3a6d',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        // Lakuloka accent yellow #F9B91E
        accent: {
          DEFAULT: 'hsl(var(--accent) / <alpha-value>)',
          50: '#fffbea',
          100: '#fff3c6',
          200: '#ffe78d',
          300: '#ffd54f',
          400: '#ffca28',
          500: 'hsl(var(--accent-500) / <alpha-value>)',
          600: 'hsl(var(--accent-600) / <alpha-value>)',
          700: '#c48616',
          foreground: 'hsl(var(--accent-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
      },
      borderRadius: {
        lg: '0.5rem',
        md: '0.375rem',
        sm: '0.25rem',
      },
      animation: {
        'cart-pop': 'cart-pop 0.38s cubic-bezier(0.36, 0.07, 0.19, 0.97) both',
      },
      keyframes: {
        'cart-pop': {
          '0%':   { transform: 'scale(1)' },
          '35%':  { transform: 'scale(1.45)' },
          '65%':  { transform: 'scale(0.88)' },
          '100%': { transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [],
};
