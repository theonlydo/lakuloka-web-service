'use client';

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import id from './id';
import en from './en';
import type { TranslationKey } from './id';

type Locale = 'id' | 'en';

const translations: Record<Locale, Record<TranslationKey, string>> = { id, en };

interface I18nContextValue {
  locale: Locale;
  t: (key: TranslationKey, vars?: Record<string, string | number>) => string;
  toggleLocale: () => void;
}

const I18nContext = createContext<I18nContextValue>({
  locale: 'id',
  t: (key) => key,
  toggleLocale: () => {},
});

export function I18nProvider({
  children,
  initialLocale = 'id',
}: {
  children: ReactNode;
  initialLocale?: Locale;
}) {
  const [locale, setLocale] = useState<Locale>(initialLocale);

  const toggleLocale = useCallback(() => {
    setLocale((l) => (l === 'id' ? 'en' : 'id'));
  }, []);

  const value = useMemo<I18nContextValue>(
    () => ({
      locale,
      toggleLocale,
      t: (key, vars) => {
        let str = translations[locale][key] ?? translations['id'][key] ?? key;
        if (vars) {
          Object.entries(vars).forEach(([k, v]) => {
            str = str.replace(`{${k}}`, String(v));
          });
        }
        return str;
      },
    }),
    [locale, toggleLocale]
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nContextValue {
  return useContext(I18nContext);
}
