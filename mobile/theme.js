// Central Theme styling parameters matching the Vite / Tailwind web app
export const theme = {
  colors: {
    primary: '#2563eb',          // Brand 500
    primaryDark: '#1d4ed8',      // Brand 600
    primaryLight: '#ebf1ff',     // Brand 100
    primaryLightest: '#f5f8ff',  // Brand 50
    background: '#f8fafc',       // Slate 50
    card: '#ffffff',             // White
    border: '#e2e8f0',           // Slate 200
    text: '#0f172a',             // Slate 900
    textMuted: '#475569',        // Slate 600
    textLight: '#94a3b8',        // Slate 400
    success: '#10b981',          // Emerald 500
    successBg: 'rgba(16, 185, 129, 0.1)',
    error: '#ef4444',            // Red 500
    errorBg: 'rgba(239, 68, 68, 0.1)',
    warning: '#f59e0b',          // Amber 500
    warningBg: 'rgba(245, 158, 11, 0.1)',
    darkBgSimulated: '#0f172a',
    darkCardSimulated: '#1e293b',
    darkBorderSimulated: '#334155',
  },
  radius: {
    card: 16,
    button: 12,
    input: 12,
    badge: 8,
  },
  shadows: {
    small: {
      shadowColor: '#0f172a',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 4,
      elevation: 2,
    },
    medium: {
      shadowColor: '#0f172a',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.08,
      shadowRadius: 12,
      elevation: 4,
    },
    large: {
      shadowColor: '#0f172a',
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.12,
      shadowRadius: 20,
      elevation: 8,
    },
  },
  fonts: {
    sans: 'System', // system sans-serif font
  }
};
export default theme;
