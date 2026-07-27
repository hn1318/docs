import { sourceEn, sourceZh } from '@/lib/source';
import { llms } from 'fumadocs-core/source';

export const revalidate = false;

export function GET() {
  return new Response(
    [llms(sourceEn).index(), llms(sourceZh).index()].join('\n'),
  );
}
