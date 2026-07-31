'use client'

import type { CalculatedPlaylist, LanguageCode, Translations } from '@/app/types'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useProgressStore } from '@/app/store/useProgressStore'
import { videoThumbnailUrl, fallbackThumbnailUrl } from '@/app/utils'

export type RecentlyWatchedPlaylist = Pick<CalculatedPlaylist, 'id' | 'name' | 'thumbnailId'>

export interface RecentlyWatchedProps {
  playlists: Record<string, RecentlyWatchedPlaylist>
  lang: LanguageCode
  t: Translations
}

const COLLAPSED_COUNT = 6
const HIDDEN_KEY = 'salasel-hide-recently-watched'

const RecentlyWatched: React.FC<RecentlyWatchedProps> = ({ playlists, lang, t }) => {
  const { recentPlaylists } = useProgressStore()
  const [expanded, setExpanded] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setHidden(localStorage.getItem(HIDDEN_KEY) === 'true')
    }
    setMounted(true)
  }, [])

  const toggleHidden = () => {
    const next = !hidden
    setHidden(next)
    if (typeof window !== 'undefined') {
      localStorage.setItem(HIDDEN_KEY, String(next))
    }
  }

  const recent = recentPlaylists.flatMap((id) => (playlists[id] ? [playlists[id]] : []))

  if (!mounted || recent.length === 0) return null

  const visible = expanded ? recent : recent.slice(0, COLLAPSED_COUNT)
  const hasMore = recent.length > COLLAPSED_COUNT
  const countLabel = t.playlistsCountLabel.replace('{n}', String(recent.length))

  return (
    <section className="mb-10">
      <div className="rounded-xl border border-slate-700 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between bg-slate-800/80 px-4 py-3">
          <div className="flex items-center gap-2.5">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-primary shrink-0"
              aria-hidden="true"
            >
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
            <div>
              <h2 className="text-sm font-semibold text-white leading-none">{t.continueWatchingLabel}</h2>
              <p className="text-xs text-slate-500 mt-0.5">{countLabel}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!hidden && hasMore && (
              <button
                onClick={() => setExpanded((prev) => !prev)}
                className="text-xs font-medium px-3 py-1 rounded-full border border-primary/40 text-primary hover:bg-primary/10 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {expanded ? t.showLessLabel : `${t.viewAllLabel} (${recent.length})`}
              </button>
            )}
            <button
              onClick={toggleHidden}
              className="text-xs font-medium px-3 py-1 rounded-full border border-slate-600 text-slate-400 hover:border-slate-400 hover:text-slate-200 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-slate-500"
              aria-label={hidden ? t.showLabel : t.hideLabel}
            >
              {hidden ? t.showLabel : t.hideLabel}
            </button>
          </div>
        </div>

        {/* Content panel — seamlessly extends below header */}
        {!hidden && (
          <div className="bg-slate-900/40 border-t border-slate-700/60 p-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {visible.map((pl) => (
                <RecentCard key={pl.id} playlist={pl} lang={lang} />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

interface RecentCardProps {
  playlist: RecentlyWatchedPlaylist
  lang: LanguageCode
}

const RecentCard: React.FC<RecentCardProps> = ({ playlist, lang }) => {
  const [imageUrl, setImageUrl] = useState(videoThumbnailUrl(playlist.thumbnailId))

  return (
    <Link href={`/${lang}/playlist/${playlist.id}`} className="block group">
      <div className="rounded-lg overflow-hidden border border-slate-700 hover:border-primary transition-colors">
        <div className="aspect-video relative bg-slate-800">
          <Image
            src={imageUrl}
            alt={playlist.name}
            fill
            sizes="(max-width: 640px) 144px, 160px"
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            onError={() => setImageUrl(fallbackThumbnailUrl(playlist.thumbnailId))}
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="white"
              aria-hidden="true"
            >
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
          </div>
        </div>
        <p className="px-2 py-1.5 text-xs text-slate-300 group-hover:text-primary transition-colors line-clamp-2 leading-tight">
          {playlist.name}
        </p>
      </div>
    </Link>
  )
}

export default RecentlyWatched
