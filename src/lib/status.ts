import type { Locale } from '@/i18n/config';

/**
 * Instatus integration.
 *
 * The public status page exposes a CORS-enabled summary feed that we poll from
 * the browser — `output: 'export'` means there is no server to proxy it, and a
 * build-time fetch would be stale the moment we deploy.
 *
 * Shape (trimmed):
 *   { page: { name, url, status: 'UP' | 'HASISSUES' | 'UNDERMAINTENANCE' },
 *     activeIncidents: [{ name, status, impact, started, url }],
 *     activeMaintenances: [{ name, status, started, url }] }
 *
 * Empty lists are sometimes omitted entirely, and every field is treated as
 * untrusted, so everything below normalises before it reaches the UI.
 */

export const STATUS_PAGE_URL = 'https://makerstudio.instatus.com';

export const STATUS_SUMMARY_URL = `${STATUS_PAGE_URL}/summary.json`;

/** Visual bucket a page status falls into. */
export type StatusTone = 'up' | 'issues' | 'maintenance' | 'unknown';

export interface StatusIncident {
  name: string;
  /** INVESTIGATING | IDENTIFIED | MONITORING | RESOLVED — kept open-ended. */
  status: string;
  /** MAJOROUTAGE | PARTIALOUTAGE | DEGRADEDPERFORMANCE | … */
  impact?: string;
  started?: string;
  url?: string;
}

export interface StatusMaintenance {
  name: string;
  /** NOTSTARTEDYET | INPROGRESS | COMPLETED */
  status: string;
  started?: string;
  url?: string;
}

export interface StatusSummary {
  page: { name: string; url: string; status: string };
  activeIncidents: StatusIncident[];
  activeMaintenances: StatusMaintenance[];
}

function asText(value: unknown): string | undefined {
  return typeof value === 'string' && value.trim() !== '' ? value.trim() : undefined;
}

function asRecord(value: unknown): Record<string, unknown> | null {
  return typeof value === 'object' && value !== null ? (value as Record<string, unknown>) : null;
}

function toIncident(value: unknown): StatusIncident | null {
  const record = asRecord(value);
  if (!record) return null;

  const name = asText(record.name);
  const status = asText(record.status);
  if (!name || !status) return null;

  return {
    name,
    status,
    impact: asText(record.impact),
    started: asText(record.started),
    url: asText(record.url),
  };
}

function toMaintenance(value: unknown): StatusMaintenance | null {
  const record = asRecord(value);
  if (!record) return null;

  const name = asText(record.name);
  const status = asText(record.status);
  if (!name || !status) return null;

  return {
    name,
    status,
    started: asText(record.started),
    url: asText(record.url),
  };
}

function toList<T>(value: unknown, map: (item: unknown) => T | null): T[] {
  return Array.isArray(value) ? value.map(map).filter((item): item is T => item !== null) : [];
}

/** Returns `null` when the payload is not a usable status summary. */
export function normalizeStatusSummary(raw: unknown): StatusSummary | null {
  const root = asRecord(raw);
  const page = asRecord(root?.page);
  const status = asText(page?.status);
  if (!root || !page || !status) return null;

  return {
    page: {
      name: asText(page.name) ?? 'MakerStudio',
      url: asText(page.url) ?? STATUS_PAGE_URL,
      status,
    },
    activeIncidents: toList(root.activeIncidents, toIncident),
    activeMaintenances: toList(root.activeMaintenances, toMaintenance),
  };
}

export function statusTone(status: string | undefined): StatusTone {
  switch (status) {
    case 'UP':
      return 'up';
    case 'HASISSUES':
      return 'issues';
    case 'UNDERMAINTENANCE':
      return 'maintenance';
    default:
      return 'unknown';
  }
}

/** Instatus dates are `toString()` output — tolerate the trailing zone name. */
function parseStatusDate(value: string | undefined): Date | null {
  if (!value) return null;

  const direct = new Date(value);
  if (!Number.isNaN(direct.getTime())) return direct;

  const cleaned = new Date(value.replace(/\s*\([^)]*\)\s*$/, ''));
  return Number.isNaN(cleaned.getTime()) ? null : cleaned;
}

const INTL_LOCALES: Record<Locale, string> = { en: 'en', zh: 'zh-CN' };

const ELAPSED_UNITS: Array<[Intl.RelativeTimeFormatUnit, number]> = [
  ['second', 60],
  ['minute', 60],
  ['hour', 24],
  ['day', 30],
  ['month', 12],
  ['year', Number.POSITIVE_INFINITY],
];

/** "2 hr. ago" / "2小时前"; empty string when the date cannot be parsed. */
export function formatElapsed(value: string | undefined, locale: Locale): string {
  const date = parseStatusDate(value);
  if (!date) return '';

  const diff = Date.now() - date.getTime();
  const sign = diff >= 0 ? -1 : 1;
  let amount = Math.abs(diff) / 1000;

  for (const [unit, size] of ELAPSED_UNITS) {
    if (amount < size || unit === 'year') {
      const formatter = new Intl.RelativeTimeFormat(INTL_LOCALES[locale] ?? 'en', {
        numeric: 'auto',
        style: 'short',
      });
      return formatter.format(sign * Math.round(amount), unit);
    }
    amount /= size;
  }

  return '';
}

/** Fallback for codes we do not have a translation for. */
export function humanizeStatus(value: string): string {
  const words = value.replace(/[_-]+/g, ' ').toLowerCase();
  return words.charAt(0).toUpperCase() + words.slice(1);
}
