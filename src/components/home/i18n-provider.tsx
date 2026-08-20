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
 * Wraps the home layout with fumadocs' I18nProvider so the built-in
 * `languageSelect` slot renders (a Languages icon next to the theme toggle).
 * `onLocaleChange` persists the choice in a cookie and navigates to the
 * matching root path, so the middleware's cookie-first rule makes the
 * switch stick instead of being re-negotiated by Accept-Language.
 */
export function HomeI18n({
  locale,
  children,
}: {
  locale: Locale;
  children: ReactNode;
}) {
  const router = useRouter();

  return (
    <I18nProvider
      locales={LOCALES}
      locale={locale}
      onLocaleChange={(value) => {
        const next = value as Locale;
        document.cookie = `locale=${next}; path=/; max-age=31536000; samesite=lax`;
        router.push(next === 'en' ? '/' : `/${next}`);
      }}
    >
      {children}
    </I18nProvider>
  );
}
