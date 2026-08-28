import { hchatEn } from '@/lib/source';
import { ProjectDocsPage } from '@/components/project-docs-page';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

export default async function Page(props: PageProps<'/docs/hchat/[[...slug]]'>) {
  const params = await props.params;
  return <ProjectDocsPage source={hchatEn} params={params} />;
}

export function generateStaticParams() {
  return hchatEn.generateParams();
}

export async function generateMetadata(props: PageProps<'/docs/hchat/[[...slug]]'>): Promise<Metadata> {
  const params = await props.params;
  const page = hchatEn.getPage(params.slug);
  if (!page) notFound();

  return {
    title: page.data.title,
    description: page.data.description,
  };
}
