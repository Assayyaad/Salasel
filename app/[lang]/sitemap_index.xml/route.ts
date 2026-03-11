import { getPlaylists } from '@/app/db'
import { allLanguages } from '@/app/static'
import { NextResponse } from 'next/server'

export async function GET(_req: Request, { params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  const baseUrl = 'https://salasel.app'
  const playlists = getPlaylists()

  const isValidLang = allLanguages.some((l) => l.code === lang)
  if (!isValidLang) return new NextResponse('Not Found', { status: 404 })

  const playlistSitemaps = Object.keys(playlists)
    .map(
      (id) => `
  <sitemap>
    <loc>${baseUrl}/${lang}/playlist/${id}/sitemap.xml</loc>
  </sitemap>`,
    )
    .join('')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${baseUrl}/${lang}/sitemap.xml</loc>
  </sitemap>
${playlistSitemaps}
</sitemapindex>`

  return new NextResponse(xml, {
    headers: { 'Content-Type': 'application/xml' },
  })
}
