'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';

const START = 8;
/** Never fill all the way on its own — the last 10% waits for the route. */
const CEILING = 90;
/** Give up (and hide) if a navigation never completes. */
const WATCHDOG = 15000;

/** Path + query of the current document. The hash is deliberately left out. */
function documentKey() {
  return `${window.location.pathname}${window.location.search}`;
}

/** `/downloads` and `/downloads/` address the same page with trailingSlash on. */
function normalizePath(pathname: string) {
  const trimmed = pathname.replace(/\/+$/, '');
  return trimmed === '' ? '/' : trimmed;
}

/**
 * Thin progress bar pinned to the top of the viewport.
 *
 * Static exports are cheap on the server but a slow network can leave a click
 * looking dead for a second or more. This starts instantly on any same-origin
 * link click and completes when the navigation commits.
 *
 * In-page jumps (`#releases`, `#quick-links`, …) are not navigations: Chrome
 * fires `popstate` for them too, so both the click handler and the popstate
 * handler compare the full document key before starting anything. As a final
 * guard the bar also completes as soon as the URL changes for any reason, which
 * covers query-only navigations that never change the pathname.
 *
 * Mounted once in the root layout — covers the home page, docs, project
 * switching and language switching alike.
 */
export function NavProgress() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);
  const [value, setValue] = useState(0);

  const trickle = useRef<ReturnType<typeof setInterval> | null>(null);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const watchdog = useRef<ReturnType<typeof setTimeout> | null>(null);
  /** True while a navigation we started is still pending. */
  const pending = useRef(false);
  /** Document (path + query) at the moment the current navigation started. */
  const startUrl = useRef('');
  /** Last document we considered "current", used to ignore hash-only popstates. */
  const lastDocument = useRef<string | null>(null);

  const clearTimers = useCallback(() => {
    if (trickle.current) clearInterval(trickle.current);
    if (hideTimer.current) clearTimeout(hideTimer.current);
    if (watchdog.current) clearTimeout(watchdog.current);
    trickle.current = null;
    hideTimer.current = null;
    watchdog.current = null;
  }, []);

  const finish = useCallback(() => {
    if (!pending.current) return;
    pending.current = false;
    clearTimers();

    setValue(100);
    hideTimer.current = setTimeout(() => {
      setVisible(false);
      setValue(0);
    }, 240);
  }, [clearTimers]);

  const start = useCallback(() => {
    if (pending.current) return;
    pending.current = true;
    clearTimers();

    startUrl.current = window.location.href;
    setVisible(true);
    setValue(START);

    trickle.current = setInterval(() => {
      // Any committed URL change ends the wait — including same-document jumps
      // (hash or query only) that never change the pathname.
      if (window.location.href !== startUrl.current) {
        lastDocument.current = documentKey();
        finish();
        return;
      }
      setValue((v) => (v >= CEILING ? v : v + Math.max(0.6, (CEILING - v) * 0.14)));
    }, 180);

    watchdog.current = setTimeout(() => {
      pending.current = false;
      clearTimers();
      setVisible(false);
      setValue(0);
    }, WATCHDOG);
  }, [clearTimers, finish]);

  // Complete the bar once the new route has rendered.
  const firstRoute = useRef(true);
  useEffect(() => {
    lastDocument.current = documentKey();
    if (firstRoute.current) {
      firstRoute.current = false;
      return;
    }
    finish();
  }, [pathname, finish]);

  // Start on a real same-origin navigation, and only on one.
  useEffect(() => {
    lastDocument.current = documentKey();

    function onClick(event: MouseEvent) {
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

      const anchor = (event.target as HTMLElement | null)?.closest?.('a');
      if (!anchor) return;
      if (anchor.target === '_blank' || anchor.hasAttribute('download')) return;

      const href = anchor.getAttribute('href');
      if (!href || href.startsWith('#')) return;
      if (/^(mailto:|tel:|javascript:)/i.test(href)) return;

      let url: URL;
      try {
        url = new URL(href, window.location.href);
      } catch {
        return;
      }
      if (url.origin !== window.location.origin) return;

      // Same page, only a hash (or a trailing-slash variation) differs.
      const samePath = normalizePath(url.pathname) === normalizePath(window.location.pathname);
      if (samePath && url.search === window.location.search) return;

      start();
    }

    function onPopState() {
      // Chrome fires popstate for fragment navigation as well; a hash-only
      // change never swaps the document, so there is nothing to wait for.
      const next = documentKey();
      if (next === lastDocument.current) return;
      lastDocument.current = next;
      start();
    }

    document.addEventListener('click', onClick, true);
    window.addEventListener('popstate', onPopState);

    return () => {
      document.removeEventListener('click', onClick, true);
      window.removeEventListener('popstate', onPopState);
      clearTimers();
    };
  }, [start, clearTimers]);

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-x-0 top-0 z-[9999] h-[3px] transition-opacity duration-300"
      style={{ opacity: visible ? 1 : 0 }}
    >
      <div
        className="h-full bg-fd-primary shadow-[0_0_10px_rgba(120,120,255,0.55)]"
        style={{
          width: `${value}%`,
          transition: value === 0 ? 'none' : 'width 220ms ease-out',
        }}
      />
    </div>
  );
}
