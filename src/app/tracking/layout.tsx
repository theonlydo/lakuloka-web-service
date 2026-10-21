import type { Metadata } from 'next';
import ThemeStyle from '~components/ThemeStyle';
import { trackingTheme } from './theme';

export const metadata: Metadata = {
  title: 'Lacak Jasa — Lakuloka',
  description: 'Cek status progress pekerjaan jasa',
};

export default function TrackingLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeStyle module="tracking" theme={trackingTheme}>
      {children}
    </ThemeStyle>
  );
}
