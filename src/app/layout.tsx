import type { Metadata } from 'next';
import '~app/globals.css';

export const metadata: Metadata = {
  title: 'Lakuloka',
  description: 'Lakuloka web platform — resto, tracking, kitchen, dan queue display.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
