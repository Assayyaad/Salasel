
import { useEffect, useRef, useState } from 'react'
import videojs from 'video.js'
import 'video.js/dist/video-js.css'

type Player = ReturnType<typeof videojs>;

interface VideoJsOptions {
  autoplay: boolean;
  muted: boolean;
  controls: boolean;
  responsive: boolean;
  fluid: boolean;
  techOrder: string[];
  sources: { src: string; type: string }[];
  youtube?: {
    playsinline: number;
    ytControls: number;
    modestbranding: number;
    rel: number;
    iv_load_policy: number;
  };
}

export const useVideoPlayer = (options: VideoJsOptions) => {
  const videoNode = useRef<HTMLVideoElement>(null)
  const playerRef = useRef<Player | null>(null)
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    const videoElement = videoNode.current
    if (!videoElement) return

    let player: Player;

    (async () => {
      const videojs = (await import('video.js')).default
      await import('videojs-youtube')

      player = videojs(videoElement, options)
      playerRef.current = player

      player.ready(() => {
        setIsReady(true)
      })
    })()

    return () => {
      if (playerRef.current) {
        playerRef.current.dispose()
        playerRef.current = null
        setIsReady(false)
      }
    }
  }, [options])

  return { videoNode, player: playerRef.current, isReady }
}
