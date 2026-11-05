import type { AssetView, Platform, ReleaseView } from './downloads';

/**
 * Live GitHub Releases lookup.
 *
 * The site is a pure static export — there is no server to ask. So the browser
 * talks to the public GitHub REST API directly (it sends `Access-Control-
 * Allow-Origin: *`), which means a release published on GitHub shows up on the
 * downloads page without rebuilding or redeploying.
 *
 * Everything here degrades silently: on rate limit (60 req/h/IP), offline or a
 * blocked network the caller simply keeps rendering the baked manifest.
 */

const CACHE_TTL = 5 * 60 * 1000;
const REQUEST_TIMEOUT = 8000;
const CACHE_PREFIX = 'makerstudio:gh-releases:';

interface ApiAsset {
  id: number;
  name: string;
  size: number;
  browser_download_url: string;
  /** `sha256:<hex>` — only present for assets uploaded after GitHub added it. */
  digest?: string | null;
}

interface ApiRelease {
  tag_name: string;
  html_url: string;
  published_at: string | null;
  created_at: string;
  draft: boolean;
  prerelease: boolean;
  assets: ApiAsset[];
}

/** Installer formats first — the top row gets the "Recommended" badge. */
const ASSET_PRIORITY: Record<string, number> = {
  EXE: 0,
  MSI: 1,
  DMG: 2,
  PKG: 2,
  APPIMAGE: 3,
  DEB: 3,
  RPM: 3,
  ZIP: 4,
  TAR: 5,
  GZ: 5,
};

function extensionOf(name: string) {
  const match = name.match(/\.([a-z0-9]+)$/i);
  return (match?.[1] ?? 'file').toUpperCase();
}

function guessPlatform(name: string): Platform {
  const lower = name.toLowerCase();
  if (/\.(dmg|pkg)$/.test(lower) || /macos|darwin|osx/.test(lower)) return 'macos';
  if (/\.(appimage|deb|rpm)$/.test(lower) || /linux/.test(lower)) return 'linux';
  return 'windows';
}

function guessArch(name: string) {
  const lower = name.toLowerCase();
  if (/aarch64|arm64/.test(lower)) return 'arm64';
  if (/x64|x86_64|amd64/.test(lower)) return 'x64';
  if (/i686|x86|ia32|win32/.test(lower)) return 'x86';
  return 'universal';
}

function formatSize(bytes: number) {
  if (!bytes || bytes < 0) return '—';
  const mb = bytes / 1024 / 1024;
  if (mb >= 1) return `${mb.toFixed(2)} MB`;
  return `${Math.max(1, Math.round(bytes / 1024))} KB`;
}

function noteFor(name: string): AssetView['note'] {
  switch (extensionOf(name)) {
    case 'EXE':
      return {
        en: 'Setup wizard — creates Start menu and uninstall entries',
        zh: '安装向导，会创建开始菜单与卸载项',
      };
    case 'MSI':
      return {
        en: 'MSI package — for silent / managed installs',
        zh: 'MSI 安装包，适合静默或批量部署',
      };
    case 'DMG':
      return { en: 'macOS disk image — drag into Applications', zh: 'macOS 磁盘映像，拖入「应用程序」即可' };
    case 'APPIMAGE':
      return { en: 'Portable Linux build — no installation', zh: 'Linux 便携版，无需安装' };
    case 'DEB':
      return { en: 'Debian / Ubuntu package', zh: 'Debian / Ubuntu 安装包' };
    case 'RPM':
      return { en: 'Fedora / RHEL package', zh: 'Fedora / RHEL 安装包' };
    case 'ZIP':
      return { en: 'Archive — unpack and run', zh: '压缩包，解压后直接运行' };
    default:
      return { en: 'Release asset', zh: '发布文件' };
  }
}

function normalizeAsset(asset: ApiAsset): AssetView {
  const format = extensionOf(asset.name);

  return {
    id: String(asset.id),
    file: asset.name,
    platform: guessPlatform(asset.name),
    arch: guessArch(asset.name),
    format,
    size: formatSize(asset.size),
    sha256: asset.digest?.replace(/^sha256:/i, '') || undefined,
    github: asset.browser_download_url,
    note: noteFor(asset.name),
  };
}

function normalizeRelease(release: ApiRelease): ReleaseView {
  const assets = (release.assets ?? [])
    .filter((asset) => asset.name && !/\.(sig|sha256|sha512|txt|json)$/i.test(asset.name))
    .map(normalizeAsset)
    .sort(
      (a, b) =>
        (ASSET_PRIORITY[a.format] ?? 9) - (ASSET_PRIORITY[b.format] ?? 9) ||
        a.file.localeCompare(b.file),
    );

  return {
    version: release.tag_name,
    releasedAt: (release.published_at ?? release.created_at ?? '').slice(0, 10),
    channel: release.prerelease ? 'beta' : 'stable',
    releaseUrl: release.html_url,
    assets,
  };
}

function readCache(repoUrl: string): ReleaseView[] | null {
  try {
    const raw = sessionStorage.getItem(CACHE_PREFIX + repoUrl);
    if (!raw) return null;
    const entry = JSON.parse(raw) as { at: number; data: ReleaseView[] };
    if (!entry?.data?.length || Date.now() - entry.at > CACHE_TTL) return null;
    return entry.data;
  } catch {
    return null;
  }
}

function writeCache(repoUrl: string, data: ReleaseView[]) {
  try {
    sessionStorage.setItem(CACHE_PREFIX + repoUrl, JSON.stringify({ at: Date.now(), data }));
  } catch {
    /* private mode / quota — the in-memory state still works */
  }
}

/**
 * GitHub API endpoints, tried in order.
 *
 * `api.github.com` sends `Access-Control-Allow-Origin: *`, so the browser can
 * call it directly. If that host is slow or unreachable for your audience, add
 * a CORS-friendly mirror here (same `/repos/...` path shape) and it is used as
 * a fallback — no other code needs to change.
 */
const API_BASES = ['https://api.github.com'];

async function requestReleases(endpoint: string): Promise<ApiRelease[] | null> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

  try {
    const response = await fetch(endpoint, {
      headers: { Accept: 'application/vnd.github+json' },
      signal: controller.signal,
      cache: 'no-store',
    });
    if (!response.ok) return null;

    const payload = (await response.json()) as unknown;
    return Array.isArray(payload) ? (payload as ApiRelease[]) : null;
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Latest releases for a GitHub repo, newest first. Returns `null` whenever the
 * request cannot be satisfied, so callers can keep the baked data.
 */
export async function fetchReleases(repoUrl: string, limit = 8): Promise<ReleaseView[] | null> {
  const cached = readCache(repoUrl);
  if (cached) return cached;

  const match = repoUrl.match(/github\.com\/([^/]+)\/([^/?#]+)/i);
  if (!match) return null;

  const [, owner, repo] = match;

  for (const base of API_BASES) {
    const raw = await requestReleases(`${base}/repos/${owner}/${repo}/releases?per_page=${limit}`);
    if (!raw) continue;

    const releases = raw
      .filter((release) => !release.draft && release.tag_name)
      .map(normalizeRelease);

    // Nothing downloadable yet — prefer the curated baked manifest.
    if (!releases.length || releases.every((release) => release.assets.length === 0)) continue;

    writeCache(repoUrl, releases);
    return releases;
  }

  return null;
}
