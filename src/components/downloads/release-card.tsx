'use client';

import Link from 'next/link';
import { ArrowRight, ChevronDown, Download, ExternalLink, History, Server } from 'lucide-react';
import { CopyValue } from './copy-value';
import { useProjectReleases } from './releases-provider';
import { getDictionary } from '@/i18n/dict';
import type { Locale } from '@/i18n/config';
import {
  DOWNLOAD_PROJECTS,
  MIRROR_ROUTES,
  PLATFORM_LABELS,
  mirrorHref,
  pick,
  type AssetView,
  type DownloadProject,
  type ReleaseView,
} from '@/lib/downloads';

type Dict = ReturnType<typeof getDictionary>;

function AssetRow({
  project,
  release,
  asset,
  recommended = false,
  locale,
  dict,
}: {
  project: DownloadProject;
  release: ReleaseView;
  asset: AssetView;
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
          {asset.sha256 ? (
            <>
              <code className="font-mono" title={asset.sha256}>
                {asset.sha256.slice(0, 16)}…
              </code>
              <CopyValue value={asset.sha256} label={d.copy} copiedLabel={d.copied} />
            </>
          ) : (
            <span className="font-mono">—</span>
          )}
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

/**
 * One project's release card.
 *
 * Renders the baked manifest during SSR, then swaps in the live GitHub release
 * list as soon as it arrives — a newly published version shows up without a
 * rebuild. When the sync fails the baked data stays on screen.
 */
export function ReleaseCard({ projectKey, locale }: { projectKey: string; locale: Locale }) {
  const dict = getDictionary(locale);
  const d = dict.downloads;
  const prefix = locale === 'zh' ? '/zh' : '';
  const project = DOWNLOAD_PROJECTS.find((item) => item.key === projectKey);

  const { releases, live } = useProjectReleases(projectKey);
  const latest = releases[0];
  const older = releases.slice(1);

  if (!project || !latest) return null;

  const Icon = project.icon;

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
              {live && (
                <span
                  className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-700 dark:text-emerald-400"
                  title={d.liveSyncHint}
                >
                  <span className="relative flex size-1.5">
                    <span className="absolute inline-flex size-full rounded-full bg-emerald-500 opacity-70 motion-safe:animate-ping" />
                    <span className="relative inline-flex size-1.5 rounded-full bg-emerald-500" />
                  </span>
                  {d.liveSync}
                </span>
              )}
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
