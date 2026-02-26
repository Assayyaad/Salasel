import type { Videos } from '@/app/types'

import fs from 'fs/promises'
import path from 'path'
import { MetadataRoute } from 'next'
import { allLanguages, defaultLanguage } from '@/app/static'
import { getPlaylists } from '@/app/db'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://salasel.app'
  const langAlts = generateLangAlts(baseUrl)

  const sitemapEntries: MetadataRoute.Sitemap = [
    {
      url: langAlts[allLanguages[0].code], // Use the first language as the canonical URL
      priority: 1.0,
      alternates: { languages: langAlts },
    },
  ]

  const playlists = getPlaylists()
  const promises: Promise<MetadataRoute.Sitemap>[] = []

  for (const id in playlists) {
    if (!Object.hasOwn(playlists, id)) continue
    promises.push(playlistSitemap(baseUrl, id))
  }

  // Process all playlists in parallel and collect their entries
  const playlistEntries = await Promise.all(promises)

  // Flatten and combine all entries
  return [...sitemapEntries, ...playlistEntries.flat()]
}

async function playlistSitemap(baseUrl: string, playlistId: string): Promise<MetadataRoute.Sitemap> {
  const sitemap: MetadataRoute.Sitemap = []
  const playlistAlts = generateLangAlts(baseUrl, `playlist/${playlistId}`)

  // Add playlist URL
  sitemap.push({
    url: playlistAlts[allLanguages[0].code], // Use the first language as the canonical URL
    priority: 0.8,
    alternates: { languages: playlistAlts },
  })

  // Read the corresponding video file for this playlist
  try {
    const filePath = path.join(process.cwd(), 'public', 'videos', `${playlistId}.json`)
    const data = await fs.readFile(filePath, 'utf-8')
    const videos: Videos = JSON.parse(data)

    // Add video URLs
    for (const id in videos) {
      if (!Object.hasOwn(videos, id)) continue

      const v = videos[id]
      const videoAlts = generateLangAlts(baseUrl, `playlist/${playlistId}/${v.id}`)

      sitemap.push({
        url: videoAlts[allLanguages[0].code], // Use the first language as the canonical URL
        priority: 0.5,
        alternates: { languages: videoAlts },
      })
    }
  } catch (error) {
    console.error(`Error reading video file for playlist ${playlistId}:`, error)
  }

  return sitemap
}

function generateLangAlts(baseUrl: string, urlRoute: string = ''): Record<string, string> {
  const alts = allLanguages.reduce(
    (acc, lang) => {
      const path = urlRoute ? `/${lang.code}/${urlRoute}` : `/${lang.code}`
      acc[lang.code] = `${baseUrl}${path}`
      return acc
    },
    {} as Record<string, string>,
  )

  // Add x-default pointing to the default language (ar)
  const defaultPath = urlRoute ? `/${defaultLanguage}/${urlRoute}` : `/${defaultLanguage}`
  alts['x-default'] = `${baseUrl}${defaultPath}`

  return alts
}
