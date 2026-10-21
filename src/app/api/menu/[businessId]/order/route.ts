import { NextRequest, NextResponse } from 'next/server';
import { createOrder } from '~lib/api';
import type { CreateOrderPayload } from '~lib/types';

interface RouteParams {
  params: Promise<{ businessId: string }>;
}

export async function POST(request: NextRequest, { params }: RouteParams) {
  const { businessId } = await params;

  let body: CreateOrderPayload;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 });
  }

  if (!body.customer?.trim()) {
    return NextResponse.json({ error: 'Customer name is required.' }, { status: 422 });
  }
  if (!body.phone?.trim()) {
    return NextResponse.json({ error: 'Phone number is required.' }, { status: 422 });
  }
  if (!body.table?.trim()) {
    return NextResponse.json({ error: 'Table number is required.' }, { status: 422 });
  }
  if (!body.items?.length) {
    return NextResponse.json({ error: 'Order must have at least one item.' }, { status: 422 });
  }

  // Demo mode — simulate order result without hitting backend
  if (businessId === 'demo') {
    if (body.paymentFlow === 'can_paylater') {
      return NextResponse.json({ type: 'pending', pendingId: 9999 });
    }
    return NextResponse.json({ type: 'qr', token: `demo-${Date.now()}` });
  }

  try {
    const result = await createOrder(businessId, body);
    return NextResponse.json(result);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'UNKNOWN';
    if (msg === 'BUSINESS_NOT_FOUND') {
      return NextResponse.json({ error: 'Toko tidak ditemukan.' }, { status: 404 });
    }
    if (msg === 'MENU_DISABLED') {
      return NextResponse.json({ error: 'Menu digital tidak tersedia.' }, { status: 403 });
    }
    console.error('[order route]', err);
    return NextResponse.json({ error: 'Gagal membuat pesanan.' }, { status: 500 });
  }
}
