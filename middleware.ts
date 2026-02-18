import { NextRequest, NextResponse } from 'next/server'
import { allLanguages, defaultLanguage } from './app/static'

const languageCodes = allLanguages.map((lang) => lang.code)

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

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
    // - static files
    '/((?!api|_next|.*\\..*).*)',
  ],
}
