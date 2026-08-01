'use client'

import type { Translations } from '@/app/types'

import React, { useState } from 'react'
import { youtubeEmbedUrl, youtubeWatchUrl } from '@/app/utils'

export interface WatchPlayerProps {
  videoId: string
  playlistId: string
  title: string
  t: Translations
}

/**
 * Embedded YouTube player (privacy-friendly nocookie domain). If the embed
 * fails (embedding disabled / region blocked), falls back to a "watch on
 * YouTube" card so the video is never a dead end.
 */
const WatchPlayer: React.FC<WatchPlayerProps> = ({ videoId, playlistId, title, t }) => {
  const [failed, setFailed] = useState(false)
  const watchUrl = youtubeWatchUrl(videoId, playlistId)

  return (
    <div className="relative w-full aspect-video overflow-hidden rounded-xl bg-black shadow-lg">
      {failed ? (
        <a
          href={watchUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-4 text-center text-slate-300 hover:text-white transition-colors"
        >
          <span className="material-icons-round text-5xl text-primary">smart_display</span>
          <span className="text-sm max-w-xs">{t.videoUnavailableLabel}</span>
        </a>
      ) : (
        <iframe
          className="absolute inset-0 h-full w-full"
          src={youtubeEmbedUrl(videoId, playlistId)}
          title={title}
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
          onError={() => setFailed(true)}
        />
      )}
    </div>
  )
}

export default WatchPlayer
