import { allLanguages } from '@/app/static'
import { NextResponse } from 'next/server'

export async function GET() {
  const baseUrl = 'https://salasel.app'

  const sitemaps = allLanguages
    .map(
      (lang) => `
  <sitemap>
    <loc>${baseUrl}/${lang.code}/sitemap_index.xml</loc>
  </sitemap>`,
    )
    .join('')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemaps}
</sitemapindex>`

  return new NextResponse(xml, {
    headers: { 'Content-Type': 'application/xml' },
  })
}
