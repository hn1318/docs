import { RootProvider } from 'fumadocs-ui/provider/next';
import './global.css';
import { Inter } from 'next/font/google';
import { headers } from 'next/headers';
import { locales } from '@/i18n/config';
import type { Locale } from '@/i18n/config';

const inter = Inter({
  subsets: ['latin'],
});

export default async function Layout({ children }: LayoutProps<'/'>) {
  const headersList = await headers();
  const pathname =
    headersList.get('x-pathname') ?? headersList.get('x-invoke-pathname') ?? '/';

  const locale = (locales.find((l) => l !== 'en' && pathname.startsWith(`/${l}`)) ?? 'en') as Locale;

  return (
    <html lang={locale} className={inter.className} suppressHydrationWarning>
      <body className="flex flex-col min-h-screen">
        <RootProvider>{children}</RootProvider>
      </body>
    </html>
  );
}
