import type { ModuleTheme } from '~lib/theming';

/** Tracking theme — teal/amber on light. Edit values to rebrand. */
export const trackingTheme: ModuleTheme = {
  brandName: 'Lacak Jasa',
  tagline: 'Cek status progress pekerjaan jasa',
  appearance: 'light',
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, sans-serif",
  colors: {
    primary: '175 77% 26%',
    primaryForeground: '0 0% 100%',
    primarySoft: '173 60% 84%',
    primaryStrong: '174 72% 32%',
    primaryDark: '175 77% 22%',
    secondary: '175 30% 92%',
    secondaryForeground: '175 77% 22%',
    accent: '25 95% 53%',
    accentStrong: '21 90% 48%',
    accentForeground: '0 0% 100%',
    background: '0 0% 100%',
    foreground: '222 47% 11%',
    muted: '173 20% 95%',
    mutedForeground: '175 15% 40%',
    border: '173 20% 88%',
    ring: '175 77% 26%',
  },
};
