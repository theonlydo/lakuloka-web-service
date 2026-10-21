'use client';

import { useEffect, useState } from 'react';
import type { KitchenOrder } from '~lib/kitchen';
import { subscribeKitchenOrders } from '~lib/realtime';

interface QueueBoardProps {
  businessId: string;
  businessName: string;
  initialOrders: KitchenOrder[];
}

/** TV-mode queue screen: huge ready numbers, smaller preparing list. No interaction. */
export default function QueueBoard({ businessId, businessName, initialOrders }: QueueBoardProps) {
  const [orders, setOrders] = useState<KitchenOrder[]>(initialOrders);

  useEffect(() => {
    const sub = subscribeKitchenOrders(businessId, setOrders);
    return () => sub.unsubscribe();
  }, [businessId]);

  const ready = orders.filter((o) => o.status === 'ready');
  const preparing = orders.filter((o) => o.status === 'preparing' || o.status === 'new');

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <header className="border-b border-border px-8 py-5 text-center">
        <h1 className="text-3xl font-bold tracking-tight">{businessName}</h1>
        <p className="mt-1 text-sm uppercase tracking-widest text-muted-foreground">
          Nomor Siap Diambil
        </p>
      </header>

      <main className="grid flex-1 gap-6 p-8 lg:grid-cols-2">
        <section className="rounded-2xl bg-muted/50 p-6">
          <h2 className="text-xl font-bold uppercase tracking-wider text-primary">
            Siap ({ready.length})
          </h2>
          {ready.length === 0 ? (
            <p className="mt-6 text-center text-2xl text-muted-foreground">—</p>
          ) : (
            <div className="mt-4 flex flex-wrap gap-4">
              {ready.map((o) => (
                <div
                  key={o.id}
                  className="rounded-2xl bg-primary px-8 py-5 text-center text-primary-foreground shadow-lg"
                >
                  <div className="font-mono text-6xl font-black">{o.id}</div>
                  <div className="mt-1 text-sm font-semibold">Meja {o.table}</div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="rounded-2xl bg-muted/50 p-6">
          <h2 className="text-xl font-bold uppercase tracking-wider text-muted-foreground">
            Disiapkan ({preparing.length})
          </h2>
          {preparing.length === 0 ? (
            <p className="mt-6 text-center text-2xl text-muted-foreground">—</p>
          ) : (
            <div className="mt-4 flex flex-wrap gap-3">
              {preparing.map((o) => (
                <div
                  key={o.id}
                  className="rounded-xl border border-border bg-background px-6 py-3 text-center"
                >
                  <div className="font-mono text-4xl font-bold text-muted-foreground">{o.id}</div>
                  <div className="mt-0.5 text-xs text-muted-foreground">Meja {o.table}</div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      <footer className="border-t border-border px-8 py-3 text-center text-xs text-muted-foreground">
        Powered by Lakuloka
      </footer>
    </div>
  );
}
