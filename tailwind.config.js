/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: '#09090b',
        panel: '#111115',
        panel2: '#17171c',
        line: 'rgba(255,255,255,0.08)',
        bone: '#f4f1ea',
        mute: '#9a9aa3',
        accent: '#ff2d55',
        // legacy tokens (kept so the chat widget / any old classes still resolve)
        'primary-bg': '#09090b',
        'secondary-bg': '#111115',
        'accent-1': '#ff2d55',
        'accent-2': '#ff2d55',
        'text-primary': '#f4f1ea',
        'text-secondary': '#9a9aa3',
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        sans: ['"Inter"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        serif: ['"Instrument Serif"', 'Georgia', 'serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'Menlo', 'monospace'],
      },
      letterSpacing: { tightest: '-0.055em' },
    },
  },
  plugins: [],
};
