import { sourceZh } from '@/lib/source';
import { ProjectDocsLayout } from '@/components/project-docs-layout';

export default function Layout({ children }: LayoutProps<'/zh/docs/[[...slug]]'>) {
  return (
    <ProjectDocsLayout locale="zh" tree={sourceZh.getPageTree()}>
      {children}
    </ProjectDocsLayout>
  );
}
