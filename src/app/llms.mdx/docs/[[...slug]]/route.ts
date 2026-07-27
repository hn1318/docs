import { getLLMText, getPageMarkdownUrl, sourceEn, sourceZh } from '@/lib/source';
import { notFound } from 'next/navigation';

export const revalidate = false;

export async function GET(_req: Request, { params }: RouteContext<'/llms.mdx/docs/[[...slug]]'>) {
  const { slug } = await params;
  const slugs = slug?.slice(0, -1);

  const page = sourceEn.getPage(slugs) ?? sourceZh.getPage(slugs);
  if (!page) notFound();

  return new Response(await getLLMText(page), {
    headers: {
      'Content-Type': 'text/markdown',
    },
  });
}

export function generateStaticParams() {
  const enPages = sourceEn.getPages().map((page) => ({
    lang: page.locale,
    slug: getPageMarkdownUrl(page).segments,
  }));
  const zhPages = sourceZh.getPages().map((page) => ({
    lang: page.locale,
    slug: getPageMarkdownUrl(page).segments,
  }));
  return [...enPages, ...zhPages];
}
