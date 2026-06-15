'use client'

import type { CalculatedPlaylist, LanguageCode, Translations } from '@/app/types'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { videoThumbnailUrl, fallbackThumbnailUrl } from '@/app/utils'
import BookmarkButton from '@/app/[lang]/(home)/components/BookmarkButton'
import { useProgressStore } from '@/app/store/useProgressStore'

export type PlaylistCardPlaylist = Pick<
  CalculatedPlaylist,
  'id' | 'name' | 'description' | 'thumbnailId' | 'videoCount'
>
export interface PlaylistCardProps {
  playlist: PlaylistCardPlaylist
  lang: LanguageCode
  t: Translations
  priority?: boolean
}

const PlaylistCard: React.FC<PlaylistCardProps> = ({ playlist, lang, t, priority = false }) => {
  const [imageUrl, setImageUrl] = useState(videoThumbnailUrl(playlist.thumbnailId))
  const [isClient, setIsClient] = useState(false)
  const completedVideos = useProgressStore((s) => s.completedVideos)

  useEffect(() => {
    setIsClient(true)
  }, [])

  const completedCount = isClient ? (completedVideos[playlist.id]?.size ?? 0) : 0
  const totalCount = playlist.videoCount
  const isCompleted = totalCount > 0 && completedCount === totalCount
  const progressPct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0
  const hasProgress = completedCount > 0

  return (
    <Link href={`/${lang}/playlist/${playlist.id}`} className="block group">
      <article className="h-full bg-slate-800/50 rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 border border-slate-700 hover:border-primary">
        <div className="aspect-video w-full overflow-hidden relative">
          <Image
            src={imageUrl}
            alt={playlist.name}
            fill={true}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
            priority={priority}
            fetchPriority={priority ? 'high' : undefined}
            onError={() => setImageUrl(fallbackThumbnailUrl(playlist.thumbnailId))}
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />

          {/* Bookmark button — top end */}
          <div className="absolute top-2 end-2">
            <BookmarkButton playlistId={playlist.id} />
          </div>

          {/* Completed badge — top start */}
          {isClient && isCompleted && (
            <div className="absolute top-2 start-2 flex items-center gap-1 bg-green-600/90 text-white text-xs font-semibold px-2 py-1 rounded-full backdrop-blur-sm">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="size-3.5 shrink-0"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 00-1.414 0L8 12.586 4.707 9.293a1 1 0 00-1.414 1.414l4 4a1 1 0 001.414 0l8-8a1 1 0 000-1.414z"
                  clipRule="evenodd"
                />
              </svg>
              {t.completedLabel}
            </div>
          )}

          {/* Progress bar — bottom of thumbnail */}
          {isClient && hasProgress && (
            <div className="absolute bottom-0 start-0 end-0 h-1 bg-black/40">
              <div
                className={`h-full transition-all duration-300 ${isCompleted ? 'bg-green-500' : 'bg-primary'}`}
                style={{ width: `${progressPct}%` }}
                role="progressbar"
                aria-valuenow={progressPct}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={`${progressPct}%`}
              />
            </div>
          )}
        </div>

        <div className="p-4">
          <h2 className="text-lg font-semibold text-white group-hover:text-primary transition-colors">
            {playlist.name}
          </h2>
          <p className="text-sm text-slate-400 mt-1 min-h-[2.5rem]">{playlist.description}</p>
        </div>
      </article>
    </Link>
  )
}

export default PlaylistCard
