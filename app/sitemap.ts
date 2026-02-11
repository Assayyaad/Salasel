import type { Video } from './types'

import fs from 'fs/promises'
import path from 'path'
import { MetadataRoute } from 'next'
import playlists from '@/public/playlists.json'

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

  // Process all playlists in parallel and collect their entries
  const playlistEntries = await Promise.all(
    playlists.map(async (pl) => {
      const entries: MetadataRoute.Sitemap = []

      // Add playlist URL
      entries.push({
        url: `${baseUrl}/playlist/${pl.id}`,
        priority: 0.8,
        alternates: {
          languages: {
            ar: `${baseUrl}/playlist/${pl.id}`,
          },
        },
      })

      // Read the corresponding video file for this playlist
      try {
        const videoFilePath = path.join(process.cwd(), 'public', 'videos', `${pl.id}.json`)
        const videoData = await fs.readFile(videoFilePath, 'utf-8')
        const videos: Video[] = JSON.parse(videoData)

        // Add video URLs
        videos.forEach((video) => {
          entries.push({
            url: `${baseUrl}/playlist/${pl.id}/${video.id}`,
            priority: 0.5,
            alternates: {
              languages: {
                ar: `${baseUrl}/playlist/${pl.id}/${video.id}`,
              },
            },
          })
        })
      } catch (error) {
        console.error(`Error reading video file for playlist ${pl.id}:`, error)
      }

      return entries
    }),
  )

  // Flatten and combine all entries
  return [...sitemapEntries, ...playlistEntries.flat()]
}
