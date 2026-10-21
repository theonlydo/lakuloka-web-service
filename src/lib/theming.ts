/**
 * Per-module theming contract.
 *
 * Shared UI components must only use semantic Tailwind tokens
 * (bg-primary, text-foreground, bg-background, ...) — never hardcode a hex.
 * Each module defines its own token values in its `theme.ts`; ThemeStyle
 * injects them as CSS vars scoped to that module's subtree, so modules
 * sharing one Next.js process can never leak styles into each other.
 */

export type ModuleAppearance = 'light' | 'dark';

export interface ModuleThemeColors {
  /** Base token (bg-primary, text-primary, border-primary, ring-primary) */
  primary: string; // HSL triplet, e.g. '241 36% 32%'
  primaryForeground: string;
  primarySoft: string; // primary-200
  primaryStrong: string; // primary-600
  primaryDark: string; // primary-700
  secondary: string;
  secondaryForeground: string;
  accent: string; // accent DEFAULT + accent-500
  accentStrong: string; // accent-600
  accentForeground: string;
  background: string;
  foreground: string;
  muted: string;
  mutedForeground: string;
  border: string;
  ring: string;
}

export interface ModuleTheme {
  brandName: string;
  tagline: string;
  appearance: ModuleAppearance;
  fontFamily: string;
  colors: ModuleThemeColors;
}

/** Flatten a ModuleTheme into CSS custom properties for inline style. */
export function themeToCssVars(theme: ModuleTheme): Record<string, string> {
  const c = theme.colors;
  return {
    '--background': c.background,
    '--foreground': c.foreground,
    '--primary': c.primary,
    '--primary-foreground': c.primaryForeground,
    '--primary-200': c.primarySoft,
    '--primary-600': c.primaryStrong,
    '--primary-700': c.primaryDark,
    '--secondary': c.secondary,
    '--secondary-foreground': c.secondaryForeground,
    '--accent': c.accent,
    '--accent-500': c.accent,
    '--accent-600': c.accentStrong,
    '--accent-foreground': c.accentForeground,
    '--muted': c.muted,
    '--muted-foreground': c.mutedForeground,
    '--border': c.border,
    '--input': c.border,
    '--ring': c.ring,
    '--font-sans': theme.fontFamily,
  };
}
