import type { CartItem, SelectedVariantOption } from './types';
import type { ClassValue } from 'clsx';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Format price as Indonesian Rupiah */
export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Calculate subtotal for base price + variant extra × quantity.
 * Called from CartContext with explicit basePrice/variantSelections/qty.
 */
export function calcSubtotal(
  basePrice: number,
  variantSelections: SelectedVariantOption[],
  quantity: number,
): number {
  const variantExtra = variantSelections.reduce((sum, v) => sum + v.price, 0);
  return (basePrice + variantExtra) * quantity;
}

/** Calculate grand total for all cart items */
export function calcGrandTotal(cart: CartItem[]): number {
  return cart.reduce((sum, item) => sum + item.subtotal, 0);
}

/**
 * Generate a stable cart line ID based on product + variant combo + note.
 * Same product with different variants = different cart line.
 */
export function generateCartId(
  productId: number,
  variantSelections: SelectedVariantOption[],
  note: string,
): string {
  const variantKey = variantSelections.map((v) => `${v.groupName}:${v.optionName}`).join('|');
  return `${productId}-${variantKey}-${note}`;
}

/** Format variant selections as a readable string, e.g. "Ukuran: Besar, Topping: Extra" */
export function formatVariantText(selections: SelectedVariantOption[]): string {
  if (!selections.length) return '';
  return selections.map((s) => `${s.groupName}: ${s.optionName}`).join(', ');
}
