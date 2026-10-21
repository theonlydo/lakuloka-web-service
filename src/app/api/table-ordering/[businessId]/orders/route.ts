import { NextRequest, NextResponse } from 'next/server';
import { createSelfPayOrder } from '~lib/tableOrderingApi';
import type { CreateSelfPayOrderPayload } from '~lib/types';

interface RouteParams {
  params: Promise<{ businessId: string }>;
}

export async function POST(request: NextRequest, { params }: RouteParams) {
  const { businessId } = await params;

  let body: CreateSelfPayOrderPayload;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 });
  }

  if (!body.customer?.trim()) {
    return NextResponse.json({ error: 'Customer name is required.' }, { status: 422 });
  }
  if (!body.table?.trim()) {
    return NextResponse.json({ error: 'Table number is required.' }, { status: 422 });
  }
  if (!body.items?.length) {
    return NextResponse.json({ error: 'Order must have at least one item.' }, { status: 422 });
  }

  try {
    const timezone = request.headers.get('x-timezone') ?? undefined;
    const result = await createSelfPayOrder(businessId, body, timezone);
    return NextResponse.json(result, { status: 201 });
  } catch (err: unknown) {
    console.error('[table-ordering order route]', err);
    const message = err instanceof Error ? err.message : 'Gagal membuat pesanan.';
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
