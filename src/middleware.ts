import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { locales, defaultLocale, isValidLocale } from '@/i18n/config';

function getLocaleFromPath(pathname: string): string | null {
  for (const locale of locales) {
    if (pathname === `/${locale}` || pathname.startsWith(`/${locale}/`)) {
      return locale;
    }
  }
  return null;
}

function getPreferredLocale(request: NextRequest): string {
  const acceptLanguage = request.headers.get('accept-language') ?? '';
  const preferred = acceptLanguage.split(',').map((lang) => {
    const [code] = lang.trim().split(';');
    return code.split('-')[0].toLowerCase();
  });

  for (const lang of preferred) {
    if (isValidLocale(lang)) return lang;
  }

  return defaultLocale;
}

/**
 * Resolve the active locale.
 * An explicit `locale` cookie (set when the user toggles language) takes
 * priority over the browser's Accept-Language, so a manual switch is never
 * overridden by locale negotiation on the root path.
 */
function resolveLocale(request: NextRequest): string {
  const cookieLocale = request.cookies.get('locale')?.value;
  if (cookieLocale && isValidLocale(cookieLocale)) return cookieLocale;
  return getPreferredLocale(request);
}

function nextWithPathname(request: NextRequest) {
  const headers = new Headers(request.headers);
  headers.set('x-pathname', request.nextUrl.pathname);
  return NextResponse.next({ request: { headers } });
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip static, api, and special routes
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/og') ||
    pathname.startsWith('/llms') ||
    pathname.includes('.')
  ) {
    return nextWithPathname(request);
  }

  const pathLocale = getLocaleFromPath(pathname);

  // If already on a non-default locale path, continue
  if (pathLocale && pathLocale !== defaultLocale) {
    return nextWithPathname(request);
  }

  // If on a non-default locale that matches, redirect to strip it
  if (pathLocale === defaultLocale) {
    const newPath = pathname.replace(`/${defaultLocale}`, '') || '/';
    return NextResponse.redirect(new URL(newPath, request.url));
  }

  // Resolve locale: explicit cookie choice > Accept-Language
  const preferred = resolveLocale(request);

  // Redirect non-default locale users to their locale prefix
  if (preferred !== defaultLocale) {
    return NextResponse.redirect(new URL(`/${preferred}${pathname}`, request.url));
  }

  return nextWithPathname(request);
}

export const config = {
  matcher: ['/((?!_next|api|og|llms|.*\\..*).*)'],
};
