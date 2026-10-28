import { NextRequest, NextResponse } from 'next/server';
import { getDummyKitchenOrders } from '~lib/kitchen';

interface RouteParams {
  params: Promise<{ businessId: string }>;
}

/**
 * Dummy kitchen feed. Consumed by subscribeKitchenOrders() (src/lib/realtime.ts).
 * TODO(lakuloka-be): replace the dummy source with a server-side proxy to the
 * kitchen orders endpoint using src/lib/webToken.ts.
 */
export async function GET(_request: NextRequest, { params }: RouteParams) {
  const { businessId } = await params;
  return NextResponse.json({
    businessId,
    orders: getDummyKitchenOrders(businessId),
  });
}
