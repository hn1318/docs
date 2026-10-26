'use client';

import { useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { cn } from '@/lib/cn';

interface CopyValueProps {
  /** Text placed on the clipboard — a full checksum or a shell command. */
  value: string;
  label: string;
  copiedLabel: string;
  className?: string;
}

/**
 * Small copy button used for checksums and verification commands.
 * Fails quietly in insecure contexts, where the clipboard API is unavailable.
 */
export function CopyValue({ value, label, copiedLabel, className }: CopyValueProps) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard unavailable (http / permissions) — leave the button as-is */
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      title={copied ? copiedLabel : label}
      aria-label={copied ? copiedLabel : label}
      className={cn(
        'inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[11px] text-fd-muted-foreground transition-colors hover:bg-fd-accent hover:text-fd-foreground',
        copied && 'text-emerald-600 dark:text-emerald-400',
        className,
      )}
    >
      {copied ? <Check className="size-3" /> : <Copy className="size-3" />}
      <span>{copied ? copiedLabel : label}</span>
    </button>
  );
}
