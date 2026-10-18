import { autoclickerZh } from '@/lib/source';
import { ProjectDocsLayout } from '@/components/project-docs-layout';

export default function Layout({ children }: LayoutProps<'/zh/docs/autoclicker'>) {
  return (
    <ProjectDocsLayout locale="zh" tree={autoclickerZh.getPageTree()}>
      {children}
    </ProjectDocsLayout>
  );
}
