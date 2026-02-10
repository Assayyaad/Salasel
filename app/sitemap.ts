import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://salasel.app',
      priority: 1.0,
      alternates: {
        languages: {
          ar: 'https://salasel.app',
        },
      },
    },
  ]
}
