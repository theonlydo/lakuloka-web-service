// ─── Business ───────────────────────────────────────────────────────────────

export interface BusinessInfo {
  businessId: string;
  businessName: string;
  address: string;
  paymentFlow: 'can_paylater' | 'direct_payment' | string;
  bannerUrl?: string | null;
}

// ─── Category ───────────────────────────────────────────────────────────────

export interface Category {
  id: number;
  name: string;
  description?: string | null;
}

// ─── Variant ────────────────────────────────────────────────────────────────

export interface VariantOption {
  listName: string;
  price: number;
  capitalPrice: number;
}

export interface Variant {
  id: number;
  groupName: string;
  options: VariantOption[];
  isRequired: boolean;
  allowMultiple: boolean;
  minSelection: number;
  maxSelection: number;
}

// ─── Product ────────────────────────────────────────────────────────────────

export interface Product {
  id: number;
  name: string;
  description?: string | null;
  sellingPrice: number;
  imageUrl?: string | null;
  isAvailable: boolean;
  hasStock: boolean;
  stock: number;
  unit?: string | null;
  categoryId?: number | null;
  category?: Category | null;
  variants: Variant[];
}

// ─── Menu API response ───────────────────────────────────────────────────────

export interface MenuData {
  products: Product[];
  categories: Category[];
}

// ─── Cart ────────────────────────────────────────────────────────────────────

export interface SelectedVariantOption {
  groupName: string;
  optionName: string;
  price: number;
  capitalPrice: number;
}

export interface CartItem {
  cartId: string; // uuid — unique per line in cart (product + variant combo)
  productId: number;
  productName: string;
  basePrice: number;
  imageUrl?: string;
  variantSelections: SelectedVariantOption[];
  note: string;
  quantity: number;
  subtotal: number;
}

// ─── Order ───────────────────────────────────────────────────────────────────

export interface OrderItem {
  productId: number;
  productName: string;
  qty: number;
  customerPrice: number;
  variantSelections: SelectedVariantOption[];
  note: string;
}

export interface CreateOrderPayload {
  items: OrderItem[];
  customer: string;
  phone: string;
  table: string;
  note: string;
  grandTotal: number;
  paymentFlow?: string;
}

export type OrderResultType = 'pending' | 'qr';

export interface OrderResult {
  type: OrderResultType;
  pendingId?: number;
  token?: string;
}

// ─── F-33 Table Ordering (Gold+ self-pay) ────────────────────────────────────
// A separate, additive domain from the legacy order flow above — see
// src/lib/tableOrderingApi.ts. Only self-pay (single order, pay now via
// QRIS) is wired up client-side so far; dine-in open bill (table sessions)
// is a kasir-initiated flow still pending on the mobile app side.

export interface QrisPayload {
  qr_url?: string;
  qr_content?: string;
}

export interface SelfPayOrderItem {
  productId: number;
  qty: number;
  variantSelections?: SelectedVariantOption[];
  note: string;
}

export interface CreateSelfPayOrderPayload {
  customer: string;
  phone: string;
  table: string;
  items: SelfPayOrderItem[];
}

export interface SelfPayOrderResult {
  orderToken: string;
  grandTotal: number;
  qris: QrisPayload;
}

export type SelfPayOrderStatus = 'pending_payment' | 'paid' | 'cancelled' | 'expired';

export interface SelfPayStatusResult {
  orderToken: string;
  status: SelfPayOrderStatus;
  grandTotal: number;
  tableNo: string;
}
