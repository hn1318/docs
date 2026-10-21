'use client';

import { useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { cn } from '@/lib/cn';

/**
 * Tiny inline button that copies a full SHA-256 to the clipboard.
 * The page only shows an abbreviated hash, so this is how users get the rest.
 */
export function ChecksumCopy({ value, label }: { value: string; label: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* clipboard unavailable (http / permissions) — silently ignore */
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      title={label}
      aria-label={label}
      className={cn(
        'inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[11px] transition-colors',
        'text-fd-muted-foreground hover:bg-fd-accent hover:text-fd-foreground active:scale-95',
        copied && 'text-green-600 dark:text-green-400',
      )}
    >
      {copied ? <Check className="size-3" /> : <Copy className="size-3" />}
    </button>
  );
}
