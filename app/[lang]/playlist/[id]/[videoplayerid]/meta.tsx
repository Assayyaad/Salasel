import type { Metadata } from 'next'
import type { VideoPlayerParams } from '@/app/[lang]/playlist/[id]/[videoplayerid]/params'

import { getVideo } from '@/app/db'
import { videoThumbnailUrl } from '@/app/utils'
import { getTranslations } from '@/app/translate'
import { allLanguages } from '@/app/static'

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
  const title = `${t.appTitle} · ${playlist.name} | ${video.title}`
  const description = `${playlist.name} | ${video.title}`

  // Generate alternate language links for hreflang
  const langAlts = allLanguages.reduce(
    (acc, l) => {
      acc[l.code] = `https://salasel.app/${l.code}/playlist/${id}/${videoplayerid}`
      return acc
    },
    {} as Record<string, string>,
  )

  return {
    title,
    description,
    alternates: {
      languages: langAlts,
    },
    openGraph: {
      title: video.title,
      description,
      url: `https://salasel.app/${lang}/playlist/${id}/${videoplayerid}`,
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
      site: '@SalaselApp',
      images: [thumbnailUrl],
      players: {
        playerUrl: `https://www.youtube.com/embed/${video.id}`,
        streamUrl: `https://www.youtube.com/watch?v=${video.id}`,
        width: 1280,
        height: 720,
      },
    },
    keywords: [playlist.name, video.title, ...playlist.categories.map((c) => t.categories[c])],
    authors: playlist.participants.map((p) => ({ name: p })),
  }
}
