import { autoclickerEn } from '@/lib/source';
import { ProjectDocsLayout } from '@/components/project-docs-layout';

export default function Layout({ children }: LayoutProps<'/docs/autoclicker'>) {
  return (
    <ProjectDocsLayout locale="en" tree={autoclickerEn.getPageTree()}>
      {children}
    </ProjectDocsLayout>
  );
}
