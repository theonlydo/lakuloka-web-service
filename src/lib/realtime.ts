/**
 * Realtime seam for kitchen + queue displays.
 *
 * Target architecture (chosen): SSE/WebSocket pushed from lakuloka-be.
 * Until the backend supports it, this module simulates the live feed with
 * a polling interval against our own API route. UI components subscribe
 * via subscribeKitchenOrders() and MUST NOT care which transport is used —
 * swapping to EventSource later only changes this file.
 */

import type { KitchenOrder } from './kitchen';

export interface KitchenSubscription {
  unsubscribe: () => void;
}

async function pollOnce(businessId: string): Promise<KitchenOrder[]> {
  const res = await fetch(`/api/kitchen/${encodeURIComponent(businessId)}/orders`, {
    cache: 'no-store',
  });
  if (!res.ok) throw new Error(`Kitchen poll failed (${res.status})`);
  const json = await res.json();
  return (json.orders ?? []) as KitchenOrder[];
}

export function subscribeKitchenOrders(
  businessId: string,
  onOrders: (orders: KitchenOrder[]) => void,
  onError?: (message: string) => void,
  intervalMs = 8000
): KitchenSubscription {
  let stopped = false;

  const tick = async () => {
    if (stopped) return;
    try {
      onOrders(await pollOnce(businessId));
    } catch (err) {
      onError?.(err instanceof Error ? err.message : 'Poll failed');
    }
  };

  // TODO(lakuloka-be): replace setInterval with
  //   const source = new EventSource(`/api/stream/kitchen/${businessId}`);
  //   source.onmessage = (e) => onOrders(JSON.parse(e.data).orders);
  // and return { unsubscribe: () => source.close() }.
  void tick();
  const timer = setInterval(tick, intervalMs);
  return { unsubscribe: () => { stopped = true; clearInterval(timer); } };
}
