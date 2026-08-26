import { getSource } from '@/lib/source';
import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { LanguageSelectText } from 'fumadocs-ui/layouts/shared/slots/language-select';
import { baseOptions } from '@/lib/layout.shared';
import { SiteI18n } from '@/components/site-i18n';
import { NarrowLanguageSelect } from '@/components/language-select';

export default function Layout({ children }: LayoutProps<'/docs'>) {
  const source = getSource('en');

  return (
    <SiteI18n locale="en">
      <DocsLayout
        tree={source.getPageTree()}
        {...baseOptions('en')}
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
