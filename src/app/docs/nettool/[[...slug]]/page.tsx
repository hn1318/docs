import { nettoolEn } from '@/lib/source';
import { ProjectDocsPage } from '@/components/project-docs-page';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

export default async function Page(props: PageProps<'/docs/nettool/[[...slug]]'>) {
  const params = await props.params;
  return <ProjectDocsPage source={nettoolEn} params={params} />;
}

export function generateStaticParams() {
  return nettoolEn.generateParams();
}

export async function generateMetadata(props: PageProps<'/docs/nettool/[[...slug]]'>): Promise<Metadata> {
  const params = await props.params;
  const page = nettoolEn.getPage(params.slug);
  if (!page) notFound();

  return {
    title: page.data.title,
    description: page.data.description,
  };
}
