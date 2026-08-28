import {
  campustaoEn as campustaoEnCol,
  campustaoZh as campustaoZhCol,
  docsEn as docsEnCol,
  docsZh as docsZhCol,
  hchatEn as hchatEnCol,
  hchatZh as hchatZhCol,
  hweatherEn as hweatherEnCol,
  hweatherZh as hweatherZhCol,
  nettoolEn as nettoolEnCol,
  nettoolZh as nettoolZhCol,
} from 'collections/server';
import { loader } from 'fumadocs-core/source';
import { lucideIconsPlugin } from 'fumadocs-core/source/lucide-icons';
import { docsContentRoute, docsRoute } from './shared';
import type { Locale } from '@/i18n/config';

// MakerStudio
export const sourceEn = loader({
  baseUrl: docsRoute,
  source: docsEnCol.toFumadocsSource(),
  plugins: [lucideIconsPlugin()],
});
export const sourceZh = loader({
  baseUrl: '/zh/docs',
  source: docsZhCol.toFumadocsSource(),
  plugins: [lucideIconsPlugin()],
});

// HWeather
export const hweatherEn = loader({
  baseUrl: '/docs/hweather',
  source: hweatherEnCol.toFumadocsSource(),
  plugins: [lucideIconsPlugin()],
});
export const hweatherZh = loader({
  baseUrl: '/zh/docs/hweather',
  source: hweatherZhCol.toFumadocsSource(),
  plugins: [lucideIconsPlugin()],
});

// HChat
export const hchatEn = loader({
  baseUrl: '/docs/hchat',
  source: hchatEnCol.toFumadocsSource(),
  plugins: [lucideIconsPlugin()],
});
export const hchatZh = loader({
  baseUrl: '/zh/docs/hchat',
  source: hchatZhCol.toFumadocsSource(),
  plugins: [lucideIconsPlugin()],
});

// NetTool
export const nettoolEn = loader({
  baseUrl: '/docs/nettool',
  source: nettoolEnCol.toFumadocsSource(),
  plugins: [lucideIconsPlugin()],
});
export const nettoolZh = loader({
  baseUrl: '/zh/docs/nettool',
  source: nettoolZhCol.toFumadocsSource(),
  plugins: [lucideIconsPlugin()],
});

// CampusTao
export const campustaoEn = loader({
  baseUrl: '/docs/campustao',
  source: campustaoEnCol.toFumadocsSource(),
  plugins: [lucideIconsPlugin()],
});
export const campustaoZh = loader({
  baseUrl: '/zh/docs/campustao',
  source: campustaoZhCol.toFumadocsSource(),
  plugins: [lucideIconsPlugin()],
});

/** All sources across every project & locale, for search indexing. */
export const allSources = [
  sourceEn,
  sourceZh,
  hweatherEn,
  hweatherZh,
  hchatEn,
  hchatZh,
  nettoolEn,
  nettoolZh,
  campustaoEn,
  campustaoZh,
];

export function getSource(locale: Locale) {
  return locale === 'zh' ? sourceZh : sourceEn;
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
