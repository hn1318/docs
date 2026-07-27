import { getLLMText, sourceEn, sourceZh } from '@/lib/source';

export const revalidate = false;

export async function GET() {
  const allPages = [...sourceEn.getPages(), ...sourceZh.getPages()];
  const scan = allPages.map(getLLMText);
  const scanned = await Promise.all(scan);

  return new Response(scanned.join('\n\n'));
}
