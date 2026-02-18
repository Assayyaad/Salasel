import type { Metadata } from 'next'
import type { SelectedPlaylistParams } from '@/app/playlist/[id]/params'

import { getPlaylist } from '@/app/db'
import { videoThumbnailUrl } from '@/app/utils'
import { playlistNotFound, appTitle } from '@/app/static'

export interface SelectedPlaylistMetadataProps {
  params: Promise<SelectedPlaylistParams>
}

export async function generateMetadata({ params }: SelectedPlaylistMetadataProps): Promise<Metadata> {
  const { id } = await params
  const playlist = getPlaylist(id)

  if (!playlist) {
    return {
      title: playlistNotFound,
      description: playlistNotFound,
    }
  }

  const thumbnailUrl = videoThumbnailUrl(playlist.thumbnailId)
  const title = `${appTitle} · ${playlist.channel} | ${playlist.name}`
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
    keywords: [playlist.name, playlist.channel, ...playlist.categories],
    authors: playlist.participants.map((p) => ({ name: p })),
  }
}
