import { useState, useEffect } from 'react';
import { useI18n } from '~lib/i18n';
import { useCart } from '~contexts/CartContext';
import type { CreateOrderPayload, OrderResult } from '~lib/types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '~components/ui/dialog';
import { Button } from '~components/ui/button';
import OrderResultView from './OrderResult';

interface CheckoutFormProps {
  businessId: string;
  tableNo: string;
  paymentFlow: string;
  onClose: () => void;
  onSuccess: () => void;
}

export default function CheckoutForm({
  businessId,
  tableNo,
  paymentFlow,
  onClose,
  onSuccess,
}: CheckoutFormProps) {
  const { t } = useI18n();
  const { items, grandTotal } = useCart();

  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [tableNumber, setTableNumber] = useState(tableNo);

  // Pre-fill from last successful order
  useEffect(() => {
    try {
      const saved = localStorage.getItem('lk_customer');
      if (saved) {
        const { name, phone: savedPhone } = JSON.parse(saved);
        if (name) setCustomerName(name);
        if (savedPhone) setPhone(savedPhone);
      }
    } catch {
      // ignore parse errors
    }
  }, []);
  const [note, setNote] = useState('');
  const [fieldErrors, setFieldErrors] = useState<{ name?: string; phone?: string; table?: string }>({});
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState('');
  const [result, setResult] = useState<OrderResult | null>(null);

  function validate(): boolean {
    const errs: typeof fieldErrors = {};
    if (!customerName.trim()) errs.name = t('checkout_name_required');
    if (!phone.trim()) {
      errs.phone = t('checkout_phone_required');
    } else if (!/^(\+?62|0)[0-9]{8,12}$/.test(phone.replace(/[\s\-()]/g, ''))) {
      errs.phone = t('checkout_phone_invalid');
    }
    if (!tableNumber.trim()) errs.table = t('checkout_table_required');
    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSubmit() {
    if (!validate()) return;
    setSubmitting(true);
    setApiError('');

    const payload: CreateOrderPayload = {
      items: items.map((i) => ({
        productId: i.productId,
        productName: i.productName,
        qty: i.quantity,
        customerPrice: i.basePrice,
        variantSelections: i.variantSelections,
        note: i.note,
      })),
      customer: customerName.trim(),
      phone: phone.trim(),
      table: tableNumber.trim(),
      note: note.trim(),
      grandTotal,
      paymentFlow,
    };

    try {
      const res = await fetch(`/api/menu/${encodeURIComponent(businessId)}/order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorBody = await res.json().catch(() => ({}));
        setApiError(errorBody?.error || t('error_order_failed'));
        return;
      }

      const data: OrderResult = await res.json();
      // Persist name & phone for next order
      try {
        localStorage.setItem('lk_customer', JSON.stringify({
          name: customerName.trim(),
          phone: phone.trim(),
        }));
      } catch {
        // ignore storage errors
      }
      setResult(data);
    } catch {
      setApiError(t('error_order_failed'));
    } finally {
      setSubmitting(false);
    }
  }

  if (result) {
    return (
      <OrderResultView
        result={result}
        onNewOrder={onSuccess}
        onClose={onClose}
      />
    );
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('checkout_title')}</DialogTitle>
        </DialogHeader>

        <div className="mt-4 space-y-4">
          {/* Name */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              {t('checkout_name_label')}
              <span className="text-red-500"> *</span>
            </label>
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder={t('checkout_name_placeholder')}
              maxLength={100}
              className={`w-full rounded-lg border px-3 py-2.5 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 ${
                fieldErrors.name
                  ? 'border-red-400 focus:border-red-400 focus:ring-red-400'
                  : 'border-gray-300 focus:border-primary focus:ring-primary'
              }`}
            />
            {fieldErrors.name && (
              <p className="mt-1 text-xs text-red-500">{fieldErrors.name}</p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              {t('checkout_phone_label')}
              <span className="text-red-500"> *</span>
            </label>
            <input
              type="tel"
              inputMode="numeric"
              value={phone}
              onChange={(e) => {
                // Allow only digits, +, spaces, dashes
                const val = e.target.value.replace(/[^0-9+\-\s()]/g, '');
                if (val.replace(/\D/g, '').length <= 15) setPhone(val);
              }}
              placeholder={t('checkout_phone_placeholder')}
              maxLength={18}
              className={`w-full rounded-lg border px-3 py-2.5 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 ${
                fieldErrors.phone
                  ? 'border-red-400 focus:border-red-400 focus:ring-red-400'
                  : 'border-gray-300 focus:border-primary focus:ring-primary'
              }`}
            />
            {fieldErrors.phone && (
              <p className="mt-1 text-xs text-red-500">{fieldErrors.phone}</p>
            )}
          </div>

          {/* Table */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              {t('checkout_table_label')}
              <span className="text-red-500"> *</span>
            </label>
            <input
              type="text"
              value={tableNumber}
              onChange={(e) => setTableNumber(e.target.value)}
              placeholder={t('checkout_table_placeholder')}
              maxLength={20}
              className={`w-full rounded-lg border px-3 py-2.5 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 ${
                fieldErrors.table
                  ? 'border-red-400 focus:border-red-400 focus:ring-red-400'
                  : 'border-gray-300 focus:border-primary focus:ring-primary'
              }`}
            />
            {fieldErrors.table && (
              <p className="mt-1 text-xs text-red-500">{fieldErrors.table}</p>
            )}
          </div>

          {/* Note */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              {t('checkout_note_label')}
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder={t('checkout_note_placeholder')}
              rows={2}
              maxLength={250}
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm placeholder:text-gray-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          {apiError && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{apiError}</p>
          )}

          <Button
            className="w-full"
            onClick={handleSubmit}
            disabled={submitting}
          >
            {submitting ? t('loading') : t('checkout_submit')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
