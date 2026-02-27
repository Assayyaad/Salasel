import { NextResponse } from 'next/server'
import { allLanguages } from '@/app/static'
import { getPlaylists } from '@/app/db'

export async function GET(_req: Request, { params }: { params: { lang: string } }) {
  const { lang } = params
  const baseUrl = 'https://salasel.app'

  const isValidLang = allLanguages.some((l) => l.code === lang)
  if (!isValidLang) return new NextResponse('Not Found', { status: 404 })

  const playlists = getPlaylists()

  const playlistSitemaps = Object.keys(playlists)
    .map((id) => `  <sitemap>\n    <loc>${baseUrl}/${lang}/playlist/${id}/sitemap.xml</loc>\n  </sitemap>`)
    .join('\n')

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
