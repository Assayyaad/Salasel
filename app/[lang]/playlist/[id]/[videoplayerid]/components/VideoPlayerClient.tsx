'use client'

import type { CalculatedPlaylist, CalculatedVideo, Translations } from '@/app/types'

import React, { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useProgressStore } from '@/app/store/useProgressStore'
import PlaylistSidebar from '@/app/[lang]/playlist/[id]/[videoplayerid]/components/PlaylistSidebar'
import VideoPlayer from '@/app/[lang]/playlist/[id]/[videoplayerid]/components/VideoPlayer'

export type VideoPlayerClientPlaylist = Pick<CalculatedPlaylist, 'id' | 'channel' | 'name'>
export type VideoPlayerClientVideo = Pick<CalculatedVideo, 'id' | 'title'>
export interface VideoPlayerClientProps {
  playlist: VideoPlayerClientPlaylist
  video: VideoPlayerClientVideo
  t: Translations
}

const VideoPlayerClient: React.FC<VideoPlayerClientProps> = ({ playlist, video, t }) => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { videoTimestamps } = useProgressStore()

  // Add timestamp to URL if not present
  useEffect(() => {
    const hasTimestamp = searchParams.get('t')
    if (!hasTimestamp && videoTimestamps[video.id]) {
      const timestamp = videoTimestamps[video.id]
      // Convert seconds to MM:SS or HH:MM:SS format
      const hours = Math.floor(timestamp / 3600)
      const minutes = Math.floor((timestamp % 3600) / 60)
      const seconds = Math.floor(timestamp % 60)

      let timestampStr = ''
      if (hours > 0) {
        timestampStr = `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
      } else {
        timestampStr = `${minutes}:${seconds.toString().padStart(2, '0')}`
      }

      // Update URL with timestamp parameter
      const newSearchParams = new URLSearchParams(searchParams.toString())
      newSearchParams.set('t', timestampStr)
      router.replace(`?${newSearchParams.toString()}`, { scroll: false })
    }
  }, [video.id, searchParams, videoTimestamps, router])

  return (
    <main dir="rtl" className="w-full max-w-full mx-auto px-4 md:px-6 lg:px-8 pt-4 pb-16">
      <div className="flex flex-col gap-6">
        <VideoPlayer playlist={playlist} video={video} />
        <PlaylistSidebar playlistId={playlist.id} videoId={video.id} t={t} />
      </div>
    </main>
  )
}

export default VideoPlayerClient
