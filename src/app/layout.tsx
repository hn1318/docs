import { RootProvider } from 'fumadocs-ui/provider/next';
import './global.css';
import '@fontsource-variable/inter';
import { LocaleLang } from '@/components/locale-lang';
import { SearchDialogWithProducts } from '@/components/search-dialog';

export default function Layout({ children }: LayoutProps<'/'>) {
  return (
    <html suppressHydrationWarning>
      <head>
        {/* Umami analytics */}
        <script
          defer
          src="https://umami.hn3.top/script.js"
          data-website-id="ed0ddb51-b293-4d8f-9a66-a297c16b5802"
        />
        <script defer src="https://umami.hn3.top/recorder.js" data-website-id="ed0ddb51-b293-4d8f-9a66-a297c16b5802" />
      </head>
      <body className="flex flex-col min-h-screen">
        <LocaleLang />
        <RootProvider
          search={{
            // Custom dialog: product filter dropdown shown on docs pages only.
            SearchDialog: SearchDialogWithProducts,
            options: {
              // Static export: search runs fully client-side against the
              // build-time JSON index emitted by /api/search.
              type: 'static',
              api: '/api/search',
              // Product dropdown rendered below the search input (docs only).
              // Page tag is `frontmatter.product` or `'all'`.
              tags: [
                { name: 'All', value: 'all' },
                { name: 'HWeather', value: 'hweather' },
                { name: 'HChat', value: 'hchat' },
                { name: 'NetTool', value: 'nettool' },
                { name: 'CampusTao', value: 'campustao' },
              ],
              defaultTag: 'all',
            },
          }}
        >
          {children}
        </RootProvider>
      </body>
    </html>
  );
}
