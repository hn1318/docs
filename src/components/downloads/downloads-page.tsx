import Link from 'next/link';
import {
  ArrowRight,
  ChevronDown,
  ExternalLink,
  Globe,
  Package,
  Server,
  ShieldCheck,
} from 'lucide-react';
import { SiteFooter } from '@/components/site-footer';
import { HeroBackdrop } from '@/components/hero-backdrop';
import { CopyValue } from './copy-value';
import { BuildManifest } from './build-manifest';
import { ReleaseCard } from './release-card';
import { ReleasesProvider } from './releases-provider';
import { getDictionary } from '@/i18n/dict';
import type { Locale } from '@/i18n/config';
import { DOWNLOAD_PROJECTS, WEB_PROJECTS, pick } from '@/lib/downloads';

type Dict = ReturnType<typeof getDictionary>;

/* -------------------------------- sections -------------------------------- */

function SectionHeading({
  tag,
  title,
  description,
}: {
  tag: string;
  title: string;
  description: string;
}) {
  return (
    <div className="max-w-2xl">
      <span className="inline-flex items-center rounded-full border border-fd-border bg-fd-card px-3 py-1 text-xs font-medium tracking-wide text-fd-muted-foreground uppercase">
        {tag}
      </span>
      <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">{title}</h2>
      <p className="mt-3 text-base leading-relaxed text-fd-muted-foreground">{description}</p>
    </div>
  );
}

function CommandBlock({ label, command, dict }: { label: string; command: string; dict: Dict }) {
  const d = dict.downloads;

  return (
    <div className="overflow-hidden rounded-xl border border-fd-border bg-fd-background/60">
      <div className="flex items-center justify-between gap-2 border-b border-fd-border px-3 py-1.5">
        <span className="text-[10px] font-semibold tracking-[0.14em] text-fd-muted-foreground uppercase">
          {label}
        </span>
        <CopyValue value={command} label={d.copy} copiedLabel={d.copied} />
      </div>
      <pre className="overflow-x-auto px-3 py-2.5 text-[11px] leading-relaxed whitespace-pre-wrap break-all">
        <code className="font-mono">{command}</code>
      </pre>
    </div>
  );
}

/* ---------------------------------- page ---------------------------------- */

export function DownloadsPage({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  const d = dict.downloads;
  const prefix = locale === 'zh' ? '/zh' : '';
  const verifyFile = DOWNLOAD_PROJECTS[0]?.releases[0]?.assets[0]?.file ?? '<file>';

  return (
    <ReleasesProvider>
      <main className="flex flex-1 flex-col">
        {/* ---------------------------------- Hero ---------------------------------- */}
        <section className="relative overflow-hidden">
          <HeroBackdrop />

          <div className="mx-auto max-w-screen-lg px-6 pt-32 pb-16 sm:pt-36 sm:pb-20">
            <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-16">
              <div>
                <span className="inline-flex items-center gap-2 rounded-full border border-fd-border bg-fd-card px-3 py-1 text-xs font-medium text-fd-muted-foreground">
                  <Package className="size-3.5" />
                  {d.tag}
                </span>

                <h1 className="mt-6 bg-gradient-to-b from-fd-foreground to-fd-foreground/60 bg-clip-text text-4xl leading-[1.08] font-bold tracking-tight text-transparent sm:text-5xl md:text-6xl">
                  {d.title}
                </h1>

                <p className="mt-5 max-w-xl text-base leading-relaxed text-fd-muted-foreground sm:text-lg">
                  {d.description}
                </p>

                <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3">
                  <a
                    href="#releases"
                    className="inline-flex items-center gap-2 rounded-full border border-fd-border bg-fd-card px-5 py-2.5 text-sm font-medium text-fd-foreground transition-colors hover:bg-fd-accent"
                  >
                    <ChevronDown className="size-4" />
                    {d.browseAll}
                  </a>
                  <Link
                    href={`${prefix}/docs`}
                    className="inline-flex items-center gap-2 text-sm font-medium text-fd-muted-foreground transition-colors hover:text-fd-foreground"
                  >
                    {d.readDocs}
                    <ArrowRight className="size-4" />
                  </Link>
                </div>

                <p className="mt-6 flex items-start gap-2 text-xs leading-relaxed text-fd-muted-foreground">
                  <ShieldCheck className="mt-0.5 size-3.5 shrink-0 text-emerald-600 dark:text-emerald-400" />
                  {d.heroNote}
                </p>
              </div>

              <BuildManifest locale={locale} />
            </div>
          </div>
        </section>

        {/* -------------------------------- Releases -------------------------------- */}
        <section id="releases" className="scroll-mt-24 border-b border-fd-border bg-fd-card/30">
          <div className="mx-auto max-w-screen-lg px-6 py-20">
            <SectionHeading
              tag={d.releasesTag}
              title={d.releasesTitle}
              description={d.releasesDescription}
            />

            <div className="mt-8 flex items-start gap-2 rounded-xl border border-dashed border-fd-border bg-fd-card/60 px-4 py-3 sm:items-center sm:gap-3">
              <Server className="mt-0.5 size-4 shrink-0 text-fd-muted-foreground sm:mt-0" />
              <p className="text-xs leading-relaxed text-fd-muted-foreground">
                <span className="font-semibold text-fd-foreground">{d.routesTitle}</span>
                {' — '}
                {d.routesNote}
              </p>
            </div>

            <div className="mt-8 space-y-6">
              {DOWNLOAD_PROJECTS.map((project) => (
                <ReleaseCard key={project.key} projectKey={project.key} locale={locale} />
              ))}
            </div>
          </div>
        </section>

        {/* ------------------------------ Web products ------------------------------ */}
        <section id="web" className="scroll-mt-24 border-b border-fd-border">
          <div className="mx-auto max-w-screen-lg px-6 py-20">
            <SectionHeading tag={d.webTag} title={d.webTitle} description={d.webDescription} />

            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              {WEB_PROJECTS.map((project) => (
                <a
                  key={project.key}
                  href={project.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex h-full flex-col rounded-2xl border border-fd-border bg-fd-card p-5 transition-colors hover:border-fd-primary/40 hover:bg-fd-accent/20"
                >
                  <div className="flex items-center justify-between">
                    <span className="inline-flex rounded-lg bg-fd-accent p-2 text-fd-foreground">
                      <Globe className="size-4" />
                    </span>
                    <ExternalLink className="size-4 text-fd-muted-foreground transition-colors group-hover:text-fd-foreground" />
                  </div>
                  <p className="mt-4 font-semibold tracking-tight">{project.name}</p>
                  <p className="mt-1 text-sm leading-relaxed text-fd-muted-foreground">
                    {pick(locale, project.tagline)}
                  </p>
                  <span className="mt-auto inline-flex items-center gap-1 pt-4 text-sm font-medium text-fd-foreground">
                    {d.openApp}
                    <ArrowRight className="size-3.5" />
                  </span>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* --------------------------------- Verify --------------------------------- */}
        <section>
          <div className="mx-auto max-w-screen-lg px-6 py-20">
            <div className="rounded-2xl border border-fd-border bg-fd-card p-6 sm:p-8">
              <div className="flex items-start gap-4">
                <span className="inline-flex shrink-0 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 p-3 text-white shadow-md">
                  <ShieldCheck className="size-6" />
                </span>
                <div className="min-w-0">
                  <h2 className="text-lg font-semibold tracking-tight">{d.verifyTitle}</h2>
                  <p className="mt-2 max-w-2xl text-sm leading-relaxed text-fd-muted-foreground">
                    {d.verifyDescription}
                  </p>
                </div>
              </div>

              <div className="mt-6 grid gap-3 lg:grid-cols-2">
                <CommandBlock
                  label="Windows"
                  command={`certutil -hashfile ${verifyFile} SHA256`}
                  dict={dict}
                />
                <CommandBlock
                  label="macOS / Linux"
                  command={`shasum -a 256 ${verifyFile}`}
                  dict={dict}
                />
              </div>

              <p className="mt-4 text-xs leading-relaxed text-fd-muted-foreground">{d.verifyCompare}</p>
            </div>
          </div>
        </section>

        <SiteFooter locale={locale} />
      </main>
    </ReleasesProvider>
  );
}
