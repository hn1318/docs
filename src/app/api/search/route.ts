import { createSearchAPI } from 'fumadocs-core/search/server';
import { sourceEn, sourceZh } from '@/lib/source';

/**
 * Static search endpoint.
 *
 * With `output: 'export'` this GET handler runs at build time and is emitted
 * as a static JSON file. The client (`type: 'static'` in RootProvider) fetches
 * it once and performs the search entirely in the browser — no server needed.
 *
 * Both locales share a single multilingual index (Unicode word segmentation),
 * so Chinese and English are both searchable with zero extra config.
 */
export const dynamic = 'force-static';

async function buildIndexes() {
  const pages = [...sourceEn.getPages(), ...sourceZh.getPages()];

  return pages.map((page) => ({
    title: page.data.title,
    description: page.data.description,
    url: page.url,
    id: page.url,
    structuredData: page.data.structuredData,
  }));
}

export const { staticGET: GET } = createSearchAPI('advanced', {
  indexes: buildIndexes,
});
