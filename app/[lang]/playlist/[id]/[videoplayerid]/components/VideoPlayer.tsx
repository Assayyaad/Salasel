'use client'

import type { CalculatedPlaylist, CalculatedVideo } from '@/app/types'

import React, { useEffect, useMemo, useRef } from 'react'
import { useVideoPlayer } from '@/app/[lang]/playlist/[id]/[videoplayerid]/components/hooks/useVideoPlayer'
import Librecounter from '@/app/shared/components/Librecounter'
import { useProgressStore } from '@/app/store/useProgressStore'
import { useVideoPlayerStore } from '@/app/store/useVideoPlayerStore'
import 'video.js/dist/video-js.css'

export type VideoPlayerPlaylist = Pick<CalculatedPlaylist, 'id' | 'name'>
export type VideoPlayerVideo = Pick<CalculatedVideo, 'id' | 'title'>
export interface VideoPlayerProps {
  playlist: VideoPlayerPlaylist
  video: VideoPlayerVideo
  timestamp: string | null
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ playlist, video, timestamp }) => {
  const { setVideoProgress, toggleVideoCompleted, setVideoTimestamp } = useProgressStore()
  const { setCurrentTime } = useVideoPlayerStore()
  const lastUpdateTime = useRef(0)

  const videoJsOptions = useMemo(
    () => ({
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
    }),
    [video.id],
  )

  const { videoNode, player, isReady } = useVideoPlayer(videoJsOptions)

  useEffect(() => {
    if (!player || !isReady) return

    const playerElement = player.el()
    if (playerElement instanceof HTMLElement) {
      // Add a transition style for the fade-in effect
      playerElement.style.transition = 'opacity 0.2s ease-in-out'

      // Remove the initializing class to fade the player in
      playerElement.classList.remove('player-initializing')

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

      const clickListener = () => {
        if (player.paused()) {
          player.play()
        } else {
          player.pause()
        }
      }

      overlay.addEventListener('click', clickListener)
      playerElement.appendChild(overlay)

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

              const currentCompletedVideos = useProgressStore.getState().completedVideos
              if (
                progress >= COMPLETION_THRESHOLD &&
                (!currentCompletedVideos[playlist.id] || !currentCompletedVideos[playlist.id].has(video.id))
              ) {
                toggleVideoCompleted(playlist.id, video.id)
              }
            }
          }
        }
      }
      player.on('ended', onEnded)
      player.on('timeupdate', onTimeUpdate)

      return () => {
        player.off('ended', onEnded)
        player.off('timeupdate', onTimeUpdate)
        overlay.removeEventListener('click', clickListener)
        if (overlay.parentNode) {
          overlay.parentNode.removeChild(overlay)
        }
      }
    }
  }, [
    player,
    isReady,
    playlist.id,
    video.id,
    toggleVideoCompleted,
    setCurrentTime,
    setVideoProgress,
    setVideoTimestamp,
  ])

  useEffect(() => {
    // 1. Initial safety check
    if (!player || !isReady || !video) return

    // 2. Snapshot them as constants so TypeScript stops panicking
    const activePlayer = player
    const activeVideo = video

    activePlayer.ready(() => {
      const newSrc = {
        src: `https://www.youtube-nocookie.com/watch?v=${activeVideo.id}`,
        type: 'video/youtube',
      }

      if (activePlayer.currentSrc() !== newSrc.src) {
        activePlayer.src(newSrc)
      }

      if (timestamp) {
        const seconds = timestampToSeconds(timestamp)
        if (seconds > 0) activePlayer.currentTime(seconds)
      }

      // 3. Handle the potentially undefined play() promise
      const playPromise = activePlayer.play()
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          console.log('Playback was prevented by browser policy.')
        })
      }
    })
  }, [player, isReady, video, timestamp])

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
