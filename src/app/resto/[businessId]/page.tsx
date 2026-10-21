import { notFound } from 'next/navigation';
import { fetchBusinessInfo, fetchMenuProducts } from '~lib/api';
import { checkTableOrderingAvailability } from '~lib/tableOrderingApi';
import MenuClient from './MenuClient';
import type { BusinessInfo, MenuData } from '~lib/types';
import { DEMO_DATA } from '~lib/demo';

interface Props {
  params: Promise<{ businessId: string }>;
  searchParams: Promise<{ no?: string }>;
}

export default async function BusinessPage({ params, searchParams }: Props) {
  const { businessId } = await params;
  const { no } = await searchParams;

  let business: BusinessInfo;
  let menuData: MenuData;

  // Demo mode — no backend required
  if (businessId === 'demo') {
    business = DEMO_DATA.business;
    menuData = { products: DEMO_DATA.products, categories: DEMO_DATA.categories };
    return (
      <MenuClient
        business={business}
        menuData={menuData}
        tableNo={no ?? '1'}
        tableOrderingAvailable={false}
      />
    );
  }

  try {
    [business, menuData] = await Promise.all([
      fetchBusinessInfo(businessId),
      fetchMenuProducts(businessId),
    ]);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : '';
    if (msg === 'BUSINESS_NOT_FOUND' || msg === 'MENU_DISABLED') {
      notFound();
    }
    // On any other error render fallback via client
    return (
      <div className="flex min-h-screen items-center justify-center p-8 text-center">
        <p className="text-sm text-gray-500">Gagal memuat menu. Silahkan refresh halaman.</p>
      </div>
    );
  }

  // F-33 self-pay availability (Gold+) — checked independently of the
  // legacy business-info fetch above; any failure here just hides the
  // self-pay UI, it never blocks the menu itself from rendering.
  const tableOrderingAvailable = await checkTableOrderingAvailability(businessId);

  return (
    <MenuClient
      business={business}
      menuData={menuData}
      tableNo={no ?? ''}
      tableOrderingAvailable={tableOrderingAvailable}
    />
  );
}
