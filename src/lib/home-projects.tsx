import { BookOpen, CloudSun, MousePointerClick, Network, type LucideIcon } from 'lucide-react';
import type { getDictionary } from '@/i18n/dict';

type ProjectKey = keyof ReturnType<typeof getDictionary>['projects']['items'];

export interface HomeProject {
  key: ProjectKey;
  icon: LucideIcon;
  /** Where the card leads — the live app or its repository. */
  href: string;
  /** Tailwind gradient used for the icon tile + hover accent. */
  accent: string;
  /** Tailwind background used for the hover glow. */
  glow: string;
}

/**
 * The products featured on the home page and in the footer.
 * Copy lives in `src/i18n/dict.ts` → `projects.items`, keyed by `key`.
 */
export const homeProjects: HomeProject[] = [
  {
    key: 'hwather',
    icon: CloudSun,
    href: 'https://weather.hn3.top',
    accent: 'from-sky-500 to-blue-600',
    glow: 'bg-sky-500/20',
  },
  {
    key: 'autoclicker',
    icon: MousePointerClick,
    href: 'https://github.com/hn1318/AutoClicker',
    accent: 'from-teal-500 to-cyan-600',
    glow: 'bg-teal-500/20',
  },
  {
    key: 'nettool',
    icon: Network,
    href: 'https://github.com/hn1318/netTool',
    accent: 'from-violet-500 to-indigo-600',
    glow: 'bg-violet-500/20',
  },
  {
    key: 'campustao',
    icon: BookOpen,
    href: 'https://book.hn3.top',
    accent: 'from-amber-500 to-orange-600',
    glow: 'bg-amber-500/20',
  },
];
