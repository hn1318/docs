'use client';

import { useEffect } from 'react';

/**
 * Static export cannot read the request to decide `<html lang>` at build time,
 * so we correct it on the client from the pathname. Runs once after hydration.
 */
export function LocaleLang() {
  useEffect(() => {
    const path = window.location.pathname;
    document.documentElement.lang = path.startsWith('/zh') ? 'zh' : 'en';
  }, []);

  return null;
}
