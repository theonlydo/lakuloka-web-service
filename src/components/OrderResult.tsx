import type { OrderResult } from '~lib/types';
import { useI18n } from '~lib/i18n';
import { Button } from '~components/ui/button';
import QRCode from 'react-qr-code';
import { CheckCircle } from 'lucide-react';

interface OrderResultProps {
  result: OrderResult;
  onNewOrder: () => void;
  onClose: () => void;
}

export default function OrderResultView({ result, onNewOrder, onClose }: OrderResultProps) {
  const { t } = useI18n();

  if (result.type === 'pending') {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-6">
        <div className="w-full max-w-sm rounded-2xl bg-white p-8 text-center shadow-xl">
          <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
          <h2 className="mt-4 text-xl font-bold text-gray-900">{t('order_pending_title')}</h2>
          <p className="mt-2 text-sm text-gray-600">{t('order_pending_desc')}</p>
          <p className="mt-2 text-xs text-gray-400">{t('order_pending_note')}</p>
          <Button className="mt-6 w-full" onClick={onNewOrder}>
            {t('order_new_order')}
          </Button>
        </div>
      </div>
    );
  }

  // QR flow
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-6">
      <div className="w-full max-w-sm rounded-2xl bg-white p-8 text-center shadow-xl">
        <h2 className="text-xl font-bold text-gray-900">{t('order_qr_title')}</h2>
        <p className="mt-1 text-sm text-gray-500">{t('order_qr_desc')}</p>

        {result.token && (
          <div className="my-6 flex justify-center">
            <div className="rounded-xl bg-white p-3 ring-2 ring-primary">
              <QRCode value={JSON.stringify({ type: 'digital_menu', token: result.token })} size={200} />
            </div>
          </div>
        )}

        <p className="text-xs text-gray-400">{t('order_qr_expires')}</p>

        <Button className="mt-6 w-full" onClick={onNewOrder}>
          {t('order_new_order')}
        </Button>
      </div>
    </div>
  );
}
