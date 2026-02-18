import type { Videos } from '@/app/types'

import fs from 'fs/promises'
import path from 'path'
import { MetadataRoute } from 'next'
import { getPlaylists } from '@/app/db'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://salasel.app'
  const sitemapEntries: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      priority: 1.0,
      alternates: {
        languages: {
          ar: baseUrl,
        },
      },
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

  // Add playlist URL
  sitemap.push({
    url: `${baseUrl}/playlist/${playlistId}`,
    priority: 0.8,
    alternates: {
      languages: {
        ar: `${baseUrl}/playlist/${playlistId}`,
      },
    },
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

      sitemap.push({
        url: `${baseUrl}/playlist/${playlistId}/${v.id}`,
        priority: 0.5,
        alternates: {
          languages: {
            ar: `${baseUrl}/playlist/${playlistId}/${v.id}`,
          },
        },
      })
    }
  } catch (error) {
    console.error(`Error reading video file for playlist ${playlistId}:`, error)
  }

  return sitemap
}
