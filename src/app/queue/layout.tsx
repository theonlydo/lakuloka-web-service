import type { Metadata } from 'next';
import ThemeStyle from '~components/ThemeStyle';
import { queueTheme } from './theme';

export const metadata: Metadata = {
  title: 'Queue Display — Lakuloka',
  description: 'Layar antrean: nomor siap diambil',
};

export default function QueueLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeStyle module="queue" theme={queueTheme}>
      {children}
    </ThemeStyle>
  );
}
