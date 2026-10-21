import Link from 'next/link';
import {
  ArrowRight,
  ChevronDown,
  Download,
  ExternalLink,
  Globe,
  History,
  Package,
  Server,
  ShieldCheck,
} from 'lucide-react';
import { Reveal } from '@/components/home/reveal';
import { SiteFooter } from '@/components/site-footer';
import { ChecksumCopy } from './checksum-copy';
import { HeroAurora } from './hero-aurora';
import { getDictionary } from '@/i18n/dict';
import type { Locale } from '@/i18n/config';
import {
  DOWNLOAD_PROJECTS,
  MIRROR_ROUTES,
  PLATFORM_LABELS,
  WEB_PROJECTS,
  mirrorHref,
  pick,
  type DownloadAsset,
  type DownloadProject,
  type DownloadRelease,
} from '@/lib/downloads';

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
    <Reveal className="max-w-2xl">
      <span className="inline-flex items-center rounded-full border border-fd-border bg-fd-card px-3 py-1 text-xs font-medium tracking-wide text-fd-muted-foreground uppercase">
        {tag}
      </span>
      <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">{title}</h2>
      <p className="mt-3 text-base leading-relaxed text-fd-muted-foreground">{description}</p>
    </Reveal>
  );
}

/* --------------------------------- assets --------------------------------- */

function AssetRow({
  project,
  release,
  asset,
  locale,
  dict,
}: {
  project: DownloadProject;
  release: DownloadRelease;
  asset: DownloadAsset;
  locale: Locale;
  dict: Dict;
}) {
  const d = dict.downloads;

  return (
    <li className="flex flex-col gap-3 px-6 py-4 transition-colors hover:bg-fd-accent/30 sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:px-8">
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-medium">{PLATFORM_LABELS[asset.platform]}</span>
          <span className="rounded-full bg-fd-accent px-2 py-0.5 text-[11px] text-fd-muted-foreground">
            {asset.arch}
          </span>
          <span className="rounded-full bg-fd-accent px-2 py-0.5 text-[11px] text-fd-muted-foreground">
            {asset.format}
          </span>
          <span className="text-xs text-fd-muted-foreground">{asset.size}</span>
        </div>
        <p className="mt-1 text-xs text-fd-muted-foreground">{pick(locale, asset.note)}</p>
        <div className="mt-1.5 flex items-center gap-1.5 text-[11px] text-fd-muted-foreground">
          <span className="font-medium">{d.checksumLabel}</span>
          <code className="font-mono">{asset.sha256.slice(0, 16)}…</code>
          <ChecksumCopy value={asset.sha256} label={d.copy} />
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {/* GitHub is always available */}
        <a
          href={asset.github}
          className="inline-flex items-center gap-1.5 rounded-full bg-fd-foreground px-4 py-2 text-xs font-medium text-fd-background shadow-sm transition-all duration-200 hover:opacity-90 active:scale-95"
        >
          <Download className="size-3.5" />
          {d.routeGitHub}
        </a>

        {MIRROR_ROUTES.map((route) => (
          <a
            key={route.id}
            href={mirrorHref(route, project, release.version, asset)}
            className="inline-flex items-center gap-1.5 rounded-full border border-fd-border bg-fd-card px-4 py-2 text-xs font-medium text-fd-foreground transition-all duration-200 hover:bg-fd-accent active:scale-95"
          >
            <Server className="size-3.5" />
            {route.name || (route.tier === 'official' ? d.routeOfficial : d.routeBackup)}
          </a>
        ))}

        {MIRROR_ROUTES.length === 0 && (
          <span
            title={d.planned}
            className="inline-flex cursor-not-allowed items-center gap-1.5 rounded-full border border-dashed border-fd-border px-4 py-2 text-xs text-fd-muted-foreground/70"
          >
            <Server className="size-3.5" />
            {d.routeOfficial} · {d.planned}
          </span>
        )}
      </div>
    </li>
  );
}

/* --------------------------------- release -------------------------------- */

function ReleaseCard({
  project,
  locale,
  dict,
  prefix,
}: {
  project: DownloadProject;
  locale: Locale;
  dict: Dict;
  prefix: string;
}) {
  const d = dict.downloads;
  const latest = project.releases[0];
  const older = project.releases.slice(1);
  const Icon = project.icon;

  if (!latest) return null;

  return (
    <Reveal>
      <article className="relative overflow-hidden rounded-2xl border border-fd-border bg-fd-card">
        <div className={`pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r ${project.accent}`} />

        <header className="flex flex-col gap-4 border-b border-fd-border p-6 sm:flex-row sm:items-start sm:justify-between sm:p-8">
          <div className="flex items-start gap-4">
            <div className={`inline-flex shrink-0 rounded-xl bg-gradient-to-br ${project.accent} p-3 text-white shadow-md`}>
              <Icon className="size-6" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-xl font-semibold tracking-tight">{project.name}</h3>
                <span className="rounded-full bg-fd-primary/10 px-2.5 py-0.5 text-[11px] font-medium text-fd-primary">
                  {d.latest} · {latest.version}
                </span>
              </div>
              <p className="mt-1 text-sm text-fd-muted-foreground">{pick(locale, project.tagline)}</p>
            </div>
          </div>
          <div className="shrink-0 text-xs text-fd-muted-foreground sm:text-right">
            <p>
              {d.released} {latest.releasedAt}
            </p>
            <p className="mt-1">
              {latest.assets.length} {d.files}
            </p>
          </div>
        </header>

        <ul className="divide-y divide-fd-border">
          {latest.assets.map((asset) => (
            <AssetRow
              key={asset.id}
              project={project}
              release={latest}
              asset={asset}
              locale={locale}
              dict={dict}
            />
          ))}
        </ul>

        {older.length > 0 && (
          <details className="group/old border-t border-fd-border">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-2 px-6 py-4 text-sm text-fd-muted-foreground transition-colors hover:text-fd-foreground sm:px-8">
              <span className="inline-flex items-center gap-2">
                <History className="size-4" />
                {d.olderVersions} ({older.length})
              </span>
              <ChevronDown className="size-4 transition-transform duration-200 group-open/old:rotate-180" />
            </summary>
            <div className="space-y-3 px-6 pb-6 sm:px-8">
              {older.map((release) => (
                <div key={release.version} className="overflow-hidden rounded-xl border border-fd-border">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-fd-border bg-fd-background/50 px-4 py-2.5">
                    <div className="flex items-center gap-2 text-sm font-medium">
                      {release.version}
                      <span className="text-xs font-normal text-fd-muted-foreground">
                        {release.releasedAt}
                      </span>
                    </div>
                    <a
                      href={release.releaseUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-fd-muted-foreground transition-colors hover:text-fd-foreground"
                    >
                      {d.viewOnGitHub}
                      <ExternalLink className="size-3" />
                    </a>
                  </div>
                  <ul className="divide-y divide-fd-border">
                    {release.assets.map((asset) => (
                      <AssetRow
                        key={asset.id}
                        project={project}
                        release={release}
                        asset={asset}
                        locale={locale}
                        dict={dict}
                      />
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </details>
        )}

        <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-fd-border px-6 py-4 sm:px-8">
          <div className="flex flex-wrap items-center gap-5 text-sm">
            <a
              href={project.repo}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-fd-muted-foreground transition-colors hover:text-fd-foreground"
            >
              {d.viewOnGitHub}
              <ExternalLink className="size-3.5" />
            </a>
            <Link
              href={`${prefix}${project.docs}`}
              className="inline-flex items-center gap-1 text-fd-muted-foreground transition-colors hover:text-fd-foreground"
            >
              {d.readDocs}
              <ArrowRight className="size-3.5" />
            </Link>
          </div>
          <a
            href={`${project.repo}/releases`}
            target="_blank"
            rel="noopener noreferrer"
            className="group/all inline-flex items-center gap-1 text-sm font-medium text-fd-foreground transition-colors hover:text-fd-primary"
          >
            {d.allReleases}
            <ArrowRight className="size-3.5 transition-transform duration-200 group-hover/all:translate-x-0.5" />
          </a>
        </footer>
      </article>
    </Reveal>
  );
}

/* ---------------------------------- page ---------------------------------- */

export function DownloadsPage({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  const d = dict.downloads;
  const prefix = locale === 'zh' ? '/zh' : '';
  const sample = DOWNLOAD_PROJECTS[0]?.releases[0]?.assets[0];

  return (
    <main className="flex flex-1 flex-col">
      {/* ---------------------------------- Hero ---------------------------------- */}
      <section className="relative overflow-hidden border-b border-fd-border">
        <HeroAurora />

        <div className="mx-auto max-w-screen-lg px-6 pt-36 pb-24 text-center">
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-full border border-fd-border bg-fd-card px-3 py-1 text-xs text-fd-muted-foreground">
              <Package className="size-3.5" />
              {d.tag}
            </span>
          </Reveal>
          <Reveal delay={100}>
            <h1 className="mt-6 bg-gradient-to-b from-fd-foreground to-fd-foreground/60 bg-clip-text text-4xl leading-[1.1] font-bold tracking-tight text-transparent sm:text-5xl md:text-6xl">
              {d.title}
            </h1>
          </Reveal>
          <Reveal delay={200}>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-fd-muted-foreground sm:text-lg">
              {d.description}
            </p>
          </Reveal>
        </div>
      </section>

      {/* -------------------------------- Releases -------------------------------- */}
      <section className="border-b border-fd-border bg-fd-card/30">
        <div className="mx-auto max-w-screen-lg px-6 py-20">
          <Reveal>
            <div className="mb-10 flex flex-col gap-3 rounded-2xl border border-fd-border bg-fd-card p-5 sm:flex-row sm:items-start sm:gap-4">
              <Server className="size-5 shrink-0 text-fd-muted-foreground" />
              <div>
                <p className="text-sm font-semibold">{d.routesTitle}</p>
                <p className="mt-1 text-xs leading-relaxed text-fd-muted-foreground">{d.routesNote}</p>
              </div>
            </div>
          </Reveal>

          <div className="space-y-6">
            {DOWNLOAD_PROJECTS.map((project) => (
              <ReleaseCard
                key={project.key}
                project={project}
                locale={locale}
                dict={dict}
                prefix={prefix}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------ Web products ------------------------------ */}
      <section className="border-b border-fd-border">
        <div className="mx-auto max-w-screen-lg px-6 py-20">
          <SectionHeading tag={d.tag} title={d.webTitle} description={d.webDescription} />

          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {WEB_PROJECTS.map((project, i) => (
              <Reveal key={project.key} delay={i * 80}>
                <a
                  href={project.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex h-full flex-col rounded-2xl border border-fd-border bg-fd-card p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
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
                    <ArrowRight className="size-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
                  </span>
                </a>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* --------------------------------- Verify --------------------------------- */}
      <section>
        <div className="mx-auto max-w-screen-lg px-6 py-20">
          <div className="flex flex-col gap-6 rounded-2xl border border-fd-border bg-fd-card p-6 sm:p-8 md:flex-row md:items-start">
            <div className="inline-flex shrink-0 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 p-3 text-white shadow-md">
              <ShieldCheck className="size-6" />
            </div>
            <div className="min-w-0">
              <h2 className="text-lg font-semibold tracking-tight">{d.verifyTitle}</h2>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-fd-muted-foreground">
                {d.verifyDescription}
              </p>
              <pre className="mt-4 overflow-x-auto rounded-xl border border-fd-border bg-fd-background/60 px-4 py-3 text-xs">
                <code className="font-mono">
                  {`certutil -hashfile ${sample?.file ?? '<file>'} SHA256`}
                </code>
              </pre>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter locale={locale} />
    </main>
  );
}
