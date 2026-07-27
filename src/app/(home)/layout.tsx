import { HomeLayout } from 'fumadocs-ui/layouts/home';
import { baseOptions } from '@/lib/layout.shared';
import { headers } from 'next/headers';
import { locales } from '@/i18n/config';
import type { Locale } from '@/i18n/config';

export default async function Layout({ children }: LayoutProps<'/'>) {
  const headersList = await headers();
  const pathname =
    headersList.get('x-pathname') ?? headersList.get('x-invoke-pathname') ?? '/';

  const locale = (locales.find((l) => l !== 'en' && pathname.startsWith(`/${l}`)) ?? 'en') as Locale;

  return <HomeLayout {...baseOptions(locale)}>{children}</HomeLayout>;
}
