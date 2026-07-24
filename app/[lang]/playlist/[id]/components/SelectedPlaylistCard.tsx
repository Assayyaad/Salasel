'use client'

import type { CalculatedPlaylist, Translations } from '@/app/types'

import React, { useState } from 'react'
import Image from 'next/image'
import Librecounter from '@/app/shared/components/Librecounter'
import { formatDate, videoThumbnailUrl, fallbackThumbnailUrl, formatTime } from '@/app/utils'
import { defaultLabel } from '@/app/static'
import { useBookmarkStore } from '@/app/store/useBookmarkStore'

export type SelectedPlaylistCardPlaylist = Pick<
  CalculatedPlaylist,
  | 'id'
  | 'name'
  | 'description'
  | 'thumbnailId'
  | 'participants'
  | 'videoCount'
  | 'duration'
  | 'type'
  | 'style'
  | 'categories'
  | 'classes'
  | 'startDate'
  | 'endDate'
>
export interface SelectedPlaylistCardProps {
  playlist: SelectedPlaylistCardPlaylist
  t: Translations
}

const SelectedPlaylistCard: React.FC<SelectedPlaylistCardProps> = ({ playlist, t }) => {
  const [isLoading, setIsLoading] = useState(true)
  const [imageUrl, setImageUrl] = useState(videoThumbnailUrl(playlist.thumbnailId))
  const [expanded, setExpanded] = useState(false)
  const { isBookmarked, toggleBookmark } = useBookmarkStore()
  const bookmarked = isBookmarked(playlist.id)

  const DESCRIPTION_LIMIT = 100
  const isTruncatable = playlist.description.length > DESCRIPTION_LIMIT
  const displayedDescription =
    isTruncatable && !expanded ? `${playlist.description.slice(0, DESCRIPTION_LIMIT).trimEnd()}…` : playlist.description

  if (!playlist) {
    return <div>{t.loading}</div> // Or some other loading state
  }

  return (
    <div className="bg-card-light dark:bg-card-dark rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700">
      <div className="flex flex-col lg:flex-row lg:items-center">
        <div className="p-6 lg:w-1/2 flex flex-col justify-center space-y-4">
          {/* 1. Reordered Information */}
          <h1 className="text-3xl font-extrabold text-text-light dark:text-text-dark mb-2 tracking-tight">
            {playlist.name}
          </h1>
          {/* Bookmark button */}
          <div>
            <button
              onClick={() => toggleBookmark(playlist.id)}
              aria-label={bookmarked ? 'Remove bookmark' : 'Bookmark playlist'}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm border transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary bg-slate-800 border-slate-600 text-slate-300 hover:border-primary hover:text-primary"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill={bookmarked ? 'currentColor' : 'none'}
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={bookmarked ? 'text-primary' : ''}
                aria-hidden="true"
              >
                <path d="M19 21l-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
              </svg>
              {t.bookmarkLabel}
            </button>
          </div>
          <div>
            <p className="text-base text-gray-600 dark:text-gray-300 leading-relaxed">
              {displayedDescription} <Librecounter />
            </p>
            {isTruncatable && (
              <button
                type="button"
                onClick={() => setExpanded((v) => !v)}
                className="mt-1 text-sm font-medium text-primary hover:underline focus:outline-none cursor-pointer"
              >
                {expanded ? t.readLessLabel : t.readMoreLabel}
              </button>
            )}
          </div>

          {playlist.participants.length > 0 && (
            <div className="text-sm text-muted-light dark:text-muted-dark font-medium">
              <span>
                {t.withParticipation} {playlist.participants.join(`${t.__language.comma} `)}
              </span>
            </div>
          )}

          {/* 2. New Multi-column metadata list */}
          <div className="grid grid-cols-2 gap-x-6 gap-y-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-2">
              <span className="material-icons-round text-base ml-1 text-primary">ondemand_video</span>
              <span className="flex flex-col">
                <span className="text-sm font-semibold text-text-light dark:text-text-dark">{t.videosLabel}</span>
                <span className="text-xs text-muted-light dark:text-muted-dark">{playlist.videoCount}</span>
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="material-icons-round text-base ml-1 text-primary">schedule</span>
              <span className="flex flex-col">
                <span className="text-sm font-semibold text-text-light dark:text-text-dark">{t.durationLabel}</span>
                <span className="text-xs text-muted-light dark:text-muted-dark">{formatTime(playlist.duration)}</span>
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="material-icons-round text-base ml-1 text-primary">question_mark</span>
              <span className="flex flex-col">
                <span className="text-sm font-semibold text-text-light dark:text-text-dark">{t.typeLabel}</span>
                <span className="text-xs text-muted-light dark:text-muted-dark">
                  {t.contents[playlist.type] || defaultLabel}
                </span>
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="material-icons-round text-base ml-1 text-primary">mic</span>
              <span className="flex flex-col">
                <span className="text-sm font-semibold text-text-light dark:text-text-dark">{t.styleLabel}</span>
                <span className="text-xs text-muted-light dark:text-muted-dark">
                  {t.presentations[playlist.style] || defaultLabel}
                </span>
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="material-icons-round text-base ml-1 text-primary">category</span>
              <span className="flex flex-col">
                <span className="text-sm font-semibold text-text-light dark:text-text-dark">{t.categoriesLabel}</span>
                <span className="text-xs text-muted-light dark:text-muted-dark">
                  {playlist.categories.map((c) => t.categories[c] || defaultLabel).join(`${t.__language.comma} `) ||
                    defaultLabel}
                </span>
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="material-icons-round text-base ml-1 text-primary">group</span>
              <span className="flex flex-col">
                <span className="text-sm font-semibold text-text-light dark:text-text-dark">{t.classesLabel}</span>
                <span className="text-xs text-muted-light dark:text-muted-dark">
                  {playlist.classes.map((c) => t.classes[c] || defaultLabel).join(`${t.__language.comma} `) ||
                    defaultLabel}
                </span>
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="material-icons-round text-base ml-1 text-primary">event</span>
              <span className="flex flex-col">
                <span className="text-sm font-semibold text-text-light dark:text-text-dark">{t.startDateLabel}</span>
                <span className="text-xs text-muted-light dark:text-muted-dark">{formatDate(playlist.startDate)}</span>
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="material-icons-round text-base ml-1 text-primary">event_available</span>
              <span className="flex flex-col">
                <span className="text-sm font-semibold text-text-light dark:text-text-dark">{t.endDateLabel}</span>
                <span className="text-xs text-muted-light dark:text-muted-dark">{formatDate(playlist.endDate)}</span>
              </span>
            </div>
          </div>
        </div>
        <div className="lg:w-1/2 relative bg-gray-100 dark:bg-gray-800 aspect-video">
          {isLoading && <div className="shimmer-wrapper"></div>}
          <Image
            alt={playlist.name}
            className={`w-full h-full object-cover transition-opacity duration-500 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
            src={imageUrl}
            fill={true}
            priority
            fetchPriority="high"
            onLoad={() => setIsLoading(false)}
            onError={() => setImageUrl(fallbackThumbnailUrl(playlist.thumbnailId))}
          />
          <div
            className={`absolute inset-0 bg-gradient-to-l from-transparent to-black/10 dark:to-black/30 pointer-events-none transition-opacity duration-500 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
          ></div>
        </div>
      </div>
    </div>
  )
}

export default SelectedPlaylistCard
