'use client';

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import {
  DOWNLOAD_PROJECTS,
  bakedReleases,
  type AssetView,
  type ReleaseView,
} from '@/lib/downloads';
import { fetchReleases } from '@/lib/github-releases';
import { fetchOpenList, mergeOpenListAssets, type OpenListSource } from '@/lib/openlist';

export type ReleasesOrigin = 'live' | 'baked';

interface ReleasesState {
  /** Release list per project key — live data when available, baked data otherwise. */
  byProject: Record<string, ReleaseView[]>;
  /** OpenList mirror per project key, when the folder could be read. */
  openList: Record<string, OpenListSource>;
  /** True once at least one project was refreshed from a network source. */
  live: boolean;
  /** Epoch ms of the last successful sync (0 when still on baked data). */
  syncedAt: number;
}

interface ProjectReleases {
  releases: ReleaseView[];
  live: boolean;
  source: ReleasesOrigin;
  syncedAt: number;
  /** OpenList folder for this project (undefined when unreachable). */
  openList?: OpenListSource;
}

const ReleasesContext = createContext<ReleasesState | null>(null);

/**
 * Keeps the curated wording (file notes, checksums) of the baked manifest while
 * taking versions, dates and download URLs from GitHub / OpenList. Files that
 * never appeared in the baked data keep their auto-generated note.
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
        mirror: asset.mirror ?? previous.mirror,
      };
    }),
  }));
}

/**
 * Fetches every project's releases (GitHub) and its OpenList mirror once per
 * page load, then hands the merged result to the cards and hero manifest.
 *
 * The static HTML already contains the baked manifest, so the first paint is
 * always complete; network data only refines it. Any failure (offline, rate
 * limit, blocked CORS, missing folder) leaves the previous data in place.
 */
export function ReleasesProvider({ children }: { children: ReactNode }) {
  const fallback = useMemo<Record<string, ReleaseView[]>>(
    () => Object.fromEntries(DOWNLOAD_PROJECTS.map((project) => [project.key, bakedReleases(project)])),
    [],
  );

  const [state, setState] = useState<ReleasesState>({
    byProject: fallback,
    openList: {},
    live: false,
    syncedAt: 0,
  });

  useEffect(() => {
    let cancelled = false;

    void Promise.all(
      DOWNLOAD_PROJECTS.map(async (project) => {
        // 两条线路并行：GitHub 提供版本/校验值，OpenList 提供备用直链。
        const [github, openlist] = await Promise.all([
          fetchReleases(project.repo),
          fetchOpenList(project.folder),
        ]);
        return { key: project.key, github, openlist } as const;
      }),
    ).then((results) => {
      if (cancelled) return;

      const byProject: Record<string, ReleaseView[]> = { ...fallback };
      const openList: Record<string, OpenListSource> = {};
      let live = false;

      for (const { key, github, openlist } of results) {
        const baked = fallback[key] ?? [];
        const base = github?.length ? mergeCurated(github, baked) : baked;

        if (openlist) {
          openList[key] = openlist;
          if (openlist.resolved) live = true;
        }

        byProject[key] = base.map((release) => ({
          ...release,
          assets: mergeOpenListAssets(release.assets, openlist),
        }));

        if (github?.length) live = true;
      }

      if (live || Object.keys(openList).length) {
        setState({ byProject, openList, live, syncedAt: Date.now() });
      }
    });

    return () => {
      cancelled = true;
    };
  }, [fallback]);

  return <ReleasesContext.Provider value={state}>{children}</ReleasesContext.Provider>;
}

/** Releases for one project, plus where they came from and its OpenList mirror. */
export function useProjectReleases(key: string): ProjectReleases {
  const state = useContext(ReleasesContext);
  const baked = useMemo(
    () =>
      bakedReleases(
        DOWNLOAD_PROJECTS.find((project) => project.key === key) ?? DOWNLOAD_PROJECTS[0],
      ),
    [key],
  );

  const releases = state?.byProject[key] ?? baked;

  return {
    releases,
    live: state?.live ?? false,
    source: state?.live ? 'live' : 'baked',
    syncedAt: state?.syncedAt ?? 0,
    openList: state?.openList[key],
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
