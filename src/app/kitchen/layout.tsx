import type { Metadata } from 'next';
import ThemeStyle from '~components/ThemeStyle';
import KitchenGate from '~components/kitchen/KitchenGate';
import { kitchenTheme } from './theme';

export const metadata: Metadata = {
  title: 'Kitchen Display — Lakuloka',
  description: 'Layar dapur untuk memantau dan memproses order',
};

export default function KitchenLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeStyle module="kitchen" theme={kitchenTheme}>
      <KitchenGate>{children}</KitchenGate>
    </ThemeStyle>
  );
}
