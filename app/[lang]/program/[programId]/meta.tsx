import type { Metadata } from 'next'
import type { ProgramParams } from '@/app/[lang]/program/[programId]/params'

import { getProgram } from '@/app/db'
import { videoThumbnailUrl } from '@/app/utils'
import { getTranslations } from '@/app/translate'
import { allLanguages, defaultLanguage } from '@/app/static'

export interface ProgramMetadataProps {
  params: Promise<ProgramParams>
}

export async function generateMetadata({ params }: ProgramMetadataProps): Promise<Metadata> {
  const { lang, programId } = await params
  const t = getTranslations(lang)
  const program = getProgram(programId)

  if (!program) {
    return {
      title: t.programNotFound,
      description: t.programNotFound,
    }
  }

  const thumbnailUrl = videoThumbnailUrl(program.thumbnailId)
  const title = `${t.appTitle} · ${program.name}`
  const description = program.description || title

  const baseUrl = 'https://salasel.app'
  const langAlts = allLanguages.reduce(
    (acc, l) => {
      acc[l.code] = `${baseUrl}/${l.code}/program/${programId}`
      return acc
    },
    { 'x-default': `${baseUrl}/${defaultLanguage}/program/${programId}` } as Record<string, string>,
  )

  return {
    title,
    description,
    alternates: {
      languages: langAlts,
    },
    openGraph: {
      title: program.name,
      description,
      url: `${baseUrl}/${lang}/program/${programId}`,
      images: [
        {
          url: thumbnailUrl,
          width: 640,
          height: 480,
          alt: program.name,
        },
      ],
      type: 'video.other',
      siteName: 'سلاسل',
      locale: 'ar_SA',
    },
    twitter: {
      card: 'summary_large_image',
      title: program.name,
      description,
      site: '@SalaselApp',
      images: [thumbnailUrl],
    },
    keywords: [program.name, ...program.categories.map((c) => t.categories[c])],
    authors: program.participants.map((p) => ({ name: p })),
  }
}
