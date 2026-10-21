import type { ModuleTheme } from '~lib/theming';

/** Queue theme — near-black TV screen, yellow ready numbers. Edit values to rebrand. */
export const queueTheme: ModuleTheme = {
  brandName: 'Queue Display',
  tagline: 'Nomor antrean siap diambil',
  appearance: 'dark',
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, sans-serif",
  colors: {
    primary: '48 96% 53%',
    primaryForeground: '0 0% 10%',
    primarySoft: '48 90% 75%',
    primaryStrong: '45 93% 47%',
    primaryDark: '42 95% 38%',
    secondary: '0 0% 14%',
    secondaryForeground: '0 0% 98%',
    accent: '142 71% 45%',
    accentStrong: '142 76% 36%',
    accentForeground: '0 0% 100%',
    background: '0 0% 4%',
    foreground: '0 0% 98%',
    muted: '0 0% 12%',
    mutedForeground: '0 0% 60%',
    border: '0 0% 16%',
    ring: '48 96% 53%',
  },
};
