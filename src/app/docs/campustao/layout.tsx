import { campustaoEn } from '@/lib/source';
import { ProjectDocsLayout } from '@/components/project-docs-layout';

export default function Layout({ children }: LayoutProps<'/docs/campustao'>) {
  return (
    <ProjectDocsLayout locale="en" tree={campustaoEn.getPageTree()}>
      {children}
    </ProjectDocsLayout>
  );
}
