import type { Videos } from '@/app/types'

import fs from 'fs/promises'
import path from 'path'
import { allLanguages } from '@/app/static'
import { NextResponse } from 'next/server'

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ lang: string; id: string }> },
) {
  const { lang, id } = await params
  const baseUrl = 'https://salasel.app'

  const isValidLang = allLanguages.some((l) => l.code === lang)
  if (!isValidLang) return new NextResponse('Not Found', { status: 404 })

  let videos: Videos = {}
  try {
    const filePath = path.join(process.cwd(), 'public', 'videos', `${id}.json`)
    const data = await fs.readFile(filePath, 'utf-8')
    videos = JSON.parse(data)
  } catch {
    return new NextResponse('Not Found', { status: 404 })
  }

  const urlEntries = Object.values(videos)
    .map((v) => {
      const langAlts = allLanguages
        .map(
          (l) =>
            `<xhtml:link rel="alternate" hreflang="${l.code}" href="${baseUrl}/${l.code}/playlist/${id}/${v.id}"/>`,
        )
        .join('\n      ')

      return `
  <url>
    <loc>${baseUrl}/${lang}/playlist/${id}/${v.id}</loc>
    <priority>0.5</priority>
    ${langAlts}
  </url>`
    })
    .join('')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urlEntries}
</urlset>`

  return new NextResponse(xml, {
    headers: { 'Content-Type': 'application/xml' },
  })
}
