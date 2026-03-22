import { MetadataRoute } from 'next'
import { allLanguages } from '@/app/static'
import { getPlaylists } from '@/app/db'

export default async function sitemap({
  params,
}: {
  params: Promise<{ lang: string }>
}): Promise<MetadataRoute.Sitemap> {
  const { lang } = await params
  const baseUrl = 'https://salasel.app'

  const isValidLang = allLanguages.some((l) => l.code === lang)
  if (!isValidLang) return []

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
