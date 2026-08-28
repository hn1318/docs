import { campustaoZh } from '@/lib/source';
import { ProjectDocsPage } from '@/components/project-docs-page';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

export default async function Page(props: PageProps<'/zh/docs/campustao/[[...slug]]'>) {
  const params = await props.params;
  return <ProjectDocsPage source={campustaoZh} params={params} />;
}

export function generateStaticParams() {
  return campustaoZh.generateParams();
}

export async function generateMetadata(props: PageProps<'/zh/docs/campustao/[[...slug]]'>): Promise<Metadata> {
  const params = await props.params;
  const page = campustaoZh.getPage(params.slug);
  if (!page) notFound();

  return {
    title: page.data.title,
    description: page.data.description,
  };
}
