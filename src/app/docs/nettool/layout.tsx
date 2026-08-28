import { nettoolEn } from '@/lib/source';
import { ProjectDocsLayout } from '@/components/project-docs-layout';

export default function Layout({ children }: LayoutProps<'/docs/nettool'>) {
  return (
    <ProjectDocsLayout locale="en" tree={nettoolEn.getPageTree()}>
      {children}
    </ProjectDocsLayout>
  );
}
