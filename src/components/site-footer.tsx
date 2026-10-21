import Link from 'next/link';
import { getDictionary } from '@/i18n/dict';
import type { Locale } from '@/i18n/config';
import { homeProjects } from '@/lib/home-projects';

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

        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-fd-border pt-6 text-xs text-fd-muted-foreground sm:flex-row">
          <p>&copy; {new Date().getFullYear()} MakerStudio. {dict.footer.rights}</p>
          <div className="flex flex-col items-center gap-3 sm:flex-row sm:gap-4">
            <a
              href="https://status.hn3.top/status/u"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full border border-fd-border bg-fd-card px-2.5 py-1 font-medium transition-colors hover:border-fd-primary/40 hover:text-fd-foreground"
            >
              <span className="relative flex size-1.5">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-500 opacity-75" />
                <span className="relative inline-flex size-1.5 rounded-full bg-emerald-500" />
              </span>
              Status
            </a>
            <p>Next.js · Fumadocs · Tailwind CSS · Cloudflare</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
