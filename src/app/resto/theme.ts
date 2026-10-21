import type { ModuleTheme } from '~lib/theming';

/**
 * Laku Resto theme — identical to the original digital-menu branding.
 * To rebrand resto, edit the values below. Nothing else changes.
 */
export const restoTheme: ModuleTheme = {
  brandName: 'Laku Resto',
  tagline: 'Pesan menu langsung dari mejamu',
  appearance: 'light',
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, sans-serif",
  colors: {
    primary: '241 36% 32%',
    primaryForeground: '0 0% 100%',
    primarySoft: '240 60% 81%',
    primaryStrong: '241 44% 46%',
    primaryDark: '242 36% 33%',
    secondary: '240 30% 50%',
    secondaryForeground: '0 0% 100%',
    accent: '43 94% 55%',
    accentStrong: '41 79% 49%',
    accentForeground: '240 36% 11%',
    background: '0 0% 100%',
    foreground: '222.2 84% 4.9%',
    muted: '240 20% 96%',
    mutedForeground: '240 10% 46%',
    border: '214.3 31.8% 91.4%',
    ring: '241 36% 32%',
  },
};
