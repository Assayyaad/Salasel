import { NextResponse } from 'next/server'
import { allLanguages } from '@/app/static'

export async function GET() {
  const baseUrl = 'https://salasel.app'

  const sitemaps = allLanguages
    .map((lang) => `  <sitemap>\n    <loc>${baseUrl}/${lang.code}/sitemap_index.xml</loc>\n  </sitemap>`)
    .join('\n')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemaps}
</sitemapindex>`

  return new NextResponse(xml, {
    headers: { 'Content-Type': 'application/xml' },
  })
}
