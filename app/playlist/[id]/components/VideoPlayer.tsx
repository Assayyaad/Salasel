'use client'

import React, { useEffect, useRef, useState } from 'react'
import videojs from 'video.js'
import 'video.js/dist/video-js.css'
import 'videojs-youtube'
import { Playlist as Course, Video } from '../../../types'
import { by, noVideos } from '@/app/static'

interface VideoPlayerProps {
  playlist: Course
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ playlist }) => {
  const videoNode = useRef<HTMLVideoElement>(null)
  const playerRef = useRef<any>(null)
  const [currentVideo, setCurrentVideo] = useState<Video | null>(null)

  // This effect synchronizes the internal state with the playlist prop.
  // It runs when the playlist prop changes, updating the video to the first one in the new playlist.
  useEffect(() => {
    if (playlist && playlist.الفيديوهات && playlist.الفيديوهات.length > 0) {
      setCurrentVideo(playlist.الفيديوهات[0])
    } else {
      setCurrentVideo(null)
    }
  }, [playlist])

  useEffect(() => {
    if (!currentVideo || !videoNode.current) return

    if (!playerRef.current) {
      // The DOM element needs a `data-vjs-player` attribute for Video.js to recognize it
      const player = (playerRef.current = videojs(
        videoNode.current,
        {
          autoplay: false,
          controls: true,
          responsive: true,
          fluid: true,
          techOrder: ['youtube'],
          sources: [
            {
              src: currentVideo.youtubeUrl || '',
              type: 'video/youtube',
            },
          ],
        },
        () => {
          console.log('player is ready')
        },
      ))
    } else {
      const player = playerRef.current
      player.src({ src: currentVideo.youtubeUrl || '', type: 'video/youtube' })
    }

    // Cleanup function
    return () => {
      if (playerRef.current) {
        // playerRef.current.dispose();
        // playerRef.current = null;
      }
    }
  }, [currentVideo])

  // Dispose the player when the component unmounts
  useEffect(() => {
    const player = playerRef.current
    return () => {
      if (player && !player.isDisposed()) {
        player.dispose()
        playerRef.current = null
      }
    }
  }, [])

  if (!currentVideo) {
    return (
      <div className="lg:col-span-2 flex flex-col gap-6 items-center justify-center bg-black rounded-xl aspect-video">
        <p className="text-white">{noVideos}</p>
      </div>
    )
  }

  return (
    <div className="lg:col-span-2 flex flex-col gap-6">
      <div className="aspect-video bg-black rounded-xl overflow-hidden shadow-lg">
        <div data-vjs-player>
          <video ref={videoNode} className="video-js vjs-big-play-centered" />
        </div>
      </div>
      <div className="flex flex-col gap-2 p-2">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{currentVideo['عنوان']}</h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              {by} <span className="font-medium text-primary">{playlist['المقدمين']}</span>
            </p>
          </div>
          <div className="flex gap-2">
            <button className="p-2 text-gray-500 hover:text-primary hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
              <span className="material-icons-round">share</span>
            </button>
            <button className="p-2 text-gray-500 hover:text-primary hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
              <span className="material-icons-round">bookmark_border</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default VideoPlayer
