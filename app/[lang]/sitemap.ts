import type { MetadataRoute } from 'next'

import { allLanguages } from '@/app/static'
import { getPlaylists } from '@/app/db'

export default function sitemap({ params }: { params: { lang: string } }): MetadataRoute.Sitemap {
  const { lang } = params
  const baseUrl = 'https://salasel.app'
  const playlists = getPlaylists()

  return Object.keys(playlists).map((id) => ({
    url: `${baseUrl}/${lang}/playlist/${id}`,
    priority: 0.8,
    alternates: {
      languages: allLanguages.reduce(
        (acc, l) => ({ ...acc, [l.code]: `${baseUrl}/${l.code}/playlist/${id}` }),
        {} as Record<string, string>,
      ),
    },
  }))
}
