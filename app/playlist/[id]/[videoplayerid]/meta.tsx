import type { Metadata } from 'next'
import type { VideoPlayerParams } from './params'

import { videoThumbnailUrl } from '@/app/utils'
import { getVideo } from './utils'
import { appTitle, videoNotFound } from '@/app/static'

export interface VideoPlayerMetadataProps {
  params: Promise<VideoPlayerParams>
}

export async function generateMetadata({ params }: VideoPlayerMetadataProps): Promise<Metadata> {
  const { id, videoplayerid } = await params
  const data = await getVideo(id, videoplayerid)

  if (!data) {
    return {
      title: videoNotFound,
      description: videoNotFound,
    }
  }

  const { playlist, video } = data
  const thumbnailUrl = videoThumbnailUrl(video.id)
  const title = `${appTitle} · ${playlist.channel} | ${playlist.name} | ${video.title}`
  const description = `${playlist.channel} | ${playlist.name} | ${video.title}`

  return {
    title,
    description,
    openGraph: {
      title: video.title,
      description,
      images: [
        {
          url: thumbnailUrl,
          width: 640,
          height: 480,
          alt: video.title,
        },
      ],
      type: 'video.other',
      siteName: 'سلاسل',
      locale: 'ar_SA',
      videos: [
        {
          url: `https://www.youtube.com/watch?v=${video.id}`,
          secureUrl: `https://www.youtube.com/watch?v=${video.id}`,
          type: 'text/html',
          width: 1280,
          height: 720,
        },
      ],
    },
    twitter: {
      card: 'player',
      title: video.title,
      description,
      images: [thumbnailUrl],
      players: {
        playerUrl: `https://www.youtube.com/embed/${video.id}`,
        streamUrl: `https://www.youtube.com/watch?v=${video.id}`,
        width: 1280,
        height: 720,
      },
    },
    keywords: [video.title, playlist.name, playlist.channel, ...playlist.participants, ...playlist.categories],
    authors: playlist.participants.map((p) => ({ name: p })),
  }
}
