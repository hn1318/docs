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
    return NextResponse.next();
  }

  const pathLocale = getLocaleFromPath(pathname);

  // If already on a non-default locale path, continue
  if (pathLocale && pathLocale !== defaultLocale) {
    return NextResponse.next();
  }

  // If on a non-default locale that matches, redirect to strip it
  if (pathLocale === defaultLocale) {
    const newPath = pathname.replace(`/${defaultLocale}`, '') || '/';
    return NextResponse.redirect(new URL(newPath, request.url));
  }

  // Detect preferred locale from Accept-Language header
  const preferred = getPreferredLocale(request);

  // Redirect non-default locale users to their locale prefix
  if (preferred !== defaultLocale) {
    return NextResponse.redirect(new URL(`/${preferred}${pathname}`, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next|api|og|llms|.*\\..*).*)'],
};
