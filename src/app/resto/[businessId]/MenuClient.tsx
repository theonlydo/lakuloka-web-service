'use client';

import { useState, useCallback, useEffect } from 'react';
import type { BusinessInfo, MenuData } from '~lib/types';
import Header from '~components/Header';
import CategoryChips from '~components/CategoryChips';
import ProductGrid from '~components/ProductGrid';
import CartButton from '~components/CartButton';
import CartDrawer from '~components/CartDrawer';
import CartFlyEffect from '~components/CartFlyEffect';
import { Search } from 'lucide-react';
import { useI18n } from '~lib/i18n';

interface MenuClientProps {
  business: BusinessInfo;
  menuData: MenuData;
  tableNo: string;
  tableOrderingAvailable: boolean;
}

// Height of sticky header (~57px) + chips bar (~45px) + search bar (~53px) + small buffer
const STICKY_OFFSET = 165;

export default function MenuClient({ business, menuData, tableNo, tableOrderingAvailable }: MenuClientProps) {
  const { t } = useI18n();
  const [activeCategory, setActiveCategory] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const scrollToCategory = useCallback((id: number | null) => {
    if (id === null) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setActiveCategory(null);
      return;
    }
    const el = document.getElementById(`cat-section-${id}`);
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - STICKY_OFFSET + 8;
      window.scrollTo({ top, behavior: 'smooth' });
    }
    setActiveCategory(id);
  }, []);

  // Track active category via IntersectionObserver as user scrolls
  useEffect(() => {
    if (searchQuery) return;
    const sections = document.querySelectorAll<HTMLElement>('[data-cat-section]');
    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const intersecting = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (intersecting.length > 0) {
          const id = Number(intersecting[0].target.getAttribute('data-cat-section'));
          setActiveCategory(id > 0 ? id : null);
        }
      },
      { rootMargin: `-${STICKY_OFFSET}px 0px -55% 0px`, threshold: 0 },
    );

    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, [menuData.categories, searchQuery]);

  return (
    <div className="min-h-screen bg-gray-50">
      {business.bannerUrl && (
        <div className="mx-auto max-w-2xl">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={business.bannerUrl}
            alt={business.businessName}
            className="w-full object-cover"
            style={{ maxHeight: 200 }}
          />
        </div>
      )}

      {/* Single sticky container — header + chips + search always flush, no gap */}
      <div className="sticky top-0 z-30 bg-gray-50">
        <Header business={business} />
        <CategoryChips
          categories={menuData.categories}
          activeCategory={activeCategory}
          onSelect={scrollToCategory}
        />
        {/* Search bar — inside sticky wrapper so no gap on scroll */}
        <div className="border-b border-gray-100 bg-white px-4 py-2.5 shadow-sm">
          <div className="mx-auto max-w-2xl">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('search_placeholder')}
                className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-9 pr-4 text-sm text-gray-900 placeholder:text-gray-400 focus:border-primary-700 focus:outline-none focus:ring-1 focus:ring-primary-700"
              />
            </div>
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-2xl">
        <ProductGrid
          products={menuData.products}
          categories={menuData.categories}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
      </main>

      <CartButton />
      <CartFlyEffect />

      <CartDrawer
        businessId={business.businessId}
        tableNo={tableNo}
        paymentFlow={business.paymentFlow}
        tableOrderingAvailable={tableOrderingAvailable}
      />
    </div>
  );
}
