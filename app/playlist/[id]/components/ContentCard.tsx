'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { videoThumbnailUrl, fallbackThumbnailUrl } from '@/app/utils'
import { watchStatusCompleted, watchStatusInProgress, watchStatusNotStarted } from '@/app/static'

export type WatchStatus = 'not-started' | 'in-progress' | 'completed'
export interface ContentCardProps {
  title: string
  videoId: string
  playlistId: string
  status: WatchStatus
  notesCount: number
  onToggle: (videoId: string) => void
}

const ContentCard: React.FC<ContentCardProps> = ({ title, videoId, playlistId, status, notesCount, onToggle }) => {
  const [imageUrl, setImageUrl] = useState(videoThumbnailUrl(videoId))

  const handleStatusClick = (e: React.MouseEvent) => {
    e.preventDefault() // Prevent navigation when clicking the icon
    onToggle(videoId)
  }

  const inProgressClasses = status === 'in-progress' ? 'bg-yellow-50/50 dark:bg-yellow-900/10' : ''
  const completedClasses = status === 'completed' ? 'bg-green-50/50 dark:bg-green-900/10' : ''

  return (
    <Link
      href={`/playlist/${playlistId}/${videoId}`}
      dir="rtl"
      className={`block group relative transition-colors cursor-pointer p-4 sm:px-6 hover:bg-gray-50 dark:hover:bg-gray-700/30 ${completedClasses} ${inProgressClasses}`}
    >
      <div className="grid grid-cols-[auto_1fr_auto_auto] items-center gap-x-4">
        {/* Column 1: Thumbnail */}
        <div className="w-28 md:w-32 aspect-video bg-gray-200 dark:bg-gray-700 rounded-md overflow-hidden relative shadow-sm">
          <Image
            alt={title}
            className="w-full h-full object-cover"
            src={imageUrl}
            fill={true}
            onError={() => setImageUrl(fallbackThumbnailUrl(videoId))}
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/10 transition-colors">
            <span className="material-icons-round text-white text-3xl drop-shadow-md">play_circle_outline</span>
          </div>
        </div>

        {/* Column 2: Title */}
        <div className="flex flex-col">
          <h3 className="text-base font-semibold text-text-light dark:text-text-dark group-hover:text-primary transition-colors">
            {title}
          </h3>
        </div>

        {/* Column 3: Notes Count */}
        <div className="flex items-center space-x-1 text-muted-light dark:text-muted-dark">
          <span className="material-icons-round text-base">description</span>
          <span>{notesCount}</span>
        </div>

        {/* Column 4: Watch Status */}
        <div onClick={handleStatusClick} className="relative z-10 p-2 cursor-pointer">
          <WatchStatusIcon status={status} />
        </div>
      </div>
    </Link>
  )
}

const WatchStatusIcon: React.FC<{ status: WatchStatus }> = ({ status }) => {
  switch (status) {
    case 'completed':
      return (
        <span className="material-icons-round text-green-500" title={watchStatusCompleted}>
          check_circle
        </span>
      )
    case 'in-progress':
      return (
        <span className="material-icons-round text-xs text-yellow-500" title={watchStatusInProgress}>
          hourglass_bottom
        </span>
      )
    case 'not-started':
    default:
      return (
        <span className="material-icons-round text-gray-400" title={watchStatusNotStarted}>
          radio_button_unchecked
        </span>
      )
  }
}

export default ContentCard
