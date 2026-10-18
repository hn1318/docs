import { autoclickerEn } from '@/lib/source';
import { ProjectDocsPage } from '@/components/project-docs-page';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

export default async function Page(props: PageProps<'/docs/autoclicker/[[...slug]]'>) {
  const params = await props.params;
  return <ProjectDocsPage source={autoclickerEn} params={params} />;
}

export function generateStaticParams() {
  return autoclickerEn.generateParams();
}

export async function generateMetadata(props: PageProps<'/docs/autoclicker/[[...slug]]'>): Promise<Metadata> {
  const params = await props.params;
  const page = autoclickerEn.getPage(params.slug);
  if (!page) notFound();

  return {
    title: page.data.title,
    description: page.data.description,
  };
}
