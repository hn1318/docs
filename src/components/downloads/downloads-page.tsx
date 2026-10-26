import Link from 'next/link';
import {
  ArrowRight,
  Check,
  ChevronDown,
  Download,
  ExternalLink,
  Globe,
  History,
  Package,
  Server,
  ShieldCheck,
  Terminal,
} from 'lucide-react';
import { SiteFooter } from '@/components/site-footer';
import { CopyValue } from './copy-value';
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

interface FeaturedBuild {
  project: DownloadProject;
  release: DownloadRelease;
  asset: DownloadAsset;
}

/* ---------------------------------- data ---------------------------------- */

/** Newest published release across every desktop product. */
function newestBuild(): FeaturedBuild | null {
  let featured: FeaturedBuild | null = null;

  for (const project of DOWNLOAD_PROJECTS) {
    const release = project.releases[0];
    const asset = release?.assets[0];
    if (!release || !asset) continue;

    if (!featured || release.releasedAt.localeCompare(featured.release.releasedAt) > 0) {
      featured = { project, release, asset };
    }
  }

  return featured;
}

function platformSummary(assets: DownloadAsset[]) {
  const byPlatform = new Map<string, Set<string>>();

  for (const asset of assets) {
    const label = PLATFORM_LABELS[asset.platform];
    const arches = byPlatform.get(label) ?? new Set<string>();
    arches.add(asset.arch);
    byPlatform.set(label, arches);
  }

  return Array.from(byPlatform, ([label, arches]) => `${label} ${Array.from(arches).join(' / ')}`).join(
    ' · ',
  );
}

function formatSummary(assets: DownloadAsset[]) {
  return Array.from(new Set(assets.map((asset) => asset.format))).join(' · ');
}

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

/** Static "build manifest" beside the hero — the page's at-a-glance summary. */
function BuildManifest({ featured, dict }: { featured: FeaturedBuild; dict: Dict }) {
  const d = dict.downloads;
  const { project, release, asset } = featured;

  const rows = [
    { label: d.latest, value: `${project.name} ${release.version}` },
    { label: d.released, value: release.releasedAt },
    { label: d.platform, value: platformSummary(release.assets) },
    { label: d.files, value: `${release.assets.length} · ${formatSummary(release.assets)}` },
    { label: d.source, value: d.routeGitHub },
    { label: d.checksumLabel, value: `${asset.sha256.slice(0, 12)}…` },
  ];

  return (
    <div className="overflow-hidden rounded-2xl border border-fd-border bg-fd-card shadow-sm">
      <div className="flex items-center justify-between gap-3 border-b border-fd-border bg-fd-accent/40 px-5 py-3">
        <span className="inline-flex min-w-0 items-center gap-2 text-[11px] font-semibold tracking-[0.18em] text-fd-muted-foreground uppercase">
          <Terminal className="size-3.5 shrink-0" />
          <span className="truncate">{d.manifestTitle}</span>
        </span>
        <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium whitespace-nowrap text-emerald-700 dark:text-emerald-400">
          <Check className="size-3" />
          {d.manifestVerified}
        </span>
      </div>

      <dl className="divide-y divide-fd-border">
        {rows.map((row) => (
          <div key={row.label} className="flex items-baseline justify-between gap-4 px-5 py-2.5">
            <dt className="shrink-0 text-[11px] tracking-wide text-fd-muted-foreground uppercase">
              {row.label}
            </dt>
            <dd className="min-w-0 truncate text-right font-mono text-xs text-fd-foreground">
              {row.value}
            </dd>
          </div>
        ))}
      </dl>

      <div className="border-t border-fd-border px-5 py-4">
        <a
          href={asset.github}
          className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-fd-foreground px-5 py-2.5 text-sm font-medium text-fd-background shadow-sm transition-opacity hover:opacity-90"
        >
          <Download className="size-4" />
          {d.downloadNow}
        </a>
        <p
          className="mt-2 truncate text-center font-mono text-[10px] text-fd-muted-foreground"
          title={asset.file}
        >
          {asset.file}
        </p>
      </div>
    </div>
  );
}

/* --------------------------------- assets --------------------------------- */

function AssetRow({
  project,
  release,
  asset,
  recommended = false,
  locale,
  dict,
}: {
  project: DownloadProject;
  release: DownloadRelease;
  asset: DownloadAsset;
  recommended?: boolean;
  locale: Locale;
  dict: Dict;
}) {
  const d = dict.downloads;

  return (
    <li className="flex flex-col gap-4 px-6 py-4 transition-colors hover:bg-fd-accent/30 sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:px-8">
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-semibold">{PLATFORM_LABELS[asset.platform]}</span>
          <span className="rounded border border-fd-border px-1.5 py-0.5 font-mono text-[10px] tracking-wide text-fd-muted-foreground uppercase">
            {asset.arch}
          </span>
          <span className="rounded border border-fd-border px-1.5 py-0.5 font-mono text-[10px] tracking-wide text-fd-muted-foreground uppercase">
            {asset.format}
          </span>
          {recommended && (
            <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-700 dark:text-emerald-400">
              {d.recommended}
            </span>
          )}
          <span className="text-xs tabular-nums text-fd-muted-foreground">{asset.size}</span>
        </div>
        <p className="mt-1 text-xs text-fd-muted-foreground">{pick(locale, asset.note)}</p>
        <div className="mt-1.5 flex items-center gap-1.5 text-[11px] text-fd-muted-foreground">
          <span className="font-medium">{d.checksumLabel}</span>
          <code className="font-mono" title={asset.sha256}>
            {asset.sha256.slice(0, 16)}…
          </code>
          <CopyValue value={asset.sha256} label={d.copy} copiedLabel={d.copied} />
        </div>
      </div>

      <div className="flex shrink-0 flex-wrap items-center gap-2">
        <a
          href={asset.github}
          className="inline-flex items-center gap-1.5 rounded-full bg-fd-foreground px-4 py-2 text-xs font-medium text-fd-background shadow-sm transition-opacity hover:opacity-90"
        >
          <Download className="size-3.5" />
          {d.download}
        </a>

        {MIRROR_ROUTES.map((route) => (
          <a
            key={route.id}
            href={mirrorHref(route, project, release.version, asset)}
            className="inline-flex items-center gap-1.5 rounded-full border border-fd-border bg-fd-card px-4 py-2 text-xs font-medium text-fd-foreground transition-colors hover:bg-fd-accent"
          >
            <Server className="size-3.5" />
            {route.name || (route.tier === 'official' ? d.routeOfficial : d.routeBackup)}
          </a>
        ))}
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
    <article
      id={project.key}
      className="scroll-mt-24 overflow-hidden rounded-2xl border border-fd-border bg-fd-card"
    >
      <div className={`h-1 w-full bg-gradient-to-r ${project.accent}`} />

      <header className="flex flex-col gap-5 border-b border-fd-border p-6 sm:flex-row sm:items-start sm:justify-between sm:p-8">
        <div className="flex items-start gap-4">
          <div
            className={`inline-flex shrink-0 rounded-xl bg-gradient-to-br ${project.accent} p-3 text-white shadow-md`}
          >
            <Icon className="size-6" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-xl font-semibold tracking-tight">{project.name}</h3>
              <span className="rounded-full bg-fd-primary/10 px-2.5 py-0.5 font-mono text-[11px] font-medium text-fd-primary">
                {latest.version}
              </span>
              <span className="rounded-full border border-fd-border px-2 py-0.5 text-[11px] text-fd-muted-foreground">
                {latest.channel === 'beta' ? d.beta : d.stable}
              </span>
            </div>
            <p className="mt-1.5 text-sm text-fd-muted-foreground">{pick(locale, project.tagline)}</p>
          </div>
        </div>

        <div className="shrink-0 text-xs text-fd-muted-foreground sm:text-right">
          <p>
            {d.released} {latest.releasedAt}
          </p>
          <p className="mt-1">
            {latest.assets.length} {d.fileCount}
          </p>
        </div>
      </header>

      <ul className="divide-y divide-fd-border">
        {latest.assets.map((asset, index) => (
          <AssetRow
            key={asset.id}
            project={project}
            release={latest}
            asset={asset}
            recommended={index === 0}
            locale={locale}
            dict={dict}
          />
        ))}
      </ul>

      {older.length > 0 && (
        <details className="group/old border-t border-fd-border">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-2 px-6 py-3.5 text-sm text-fd-muted-foreground transition-colors hover:text-fd-foreground sm:px-8">
            <span className="inline-flex items-center gap-2">
              <History className="size-4" />
              {d.olderVersions}
              <span className="rounded-full bg-fd-accent px-1.5 py-0.5 text-[10px] tabular-nums">
                {older.length}
              </span>
            </span>
            <ChevronDown className="size-4 transition-transform duration-200 group-open/old:rotate-180" />
          </summary>

          <div className="space-y-3 px-6 pb-6 sm:px-8">
            {older.map((release) => (
              <div key={release.version} className="overflow-hidden rounded-xl border border-fd-border">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-fd-border bg-fd-background/50 px-4 py-2.5">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <span className="font-mono">{release.version}</span>
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
  );
}

/* --------------------------------- verify --------------------------------- */

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
  const featured = newestBuild();
  const verifyFile = featured?.asset.file ?? '<file>';

  return (
    <main className="flex flex-1 flex-col">
      {/* ---------------------------------- Hero ---------------------------------- */}
      <section className="relative overflow-hidden border-b border-fd-border">
        {/* Static backdrop — deliberately no moving parts. */}
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--color-fd-border)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-fd-border)_1px,transparent_1px)] bg-[size:72px_72px] opacity-40 [mask-image:radial-gradient(ellipse_80%_70%_at_35%_-10%,black,transparent)]" />
          <div className="absolute -top-40 left-[18%] h-96 w-[42rem] rounded-full bg-teal-500/[0.07] blur-3xl" />
          <div className="absolute -top-24 right-[-10%] h-80 w-[30rem] rounded-full bg-indigo-500/[0.07] blur-3xl" />
        </div>

        <div className="mx-auto max-w-screen-lg px-6 pt-32 pb-16 sm:pt-36 sm:pb-20">
          <div
            className={`grid items-center gap-12 ${
              featured ? 'lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-16' : ''
            }`}
          >
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

            {featured && <BuildManifest featured={featured} dict={dict} />}
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
  );
}
