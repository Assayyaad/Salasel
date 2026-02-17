import type { VideoPlayerParams } from './params'

import React from 'react'
import { notFound } from 'next/navigation'
import { getVideo } from './utils'
import VideoPlayerClient from './components/VideoPlayerClient'

export { generateStaticParams } from './params'
export { generateMetadata } from './meta'

export const revalidate = 3600 // Revalidate every hour

export interface VideoPlayerPageProps {
  params: Promise<VideoPlayerParams>
}

const VideoPlayerPage: React.FC<VideoPlayerPageProps> = async ({ params }) => {
  const { id, videoplayerid } = await params
  const data = await getVideo(id, videoplayerid)

  if (!data) {
    notFound()
  }

  const { playlist, video } = data

  return <VideoPlayerClient playlist={playlist} video={video} />
}

export default VideoPlayerPage
