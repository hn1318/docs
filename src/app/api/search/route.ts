import { createSearchAPI } from 'fumadocs-core/search/server';
import type { StructuredData } from 'fumadocs-core/mdx-plugins/remark-structure';
import { allSources } from '@/lib/source';
import { projectTag } from '@/lib/projects';

/**
 * Static search endpoint.
 *
 * With `output: 'export'` this GET handler runs at build time and is emitted
 * as a static JSON file. The client (`type: 'static'` in RootProvider) fetches
 * it once and performs the search entirely in the browser — no server needed.
 *
 * All products' docs are merged into a single multilingual index. Each page
 * is tagged with its product (`frontmatter.product`, falling back to the URL
 * prefix) so the product dropdown in the search dialog can filter results.
 */
export const dynamic = 'force-static';

async function buildIndexes() {
  const pages = allSources.flatMap((source) => source.getPages());

  return pages.map((page) => ({
    title: page.data.title ?? '',
    description: page.data.description ?? '',
    url: page.url,
    id: page.url,
    structuredData: page.data.structuredData as StructuredData,
    tag: (page.data as { product?: string }).product ?? projectTag(page.url),
  }));
}

export const { staticGET: GET } = createSearchAPI('advanced', {
  indexes: buildIndexes,
});
