import type { Metadata } from 'next'
import type { SelectedPlaylistParams } from '@/app/[lang]/playlist/[id]/params'

import { getPlaylist } from '@/app/db'
import { videoThumbnailUrl } from '@/app/utils'
import { getTranslations } from '@/app/translate'
import { allLanguages, defaultLanguage } from '@/app/static'

export interface SelectedPlaylistMetadataProps {
  params: Promise<SelectedPlaylistParams>
}

export async function generateMetadata({ params }: SelectedPlaylistMetadataProps): Promise<Metadata> {
  const { lang, id } = await params
  const t = getTranslations(lang)
  const playlist = getPlaylist(id)

  if (!playlist) {
    return {
      title: t.playlistNotFound,
      description: t.playlistNotFound,
    }
  }

  const thumbnailUrl = videoThumbnailUrl(playlist.thumbnailId)
  const title = `${t.appTitle} · ${playlist.name}`
  const description = playlist.description || title

  // Generate alternate language links for hreflang
  const langAlts = allLanguages.reduce(
    (acc, l) => {
      acc[l.code] = `https://salasel.app/${l.code}/playlist/${id}`
      return acc
    },
    {} as Record<string, string>,
  )

  // Add x-default pointing to the default language
  langAlts['x-default'] = `https://salasel.app/${defaultLanguage}/playlist/${id}`

  return {
    title,
    description,
    alternates: {
      languages: langAlts,
    },
    openGraph: {
      title: playlist.name,
      description,
      url: `https://salasel.app/${lang}/playlist/${id}`,
      images: [
        {
          url: thumbnailUrl,
          width: 640,
          height: 480,
          alt: playlist.name,
        },
      ],
      type: 'video.other',
      siteName: 'سلاسل',
      locale: 'ar_SA',
    },
    twitter: {
      card: 'summary_large_image',
      title: playlist.name,
      description,
      site: '@SalaselApp',
      images: [thumbnailUrl],
    },
    keywords: [playlist.name, ...playlist.categories.map((c) => t.categories[c])],
    authors: playlist.participants.map((p) => ({ name: p })),
  }
}
