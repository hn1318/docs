import { hchatEn } from '@/lib/source';
import { ProjectDocsLayout } from '@/components/project-docs-layout';

export default function Layout({ children }: LayoutProps<'/docs/hchat'>) {
  return (
    <ProjectDocsLayout locale="en" tree={hchatEn.getPageTree()}>
      {children}
    </ProjectDocsLayout>
  );
}
