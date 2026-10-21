import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { fetchBusinessInfo } from '~lib/api';
import { CartProvider } from '~contexts/CartContext';
import { I18nProvider } from '~lib/i18n';
import ThemeStyle from '~components/ThemeStyle';
import { restoTheme } from '../theme';

interface Props {
  params: Promise<{ businessId: string }>;
  children: React.ReactNode;
}

export async function generateMetadata({ params }: { params: Promise<{ businessId: string }> }): Promise<Metadata> {
  try {
    const { businessId } = await params;
    const business = await fetchBusinessInfo(businessId);
    return {
      title: `${business.businessName} — Digital Menu`,
      description: business.address || 'Pesan menu langsung dari mejamu',
    };
  } catch {
    return { title: 'Digital Menu' };
  }
}

export default async function BusinessLayout({ params, children }: Props) {
  const { businessId } = await params;

  let locale: 'id' | 'en' = 'id';
  // Could be extended to read Accept-Language header

  return (
    <ThemeStyle module="resto" theme={restoTheme}>
      <I18nProvider initialLocale={locale}>
        <CartProvider>{children}</CartProvider>
      </I18nProvider>
    </ThemeStyle>
  );
}
