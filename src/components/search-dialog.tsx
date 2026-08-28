'use client';

import { useMemo, useState } from 'react';
import { useDocsSearch } from 'fumadocs-core/search/client';
import { oramaStaticClient } from 'fumadocs-core/search/client/orama-static';
import {
  SearchDialog,
  SearchDialogClose,
  SearchDialogContent,
  SearchDialogFooter,
  SearchDialogHeader,
  SearchDialogIcon,
  SearchDialogInput,
  SearchDialogList,
  SearchDialogOverlay,
  type SharedProps,
} from 'fumadocs-ui/components/dialog/search';
import { useI18n } from 'fumadocs-ui/contexts/i18n';
import { Popover, PopoverContent, PopoverTrigger } from 'fumadocs-ui/components/ui/popover';
import { buttonVariants } from 'fumadocs-ui/components/ui/button';
import { Check, ChevronsUpDown } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/cn';

interface TagItem {
  name: string;
  value: string;
}

interface Props extends SharedProps {
  type?: 'static';
  api?: string;
  tags?: TagItem[];
  defaultTag?: string;
  delayMs?: number;
  allowClear?: boolean;
  links?: [string, string][];
  footer?: React.ReactNode;
}

/**
 * Replacement search dialog.
 *
 * Unlike the stock dialog (which renders tag filters as a row of buttons on
 * every page), this one:
 *  1. only shows the product filter on docs pages (`/docs` and `/zh/docs`),
 *  2. renders it as a compact dropdown instead of a horizontal tag row.
 */
export function SearchDialogWithProducts(props: Props) {
  const { type = 'static', api, tags = [], defaultTag, delayMs, links = [] } = props;
  const { locale } = useI18n();
  const pathname = usePathname();
  const isDocs = pathname.startsWith('/docs') || pathname.startsWith('/zh/docs');

  const [tag, setTag] = useState<string | undefined>(defaultTag);

  // Rebuild client per render like the stock dialog; `useDocsSearch` tracks
  // its `deps` (tag + locale) so tag changes trigger a fresh search.
  const client = oramaStaticClient({ from: api, locale, tag });
  const { search, setSearch, query } = useDocsSearch({ client, delayMs });

  const defaultItems = useMemo(() => {
    if (links.length === 0) return null;
    return links.map(([name, link]) => ({
      type: 'page' as const,
      id: name,
      content: name,
      url: link,
    }));
  }, [links]);

  return (
    <SearchDialog search={search} onSearchChange={setSearch} isLoading={query.isLoading} {...props}>
      <SearchDialogOverlay />
      <SearchDialogContent>
        <SearchDialogHeader>
          <SearchDialogIcon />
          <SearchDialogInput />
          <SearchDialogClose />
        </SearchDialogHeader>
        <SearchDialogList items={query.data !== 'empty' ? query.data : defaultItems} />
        {isDocs && tags.length > 0 && (
          <SearchDialogFooter className="flex items-center gap-2 border-t px-2 py-1.5">
            <ProductSelect tags={tags} value={tag ?? ''} onChange={setTag} />
          </SearchDialogFooter>
        )}
      </SearchDialogContent>
    </SearchDialog>
  );
}

function ProductSelect({
  tags,
  value,
  onChange,
}: {
  tags: TagItem[];
  value: string;
  onChange: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const selected = tags.find((t) => t.value === value) ?? tags[0];

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        className={(s) =>
          cn(
            buttonVariants({ color: 'ghost', size: 'sm' }),
            'gap-2 text-sm font-medium',
            s.open && 'bg-fd-accent',
          )
        }
      >
        <span className="text-fd-muted-foreground text-xs">Search in</span>
        <span>{selected?.name ?? 'All'}</span>
        <ChevronsUpDown className="size-3.5 text-fd-muted-foreground" />
      </PopoverTrigger>
      <PopoverContent className="flex w-auto min-w-0 flex-col gap-0.5 p-1">
        {tags.map((t) => (
          <button
            key={t.value}
            type="button"
            className={cn(
              'flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-start text-sm whitespace-nowrap transition-colors',
              t.value === value
                ? 'bg-fd-primary/10 text-fd-primary'
                : 'text-fd-muted-foreground hover:bg-fd-accent hover:text-fd-accent-foreground',
            )}
            onClick={() => {
              onChange(t.value);
              setOpen(false);
            }}
          >
            <span className="flex-1">{t.name}</span>
            {t.value === value && <Check className="size-3.5" />}
          </button>
        ))}
      </PopoverContent>
    </Popover>
  );
}
