import { getSource } from '@/lib/source';
import { ProjectDocsLayout } from '@/components/project-docs-layout';

export default function Layout({ children }: LayoutProps<'/docs/[[...slug]]'>) {
  return (
    <ProjectDocsLayout locale="en" tree={getSource('en').getPageTree()}>
      {children}
    </ProjectDocsLayout>
  );
}
