import { nettoolZh } from '@/lib/source';
import { ProjectDocsPage } from '@/components/project-docs-page';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

export default async function Page(props: PageProps<'/zh/docs/nettool/[[...slug]]'>) {
  const params = await props.params;
  return <ProjectDocsPage source={nettoolZh} params={params} />;
}

export function generateStaticParams() {
  return nettoolZh.generateParams();
}

export async function generateMetadata(props: PageProps<'/zh/docs/nettool/[[...slug]]'>): Promise<Metadata> {
  const params = await props.params;
  const page = nettoolZh.getPage(params.slug);
  if (!page) notFound();

  return {
    title: page.data.title,
    description: page.data.description,
  };
}
