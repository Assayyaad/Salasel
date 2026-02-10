'use client'

import type { Playlist, Video } from '@/app/types'

import React, { useEffect, useRef } from 'react'
import { useProgressStore } from '@/app/store/useProgressStore'
import 'video.js/dist/video-js.css'

interface VideoPlayerProps {
  video: Video
  playlist: Playlist
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ video, playlist }) => {
  const videoNode = useRef<HTMLVideoElement>(null)
  const playerRef = useRef<any>(null)
  const { setVideoProgress, toggleVideoCompleted, completedVideos } = useProgressStore()
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
          const now = Date.now()
          if (now - lastUpdateTime.current > 5000) {
            const duration = player.duration()
            const currentTime = player.currentTime()
            if (duration && currentTime) {
              const progress = (currentTime / duration) * 100
              if (!isNaN(progress) && progress > 0) {
                setVideoProgress(video.id, Math.round(progress))
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

  return (
    <div className="lg:col-span-2 flex flex-col gap-0">
      <div className="aspect-video bg-black rounded-xl overflow-hidden shadow-lg">
        <div data-vjs-player>
          <video ref={videoNode} className="video-js vjs-big-play-centered" />
        </div>
      </div>
      <div dir="rtl" className="flex flex-col gap-2 p-2">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{video.title}</h1>
            <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              <span>من سلسلة: </span>
              <span className="font-semibold text-primary">{playlist.name}</span>
              <span className="mx-2">|</span>
              <span>قناة: </span>
              <span className="font-semibold text-primary">{playlist.channel}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default VideoPlayer
