import type { Metadata } from 'next'
import type { VideoPlayerParams } from '@/app/[lang]/playlist/[id]/[videoplayerid]/params'

import { getVideo } from '@/app/db'
import { videoThumbnailUrl } from '@/app/utils'
import { getTranslations } from '@/app/translate'

export interface VideoPlayerMetadataProps {
  params: Promise<VideoPlayerParams>
}

export async function generateMetadata({ params }: VideoPlayerMetadataProps): Promise<Metadata> {
  const { lang, id, videoplayerid } = await params
  const t = getTranslations(lang)
  const { playlist, video } = await getVideo(id, videoplayerid)

  if (!playlist || !video) {
    return {
      title: t.videoNotFound,
      description: t.videoNotFound,
    }
  }

  const thumbnailUrl = videoThumbnailUrl(video.id)
  const title = `${t.appTitle} · ${playlist.channel} | ${playlist.name} | ${video.title}`
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
    keywords: [playlist.channel, playlist.name, video.title, ...playlist.categories.map((c) => t.categories[c])],
    authors: playlist.participants.map((p) => ({ name: p })),
  }
}
