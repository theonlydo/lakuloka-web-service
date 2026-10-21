'use client';

import { useState } from 'react';
import type { Product, SelectedVariantOption } from '~lib/types';
import { formatRupiah } from '~lib/utils';
import { useI18n } from '~lib/i18n';
import { useCart } from '~contexts/CartContext';
import { Check, ShoppingBag } from 'lucide-react';
import VariantModal from './VariantModal';
import { cn } from '~lib/utils';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { t } = useI18n();
  const { addToCart } = useCart();
  const [showVariantModal, setShowVariantModal] = useState(false);
  const [added, setAdded] = useState(false);

  function handleAddClick(e: React.MouseEvent<HTMLButtonElement>) {
    if (!product.isAvailable) return;
    if ((product.variants ?? []).length > 0) {
      setShowVariantModal(true);
    } else {
      addToCart(product, 1, [], '');
      const rect = e.currentTarget.getBoundingClientRect();
      window.dispatchEvent(
        new CustomEvent('cart:fly', {
          detail: { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 },
        }),
      );
      setAdded(true);
      setTimeout(() => setAdded(false), 750);
    }
  }

  function handleVariantConfirm(variantSelections: SelectedVariantOption[], note: string) {
    addToCart(product, 1, variantSelections, note);
    setShowVariantModal(false);
  }

  const isLowStock = product.hasStock && product.stock > 0 && product.stock <= 5;

  return (
    <>
      <div
        className={cn(
          'flex gap-3 bg-white px-4 py-3.5 transition-opacity',
          !product.isAvailable && 'opacity-60',
        )}
      >
        {/* Image 1:1 */}
        <div className="relative h-[72px] w-[72px] shrink-0 overflow-hidden rounded-xl bg-gray-100">
          {product.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={product.imageUrl}
              alt={product.name}
              className="h-full w-full object-cover"
              loading="lazy"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <ShoppingBag className="h-7 w-7 text-gray-200" />
            </div>
          )}
          {!product.isAvailable && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-xl">
              <span className="text-[10px] font-bold text-white leading-tight text-center">
                {t('product_unavailable')}
              </span>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex flex-1 flex-col min-w-0">
          <p className="text-sm font-semibold text-gray-900 leading-snug line-clamp-2">
            {product.name}
          </p>
          {product.description && (
            <p className="mt-0.5 text-xs text-gray-400 line-clamp-2 leading-relaxed">
              {product.description}
            </p>
          )}

          <div className="mt-auto flex items-end justify-between pt-2">
            <div className="flex flex-col gap-0.5">
              <span className="text-sm font-bold text-primary-700">
                {formatRupiah(product.sellingPrice)}
              </span>
              {isLowStock && (
                <span className="text-[10px] font-medium text-accent-600">
                  Sisa {product.stock}
                </span>
              )}
            </div>

            <button
              onClick={(e) => handleAddClick(e)}
              disabled={!product.isAvailable}
              className={cn(
                'shrink-0 rounded-full px-3 py-1 text-xs font-semibold text-white shadow-sm transition-colors disabled:cursor-not-allowed disabled:opacity-40',
                added
                  ? 'animate-cart-pop bg-green-500'
                  : 'bg-primary-700 hover:bg-primary-600 active:scale-95',
              )}
              aria-label={t('product_add')}
            >
              {added ? <Check className="h-3.5 w-3.5" /> : t('product_select')}
            </button>
          </div>
        </div>
      </div>

      {showVariantModal && (
        <VariantModal
          product={product}
          onConfirm={handleVariantConfirm}
          onClose={() => setShowVariantModal(false)}
        />
      )}
    </>
  );
}
