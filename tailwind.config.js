/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        paper: '#F3F0E8',
        paper2: '#E9E5DA',
        card: '#FBFAF6',
        ink: '#111111',
        mute: '#5F5E5A',
        line: 'rgba(17,17,17,0.12)',
        blue: '#2B44FF',
        blueSoft: '#E3E7FF',
        mint: '#0F9D63',
        accent: '#2B44FF',
      },
      fontFamily: {
        display: ['"Bricolage Grotesque"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        sans: ['"Inter"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'Menlo', 'monospace'],
      },
      letterSpacing: { tightest: '-0.045em' },
      keyframes: {
        marquee: { from: { transform: 'translateX(0)' }, to: { transform: 'translateX(-50%)' } },
        blink: { '0%,100%': { opacity: 1 }, '50%': { opacity: 0 } },
      },
      animation: { marquee: 'marquee 40s linear infinite', blink: 'blink 1s step-end infinite' },
    },
  },
  plugins: [],
};
