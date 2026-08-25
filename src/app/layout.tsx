import { RootProvider } from 'fumadocs-ui/provider/next';
import './global.css';
import '@fontsource-variable/inter';
import { LocaleLang } from '@/components/locale-lang';

export default function Layout({ children }: LayoutProps<'/'>) {
  return (
    <html suppressHydrationWarning>
      <body className="flex flex-col min-h-screen">
        <LocaleLang />
        <RootProvider>{children}</RootProvider>
      </body>
    </html>
  );
}
