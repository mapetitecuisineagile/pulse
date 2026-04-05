import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        bg:       '#080c14',
        surface:  '#0e1420',
        surface2: '#121824',
        border:   '#1a2540',
        border2:  '#243050',
        cyan:     '#00d4ff',
        green:    '#00ff9d',
        purple:   '#7b61ff',
        yellow:   '#ffd166',
        red:      '#ff6b6b',
        text:     '#e8eaf0',
        muted:    '#4a6080',
        subtle:   '#8a9bb0',
      },
      fontFamily: {
        grotesk: ['Space Grotesk', 'sans-serif'],
        mono:    ['DM Mono', 'monospace'],
        data:    ['Space Mono', 'monospace'],
      },
      borderRadius: {
        card: '10px',
      },
    },
  },
  plugins: [],
}

export default config
