import { docsEn, docsZh } from 'collections/server';
import { loader } from 'fumadocs-core/source';
import { lucideIconsPlugin } from 'fumadocs-core/source/lucide-icons';
import { docsContentRoute, docsImageRoute, docsRoute } from './shared';
import type { Locale } from '@/i18n/config';

export const sourceEn = loader({
  baseUrl: docsRoute,
  source: docsEn.toFumadocsSource(),
  plugins: [lucideIconsPlugin()],
});

export const sourceZh = loader({
  baseUrl: '/zh/docs',
  source: docsZh.toFumadocsSource(),
  plugins: [lucideIconsPlugin()],
});

export function getSource(locale: Locale) {
  return locale === 'zh' ? sourceZh : sourceEn;
}

export function getPageImageUrl(page: { locale?: string; slugs: string[] }) {
  const segments = [...page.slugs, 'image.png'];

  return {
    segments,
    url: '/' + [page.locale, ...docsImageRoute.split('/'), ...segments].filter(Boolean).join('/'),
  };
}

export function getPageMarkdownUrl(page: { locale?: string; slugs: string[] }) {
  const segments = [...page.slugs, 'content.md'];

  return {
    segments,
    url:
      '/' + [page.locale, ...docsContentRoute.split('/'), ...segments].filter(Boolean).join('/'),
  };
}

export async function getLLMText(page: {
  data: { title: string; getText: (type: 'processed' | 'raw') => Promise<string> };
  url: string;
}) {
  const processed = await page.data.getText('processed');

  return `# ${page.data.title} (${page.url})

${processed}`;
}
