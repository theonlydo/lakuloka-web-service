import { useState } from 'react';
import { useI18n } from '~lib/i18n';
import { useCart } from '~contexts/CartContext';
import { formatRupiah } from '~lib/utils';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '~components/ui/sheet';
import { Button } from '~components/ui/button';
import CartItemComponent from './CartItem';
import CheckoutForm from './CheckoutForm';
import SelfPayCheckoutForm from './SelfPayCheckoutForm';

interface CartDrawerProps {
  businessId: string;
  tableNo: string;
  paymentFlow: string;
  // F-33: Gold+ businesses get the new self-pay checkout instead of the
  // legacy direct_payment/can_paylater flow. Silver and below are
  // completely unaffected — this only ever adds a path, never removes one.
  tableOrderingAvailable: boolean;
}

export default function CartDrawer({ businessId, tableNo, paymentFlow, tableOrderingAvailable }: CartDrawerProps) {
  const { t } = useI18n();
  const { items, grandTotal, isOpen, closeCart, clearCart } = useCart();
  const [showCheckout, setShowCheckout] = useState(false);

  function handleCheckoutDone() {
    clearCart();
    closeCart();
    setShowCheckout(false);
  }

  return (
    <>
      <Sheet open={isOpen} onOpenChange={(open) => !open && closeCart()}>
        <SheetContent side="bottom" className="max-h-[85vh] overflow-y-auto pb-safe">
          <SheetHeader>
            <SheetTitle>{t('cart_title')}</SheetTitle>
          </SheetHeader>

          <div className="mt-2 divide-y divide-gray-100 px-6">
            {items.length === 0 ? (
              <div className="py-12 text-center">
                <p className="text-sm font-medium text-gray-700">{t('cart_empty')}</p>
                <p className="mt-1 text-xs text-gray-400">{t('cart_empty_desc')}</p>
              </div>
            ) : (
              items.map((item) => <CartItemComponent key={item.cartId} item={item} />)
            )}
          </div>

          {items.length > 0 && (
            <div className="mt-4 border-t border-gray-100 px-6 pb-6 pt-4">
              <div className="mb-4 flex items-center justify-between">
                <span className="text-sm font-semibold text-gray-700">{t('cart_total')}</span>
                <span className="text-base font-bold text-gray-900">{formatRupiah(grandTotal)}</span>
              </div>
              <Button className="w-full" onClick={() => { closeCart(); setShowCheckout(true); }}>
                {t('cart_checkout')}
              </Button>
            </div>
          )}
        </SheetContent>
      </Sheet>

      {showCheckout && tableOrderingAvailable && (
        <SelfPayCheckoutForm
          businessId={businessId}
          tableNo={tableNo}
          onClose={() => setShowCheckout(false)}
          onSuccess={handleCheckoutDone}
        />
      )}
      {showCheckout && !tableOrderingAvailable && (
        <CheckoutForm
          businessId={businessId}
          tableNo={tableNo}
          paymentFlow={paymentFlow}
          onClose={() => setShowCheckout(false)}
          onSuccess={handleCheckoutDone}
        />
      )}
    </>
  );
}
