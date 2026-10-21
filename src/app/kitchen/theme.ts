import type { ModuleTheme } from '~lib/theming';

/** Kitchen theme — dark slate + orange for kitchen screens. Edit values to rebrand. */
export const kitchenTheme: ModuleTheme = {
  brandName: 'Kitchen Display',
  tagline: 'Pantau dan proses order dapur',
  appearance: 'dark',
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, sans-serif",
  colors: {
    primary: '25 95% 53%',
    primaryForeground: '0 0% 100%',
    primarySoft: '25 90% 78%',
    primaryStrong: '22 92% 48%',
    primaryDark: '20 90% 40%',
    secondary: '217 33% 22%',
    secondaryForeground: '0 0% 98%',
    accent: '48 96% 53%',
    accentStrong: '45 93% 47%',
    accentForeground: '0 0% 10%',
    background: '222 47% 8%',
    foreground: '0 0% 98%',
    muted: '217 33% 17%',
    mutedForeground: '215 20% 65%',
    border: '217 33% 22%',
    ring: '25 95% 53%',
  },
};
