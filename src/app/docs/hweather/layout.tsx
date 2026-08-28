import { hweatherEn } from '@/lib/source';
import { ProjectDocsLayout } from '@/components/project-docs-layout';

export default function Layout({ children }: LayoutProps<'/docs/hweather'>) {
  return (
    <ProjectDocsLayout locale="en" tree={hweatherEn.getPageTree()}>
      {children}
    </ProjectDocsLayout>
  );
}
