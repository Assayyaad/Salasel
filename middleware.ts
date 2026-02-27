import { NextRequest, NextResponse } from 'next/server'
import { allLanguages, defaultLanguage } from './app/static'

const languageCodes = allLanguages.map((lang) => lang.code)

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // Skip middleware for YouTube-style redirect routes
  if (pathname === '/watch' || pathname.startsWith('/playlist') || pathname.startsWith('/youtu.be')) {
    return NextResponse.next()
  }

  // Check if pathname already has a language prefix
  const pathnameHasLocale = languageCodes.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`,
  )

  if (pathnameHasLocale) {
    return NextResponse.next()
  }

  // Redirect to default language if no language prefix
  const locale = defaultLanguage
  request.nextUrl.pathname = `/${locale}${pathname}`
  return NextResponse.redirect(request.nextUrl)
}

export const config = {
  matcher: [
    // Match all pathnames except for:
    // - api routes
    // - _next (Next.js internals)
    // - static files with common extensions (images, fonts, etc.) but NOT .xml
    '/((?!api|_next|.*\\.(?:ico|png|jpg|jpeg|gif|svg|webp|woff|woff2|ttf|otf|css|js|map)$).*)',
  ],
}
