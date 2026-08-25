import { getSource } from '@/lib/source';
import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { baseOptions } from '@/lib/layout.shared';

export default function Layout({ children }: LayoutProps<'/docs'>) {
  const source = getSource('en');

  return (
    <DocsLayout tree={source.getPageTree()} {...baseOptions('en')}>
      {children}
    </DocsLayout>
  );
}
