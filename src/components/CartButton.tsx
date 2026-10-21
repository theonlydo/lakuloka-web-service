import { useCart } from '~contexts/CartContext';
import { ShoppingCart } from 'lucide-react';

export default function CartButton() {
  const { totalItems, openCart } = useCart();

  if (totalItems === 0) return null;

  return (
    <div className="pointer-events-none fixed bottom-20 left-1/2 z-40 w-full max-w-2xl -translate-x-1/2">
      <button
        id="cart-fab"
        onClick={openCart}
        aria-label="Open cart"
        className="pointer-events-auto absolute right-4 flex h-14 w-14 items-center justify-center rounded-full bg-accent-500 text-gray-900 shadow-lg shadow-accent-500/40 ring-4 ring-accent-500/25 transition-transform hover:scale-105 hover:shadow-accent-500/60 active:scale-95"
      >
        <ShoppingCart className="h-6 w-6" />
        <span className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white shadow-sm">
          {totalItems > 99 ? '99+' : totalItems}
        </span>
      </button>
    </div>
  );
}
