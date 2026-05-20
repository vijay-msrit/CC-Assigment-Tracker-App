/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Syne', 'sans-serif'],
        body: ['DM Sans', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        bg: '#050505',
        surface: '#0d0d0d',
        'surface-hover': '#131313',
        border: '#1a1a1a',
        'border-hover': '#2a2a2a',
        accent: '#a855f7',
        'accent-dim': '#7c3aed',
        'accent-muted': 'rgba(168,85,247,0.12)',
        ink: '#ffffff',
        'ink-2': '#888888',
        'ink-3': '#444444',
        success: '#22c55e',
        warning: '#f59e0b',
        danger: '#ef4444',
        info: '#3b82f6',
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease forwards',
        'slide-up': 'slideUp 0.4s ease forwards',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: { from: { opacity: 0 }, to: { opacity: 1 } },
        slideUp: { from: { opacity: 0, transform: 'translateY(12px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
        pulseGlow: {
          '0%,100%': { boxShadow: '0 0 0 0 rgba(168,85,247,0)' },
          '50%': { boxShadow: '0 0 20px 4px rgba(168,85,247,0.15)' },
        },
      },
    },
  },
  plugins: [],
}
