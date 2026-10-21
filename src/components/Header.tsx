'use client';

import type { BusinessInfo } from '~lib/types';
import { MapPin } from 'lucide-react';
import { useI18n } from '~lib/i18n';

interface HeaderProps {
  business: BusinessInfo;
}

export default function Header({ business }: HeaderProps) {
  const { locale, toggleLocale } = useI18n();

  return (
    <header className="bg-gray-50">
      <div className="mx-auto max-w-2xl">
        <div className="bg-primary-700 px-4 py-3.5 text-white shadow-md">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h1 className="text-lg font-bold leading-tight tracking-tight">
                {business.businessName}
              </h1>
              {business.address && (
                <p className="mt-0.5 flex items-start gap-1 text-xs text-primary-200 opacity-90">
                  <MapPin className="mt-px h-3 w-3 shrink-0" />
                  <span className="line-clamp-1">{business.address}</span>
                </p>
              )}
            </div>
            <div className="flex flex-col items-end gap-1">
              <div
                onClick={toggleLocale}
                role="button"
                aria-label="Toggle language"
                className="mt-0.5 flex shrink-0 cursor-pointer select-none items-center rounded-full border border-white/30 bg-white/10 p-0.5 text-xs font-semibold tracking-wide transition hover:bg-white/20"
              >
                <span className={`rounded-full px-2 py-0.5 transition ${locale === 'id' ? 'bg-white text-primary-700' : 'text-white/70'}`}>
                  ID
                </span>
                <span className={`rounded-full px-2 py-0.5 transition ${locale === 'en' ? 'bg-white text-primary-700' : 'text-white/70'}`}>
                  EN
                </span>
              </div>
              <span className="text-[10px] text-white/40 whitespace-nowrap">Powered by Lakuloka</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
