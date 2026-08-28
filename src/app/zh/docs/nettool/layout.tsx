import { nettoolZh } from '@/lib/source';
import { ProjectDocsLayout } from '@/components/project-docs-layout';

export default function Layout({ children }: LayoutProps<'/zh/docs/nettool'>) {
  return (
    <ProjectDocsLayout locale="zh" tree={nettoolZh.getPageTree()}>
      {children}
    </ProjectDocsLayout>
  );
}
