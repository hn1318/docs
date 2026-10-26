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
    releases: [
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
  asset: DownloadAsset,
) {
  return `${route.base.replace(/\/$/, '')}/${project.key}/${version}/${asset.file}`;
}

/** Locale-aware short tagline helper. */
export function pick(locale: Locale, text: { en: string; zh: string }) {
  return text[locale] ?? text.en;
}
