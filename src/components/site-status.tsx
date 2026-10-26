'use client';

import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { cn } from '@/lib/cn';
import type { Locale } from '@/i18n/config';
import type { Dictionary } from '@/i18n/dict';
import {
  STATUS_PAGE_URL,
  STATUS_SUMMARY_URL,
  formatElapsed,
  humanizeStatus,
  normalizeStatusSummary,
  statusTone,
  type StatusSummary,
  type StatusTone,
} from '@/lib/status';

/** Instatus rate limits are generous; once a minute keeps the badge honest. */
const REFRESH_INTERVAL = 60_000;

const DOT: Record<StatusTone, string> = {
  up: 'bg-emerald-500',
  issues: 'bg-rose-500',
  maintenance: 'bg-amber-500',
  unknown: 'bg-fd-muted-foreground/40',
};

const TONE_TEXT: Record<StatusTone, string> = {
  up: 'text-emerald-700 dark:text-emerald-400',
  issues: 'text-rose-700 dark:text-rose-400',
  maintenance: 'text-amber-700 dark:text-amber-400',
  unknown: 'text-fd-muted-foreground',
};

function Entry({
  name,
  meta,
  href,
  tone,
}: {
  name: string;
  meta?: string;
  href?: string;
  tone: StatusTone;
}) {
  const className =
    'flex items-start gap-2 rounded-lg px-2 py-1.5 transition-colors hover:bg-fd-accent/60';
  const content = (
    <>
      <span className={cn('mt-1.5 size-1.5 shrink-0 rounded-full', DOT[tone])} />
      <span className="min-w-0">
        <span className="block truncate text-xs font-medium text-fd-foreground">{name}</span>
        {meta ? (
          <span className="mt-0.5 block text-[11px] text-fd-muted-foreground">{meta}</span>
        ) : null}
      </span>
    </>
  );

  if (!href) return <div className={className}>{content}</div>;

  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
      {content}
    </a>
  );
}

/**
 * Live status badge backed by the public Instatus summary feed.
 *
 * Renders as a plain link to the status page until the first fetch resolves, so
 * the footer stays useful with JavaScript disabled or when the feed is blocked.
 * Everything inside the panel is derived from the feed; `labels` comes from the
 * server dictionary so the badge follows the page locale.
 */
export function SiteStatus({ locale, labels }: { locale: Locale; labels: Dictionary['status'] }) {
  const [summary, setSummary] = useState<StatusSummary | null>(null);
  const [failed, setFailed] = useState(false);
  const loaded = useRef(false);

  useEffect(() => {
    const controller = new AbortController();
    let cancelled = false;

    async function load() {
      try {
        const response = await fetch(STATUS_SUMMARY_URL, {
          signal: controller.signal,
          cache: 'no-store',
          headers: { accept: 'application/json' },
        });
        if (!response.ok) throw new Error(`Status feed responded ${response.status}`);

        const next = normalizeStatusSummary(await response.json());
        if (!next) throw new Error('Unexpected status payload');
        if (cancelled) return;

        loaded.current = true;
        setSummary(next);
        setFailed(false);
      } catch {
        if (cancelled || controller.signal.aborted) return;
        // Keep the last known state: a single failed poll is not an outage.
        if (!loaded.current) setFailed(true);
      }
    }

    void load();

    const timer = window.setInterval(() => {
      if (document.visibilityState === 'visible') void load();
    }, REFRESH_INTERVAL);

    // Coming back to the tab is the most likely moment to want fresh state.
    const onVisibilityChange = () => {
      if (document.visibilityState === 'visible') void load();
    };
    document.addEventListener('visibilitychange', onVisibilityChange);

    return () => {
      cancelled = true;
      controller.abort();
      window.clearInterval(timer);
      document.removeEventListener('visibilitychange', onVisibilityChange);
    };
  }, []);

  const pageStatus = summary?.page.status;
  const tone = statusTone(pageStatus);
  const text = summary
    ? (labels.page[pageStatus as keyof typeof labels.page] ?? humanizeStatus(pageStatus ?? ''))
    : failed
      ? labels.unavailable
      : labels.checking;

  const incidents = summary?.activeIncidents ?? [];
  const maintenances = summary?.activeMaintenances ?? [];
  const quiet = incidents.length === 0 && maintenances.length === 0;

  const incidentMeta = (incident: StatusSummary['activeIncidents'][number]) => {
    const status = labels.incident[incident.status as keyof typeof labels.incident] ?? humanizeStatus(incident.status);
    const impact = incident.impact
      ? (labels.impact[incident.impact as keyof typeof labels.impact] ?? humanizeStatus(incident.impact))
      : '';
    const since = formatElapsed(incident.started, locale);

    return [status, impact, since ? `${labels.since} ${since}` : ''].filter(Boolean).join(' · ');
  };

  const maintenanceMeta = (maintenance: StatusSummary['activeMaintenances'][number]) => {
    const status =
      labels.maintenance[maintenance.status as keyof typeof labels.maintenance] ??
      humanizeStatus(maintenance.status);
    const since = formatElapsed(maintenance.started, locale);

    return [status, since ? `${labels.since} ${since}` : ''].filter(Boolean).join(' · ');
  };

  return (
    <div className="group relative inline-flex">
      <a
        href={STATUS_PAGE_URL}
        target="_blank"
        rel="noopener noreferrer"
        title={labels.open}
        className="inline-flex items-center gap-2 rounded-full border border-fd-border bg-fd-card px-2.5 py-1 text-xs font-medium text-fd-muted-foreground transition-colors hover:border-fd-primary/40 hover:text-fd-foreground"
      >
        <span
          className={cn(
            'size-1.5 shrink-0 rounded-full',
            DOT[tone],
            tone === 'issues' && 'motion-safe:animate-pulse',
          )}
        />
        <span className="max-w-[13rem] truncate">{text}</span>
        <ArrowUpRight className="size-3 opacity-60" />
      </a>

      <div
        className={cn(
          'pointer-events-none invisible absolute bottom-full left-1/2 z-40 w-[min(20rem,calc(100vw-2.5rem))] -translate-x-1/2 pb-2 opacity-0 transition-[opacity,visibility] duration-150',
          'group-hover:visible group-hover:pointer-events-auto group-hover:opacity-100',
          'group-focus-within:visible group-focus-within:pointer-events-auto group-focus-within:opacity-100',
          'sm:left-auto sm:right-0 sm:translate-x-0',
        )}
      >
        <div className="max-h-[min(24rem,70vh)] overflow-y-auto rounded-xl border border-fd-border bg-fd-card p-3 text-left shadow-lg">
          <div className="flex items-center justify-between gap-2 border-b border-fd-border pb-2">
            <span className="truncate text-xs font-semibold text-fd-foreground">
              {summary?.page.name ?? 'MakerStudio'}
            </span>
            <span
              className={cn('inline-flex shrink-0 items-center gap-1.5 text-[11px] font-medium', TONE_TEXT[tone])}
            >
              <span className={cn('size-1.5 rounded-full', DOT[tone])} />
              {text}
            </span>
          </div>

          {incidents.length > 0 && (
            <div className="mt-2">
              <p className="px-2 text-[10px] font-medium tracking-wide text-fd-muted-foreground uppercase">
                {labels.incidents}
              </p>
              <ul className="mt-1">
                {incidents.map((incident, index) => (
                  <li key={`${incident.name}-${index}`}>
                    <Entry
                      name={incident.name}
                      meta={incidentMeta(incident)}
                      href={incident.url}
                      tone="issues"
                    />
                  </li>
                ))}
              </ul>
            </div>
          )}

          {maintenances.length > 0 && (
            <div className="mt-2">
              <p className="px-2 text-[10px] font-medium tracking-wide text-fd-muted-foreground uppercase">
                {labels.maintenances}
              </p>
              <ul className="mt-1">
                {maintenances.map((maintenance, index) => (
                  <li key={`${maintenance.name}-${index}`}>
                    <Entry
                      name={maintenance.name}
                      meta={maintenanceMeta(maintenance)}
                      href={maintenance.url}
                      tone="maintenance"
                    />
                  </li>
                ))}
              </ul>
            </div>
          )}

          {summary && quiet && (
            <p className="mt-2 rounded-lg bg-fd-accent/40 px-2 py-1.5 text-[11px] text-fd-muted-foreground">
              {labels.none}
            </p>
          )}

          <a
            href={STATUS_PAGE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 flex items-center justify-between gap-2 rounded-lg px-2 py-1.5 text-[11px] font-medium text-fd-foreground transition-colors hover:bg-fd-accent"
          >
            {labels.open}
            <ArrowUpRight className="size-3" />
          </a>
        </div>
      </div>
    </div>
  );
}
