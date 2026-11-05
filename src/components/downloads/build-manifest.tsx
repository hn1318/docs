'use client';

import { Check, Download, Terminal } from 'lucide-react';
import { useNewestBuild } from './releases-provider';
import { getDictionary } from '@/i18n/dict';
import type { Locale } from '@/i18n/config';
import { DOWNLOAD_PROJECTS, PLATFORM_LABELS, type AssetView } from '@/lib/downloads';

function platformSummary(assets: AssetView[]) {
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

function formatSummary(assets: AssetView[]) {
  return Array.from(new Set(assets.map((asset) => asset.format))).join(' · ');
}

/**
 * "Build manifest" beside the hero — an at-a-glance summary of the newest build.
 *
 * Client-side so it follows the live GitHub release list; SSR paints the baked
 * manifest, so the static HTML is never empty.
 */
export function BuildManifest({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  const d = dict.downloads;
  const newest = useNewestBuild();

  if (!newest) return null;

  const project = DOWNLOAD_PROJECTS.find((item) => item.key === newest.projectKey);
  if (!project) return null;

  const { release, asset } = newest;

  const rows = [
    { label: d.latest, value: `${project.name} ${release.version}` },
    { label: d.released, value: release.releasedAt },
    { label: d.platform, value: platformSummary(release.assets) },
    { label: d.files, value: `${release.assets.length} · ${formatSummary(release.assets)}` },
    { label: d.source, value: d.routeGitHub },
    {
      label: d.checksumLabel,
      value: asset.sha256 ? `${asset.sha256.slice(0, 12)}…` : '—',
    },
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
