import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { LanguageSelectText } from 'fumadocs-ui/layouts/shared/slots/language-select';
import { baseOptions } from '@/lib/layout.shared';
import { getProjectTabs } from '@/lib/projects';
import { SiteI18n } from '@/components/site-i18n';
import { NarrowLanguageSelect } from '@/components/language-select';
import type { Locale } from '@/i18n/config';
import type { ReactNode } from 'react';
import type { Root } from 'fumadocs-core/page-tree';

/**
 * Shared docs layout for every project.
 *
 * `tabMode="auto"` renders the product switcher (`getProjectTabs`) as a
 * dropdown right below the sidebar search box (and in the mobile drawer),
 * exactly like the official Fumadocs docs.
 */
export function ProjectDocsLayout({
  locale,
  tree,
  children,
}: {
  locale: Locale;
  tree: Root;
  children: ReactNode;
}) {
  return (
    <SiteI18n locale={locale}>
      <DocsLayout
        tree={tree}
        {...baseOptions(locale, { hideProjects: true })}
        tabs={getProjectTabs(locale)}
        tabMode="auto"
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
