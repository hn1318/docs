import { hweatherZh } from '@/lib/source';
import { ProjectDocsLayout } from '@/components/project-docs-layout';

export default function Layout({ children }: LayoutProps<'/zh/docs/hweather'>) {
  return (
    <ProjectDocsLayout locale="zh" tree={hweatherZh.getPageTree()}>
      {children}
    </ProjectDocsLayout>
  );
}
