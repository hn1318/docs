'use client';

import { Languages } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from 'fumadocs-ui/components/ui/popover';
import { buttonVariants } from 'fumadocs-ui/components/ui/button';
import { useI18n } from 'fumadocs-ui/contexts/i18n';
import type { LanguageSelectProps } from 'fumadocs-ui/layouts/shared/slots/language-select';
import { cn } from '@/lib/cn';

/**
 * Narrow replacement for the default `LanguageSelect` slot.
 * The stock popover enforces `min-w-[240px]`; this one sizes to its content.
 */
export function NarrowLanguageSelect({
  className,
  variant = 'ghost',
  children,
  ...rest
}: LanguageSelectProps) {
  const context = useI18n();

  return (
    <Popover>
      <PopoverTrigger
        aria-label="Choose a language"
        className={(s) =>
          cn(buttonVariants({ variant }), 'gap-1.5 p-1.5', s.open && 'bg-fd-accent', className)
        }
        {...rest}
      >
        {children ?? <Languages className="size-5" />}
      </PopoverTrigger>
      <PopoverContent className="flex w-auto min-w-0 flex-col gap-0.5 p-1">
        {context.locales?.map((item) => (
          <button
            key={item.locale}
            type="button"
            className={cn(
              'rounded-lg px-2.5 py-1.5 text-start text-sm whitespace-nowrap transition-colors',
              item.locale === context.locale
                ? 'bg-fd-primary/10 text-fd-primary'
                : 'text-fd-muted-foreground hover:bg-fd-accent hover:text-fd-accent-foreground',
            )}
            onClick={() => context.onChange?.(item.locale)}
          >
            {item.name}
          </button>
        ))}
      </PopoverContent>
    </Popover>
  );
}
