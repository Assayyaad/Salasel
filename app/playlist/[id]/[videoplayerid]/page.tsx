'use client'

import type { Playlist, Video } from '@/app/types'

import React, { useEffect, useState } from 'react'
import { useParams, notFound } from 'next/navigation'
import PlaylistSidebar from '../components/PlaylistSidebar'
import VideoPlayer from '../components/VideoPlayer'
import { fetchPlaylistVideos } from '@/app/utils'
import playlists from '@/public/playlists.json'
import { loading } from '@/app/static'

const VideoPlayerPage: React.FC = () => {
  const params = useParams()
  const { id, videoplayerid } = params

  const [playlist, setPlaylist] = useState<Playlist | null>(null)
  const [video, setVideo] = useState<Video | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (typeof id !== 'string' || typeof videoplayerid !== 'string') {
      return
    }

    const loadData = async () => {
      try {
        const currentPlaylist = (playlists as Playlist[]).find((p) => p.id === id)

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
