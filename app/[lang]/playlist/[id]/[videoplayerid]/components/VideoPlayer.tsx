'use client'

import type { CalculatedPlaylist, CalculatedVideo } from '@/app/types'

import React, { useEffect, useRef } from 'react'
import { useSearchParams } from 'next/navigation'
import Librecounter from '@/app/shared/components/Librecounter'
import { useProgressStore } from '@/app/store/useProgressStore'
import { useVideoPlayerStore } from '@/app/store/useVideoPlayerStore'
import 'video.js/dist/video-js.css'

export type VideoPlayerPlaylist = Pick<CalculatedPlaylist, 'id' | 'name'>
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

  // Effect for player initialization and disposal
  useEffect(() => {
    const videoElement = videoNode.current
    if (!videoElement) return

    let player: any
    ;(async () => {
      const videojs = (await import('video.js')).default
      await import('videojs-youtube')

      // https://docs.videojs.com/tutorial-options.html
      const videoJsOptions = {
        autoplay: true,
        muted: false,
        controls: true,
        responsive: true,
        fluid: true,
        techOrder: ['youtube'],
        sources: [{ src: `https://www.youtube-nocookie.com/watch?v=${video.id}`, type: 'video/youtube' }],
        youtube: {
          playsinline: 1,
          ytControls: 0,
          modestbranding: 1,
          rel: 0,
          iv_load_policy: 3,
        },
      }

      player = videojs(videoElement, videoJsOptions)
      playerRef.current = player

      player.ready(() => {
        // Add a transition style for the fade-in effect
        player.el().style.transition = 'opacity 0.2s ease-in-out'

        // Remove the initializing class to fade the player in
        player.el().classList.remove('player-initializing')

        // Create a custom overlay for click-to-play/pause
        const overlay = document.createElement('div')
        overlay.style.position = 'absolute'
        overlay.style.top = '0'
        overlay.style.left = '0'
        overlay.style.width = '100%'
        // Height should not cover the control bar
        overlay.style.height = 'calc(100% - 3em)' // 3em is default control bar height
        overlay.style.zIndex = '1'
        overlay.style.cursor = 'pointer'

        overlay.addEventListener('click', () => {
          if (player.paused()) {
            player.play()
          } else {
            player.pause()
          }
        })

        player.el().appendChild(overlay)
      })

      // --- Event Listeners ---
      const onEnded = () => toggleVideoCompleted(playlist.id, video.id)
      const COMPLETION_THRESHOLD = 95
      const onTimeUpdate = () => {
        const currentTime = player.currentTime()
        if (currentTime) setCurrentTime(currentTime)

        const now = Date.now()
        if (now - lastUpdateTime.current > 5000) {
          const duration = player.duration()
          if (duration && currentTime) {
            const progress = (currentTime / duration) * 100
            if (!isNaN(progress) && progress > 0) {
              setVideoProgress(video.id, Math.round(progress))
              setVideoTimestamp(video.id, Math.round(currentTime))
              lastUpdateTime.current = now

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
    })()

    return () => {
      if (playerRef.current) {
        playerRef.current.dispose()
        playerRef.current = null
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Effect for handling video source changes and timestamp seeking
  useEffect(() => {
    const player = playerRef.current
    const timestamp = searchParams.get('t')

    if (player) {
      player.ready(() => {
        const newSrc = { src: `https://www.youtube-nocookie.com/watch?v=${video.id}`, type: 'video/youtube' }
        if (player.currentSrc() !== newSrc.src) {
          player.src(newSrc)
        }

        if (timestamp) {
          const seconds = timestampToSeconds(timestamp)
          if (seconds > 0) player.currentTime(seconds)
        }

        player.play().catch(() => {
          console.log('Playback was prevented by browser policy.')
        })
      })
    }
  }, [video.id, searchParams])

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
        {playlist.name} | {video.title} <Librecounter />
      </h1>
      <div className="aspect-video bg-black rounded-xl overflow-hidden shadow-lg">
        <div data-vjs-player>
          <video ref={videoNode} className="video-js vjs-big-play-centered player-initializing" />
        </div>
      </div>
    </div>
  )
}

const timestampToSeconds = (timestamp: string): number => {
  const parts = timestamp.split(':').map(Number)
  return parts.length === 2
    ? parts[0] * 60 + parts[1]
    : parts.length === 3
      ? parts[0] * 3600 + parts[1] * 60 + parts[2]
      : 0
}

export default VideoPlayer
