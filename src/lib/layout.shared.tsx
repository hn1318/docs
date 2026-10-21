import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import { appName, gitConfig } from './shared';
import { getDictionary } from '@/i18n/dict';
import type { Locale } from '@/i18n/config';

export function baseOptions(
  locale: Locale = 'en',
  options?: { hideProjects?: boolean },
): BaseLayoutProps {
  const dict = getDictionary(locale);
  const localePrefix = locale === 'en' ? '' : `/${locale}`;

  return {
    nav: {
      title: appName,
      // Keep the language when clicking the brand title (zh pages stay on /zh).
      url: localePrefix || '/',
    },
    githubUrl: `https://github.com/${gitConfig.user}/${gitConfig.repo}`,
    // Docs layouts hide the "Projects" entry (it only makes sense on the home
    // page); the home layout keeps it.
    links: options?.hideProjects
      ? [
          {
            text: dict.nav.docs,
            url: `${localePrefix}/docs`,
            active: 'nested-url',
          },
          {
            text: dict.nav.downloads,
            url: `${localePrefix}/downloads`,
            active: 'nested-url',
          },
        ]
      : [
          {
            text: dict.nav.projects,
            url: `${localePrefix}/#projects`,
            active: 'none',
          },
          {
            text: dict.nav.docs,
            url: `${localePrefix}/docs`,
            active: 'nested-url',
          },
          {
            text: dict.nav.downloads,
            url: `${localePrefix}/downloads`,
            active: 'nested-url',
          },
        ],
  };
}
