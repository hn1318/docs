'use client';

import { I18nProvider } from 'fumadocs-ui/contexts/i18n';
import { useRouter } from 'next/navigation';
import type { ReactNode } from 'react';
import type { Locale } from '@/i18n/config';

const LOCALES: { locale: string; name: string }[] = [
  { locale: 'en', name: 'English' },
  { locale: 'zh', name: '中文' },
];

/**
 * Wraps a layout with fumadocs' I18nProvider so the language switcher
 * (and the search dialog's locale awareness) works on every page.
 *
 * `onLocaleChange` swaps the `/zh` prefix of the current path, so switching
 * language keeps you on the equivalent page instead of jumping to the root.
 */
export function SiteI18n({ locale, children }: { locale: Locale; children: ReactNode }) {
  const router = useRouter();

  return (
    <I18nProvider
      locales={LOCALES}
      locale={locale}
      onLocaleChange={(value) => {
        const path = window.location.pathname;
        const stripped = path.startsWith('/zh') ? path.slice(3) || '/' : path;
        router.push(value === 'en' ? stripped : `/${value}${stripped}`);
      }}
    >
      {children}
    </I18nProvider>
  );
}
