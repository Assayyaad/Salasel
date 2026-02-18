'use client'

import type { CalculatedPlaylist, CalculatedVideo } from '@/app/types'

import React, { useEffect, useRef } from 'react'
import { useSearchParams } from 'next/navigation'
import Librecounter from '@/app/shared/components/Librecounter'
import { useProgressStore } from '@/app/store/useProgressStore'
import { useVideoPlayerStore } from '@/app/store/useVideoPlayerStore'
import 'video.js/dist/video-js.css'

export type VideoPlayerPlaylist = Pick<CalculatedPlaylist, 'id' | 'channel' | 'name'>
export type VideoPlayerVideo = Pick<CalculatedVideo, 'id' | 'title'>
export interface VideoPlayerProps {
  playlist: VideoPlayerPlaylist
  video: VideoPlayerVideo
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ playlist, video }) => {
  const videoNode = useRef<HTMLVideoElement>(null)
  const playerRef = useRef<any>(null)
  const searchParams = useSearchParams()
  const { setVideoProgress, toggleVideoCompleted, completedVideos, setVideoTimestamp } = useProgressStore()
  const { setCurrentTime } = useVideoPlayerStore()
  const lastUpdateTime = useRef(0)

  useEffect(() => {
    let isCancelled = false
    const videoElement = videoNode.current // Capture the DOM element

    if (videoElement && video) {
      const initPlayer = async () => {
        const videojs = (await import('video.js')).default
        await import('videojs-youtube')

        // If the component has unmounted since this async function started, do nothing.
        if (isCancelled) {
          return
        }

        // Dispose of the previous player if it exists
        if (playerRef.current) {
          playerRef.current.dispose()
        }

        const videoSrc = `https://www.youtube.com/watch?v=${video.id}`

        const player = videojs(videoElement, {
          autoplay: true,
          controls: true,
          responsive: true,
          fluid: true,
          techOrder: ['youtube'],
          sources: [{ src: videoSrc, type: 'video/youtube' }],
        })

        playerRef.current = player

        // --- Event Listeners ---
        const onEnded = () => toggleVideoCompleted(playlist.id, video.id)

        const COMPLETION_THRESHOLD = 95 // %
        const onTimeUpdate = () => {
          const currentTime = player.currentTime()

          // Update current time in store for notes functionality
          if (currentTime) {
            setCurrentTime(currentTime)
          }

          const now = Date.now()
          if (now - lastUpdateTime.current > 5000) {
            const duration = player.duration()
            if (duration && currentTime) {
              const progress = (currentTime / duration) * 100
              if (!isNaN(progress) && progress > 0) {
                setVideoProgress(video.id, Math.round(progress))
                setVideoTimestamp(video.id, Math.round(currentTime))
                lastUpdateTime.current = now

                // Mark as completed if threshold reached and not already completed
                // Also ensures that completedVideos is initialized before accessing its properties
                if (
                  progress >= COMPLETION_THRESHOLD &&
                  (!completedVideos[playlist.id] || !completedVideos[playlist.id].has(video.id))
                ) {
                  toggleVideoCompleted(playlist.id, video.id)
                }
              }
            }
          }
        }

        player.on('ended', onEnded)
        player.on('timeupdate', onTimeUpdate)
      }

      initPlayer()
    }

    // Cleanup function
    return () => {
      isCancelled = true
      // Dispose of the player when the component unmounts
      if (playerRef.current) {
        playerRef.current.dispose()
        playerRef.current = null
      }
    }
  }, [video.id, playlist.id, setVideoProgress, toggleVideoCompleted, completedVideos])

  // Handle timestamp parameter from URL
  useEffect(() => {
    const timestamp = searchParams.get('t')
    if (timestamp && playerRef.current) {
      const seconds = timestampToSeconds(timestamp)
      if (seconds > 0) {
        // Wait for player to be ready
        playerRef.current.ready(() => {
          playerRef.current.currentTime(seconds)
        })
      }
    }
  }, [searchParams])

  return (
    <div className="flex flex-col gap-4">
      <h1 dir="rtl" className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
        {playlist.channel} | {playlist.name} | {video.title} <Librecounter />
      </h1>
      <div className="aspect-video bg-black rounded-xl overflow-hidden shadow-lg">
        <div data-vjs-player>
          <video ref={videoNode} className="video-js vjs-big-play-centered" />
        </div>
      </div>
    </div>
  )
}

// Helper function to convert timestamp to seconds
const timestampToSeconds = (timestamp: string): number => {
  const parts = timestamp.split(':').map(Number)
  if (parts.length === 2) {
    // MM:SS
    return parts[0] * 60 + parts[1]
  } else if (parts.length === 3) {
    // HH:MM:SS
    return parts[0] * 3600 + parts[1] * 60 + parts[2]
  }
  return 0
}

export default VideoPlayer
