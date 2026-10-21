import { NextRequest, NextResponse } from 'next/server';
import { fetchBusinessInfo, fetchMenuProducts } from '~lib/api';
import { DEMO_DATA } from '~lib/demo';

interface RouteParams {
  params: Promise<{ businessId: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  const { businessId } = await params;

  // Return dummy data for demo mode — no backend required
  if (businessId === 'demo') {
    return NextResponse.json({
      business: DEMO_DATA.business,
      products: DEMO_DATA.products,
      categories: DEMO_DATA.categories,
    });
  }

  try {
    const [business, menuData] = await Promise.all([
      fetchBusinessInfo(businessId),
      fetchMenuProducts(businessId),
    ]);
    return NextResponse.json({ business, ...menuData });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'UNKNOWN';
    if (msg === 'BUSINESS_NOT_FOUND') {
      return NextResponse.json({ error: 'Toko tidak ditemukan.' }, { status: 404 });
    }
    if (msg === 'MENU_DISABLED') {
      return NextResponse.json({ error: 'Menu digital tidak tersedia untuk toko ini.' }, { status: 403 });
    }
    console.error('[menu route]', err);
    return NextResponse.json({ error: 'Failed to load menu.' }, { status: 500 });
  }
}
