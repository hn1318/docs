import Link from 'next/link';
import { getDictionary } from '@/i18n/dict';
import type { Locale } from '@/i18n/config';
import { homeProjects } from '@/lib/home-projects';
import { SiteStatus } from '@/components/site-status';

/**
 * Site-wide footer: brand, product links, resources and the live status pill.
 * Shared by the home page and the downloads page so both stay visually identical.
 */
export function SiteFooter({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  const prefix = locale === 'zh' ? '/zh' : '';

  return (
    <footer className="mt-auto border-t border-fd-border bg-fd-card/50">
      <div className="mx-auto max-w-screen-lg px-6 py-12">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* brand */}
          <div className="lg:col-span-2">
            <p className="text-lg font-semibold tracking-tight">MakerStudio</p>
            <p className="mt-2 max-w-xs text-sm leading-relaxed text-fd-muted-foreground">
              {dict.footer.tagline}
            </p>
          </div>

          {/* products */}
          <div>
            <p className="text-sm font-semibold">{dict.footer.product}</p>
            <ul className="mt-3 space-y-2">
              {homeProjects.map((project) => (
                <li key={project.key}>
                  <a
                    href={project.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-fd-muted-foreground transition-colors hover:text-fd-foreground"
                  >
                    {dict.projects.items[project.key].name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* resources */}
          <div>
            <p className="text-sm font-semibold">{dict.footer.resources}</p>
            <ul className="mt-3 space-y-2">
              <li>
                <Link
                  href={`${prefix}/docs`}
                  className="text-sm text-fd-muted-foreground transition-colors hover:text-fd-foreground"
                >
                  {dict.nav.docs}
                </Link>
              </li>
              <li>
                <Link
                  href={`${prefix}/downloads`}
                  className="text-sm text-fd-muted-foreground transition-colors hover:text-fd-foreground"
                >
                  {dict.nav.downloads}
                </Link>
              </li>
              <li>
                <Link
                  href={`${prefix}/docs/privacy`}
                  className="text-sm text-fd-muted-foreground transition-colors hover:text-fd-foreground"
                >
                  {dict.nav.privacy}
                </Link>
              </li>
              <li>
                <Link
                  href={`${prefix}/docs/terms`}
                  className="text-sm text-fd-muted-foreground transition-colors hover:text-fd-foreground"
                >
                  {dict.nav.terms}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-fd-border pt-6 text-xs text-fd-muted-foreground sm:flex-row">
          <div className="flex flex-col items-center gap-1.5 text-center sm:flex-row sm:gap-3 sm:text-left">
            <p>&copy; {new Date().getFullYear()} MakerStudio. {dict.footer.rights}</p>
            <span aria-hidden className="hidden size-1 rounded-full bg-fd-border sm:block" />
            <p>Next.js · Fumadocs · Tailwind CSS · Cloudflare</p>
          </div>
          <SiteStatus locale={locale} labels={dict.status} />
        </div>
      </div>
    </footer>
  );
}
