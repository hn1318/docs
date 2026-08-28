import { hweatherZh } from '@/lib/source';
import { ProjectDocsPage } from '@/components/project-docs-page';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

export default async function Page(props: PageProps<'/zh/docs/hweather/[[...slug]]'>) {
  const params = await props.params;
  return <ProjectDocsPage source={hweatherZh} params={params} />;
}

export function generateStaticParams() {
  return hweatherZh.generateParams();
}

export async function generateMetadata(props: PageProps<'/zh/docs/hweather/[[...slug]]'>): Promise<Metadata> {
  const params = await props.params;
  const page = hweatherZh.getPage(params.slug);
  if (!page) notFound();

  return {
    title: page.data.title,
    description: page.data.description,
  };
}
