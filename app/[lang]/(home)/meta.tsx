import type { Metadata } from 'next'
import type { HomeParams } from '@/app/[lang]/(home)/params'

import { allLanguages } from '@/app/static'

export interface HomeMetadataProps {
  params: Promise<HomeParams>
}

export async function generateMetadata({ params }: HomeMetadataProps): Promise<Metadata> {
  const { lang } = await params

  // Generate alternate language links for hreflang
  const langAlts = allLanguages.reduce(
    (acc, l) => {
      acc[l.code] = `/${l.code}`
      return acc
    },
    {} as Record<string, string>,
  )

  return {
    alternates: {
      languages: langAlts,
    },
  }
}
