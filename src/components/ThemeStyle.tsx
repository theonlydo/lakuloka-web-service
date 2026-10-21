import type { CSSProperties, ReactNode } from 'react';
import { themeToCssVars, type ModuleTheme } from '~lib/theming';
import type { ModuleId } from '~modules';

interface ThemeStyleProps {
  module: ModuleId;
  theme: ModuleTheme;
  children: ReactNode;
}

/**
 * Scopes a module's theme (CSS vars + light/dark) to its own subtree.
 * Server component — zero client JS.
 */
export default function ThemeStyle({ module, theme, children }: ThemeStyleProps) {
  return (
    <div
      data-module={module}
      style={themeToCssVars(theme) as CSSProperties}
      className={theme.appearance === 'dark' ? 'dark' : undefined}
    >
      {children}
    </div>
  );
}
