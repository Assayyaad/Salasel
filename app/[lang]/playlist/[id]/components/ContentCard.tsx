'use client'

import type { Translations } from '@/app/types'

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { videoThumbnailUrl, fallbackThumbnailUrl } from '@/app/utils'

export type WatchStatus = 'not-started' | 'in-progress' | 'completed'

export interface ContentCardProps {
  title: string
  videoId: string
  playlistId: string
  status: WatchStatus
  notesCount: number
  onToggle: (videoId: string) => void
  t: Translations
  priority?: boolean
}

const STATUS_ICON: Record<WatchStatus, string> = {
  'completed': 'check_circle',
  'in-progress': 'play_circle',
  'not-started': 'radio_button_unchecked',
}

const STATUS_COLOR: Record<WatchStatus, string> = {
  'completed': 'text-green-500',
  'in-progress': 'text-yellow-500',
  'not-started': 'text-slate-500',
}

const ContentCard: React.FC<ContentCardProps> = ({
  title,
  videoId,
  playlistId,
  status,
  notesCount,
  onToggle,
  t,
  priority = false,
}) => {
  const [imageUrl, setImageUrl] = useState(videoThumbnailUrl(videoId))

  const handleStatusClick = (e: React.MouseEvent) => {
    e.preventDefault()
    onToggle(videoId)
  }

  return (
    <Link
      href={`/${t.__language.code}/playlist/${playlistId}/${videoId}`}
      className={`group grid grid-cols-[7rem_1fr_4rem_5rem] items-center px-4 py-2 transition-colors ${
        status === 'completed'
          ? 'bg-green-50/60 dark:bg-green-900/20 hover:bg-green-50/80 dark:hover:bg-green-900/30'
          : 'hover:bg-white/5'
      }`}
    >
      {/* Column 1: Thumbnail */}
      <div className="w-28 aspect-video bg-gray-200 dark:bg-gray-700 rounded-md overflow-hidden relative shadow-sm">
        <Image
          alt={title}
          className="w-full h-full object-cover"
          src={imageUrl}
          fill={true}
          priority={priority}
          fetchPriority={priority ? 'high' : undefined}
          onError={() => setImageUrl(fallbackThumbnailUrl(videoId))}
        />
        <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/10 transition-colors">
          <span className="material-icons-round text-white text-3xl drop-shadow-md">play_circle_outline</span>
        </div>
      </div>

      {/* Column 2: Title */}
      <h3 className="px-4 text-base font-semibold text-text-light dark:text-text-dark group-hover:text-primary transition-colors line-clamp-2">
        {title}
      </h3>

      {/* Column 3: Notes count — always show, 0 when none */}
      <div className="flex items-center justify-center text-muted-light dark:text-muted-dark">
        <span className="text-sm">{notesCount}</span>
      </div>

      {/* Column 4: Watch status icon */}
      <div onClick={handleStatusClick} className="flex items-center justify-center relative z-10 cursor-pointer">
        <span className={`material-icons-round ${STATUS_COLOR[status]}`} title={t[statusTranslationKey(status)]}>
          {STATUS_ICON[status]}
        </span>
      </div>
    </Link>
  )
}

function statusTranslationKey(
  status: WatchStatus,
): 'watchStatusCompleted' | 'watchStatusInProgress' | 'watchStatusNotStarted' {
  if (status === 'completed') return 'watchStatusCompleted'
  if (status === 'in-progress') return 'watchStatusInProgress'
  return 'watchStatusNotStarted'
}

export default ContentCard
