import { HomeLayout } from 'fumadocs-ui/layouts/home';
import { LanguageSelectText } from 'fumadocs-ui/layouts/shared/slots/language-select';
import { baseOptions } from '@/lib/layout.shared';
import { SiteI18n } from '@/components/site-i18n';
import { NarrowLanguageSelect } from '@/components/language-select';

export default function Layout({ children }: LayoutProps<'/zh/downloads'>) {
  return (
    <SiteI18n locale="zh">
      <HomeLayout
        {...baseOptions('zh')}
        slots={{
          languageSelect: {
            root: NarrowLanguageSelect,
            text: LanguageSelectText,
          },
        }}
      >
        {children}
      </HomeLayout>
    </SiteI18n>
  );
}
