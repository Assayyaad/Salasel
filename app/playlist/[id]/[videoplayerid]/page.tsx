'use client'

import type { Playlist, Video } from '@/app/types'

import React, { useEffect, useState } from 'react'
import { useParams, notFound } from 'next/navigation'
import PlaylistSidebar from '../components/PlaylistSidebar'
import VideoPlayer from '../components/VideoPlayer'
import playlists from '@/public/playlists.json'

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

    try {
      const currentPlaylist = (playlists as Playlist[]).find((p) => p.id === id)

      if (!currentPlaylist) {
        notFound()
        return // DOES NOTHING
      }

      const currentVideo = currentPlaylist.videos.find((v) => v.id === videoplayerid)

      if (!currentVideo) {
        notFound()
        return // DOES NOTHING
      }

      setPlaylist(currentPlaylist)
      setVideo(currentVideo)
    } catch (error) {
      console.error('Failed to fetch playlist and video data:', error)
      notFound()
    } finally {
      setLoading(false)
    }
  }, [id, videoplayerid])

  if (loading) {
    return (
      <main dir="rtl" className="w-full max-w-full mx-auto px-4 md:px-6 lg:px-8 pt-4 pb-16">
        <div className="text-center p-10">Loading...</div>
      </main>
    )
  }

  if (!playlist || !video) {
    // This will be caught by notFound() in useEffect, but as a fallback
    return notFound()
  }

  return (
    <main dir="rtl" className="w-full max-w-full mx-auto px-4 md:px-6 lg:px-8 pt-4 pb-16">
      <div className="grid grid-cols-1 gap-6 lg:gap-8">
        {/* Top Section: Video Player and Playlist Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Main Content: Video Player */}
          <div className="lg:col-span-2">
            <VideoPlayer video={video} playlist={playlist} />
          </div>

          {/* Sidebar: Playlist Content */}
          <div className="lg:col-span-1">
            <PlaylistSidebar />
          </div>
        </div>
      </div>
    </main>
  )
}

export default VideoPlayerPage
