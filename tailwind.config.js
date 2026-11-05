/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        paper: '#07080B',
        paper2: '#0C0E13',
        card: '#111319',
        ink: '#F1F3F8',
        mute: '#9097A8',
        line: 'rgba(255,255,255,0.09)',
        blue: '#4C6BFF',
        blueSoft: '#AFC0FF',
        mint: '#2BD98A',
        accent: '#4C6BFF',
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
