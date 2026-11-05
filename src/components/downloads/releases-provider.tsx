'use client';

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { DOWNLOAD_PROJECTS, bakedReleases, type AssetView, type ReleaseView } from '@/lib/downloads';
import { fetchReleases } from '@/lib/github-releases';

interface ReleasesState {
  /** Release list per project key — live data when available, baked data otherwise. */
  byProject: Record<string, ReleaseView[]>;
  /** True once at least one project was refreshed from the GitHub API. */
  live: boolean;
  /** Epoch ms of the last successful sync (0 when still on baked data). */
  syncedAt: number;
}

const ReleasesContext = createContext<ReleasesState | null>(null);

/**
 * Keeps the curated wording (file notes, checksums) of the baked manifest while
 * taking versions, dates and download URLs from GitHub. New files that never
 * appeared in the baked data keep their auto-generated note.
 */
function mergeCurated(live: ReleaseView[], baked: ReleaseView[]): ReleaseView[] {
  const curated = new Map<string, AssetView>();
  for (const release of baked) {
    for (const asset of release.assets) curated.set(asset.file, asset);
  }

  return live.map((release) => ({
    ...release,
    assets: release.assets.map((asset) => {
      const previous = curated.get(asset.file);
      if (!previous) return asset;
      return {
        ...asset,
        note: previous.note,
        sha256: asset.sha256 ?? previous.sha256,
      };
    }),
  }));
}

/**
 * Fetches every project's releases from GitHub once per page load and hands the
 * result to the cards + hero manifest.
 *
 * The static HTML already contains the baked manifest, so the first paint is
 * always complete; the live data simply replaces it a moment later. If the
 * request fails (offline, rate limit, blocked network) nothing changes and the
 * page keeps working with the baked data.
 */
export function ReleasesProvider({ children }: { children: ReactNode }) {
  const fallback = useMemo<Record<string, ReleaseView[]>>(
    () => Object.fromEntries(DOWNLOAD_PROJECTS.map((project) => [project.key, bakedReleases(project)])),
    [],
  );

  const [state, setState] = useState<ReleasesState>({
    byProject: fallback,
    live: false,
    syncedAt: 0,
  });

  useEffect(() => {
    let cancelled = false;

    void Promise.all(
      DOWNLOAD_PROJECTS.map(
        async (project) => [project.key, await fetchReleases(project.repo)] as const,
      ),
    ).then((results) => {
      if (cancelled) return;

      const byProject = { ...fallback };
      let live = false;

      for (const [key, releases] of results) {
        if (!releases?.length) continue;
        byProject[key] = mergeCurated(releases, fallback[key] ?? []);
        live = true;
      }

      if (live) setState({ byProject, live: true, syncedAt: Date.now() });
    });

    return () => {
      cancelled = true;
    };
  }, [fallback]);

  return <ReleasesContext.Provider value={state}>{children}</ReleasesContext.Provider>;
}

/** Releases for one project, plus whether they came from GitHub. */
export function useProjectReleases(key: string) {
  const state = useContext(ReleasesContext);
  const baked = useMemo(
    () => bakedReleases(DOWNLOAD_PROJECTS.find((project) => project.key === key) ?? DOWNLOAD_PROJECTS[0]),
    [key],
  );

  return {
    releases: state?.byProject[key] ?? baked,
    live: state?.live ?? false,
    syncedAt: state?.syncedAt ?? 0,
  };
}

/** Newest published build across every desktop project. */
export function useNewestBuild() {
  const state = useContext(ReleasesContext);

  const byProject = state?.byProject;

  return useMemo(() => {
    if (!byProject) return null;

    let newest: { projectKey: string; release: ReleaseView; asset: AssetView } | null = null;

    for (const project of DOWNLOAD_PROJECTS) {
      const release = byProject[project.key]?.[0];
      const asset = release?.assets[0];
      if (!release || !asset) continue;
      if (!newest || release.releasedAt.localeCompare(newest.release.releasedAt) > 0) {
        newest = { projectKey: project.key, release, asset };
      }
    }

    return newest;
  }, [byProject]);
}
