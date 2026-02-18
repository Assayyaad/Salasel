import type { Metadata } from 'next'
import type { SelectedPlaylistParams } from '@/app/[lang]/playlist/[id]/params'

import { getPlaylist } from '@/app/db'
import { videoThumbnailUrl } from '@/app/utils'
import { getTranslations } from '@/app/translate'

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
  const title = `${t.appTitle} · ${playlist.channel} | ${playlist.name}`
  const description = playlist.description || title

  return {
    title,
    description,
    openGraph: {
      title: playlist.name,
      description,
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
      images: [thumbnailUrl],
    },
    keywords: [playlist.channel, playlist.name, ...playlist.categories.map((c) => t.categories[c])],
    authors: playlist.participants.map((p) => ({ name: p })),
  }
}
