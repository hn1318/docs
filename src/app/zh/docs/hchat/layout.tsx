import { hchatZh } from '@/lib/source';
import { ProjectDocsLayout } from '@/components/project-docs-layout';

export default function Layout({ children }: LayoutProps<'/zh/docs/hchat'>) {
  return (
    <ProjectDocsLayout locale="zh" tree={hchatZh.getPageTree()}>
      {children}
    </ProjectDocsLayout>
  );
}
