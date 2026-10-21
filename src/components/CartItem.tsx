import { useState } from 'react';
import type { CartItem as CartItemType } from '~lib/types';
import { useI18n } from '~lib/i18n';
import { useCart } from '~contexts/CartContext';
import { formatRupiah, formatVariantText } from '~lib/utils';
import { Check, Minus, Pencil, Plus, Trash2, X } from 'lucide-react';

interface CartItemProps {
  item: CartItemType;
}

export default function CartItem({ item }: CartItemProps) {
  const { t } = useI18n();
  const { updateQuantity, removeFromCart, updateNote } = useCart();
  const [editingNote, setEditingNote] = useState(false);
  const [noteValue, setNoteValue] = useState(item.note);

  function saveNote() {
    updateNote(item.cartId, noteValue.trim());
    setEditingNote(false);
  }

  function cancelNote() {
    setNoteValue(item.note);
    setEditingNote(false);
  }

  return (
    <div className="flex gap-3 py-3">
      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-gray-900 leading-tight line-clamp-1">
          {item.productName}
        </p>
        {item.variantSelections.length > 0 && (
          <p className="mt-0.5 text-xs text-gray-500 line-clamp-2">
            {formatVariantText(item.variantSelections)}
          </p>
        )}

        {/* Note display / edit */}
        {editingNote ? (
          <div className="mt-1.5">
            <textarea
              autoFocus
              value={noteValue}
              onChange={(e) => setNoteValue(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); saveNote(); } if (e.key === 'Escape') cancelNote(); }}
              placeholder={t('cart_note_placeholder')}
              rows={2}
              maxLength={250}
              className="w-full rounded-lg border border-primary/40 px-2.5 py-1.5 text-xs text-gray-800 placeholder:text-gray-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <div className="mt-1 flex gap-1.5">
              <button
                onClick={saveNote}
                className="flex items-center gap-1 rounded-full bg-primary px-2.5 py-0.5 text-xs font-medium text-white"
              >
                <Check className="h-3 w-3" /> Simpan
              </button>
              <button
                onClick={cancelNote}
                className="flex items-center gap-1 rounded-full border border-gray-300 px-2.5 py-0.5 text-xs text-gray-500 hover:border-gray-400"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => { setNoteValue(item.note); setEditingNote(true); }}
            className="mt-0.5 flex items-center gap-1 text-left"
          >
            {item.note ? (
              <span className="text-xs italic text-gray-400 line-clamp-1">{t('cart_note', { note: item.note })}</span>
            ) : (
              <span className="text-xs text-gray-400 hover:text-primary">{t('cart_note_add')}</span>
            )}
            <Pencil className="h-3 w-3 shrink-0 text-gray-300 hover:text-primary" />
          </button>
        )}

        <p className="mt-1.5 text-sm font-bold text-primary">{formatRupiah(item.subtotal)}</p>
      </div>

      {/* Quantity controls */}
      <div className="flex shrink-0 flex-col items-end justify-between">
        <button
          onClick={() => removeFromCart(item.cartId)}
          aria-label={t('cart_item_remove')}
          className="text-red-400 hover:text-red-600 transition-colors"
        >
          <Trash2 className="h-4 w-4" />
        </button>
        <div className="flex items-center gap-2 mt-2">
          <button
            onClick={() => updateQuantity(item.cartId, item.quantity - 1)}
            className="flex h-7 w-7 items-center justify-center rounded-full border border-gray-200 text-gray-600 hover:border-primary hover:text-primary transition-colors"
          >
            <Minus className="h-3 w-3" />
          </button>
          <span className="min-w-[1.5rem] text-center text-sm font-semibold">{item.quantity}</span>
          <button
            onClick={() => updateQuantity(item.cartId, item.quantity + 1)}
            className="flex h-7 w-7 items-center justify-center rounded-full border border-gray-200 text-gray-600 hover:border-primary hover:text-primary transition-colors"
          >
            <Plus className="h-3 w-3" />
          </button>
        </div>
      </div>
    </div>
  );
}
