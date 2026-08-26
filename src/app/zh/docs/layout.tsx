import { sourceZh } from '@/lib/source';
import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { LanguageSelectText } from 'fumadocs-ui/layouts/shared/slots/language-select';
import { baseOptions } from '@/lib/layout.shared';
import { SiteI18n } from '@/components/site-i18n';
import { NarrowLanguageSelect } from '@/components/language-select';

export default function Layout({ children }: LayoutProps<'/zh/docs'>) {
  return (
    <SiteI18n locale="zh">
      <DocsLayout
        tree={sourceZh.getPageTree()}
        {...baseOptions('zh')}
        slots={{
          languageSelect: {
            root: NarrowLanguageSelect,
            text: LanguageSelectText,
          },
        }}
      >
        {children}
      </DocsLayout>
    </SiteI18n>
  );
}
