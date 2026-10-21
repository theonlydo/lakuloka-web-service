/**
 * Dummy kitchen domain — real kitchen endpoints in lakuloka-be
 * have not been built yet. When ready, replace the dummy source in
 * src/app/api/kitchen/[businessId]/orders/route.ts with a server-side
 * proxy (same X-Menu-Key pattern as src/lib/api.ts). UI files stay unchanged.
 */

export type KitchenOrderStatus = 'new' | 'preparing' | 'ready' | 'served';

export interface KitchenOrderItem {
  name: string;
  qty: number;
  variantSummary?: string;
  note?: string;
}

export interface KitchenOrder {
  id: string;
  businessId: string;
  table: string;
  customer: string;
  items: KitchenOrderItem[];
  status: KitchenOrderStatus;
  createdAt: string;
}

export const KITCHEN_STATUS_LABEL: Record<KitchenOrderStatus, string> = {
  new: 'Baru',
  preparing: 'Dimasak',
  ready: 'Siap',
  served: 'Tersaji',
};

function demoOrders(): KitchenOrder[] {
  return [
    {
      id: 'A12',
      businessId: 'demo',
      table: '5',
      customer: 'Budi',
      items: [
        { name: 'Nasi Goreng Spesial', qty: 2, variantSummary: 'Pedas Sedang' },
        { name: 'Es Teh Manis', qty: 2, variantSummary: 'Large' },
      ],
      status: 'new',
      createdAt: '2026-09-28T10:31:00+07:00',
    },
    {
      id: 'A11',
      businessId: 'demo',
      table: '3',
      customer: 'Siti',
      items: [{ name: 'Mie Goreng Jawa', qty: 1, note: 'Tidak pedas' }],
      status: 'preparing',
      createdAt: '2026-09-28T10:24:00+07:00',
    },
    {
      id: 'A10',
      businessId: 'demo',
      table: '1',
      customer: 'Agus',
      items: [
        { name: 'Ayam Bakar Kecap', qty: 1 },
        { name: 'Kopi Susu', qty: 2, variantSummary: 'Iced' },
      ],
      status: 'ready',
      createdAt: '2026-09-28T10:12:00+07:00',
    },
  ];
}

export const DUMMY_KITCHEN_ORDERS: Record<string, KitchenOrder[]> = {
  demo: demoOrders(),
};

export function getDummyKitchenOrders(businessId: string): KitchenOrder[] {
  return DUMMY_KITCHEN_ORDERS[businessId] ?? DUMMY_KITCHEN_ORDERS.demo;
}
