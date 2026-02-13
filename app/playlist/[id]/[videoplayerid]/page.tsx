'use client'

import type { CalculatedPlaylist, CalculatedVideo } from '@/app/types'

import React, { useEffect, useState } from 'react'
import { useParams, notFound, useRouter, useSearchParams } from 'next/navigation'
import PlaylistSidebar from '../components/PlaylistSidebar'
import VideoPlayer from '../components/VideoPlayer'
import { useProgressStore } from '@/app/store/useProgressStore'
import { fetchPlaylistVideos } from '@/app/utils'
import playlists from '@/public/playlists.json'

const VideoPlayerPage: React.FC = () => {
  const params = useParams()
  const router = useRouter()
  const searchParams = useSearchParams()
  const { id, videoplayerid } = params
  const { videoTimestamps } = useProgressStore()

  const [playlist, setPlaylist] = useState<CalculatedPlaylist | null>(null)
  const [video, setVideo] = useState<CalculatedVideo | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (typeof id !== 'string' || typeof videoplayerid !== 'string') {
      return
    }

    const loadData = async () => {
      try {
        const currentPlaylist = (playlists as CalculatedPlaylist[]).find((p) => p.id === id)

        if (!currentPlaylist) {
          notFound()
          return
        }

        // Fetch videos for this playlist
        const videos = await fetchPlaylistVideos(currentPlaylist.id)

        if (videos.length === 0) {
          notFound()
          return
        }

        const currentVideo = videos.find((v) => v.id === videoplayerid)

        if (!currentVideo) {
          notFound()
          return
        }

        setPlaylist(currentPlaylist)
        setVideo(currentVideo)
      } catch (error) {
        console.error('Failed to fetch playlist and video data:', error)
        notFound()
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [id, videoplayerid])

  // Add timestamp to URL if not present
  useEffect(() => {
    if (typeof videoplayerid !== 'string') return

    const hasTimestamp = searchParams.get('t')
    if (!hasTimestamp && videoTimestamps[videoplayerid]) {
      const timestamp = videoTimestamps[videoplayerid]
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
  }, [videoplayerid, searchParams, videoTimestamps, router])

  if (loading) {
    return (
      <main dir="rtl" className="w-full max-w-full mx-auto px-4 md:px-6 lg:px-8 pt-4 pb-16">
        <div className="text-center p-10">{loading}</div>
      </main>
    )
  }

  if (!playlist || !video) {
    // This will be caught by notFound() in useEffect, but as a fallback
    return notFound()
  }

  return (
    <main dir="rtl" className="w-full max-w-full mx-auto px-4 md:px-6 lg:px-8 pt-4 pb-16">
      <div className="flex flex-col gap-6">
        <VideoPlayer video={video} playlist={playlist} />
        <PlaylistSidebar playlistId={playlist.id} videoId={video.id} />
      </div>
    </main>
  )
}

export default VideoPlayerPage
