import type { Metadata } from 'next'
import type { HomeParams } from '@/app/[lang]/(home)/params'

import { allLanguages, defaultLanguage } from '@/app/static'

export interface HomeMetadataProps {
  params: Promise<HomeParams>
}

export async function generateMetadata({ params }: HomeMetadataProps): Promise<Metadata> {
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
