import type { Locale } from '@/i18n/config';
import type { AssetView } from './downloads';

/**
 * OpenList (AList 兼容) 下载源客户端。
 *
 * 本站是纯静态导出，没有服务端可代理，因此浏览器直接调用公开的 OpenList：
 *   - `POST /api/fs/list` 列出目录
 *   - `POST /api/fs/get`  取得带签名的直链（raw_url）
 * 两个接口都返回 `Access-Control-Allow-Origin: *`，可以跨站直接访问。
 *
 * 所有失败都静默降级：网络被拦、目录改名、文件缺失时，GitHub 线路保持可用。
 */

export const OPENLIST_BASE = 'https://alist.hn13.qzz.io';

/** 桌面端产品目录所在的根路径：每个产品一个子目录。 */
export const OPENLIST_SOFTWARE_ROOT = '/@s/guest/software/m';

const CACHE_TTL = 5 * 60 * 1000;
/**
 * 这个 OpenList 实例首次冷启动（无缓存）时列目录要 6–13 秒，之后才回到 2–3 秒。
 * 超时设得太短会让真实请求必然被中止，因此给足 20 秒；失败时静默降级即可。
 */
const REQUEST_TIMEOUT = 20_000;
const LIST_TIMEOUT = 30_000;
const CACHE_PREFIX = 'makerstudio:openlist:';

interface ListEntry {
  name: string;
  size?: number;
  modified?: string;
}

export interface OpenListFile {
  name: string;
  /** 直链；解析失败时为 undefined。 */
  url?: string;
  /** 字节数，来自目录列表。 */
  size?: number;
  modified?: string;
}

export interface OpenListSource {
  /** 在 OpenList 网页端打开该目录的地址。 */
  pageUrl: string;
  files: OpenListFile[];
  /** 是否至少有一个文件解析出了直链。 */
  resolved: boolean;
}

export function openListPathFor(folder: string) {
  return `${OPENLIST_SOFTWARE_ROOT}/${folder}`;
}

export function openListPageUrl(path: string) {
  return `${OPENLIST_BASE}${path}`;
}

export function formatOpenListSize(bytes: number | undefined) {
  if (!bytes || bytes < 0) return '—';
  const mb = bytes / 1024 / 1024;
  if (mb >= 1) return `${mb.toFixed(2)} MB`;
  return `${Math.max(1, Math.round(bytes / 1024))} KB`;
}

/* ---------------------------------- 缓存 ---------------------------------- */

function readCache(path: string): ListEntry[] | null {
  try {
    const raw = sessionStorage.getItem(CACHE_PREFIX + path);
    if (!raw) return null;
    const entry = JSON.parse(raw) as { at: number; data: ListEntry[] };
    if (!Array.isArray(entry?.data) || Date.now() - entry.at > CACHE_TTL) return null;
    return entry.data;
  } catch {
    return null;
  }
}

function writeCache(path: string, data: ListEntry[]) {
  try {
    sessionStorage.setItem(CACHE_PREFIX + path, JSON.stringify({ at: Date.now(), data }));
  } catch {
    /* 隐私模式 / 配额不足——内存状态仍然可用 */
  }
}

/**
 * 直链缓存：`raw_url` 有效期通常以小时计，缓存 5 分钟能显著减少
 * `/api/fs/get` 的调用次数（该接口同样可能很慢）。
 */
const URL_CACHE_PREFIX = 'makerstudio:openlist-urls:';

function readUrlCache(path: string): OpenListFile[] | null {
  try {
    const raw = sessionStorage.getItem(URL_CACHE_PREFIX + path);
    if (!raw) return null;
    const entry = JSON.parse(raw) as { at: number; data: OpenListFile[] };
    if (!Array.isArray(entry?.data) || Date.now() - entry.at > CACHE_TTL) return null;
    return entry.data;
  } catch {
    return null;
  }
}

function writeUrlCache(path: string, data: OpenListFile[]) {
  try {
    sessionStorage.setItem(URL_CACHE_PREFIX + path, JSON.stringify({ at: Date.now(), data }));
  } catch {
    /* ignore */
  }
}

/* --------------------------------- 请求封装 -------------------------------- */

async function postJson<T>(endpoint: string, body: unknown, timeout = REQUEST_TIMEOUT): Promise<T | null> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(`${OPENLIST_BASE}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(body),
      signal: controller.signal,
      cache: 'no-store',
    });
    if (!response.ok) return null;

    const payload = (await response.json()) as { code?: number; data?: T } | null;
    if (!payload || payload.code !== 200 || payload.data == null) return null;
    return payload.data;
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

async function listFolder(path: string): Promise<ListEntry[] | null> {
  const cached = readCache(path);
  if (cached) return cached;

  const data = await postJson<{ content?: Array<{ name?: string; size?: number; is_dir?: boolean; modified?: string }> | null }>(
    '/api/fs/list',
    { path, password: '', page: 1, per_page: 200, refresh: false },
    LIST_TIMEOUT,
  );

  const content = data?.content;
  if (!Array.isArray(content)) return null;

  const files: ListEntry[] = [];
  for (const entry of content) {
    if (!entry || typeof entry.name !== 'string' || entry.is_dir) continue;
    files.push({
      name: entry.name,
      size: typeof entry.size === 'number' ? entry.size : undefined,
      modified: typeof entry.modified === 'string' ? entry.modified : undefined,
    });
  }

  writeCache(path, files);
  return files;
}

async function resolveFileUrl(path: string, name: string): Promise<string | null> {
  const data = await postJson<{ raw_url?: string | null }>('/api/fs/get', {
    path: `${path}/${name}`,
    password: '',
  });

  const url = data?.raw_url;
  return typeof url === 'string' && /^https?:\/\//i.test(url) ? url : null;
}

/**
 * 拉取某个产品文件夹的 OpenList 文件列表，并为每个文件解析直链。
 * 目录不可达时返回 `null`，调用方保持 GitHub 单线路视图。
 *
 * `folder` 必须是 OpenList 上真实的目录名（大小写敏感）。
 */
export async function fetchOpenList(folder: string): Promise<OpenListSource | null> {
  const path = openListPathFor(folder);

  const cached = readUrlCache(path);
  if (cached && cached.some((file) => file.url)) {
    return {
      pageUrl: openListPageUrl(path),
      files: cached,
      resolved: true,
    };
  }

  const files = await listFolder(path);
  if (!files || files.length === 0) return null;

  // 并行解析直链：串行等待会把多个文件的耗时累加，容易超过页面容忍度。
  const resolved = await Promise.all(
    files.map(async (file) => {
      const url = await resolveFileUrl(path, file.name);
      return { ...file, url: url ?? undefined };
    }),
  );

  if (resolved.some((file) => file.url)) writeUrlCache(path, resolved);

  return {
    pageUrl: openListPageUrl(path),
    files: resolved,
    resolved: resolved.some((file) => Boolean(file.url)),
  };
}

/**
 * 把 OpenList 文件挂到对应的下载行上：
 *  - 文件名一致时，给该 asset 补上 `mirror`（第二下载按钮）
 *  - 只在 OpenList 存在的文件，追加成独立行，避免漏掉可下载的构建
 */
export function mergeOpenListAssets(
  assets: AssetView[],
  source: OpenListSource | null,
): AssetView[] {
  if (!source || source.files.length === 0) return assets;

  const byName = new Map(source.files.map((file) => [file.name.toLowerCase(), file]));
  const claimed = new Set<string>();

  const merged = assets.map((asset) => {
    const file = byName.get(asset.file.toLowerCase());
    if (!file) return asset;
    claimed.add(file.name.toLowerCase());
    return file.url ? { ...asset, mirror: file.url } : asset;
  });

  for (const file of source.files) {
    if (!file.url || claimed.has(file.name.toLowerCase())) continue;
    merged.push(openListOnlyAsset(file));
  }

  return merged;
}

function openListOnlyAsset(file: OpenListFile): AssetView {
  const format = (file.name.match(/\.([a-z0-9]+)$/i)?.[1] ?? 'FILE').toUpperCase();
  const lower = format.toLowerCase();

  const platform: AssetView['platform'] =
    lower === 'dmg' || lower === 'pkg' || /macos|darwin/.test(file.name.toLowerCase())
      ? 'macos'
      : ['appimage', 'deb', 'rpm'].includes(lower) || /linux/.test(file.name.toLowerCase())
        ? 'linux'
        : 'windows';

  const arch = /aarch64|arm64/i.test(file.name)
    ? 'arm64'
    : /x64|x86_64|amd64/i.test(file.name)
      ? 'x64'
      : /i686|x86|ia32/i.test(file.name)
        ? 'x86'
        : 'universal';

  return {
    id: `openlist:${file.name}`,
    file: file.name,
    platform,
    arch,
    format,
    size: formatOpenListSize(file.size),
    github: file.url ?? '',
    mirror: file.url,
    note:
      format === 'EXE'
        ? { en: 'Setup wizard — creates Start menu and uninstall entries', zh: '安装向导，会创建开始菜单与卸载项' }
        : format === 'MSI'
          ? { en: 'MSI package — for silent / managed installs', zh: 'MSI 安装包，适合静默或批量部署' }
          : format === 'ZIP' || format === '7Z'
            ? { en: 'Archive — unpack and run', zh: '压缩包，解压后直接运行' }
            : { en: 'Release asset', zh: '发布文件' },
  };
}

/** 供 UI 用的路由名，两种语言都显示 OpenList。 */
export function openListLabel(_locale: Locale) {
  return 'OpenList';
}
