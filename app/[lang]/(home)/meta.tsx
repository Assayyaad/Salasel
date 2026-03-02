import type { Metadata } from 'next'

import { allLanguages, defaultLanguage } from '@/app/static'

export async function generateMetadata(): Promise<Metadata> {
  // const { lang } = await params

  // Generate alternate language links for hreflang
  const baseUrl = 'https://salasel.app'
  const langAlts = allLanguages.reduce(
    (acc, l) => {
      acc[l.code] = `${baseUrl}/${l.code}`
      return acc
    },
    { 'x-default': `${baseUrl}/${defaultLanguage}` } as Record<string, string>,
  )

  return {
    alternates: {
      languages: langAlts,
    },
  }
}
