'use client'

import type { Translations } from '@/app/types'

import React, { useState } from 'react'
import Image from 'next/image'
import { videoThumbnailUrl, fallbackThumbnailUrl } from '@/app/utils'

export interface ContentCardProps {
  title: string
  videoId: string
  playlistId: string
  t: Translations
  priority?: boolean
}

const ContentCard: React.FC<ContentCardProps> = ({ title, videoId, playlistId, priority = false }) => {
  const [imageUrl, setImageUrl] = useState(videoThumbnailUrl(videoId))

  return (
    <a
      href={`https://www.youtube.com/watch?v=${videoId}&list=${playlistId}`}
      target="_blank"
      rel="noopener noreferrer"
      className="block group relative transition-colors cursor-pointer p-4 sm:px-6 hover:bg-gray-50 dark:hover:bg-gray-700/30"
    >
      <div className="grid grid-cols-[auto_1fr] items-center gap-x-4">
        {/* Column 1: Thumbnail */}
        <div className="w-28 md:w-32 aspect-video bg-gray-200 dark:bg-gray-700 rounded-md overflow-hidden relative shadow-sm">
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
        <div className="flex flex-col">
          <h3 className="text-base font-semibold text-text-light dark:text-text-dark group-hover:text-primary transition-colors">
            {title}
          </h3>
        </div>
      </div>
    </a>
  )
}

export default ContentCard
