import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import { appName, gitConfig } from './shared';
import { getDictionary } from '@/i18n/dict';
import type { Locale } from '@/i18n/config';

export function baseOptions(locale: Locale = 'en'): BaseLayoutProps {
  const dict = getDictionary(locale);
  const localePrefix = locale === 'en' ? '' : `/${locale}`;

  return {
    nav: {
      title: appName,
    },
    githubUrl: `https://github.com/${gitConfig.user}/${gitConfig.repo}`,
    links: [
      {
        text: dict.nav.docs,
        url: `${localePrefix}/docs`,
        active: 'nested-url',
      },
    ],
  };
}
