import { campustaoEn } from '@/lib/source';
import { ProjectDocsPage } from '@/components/project-docs-page';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

export default async function Page(props: PageProps<'/docs/campustao/[[...slug]]'>) {
  const params = await props.params;
  return <ProjectDocsPage source={campustaoEn} params={params} />;
}

export function generateStaticParams() {
  return campustaoEn.generateParams();
}

export async function generateMetadata(props: PageProps<'/docs/campustao/[[...slug]]'>): Promise<Metadata> {
  const params = await props.params;
  const page = campustaoEn.getPage(params.slug);
  if (!page) notFound();

  return {
    title: page.data.title,
    description: page.data.description,
  };
}
