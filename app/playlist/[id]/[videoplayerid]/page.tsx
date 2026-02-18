import type { VideoPlayerParams } from '@/app/playlist/[id]/[videoplayerid]/params'

import React, { Suspense } from 'react'
import { notFound } from 'next/navigation'
import VideoPlayerClient from '@/app/playlist/[id]/[videoplayerid]/components/VideoPlayerClient'
import { getVideo } from '@/app/db'

export { generateStaticParams } from '@/app/playlist/[id]/[videoplayerid]/params'
export { generateMetadata } from '@/app/playlist/[id]/[videoplayerid]/meta'

export const revalidate = 3600 // Revalidate every hour

export interface VideoPlayerPageProps {
  params: Promise<VideoPlayerParams>
}

const VideoPlayerPage: React.FC<VideoPlayerPageProps> = async ({ params }) => {
  const { id, videoplayerid } = await params
  const { playlist, video } = await getVideo(id, videoplayerid)

  if (!playlist || !video) {
    return notFound()
  }

  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
      <VideoPlayerClient playlist={playlist} video={video} />
    </Suspense>
  )
}

export default VideoPlayerPage
