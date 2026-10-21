'use client';

import type { Product, Category } from '~lib/types';
import { useMemo } from 'react';
import { useI18n } from '~lib/i18n';
import ProductCard from './ProductCard';

interface ProductGridProps {
  products: Product[];
  categories: Category[];
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export default function ProductGrid({
  products,
  categories,
  searchQuery,
  onSearchChange,
}: ProductGridProps) {
  const { t } = useI18n();

  const filtered = useMemo(() => {
    if (!searchQuery) return products;
    const q = searchQuery.toLowerCase();
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q),
    );
  }, [products, searchQuery]);

  const sections = useMemo(() => {
    const catIds = new Set(categories.map((c) => c.id));
    const byCat = categories
      .map((cat) => ({
        category: cat,
        items: filtered.filter((p) => p.categoryId === cat.id),
      }))
      .filter((s) => s.items.length > 0);

    const uncategorized = filtered.filter(
      (p) => !p.categoryId || !catIds.has(p.categoryId),
    );

    return { byCat, uncategorized };
  }, [categories, filtered]);

  const isEmpty = sections.byCat.length === 0 && sections.uncategorized.length === 0;

  return (
    <div className="pb-32">

      {isEmpty ? (
        <div className="py-20 text-center text-sm text-gray-400">
          {searchQuery ? t('search_no_results') : t('error_load_menu')}
        </div>
      ) : (
        <>
          {sections.byCat.map(({ category, items }) => (
            <section
              key={category.id}
              id={`cat-section-${category.id}`}
              data-cat-section={category.id}
            >
              {/* Section header */}
              <div className="px-4 pt-5 pb-2">
                <h2 className="text-[15px] font-bold text-gray-900">{category.name}</h2>
                <div className="mt-1.5 h-0.5 w-8 rounded-full bg-primary-700" />
              </div>
              {/* Product list */}
              <div className="divide-y divide-gray-100 bg-white">
                {items.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </section>
          ))}

          {sections.uncategorized.length > 0 && (
            <section id="cat-section-0" data-cat-section="0">
              <div className="px-4 pt-5 pb-2">
                <h2 className="text-[15px] font-bold text-gray-900">Lainnya</h2>
                <div className="mt-1.5 h-0.5 w-8 rounded-full bg-primary-700" />
              </div>
              <div className="divide-y divide-gray-100 bg-white">
                {sections.uncategorized.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
}
