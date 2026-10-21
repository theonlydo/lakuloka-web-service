import { useEffect, useState, useRef } from 'react';
import QRCode from 'react-qr-code';
import { CheckCircle, XCircle } from 'lucide-react';
import { useI18n } from '~lib/i18n';
import { Button } from '~components/ui/button';
import type { SelfPayOrderResult, SelfPayOrderStatus } from '~lib/types';

interface SelfPayResultProps {
  businessId: string;
  order: SelfPayOrderResult;
  onNewOrder: () => void;
}

const POLL_INTERVAL_MS = 3000;

export default function SelfPayResult({ businessId, order, onNewOrder }: SelfPayResultProps) {
  const { t } = useI18n();
  const [status, setStatus] = useState<SelfPayOrderStatus>('pending_payment');
  const pollingRef = useRef(true);

  useEffect(() => {
    pollingRef.current = true;
    async function poll() {
      while (pollingRef.current) {
        try {
          const res = await fetch(
            `/api/table-ordering/${encodeURIComponent(businessId)}/orders/${encodeURIComponent(order.orderToken)}/status`,
            { cache: 'no-store' }
          );
          if (res.ok) {
            const data = await res.json();
            if (data.status && data.status !== 'pending_payment') {
              setStatus(data.status);
              pollingRef.current = false;
              return;
            }
          }
        } catch {
          // network hiccup — keep polling, next tick may succeed
        }
        await new Promise((r) => setTimeout(r, POLL_INTERVAL_MS));
      }
    }
    poll();
    return () => {
      pollingRef.current = false;
    };
  }, [businessId, order.orderToken]);

  if (status === 'paid') {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-6">
        <div className="w-full max-w-sm rounded-2xl bg-white p-8 text-center shadow-xl">
          <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
          <h2 className="mt-4 text-xl font-bold text-gray-900">{t('selfpay_paid_title')}</h2>
          <p className="mt-2 text-sm text-gray-600">{t('selfpay_paid_desc')}</p>
          <Button className="mt-6 w-full" onClick={onNewOrder}>
            {t('order_new_order')}
          </Button>
        </div>
      </div>
    );
  }

  if (status === 'expired' || status === 'cancelled') {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-6">
        <div className="w-full max-w-sm rounded-2xl bg-white p-8 text-center shadow-xl">
          <XCircle className="mx-auto h-16 w-16 text-red-500" />
          <h2 className="mt-4 text-xl font-bold text-gray-900">{t('selfpay_failed_title')}</h2>
          <p className="mt-2 text-sm text-gray-600">{t('selfpay_failed_desc')}</p>
          <Button className="mt-6 w-full" onClick={onNewOrder}>
            {t('order_new_order')}
          </Button>
        </div>
      </div>
    );
  }

  const qrValue = order.qris.qr_content || order.qris.qr_url || '';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-6">
      <div className="w-full max-w-sm rounded-2xl bg-white p-8 text-center shadow-xl">
        <h2 className="text-xl font-bold text-gray-900">{t('selfpay_qris_title')}</h2>
        <p className="mt-1 text-sm text-gray-500">{t('selfpay_qris_desc')}</p>

        {qrValue && (
          <div className="my-6 flex justify-center">
            <div className="rounded-xl bg-white p-3 ring-2 ring-primary">
              <QRCode value={qrValue} size={200} />
            </div>
          </div>
        )}

        <p className="text-sm font-semibold text-gray-700">{t('selfpay_waiting')}</p>
        <p className="mt-1 text-xs text-gray-400">{t('selfpay_dont_close')}</p>
      </div>
    </div>
  );
}
