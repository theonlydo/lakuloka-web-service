import { NextRequest, NextResponse } from 'next/server';
import { getSelfPayOrderStatus } from '~lib/tableOrderingApi';

interface RouteParams {
  params: Promise<{ businessId: string; token: string }>;
}

export async function GET(_request: NextRequest, { params }: RouteParams) {
  const { businessId, token } = await params;

  try {
    const result = await getSelfPayOrderStatus(businessId, token);
    return NextResponse.json(result);
  } catch (err: unknown) {
    console.error('[table-ordering status route]', err);
    const message = err instanceof Error ? err.message : 'Gagal memeriksa status pembayaran.';
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
