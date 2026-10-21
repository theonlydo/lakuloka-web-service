import { useState } from 'react';
import { Check } from 'lucide-react';
import type { Product, SelectedVariantOption, Variant, VariantOption } from '~lib/types';
import { useI18n } from '~lib/i18n';
import { formatRupiah } from '~lib/utils';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '~components/ui/dialog';
import { Button } from '~components/ui/button';

interface VariantModalProps {
  product: Product;
  onConfirm: (selections: SelectedVariantOption[], note: string) => void;
  onClose: () => void;
}

export default function VariantModal({ product, onConfirm, onClose }: VariantModalProps) {
  const { t } = useI18n();

  // selectedMap: groupName -> array of selected option names
  const [selectedMap, setSelectedMap] = useState<Record<string, string[]>>({});
  const [note, setNote] = useState('');
  const [errors, setErrors] = useState<string[]>([]);

  function toggleOption(group: Variant, option: VariantOption) {
    setSelectedMap((prev) => {
      const current = prev[group.groupName] ?? [];
      if (group.allowMultiple) {
        // Toggle: add if not present, remove if already selected
        const next = current.includes(option.listName)
          ? current.filter((n) => n !== option.listName)
          : [...current, option.listName];
        return { ...prev, [group.groupName]: next };
      } else {
        // Single select: replace
        return { ...prev, [group.groupName]: [option.listName] };
      }
    });
    setErrors((prev) => prev.filter((e) => e !== group.groupName));
  }

  function handleConfirm(e: React.MouseEvent<HTMLButtonElement>) {
    const missing: string[] = [];
    const selections: SelectedVariantOption[] = [];

    product.variants.forEach((group) => {
      const chosen = selectedMap[group.groupName] ?? [];
      if (group.isRequired && chosen.length === 0) {
        missing.push(group.groupName);
        return;
      }
      chosen.forEach((name) => {
        const opt = group.options.find((o) => o.listName === name);
        if (opt) {
          selections.push({
            groupName: group.groupName,
            optionName: opt.listName,
            price: opt.price,
            capitalPrice: opt.capitalPrice,
          });
        }
      });
    });

    if (missing.length > 0) {
      setErrors(missing);
      return;
    }

    const rect = e.currentTarget.getBoundingClientRect();
    window.dispatchEvent(
      new CustomEvent('cart:fly', {
        detail: { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 },
      }),
    );

    onConfirm(selections, note.trim());
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{product.name}</DialogTitle>
        </DialogHeader>

        <div className="mt-4 space-y-5">
          {product.variants.map((group) => {
            const hasError = errors.includes(group.groupName);
            const chosen = selectedMap[group.groupName] ?? [];
            return (
              <div key={group.id}>
                <div className="mb-2 flex items-center justify-between">
                  <span className={`text-sm font-semibold ${hasError ? 'text-red-500' : 'text-gray-800'}`}>
                    {group.groupName}
                    {group.isRequired && (
                      <span className="ml-1 text-xs font-normal text-red-400">
                        ({t('variant_required')})
                      </span>
                    )}
                  </span>
                </div>

                {group.allowMultiple ? (
                  // ── Checkbox list for multi-select ──────────────────────
                  <div className="space-y-2">
                    {group.options.map((opt) => {
                      const isSelected = chosen.includes(opt.listName);
                      return (
                        <button
                          key={opt.listName}
                          onClick={() => toggleOption(group, opt)}
                          className={`flex w-full items-center gap-3 rounded-lg border px-3 py-2 text-sm transition-colors ${
                            isSelected
                              ? 'border-primary bg-primary/10'
                              : hasError
                              ? 'border-red-300 bg-red-50 hover:border-primary'
                              : 'border-gray-200 bg-white hover:border-primary'
                          }`}
                        >
                          {/* Checkbox indicator */}
                          <span
                            className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border ${
                              isSelected
                                ? 'border-primary bg-primary text-white'
                                : 'border-gray-300 bg-white'
                            }`}
                          >
                            {isSelected && <Check className="h-3 w-3" strokeWidth={3} />}
                          </span>
                          <span className={`flex-1 text-left ${isSelected ? 'font-medium text-primary' : 'text-gray-700'}`}>
                            {opt.listName}
                          </span>
                          {opt.price > 0 && (
                            <span className="text-xs text-gray-500">+{formatRupiah(opt.price)}</span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  // ── Pill buttons for single-select ───────────────────────
                  <div className="flex flex-wrap gap-2">
                    {group.options.map((opt) => {
                      const isSelected = chosen.includes(opt.listName);
                      return (
                        <button
                          key={opt.listName}
                          onClick={() => toggleOption(group, opt)}
                          className={`rounded-lg border px-3 py-1.5 text-sm transition-colors ${
                            isSelected
                              ? 'border-primary bg-primary/10 font-medium text-primary'
                              : hasError
                              ? 'border-red-300 bg-red-50 text-gray-700 hover:border-primary'
                              : 'border-gray-200 bg-white text-gray-700 hover:border-primary'
                          }`}
                        >
                          {opt.listName}
                          {opt.price > 0 && (
                            <span className="ml-1 text-xs text-gray-500">
                              +{formatRupiah(opt.price)}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}

          {/* Note */}
          <div>
            <label className="mb-1 block text-sm font-semibold text-gray-700">
              {t('variant_note_label')}
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder={t('variant_note_placeholder')}
              rows={2}
              className="w-full rounded-lg border border-gray-200 p-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
        </div>

        <Button onClick={(e) => handleConfirm(e)} className="mt-6 w-full">
          {t('variant_add_to_cart')}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
