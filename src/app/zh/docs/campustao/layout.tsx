import { campustaoZh } from '@/lib/source';
import { ProjectDocsLayout } from '@/components/project-docs-layout';

export default function Layout({ children }: LayoutProps<'/zh/docs/campustao'>) {
  return (
    <ProjectDocsLayout locale="zh" tree={campustaoZh.getPageTree()}>
      {children}
    </ProjectDocsLayout>
  );
}
