import { MousePointerClick, type LucideIcon } from 'lucide-react';
import type { Locale } from '@/i18n/config';

export type Platform = 'windows' | 'macos' | 'linux';

export interface DownloadAsset {
  id: string;
  /** Published file name — also used to build mirror URLs. */
  file: string;
  platform: Platform;
  arch: string;
  /** Upper-case file type shown as a chip (`EXE`, `MSI`, `ZIP`, …). */
  format: string;
  size: string;
  sha256: string;
  /** GitHub-hosted file; always available. */
  github: string;
  /** Short human note about what this file is. */
  note: { en: string; zh: string };
}

export interface DownloadRelease {
  version: string;
  /** ISO date (YYYY-MM-DD) of the release. */
  releasedAt: string;
  channel: 'stable' | 'beta';
  assets: DownloadAsset[];
  /** Release page on GitHub (changelog + everything else). */
  releaseUrl: string;
}

export interface DownloadProject {
  key: string;
  name: string;
  tagline: { en: string; zh: string };
  icon: LucideIcon;
  /** Tailwind gradient for the icon tile. */
  accent: string;
  glow: string;
  repo: string;
  docs: string;
  /**
   * 文件夹名（区分大小写）——GitHub 仓库名 / OpenList 目录名都用它。
   * OpenList 的路径是大小写敏感的，`/m/autoclicker` 会报 object not found，
   * 所以这里显式给出 `AutoClicker`，而不是依赖 `key`。
   */
  folder: string;
  /** Newest first — `releases[0]` is treated as the latest build. */
  releases: DownloadRelease[];
}

export interface MirrorRoute {
  id: string;
  /** Route name shown on the button, e.g. a CDN or object-storage host. */
  name: string;
  tier: 'official' | 'backup';
  /**
   * Files are expected at `${base}/${project.key}/${version}/${asset.file}`.
   * Add an entry below and every asset instantly grows an extra button.
   */
  base: string;
}

/**
 * Self-hosted download routes (线路).
 *
 * Intentionally empty for now: everything ships through GitHub Releases.
 * Fill this array once mirrors are online — no page code needs to change.
 */
export const MIRROR_ROUTES: MirrorRoute[] = [];

/** Desktop products with real, downloadable builds. */
export const DOWNLOAD_PROJECTS: DownloadProject[] = [
  {
    key: 'autoclicker',
    name: 'AutoClicker',
    tagline: {
      en: 'Lightweight, disciplined auto clicker for Windows',
      zh: '轻量、克制的 Windows 自动连点器',
    },
    icon: MousePointerClick,
    accent: 'from-teal-500 to-cyan-600',
    glow: 'bg-teal-500/20',
    repo: 'https://github.com/hn1318/AutoClicker',
    docs: '/docs/autoclicker',
    folder: 'AutoClicker',
    releases: [
      {
        version: 'v1.0.2',
        releasedAt: '2026-11-06',
        channel: 'stable',
        releaseUrl: 'https://github.com/hn1318/AutoClicker/releases/tag/v1.0.2',
        assets: [
          {
            id: 'ac-102-exe',
            file: 'AutoClicker_1.0.2_x64-setup.exe',
            platform: 'windows',
            arch: 'x64',
            format: 'EXE',
            size: '2.47 MB',
            note: { en: 'Setup wizard — creates Start menu and uninstall entries', zh: '安装向导，会创建开始菜单与卸载项' },
            sha256: 'f6f6b2208171d24a9061c4dad6f014f9bd1f2fb5e04d64d24a77795bcf68b176',
            github:
              'https://github.com/hn1318/AutoClicker/releases/download/v1.0.2/AutoClicker_1.0.2_x64-setup.exe',
          },
          {
            id: 'ac-102-msi',
            file: 'AutoClicker_1.0.2_x64_en-US.msi',
            platform: 'windows',
            arch: 'x64',
            format: 'MSI',
            size: '3.43 MB',
            note: { en: 'MSI package — for silent / managed installs', zh: 'MSI 安装包，适合静默或批量部署' },
            sha256: 'fc08f06dfdbc014ff99e660b84cf2b2b07b070864e7b6d45127a7137edab9bfb',
            github:
              'https://github.com/hn1318/AutoClicker/releases/download/v1.0.2/AutoClicker_1.0.2_x64_en-US.msi',
          },
        ],
      },
      {
        version: 'v1.0.0',
        releasedAt: '2026-11-06',
        channel: 'stable',
        releaseUrl: 'https://github.com/hn1318/AutoClicker/releases/tag/v1.0.0',
        assets: [
          {
            id: 'ac-100-exe',
            file: 'AutoClicker_1.0.0_x64-setup.exe',
            platform: 'windows',
            arch: 'x64',
            format: 'EXE',
            size: '2.47 MB',
            note: { en: 'Setup wizard — creates Start menu and uninstall entries', zh: '安装向导，会创建开始菜单与卸载项' },
            sha256: '6de200f1a4ce187a601ba35d278f93d2ceb00781c4c02992e4fb14a0092b46b9',
            github:
              'https://github.com/hn1318/AutoClicker/releases/download/v1.0.0/AutoClicker_1.0.0_x64-setup.exe',
          },
          {
            id: 'ac-100-msi',
            file: 'AutoClicker_1.0.0_x64_en-US.msi',
            platform: 'windows',
            arch: 'x64',
            format: 'MSI',
            size: '3.43 MB',
            note: { en: 'MSI package — for silent / managed installs', zh: 'MSI 安装包，适合静默或批量部署' },
            sha256: 'ea3967115800e035182913f1c3c740408263e12b69af01e6e904913952718800',
            github:
              'https://github.com/hn1318/AutoClicker/releases/download/v1.0.0/AutoClicker_1.0.0_x64_en-US.msi',
          },
        ],
      },
      {
        version: 'v0.32.0',
        releasedAt: '2026-11-05',
        channel: 'stable',
        releaseUrl: 'https://github.com/hn1318/AutoClicker/releases/tag/v0.32.0',
        assets: [
          {
            id: 'ac-0320-exe',
            file: 'AutoClicker_0.32.0_x64-setup.exe',
            platform: 'windows',
            arch: 'x64',
            format: 'EXE',
            size: '1.72 MB',
            note: { en: 'Setup wizard — creates Start menu and uninstall entries', zh: '安装向导，会创建开始菜单与卸载项' },
            sha256: '08fdcfb04b08a32b8a661a0632052b1a9d294dae0cebf89cbf648510b1f79879',
            github:
              'https://github.com/hn1318/AutoClicker/releases/download/v0.32.0/AutoClicker_0.32.0_x64-setup.exe',
          },
          {
            id: 'ac-0320-msi',
            file: 'AutoClicker_0.32.0_x64_en-US.msi',
            platform: 'windows',
            arch: 'x64',
            format: 'MSI',
            size: '2.48 MB',
            note: { en: 'MSI package — for silent / managed installs', zh: 'MSI 安装包，适合静默或批量部署' },
            sha256: '4d12a31160594ebafc3c9280244b938b9a675d7ff1f2010cf65bbcfe2171b73a',
            github:
              'https://github.com/hn1318/AutoClicker/releases/download/v0.32.0/AutoClicker_0.32.0_x64_en-US.msi',
          },
        ],
      },
      {
        version: 'v0.3.0',
        releasedAt: '2026-11-05',
        channel: 'stable',
        releaseUrl: 'https://github.com/hn1318/AutoClicker/releases/tag/v0.3.0',
        assets: [
          {
            id: 'ac-030-exe',
            file: 'AutoClicker_0.3.0_x64-setup.exe',
            platform: 'windows',
            arch: 'x64',
            format: 'EXE',
            size: '1.71 MB',
            note: { en: 'Setup wizard — creates Start menu and uninstall entries', zh: '安装向导，会创建开始菜单与卸载项' },
            sha256: '9c5cd423d44c071a80187b74a500c016fffad6c141883532687edf0f6398b0a2',
            github:
              'https://github.com/hn1318/AutoClicker/releases/download/v0.3.0/AutoClicker_0.3.0_x64-setup.exe',
          },
          {
            id: 'ac-030-msi',
            file: 'AutoClicker_0.3.0_x64_en-US.msi',
            platform: 'windows',
            arch: 'x64',
            format: 'MSI',
            size: '2.46 MB',
            note: { en: 'MSI package — for silent / managed installs', zh: 'MSI 安装包，适合静默或批量部署' },
            sha256: '4469f5276ecd2d95a3a1e345149ebb0505a6dab3bd5a412c08b0e8d8f9eaec84',
            github:
              'https://github.com/hn1318/AutoClicker/releases/download/v0.3.0/AutoClicker_0.3.0_x64_en-US.msi',
          },
        ],
      },
      {
        version: 'v0.2.0',
        releasedAt: '2026-10-19',
        channel: 'stable',
        releaseUrl: 'https://github.com/hn1318/AutoClicker/releases/tag/v0.2.0',
        assets: [
          {
            id: 'ac-020-exe',
            file: 'AutoClicker_0.2.0_x64-setup.exe',
            platform: 'windows',
            arch: 'x64',
            format: 'EXE',
            size: '1.77 MB',
            note: { en: 'Setup wizard — creates Start menu and uninstall entries', zh: '安装向导，会创建开始菜单与卸载项' },
            sha256: '31145140e29e5debc16d047aa759eb84a60f15598ce5ca4bb22ed91687466b13',
            github:
              'https://github.com/hn1318/AutoClicker/releases/download/v0.2.0/AutoClicker_0.2.0_x64-setup.exe',
          },
          {
            id: 'ac-020-msi',
            file: 'AutoClicker_0.2.0_x64_en-US.msi',
            platform: 'windows',
            arch: 'x64',
            format: 'MSI',
            size: '2.58 MB',
            note: { en: 'MSI package — for silent / managed installs', zh: 'MSI 安装包，适合静默或批量部署' },
            sha256: '18ba44aca31b2818dbd235b07ee644aa6eff4ff27ae7902b6d80b56bd6da1d95',
            github:
              'https://github.com/hn1318/AutoClicker/releases/download/v0.2.0/AutoClicker_0.2.0_x64_en-US.msi',
          },
        ],
      },
      {
        version: 'v0.1',
        releasedAt: '2026-10-17',
        channel: 'stable',
        releaseUrl: 'https://github.com/hn1318/AutoClicker/releases/tag/v0.1',
        assets: [
          {
            id: 'ac-010-exe',
            file: 'AutoClicker_0.1.0_x64-setup.exe',
            platform: 'windows',
            arch: 'x64',
            format: 'EXE',
            size: '1.72 MB',
            note: { en: 'Setup wizard — creates Start menu and uninstall entries', zh: '安装向导，会创建开始菜单与卸载项' },
            sha256: '3517e82bb3d13241ee4bcdba8197954c41e2b865cf9c75c83f7a6a1769fb31f1',
            github:
              'https://github.com/hn1318/AutoClicker/releases/download/v0.1/AutoClicker_0.1.0_x64-setup.exe',
          },
          {
            id: 'ac-010-msi',
            file: 'AutoClicker_0.1.0_x64_en-US.msi',
            platform: 'windows',
            arch: 'x64',
            format: 'MSI',
            size: '2.51 MB',
            note: { en: 'MSI package — for silent / managed installs', zh: 'MSI 安装包，适合静默或批量部署' },
            sha256: '0c570d4ca341fcf5f8da6593a116f35f6ce2f240dcdb8f647d544876d57c66f8',
            github:
              'https://github.com/hn1318/AutoClicker/releases/download/v0.1/AutoClicker_0.1.0_x64_en-US.msi',
          },
        ],
      },
    ],
  },
];

/** Products that ship as a website or a plain repository — nothing to install. */
export const WEB_PROJECTS = [
  {
    key: 'hweather',
    name: 'HWeather',
    href: 'https://weather.hn3.top',
    docs: '/docs/hweather',
    tagline: { en: 'Weather & disaster alerts, in the browser', zh: '天气与灾害预警，浏览器直接用' },
  },
  {
    key: 'nettool',
    name: 'NetTool',
    href: 'https://github.com/hn1318/netTool',
    docs: '/docs/nettool',
    tagline: { en: 'FRP quick-connect tool, sourced on GitHub', zh: 'FRP 快速连接工具，源码在 GitHub' },
  },
  {
    key: 'campustao',
    name: 'CampusTao',
    href: 'https://book.hn3.top',
    docs: '/docs/campustao',
    tagline: { en: 'Campus second-hand book marketplace', zh: '校园二手书交易平台' },
  },
] as const;

export const PLATFORM_LABELS: Record<Platform, string> = {
  windows: 'Windows',
  macos: 'macOS',
  linux: 'Linux',
};

/** URL for an asset on a self-hosted route. */
export function mirrorHref(
  route: MirrorRoute,
  project: DownloadProject,
  version: string,
  asset: { file: string },
) {
  return `${route.base.replace(/\/$/, '')}/${project.key}/${version}/${asset.file}`;
}

/** Locale-aware short tagline helper. */
export function pick(locale: Locale, text: { en: string; zh: string }) {
  return text[locale] ?? text.en;
}

/* ----------------------------- runtime view model ----------------------------- */

/**
 * What the page actually renders. Same shape for the bake-time fallback and
 * for data pulled live from the GitHub API — `sha256` is optional because older
 * releases (and some uploads) carry no digest.
 */
export interface AssetView {
  id: string;
  file: string;
  platform: Platform;
  arch: string;
  format: string;
  size: string;
  sha256?: string;
  github: string;
  /**
   * 备用直链（目前来自 OpenList）。与 `github` 指向同一份文件，
   * 只走不同线路——下载源解析失败时保持 undefined。
   */
  mirror?: string;
  note: { en: string; zh: string };
}

export interface ReleaseView {
  version: string;
  releasedAt: string;
  channel: 'stable' | 'beta';
  releaseUrl: string;
  assets: AssetView[];
}

/**
 * Turn the baked manifest into the runtime view model.
 *
 * This is the instant-render fallback: it is what the static HTML ships with,
 * and what the page keeps showing if the GitHub request fails (offline, rate
 * limit, blocked network).
 */
export function bakedReleases(project: DownloadProject): ReleaseView[] {
  return project.releases.map((release) => ({
    version: release.version,
    releasedAt: release.releasedAt,
    channel: release.channel,
    releaseUrl: release.releaseUrl,
    assets: release.assets.map((asset) => ({ ...asset })),
  }));
}
