import type { VideoPlayerParams } from '@/app/[lang]/playlist/[id]/[videoplayerid]/params'

import React from 'react'
import { notFound } from 'next/navigation'
import WatchClient from '@/app/[lang]/playlist/[id]/[videoplayerid]/components/WatchClient'
import { getVideo } from '@/app/db'
import { getTranslations } from '@/app/translate'

export { generateStaticParams } from '@/app/[lang]/playlist/[id]/[videoplayerid]/params'
export { generateMetadata } from '@/app/[lang]/playlist/[id]/[videoplayerid]/meta'

export const revalidate = 3600 // Revalidate every hour

export interface VideoPlayerPageProps {
  params: Promise<VideoPlayerParams>
}

const VideoPlayerPage: React.FC<VideoPlayerPageProps> = async ({ params }) => {
  const { lang, id, videoplayerid } = await params
  const t = getTranslations(lang)
  const { playlist, video } = await getVideo(id, videoplayerid)

  if (!playlist || !video) {
    return notFound()
  }

  return (
    <WatchClient
      playlist={{ id: playlist.id, name: playlist.name }}
      video={{ id: video.id, title: video.title }}
      t={t}
    />
  )
}

export default VideoPlayerPage
