import { HomeLayout } from 'fumadocs-ui/layouts/home';
import { baseOptions } from '@/lib/layout.shared';
import { HomeI18n } from '@/components/home/i18n-provider';

export default function Layout({ children }: LayoutProps<'/'>) {
  return (
    <HomeI18n locale="en">
      <HomeLayout {...baseOptions('en')}>{children}</HomeLayout>
    </HomeI18n>
  );
}
