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

  for (const id in playlists) {
    if (!Object.hasOwn(playlists, id)) continue

    const playlistAlts = generateLangAlts(baseUrl, `playlist/${id}`)
    sitemapEntries.push({
      url: playlistAlts[allLanguages[0].code],
      priority: 0.8,
      alternates: { languages: playlistAlts },
    })
  }

  return sitemapEntries
}

function generateLangAlts(baseUrl: string, urlRoute: string = ''): Record<string, string> {
  const defaultPath = urlRoute ? `${defaultLanguage}/${urlRoute}` : `${defaultLanguage}`

  const alts = allLanguages.reduce(
    (acc, lang) => {
      const path = urlRoute ? `${lang.code}/${urlRoute}` : `${lang.code}`
      acc[lang.code] = `${baseUrl}/${path}`
      return acc
    },
    { 'x-default': `${baseUrl}/${defaultPath}` } as Record<string, string>,
  )

  return alts
}
