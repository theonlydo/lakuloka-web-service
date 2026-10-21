'use client';

import { useEffect, useState } from 'react';
import type { KitchenOrder, KitchenOrderStatus } from '~lib/kitchen';
import { KITCHEN_STATUS_LABEL } from '~lib/kitchen';
import { subscribeKitchenOrders } from '~lib/realtime';

const COLUMNS: KitchenOrderStatus[] = ['new', 'preparing', 'ready'];
const NEXT_STATUS: Partial<Record<KitchenOrderStatus, KitchenOrderStatus>> = {
  new: 'preparing',
  preparing: 'ready',
  ready: 'served',
};
const ACTION_LABEL: Partial<Record<KitchenOrderStatus, string>> = {
  new: 'Mulai Masak',
  preparing: 'Tandai Siap',
  ready: 'Tandai Tersaji',
};

interface KitchenBoardProps {
  businessId: string;
  initialOrders: KitchenOrder[];
}

export default function KitchenBoard({ businessId, initialOrders }: KitchenBoardProps) {
  const [orders, setOrders] = useState<KitchenOrder[]>(initialOrders);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const sub = subscribeKitchenOrders(
      businessId,
      (next) => {
        setOrders(next);
        setLastUpdated(new Date());
        setError(null);
      },
      (message) => setError(message)
    );
    return () => sub.unsubscribe();
  }, [businessId]);

  // Dummy-only local transition.
  // TODO(lakuloka-be): POST status change to the kitchen endpoint, then rely
  // on the realtime feed (SSE) for the authoritative update instead.
  const advance = (id: string) => {
    setOrders((prev) =>
      prev.map((o) => {
        const next = NEXT_STATUS[o.status];
        return o.id === id && next ? { ...o, status: next } : o;
      })
    );
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border px-6 py-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-bold">
              Kitchen <span className="font-mono text-primary">{businessId}</span>
            </h1>
            <p className="text-xs text-muted-foreground">
              {error
                ? `Feed error: ${error}`
                : `Live${lastUpdated ? ` — update ${lastUpdated.toLocaleTimeString('id-ID')}` : ' — menghubungkan…'}`}
            </p>
          </div>
          <span className="flex items-center gap-1.5 rounded-full bg-accent/15 px-3 py-1 text-xs font-semibold text-accent">
            <span className="h-2 w-2 animate-pulse rounded-full bg-accent" />
            LIVE
          </span>
        </div>
      </header>

      <main className="grid gap-4 p-6 md:grid-cols-3">
        {COLUMNS.map((status) => (
          <section key={status} className="rounded-xl bg-muted/60 p-3">
            <h2 className="px-1 pb-2 text-sm font-bold uppercase tracking-wider text-muted-foreground">
              {KITCHEN_STATUS_LABEL[status]} ({orders.filter((o) => o.status === status).length})
            </h2>
            <div className="space-y-3">
              {orders
                .filter((o) => o.status === status)
                .map((order) => (
                  <article
                    key={order.id}
                    className="rounded-lg border border-border bg-background p-3 shadow-sm"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-lg font-bold text-primary">{order.id}</span>
                      <span className="text-xs text-muted-foreground">Meja {order.table}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">{order.customer}</p>
                    <ul className="mt-2 space-y-1 text-sm">
                      {order.items.map((item, i) => (
                        <li key={i}>
                          <span className="font-semibold">{item.qty}×</span> {item.name}
                          {item.variantSummary && (
                            <span className="text-muted-foreground"> ({item.variantSummary})</span>
                          )}
                          {item.note && (
                            <span className="block text-xs italic text-accent">{item.note}</span>
                          )}
                        </li>
                      ))}
                    </ul>
                    {ACTION_LABEL[status] && (
                      <button
                        onClick={() => advance(order.id)}
                        className="mt-3 w-full rounded-lg bg-primary py-2 text-sm font-semibold text-primary-foreground hover:opacity-90"
                      >
                        {ACTION_LABEL[status]}
                      </button>
                    )}
                  </article>
                ))}
            </div>
          </section>
        ))}
      </main>
    </div>
  );
}
