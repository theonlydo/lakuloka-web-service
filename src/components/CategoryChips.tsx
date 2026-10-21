'use client';

import type { Category } from '~lib/types';
import { cn } from '~lib/utils';
import { useEffect, useRef } from 'react';

interface CategoryChipsProps {
  categories: Category[];
  activeCategory: number | null;
  onSelect: (id: number | null) => void;
}

export default function CategoryChips({ categories = [], activeCategory, onSelect }: CategoryChipsProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll the active chip into view inside the chips bar
  useEffect(() => {
    if (!scrollRef.current) return;
    const activeEl = scrollRef.current.querySelector<HTMLButtonElement>('[data-active="true"]');
    if (activeEl) {
      activeEl.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
  }, [activeCategory]);

  return (
    <div className="bg-gray-50">
      <div className="mx-auto max-w-2xl">
        <div className="border-b border-gray-100 bg-white">
        <div ref={scrollRef} className="flex gap-2 overflow-x-auto px-4 py-2.5 scrollbar-hide">
        {categories.map((cat) => (
          <button
            key={cat.id}
            data-active={activeCategory === cat.id ? 'true' : 'false'}
            onClick={() => onSelect(cat.id)}
            className={cn(
              'shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-colors',
              activeCategory === cat.id
                ? 'bg-primary-700 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200',
            )}
          >
            {cat.name}
          </button>
        ))}
      </div>
      </div>
      </div>
    </div>
  );
}
