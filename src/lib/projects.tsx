import type { LayoutTab } from 'fumadocs-ui/layouts/shared';
import { BookOpen, Boxes, CloudSun, MessagesSquare, Network } from 'lucide-react';
import type { Locale } from '@/i18n/config';

/** Products with a docs set, matching the home page project cards. */
export const PROJECTS = [
  { key: 'makerstudio', title: 'MakerStudio', url: '/docs' },
  { key: 'hweather', title: 'HWeather', url: '/docs/hweather' },
  { key: 'hchat', title: 'HChat', url: '/docs/hchat' },
  { key: 'nettool', title: 'NetTool', url: '/docs/nettool' },
  { key: 'campustao', title: 'CampusTao', url: '/docs/campustao' },
] as const;

const ICONS: Record<string, React.ReactNode> = {
  makerstudio: <Boxes className="size-4" />,
  hweather: <CloudSun className="size-4" />,
  hchat: <MessagesSquare className="size-4" />,
  nettool: <Network className="size-4" />,
  campustao: <BookOpen className="size-4" />,
};

const KEYS = PROJECTS.map((p) => p.key) as string[];

/**
 * Sidebar tab switcher ("search box → tabs dropdown" in the docs sidebar).
 * URLs are locale-prefixed so the switch keeps the current language.
 */
export function getProjectTabs(locale: Locale): LayoutTab[] {
  const prefix = locale === 'zh' ? '/zh' : '';

  return PROJECTS.map((p) => ({
    title: p.title,
    url: `${prefix}${p.url}`,
    icon: ICONS[p.key],
  }));
}

/** The tag bucket name used in the search index for a project. */
export function projectTag(url: string): string {
  const segs = url.replace(/^\/(zh\/)?/, '').split('/');
  // /docs/<project>/... → <project>; /docs/... (MakerStudio) → all
  if (segs[0] === 'docs' && segs[1] && KEYS.includes(segs[1])) return segs[1];
  return 'all';
}
