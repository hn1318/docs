import { defineConfig, defineDocs } from 'fumadocs-mdx/config';
import { metaSchema, pageSchema } from 'fumadocs-core/source/schema';

// Each product gets its own bilingual docs set under content/<product>/.
const docs = (dir: string) =>
  defineDocs({
    dir,
    docs: {
      schema: pageSchema,
      postprocess: {
        includeProcessedMarkdown: true,
      },
    },
    meta: {
      schema: metaSchema,
    },
  });

export const docsEn = docs('content/docs/en');
export const docsZh = docs('content/docs/zh');

export const hweatherEn = docs('content/hweather/en');
export const hweatherZh = docs('content/hweather/zh');

export const hchatEn = docs('content/hchat/en');
export const hchatZh = docs('content/hchat/zh');

export const nettoolEn = docs('content/nettool/en');
export const nettoolZh = docs('content/nettool/zh');

export const campustaoEn = docs('content/campustao/en');
export const campustaoZh = docs('content/campustao/zh');

export default defineConfig({
  mdxOptions: {
    // MDX options
  },
});
