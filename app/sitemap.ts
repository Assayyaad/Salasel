import type { MetadataRoute } from 'next'

import { allLanguages } from '@/app/static'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://salasel.app'

  return allLanguages.map((lang) => ({
    url: `${baseUrl}/${lang.code}`,
    priority: 1.0,
    alternates: {
      languages: allLanguages.reduce(
        (acc, l) => ({ ...acc, [l.code]: `${baseUrl}/${l.code}` }),
        {} as Record<string, string>,
      ),
    },
  }))
}
