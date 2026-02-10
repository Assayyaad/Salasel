'use client'

import type { Playlist } from '@/app/types'

import React, { useState } from 'react'
import Image from 'next/image'
import {
  formatDate,
  getClassLabel,
  getContentTypeLabel,
  getPresentationStyleLabel,
  videoThumbnailUrl,
} from '@/app/utils'
import {
  loading,
  withParticipation,
  videosLabel,
  videoLabel,
  durationLabel,
  typeLabel,
  styleLabel,
  categoriesLabel,
  classesLabel,
  startDateLabel,
  endDateLabel,
} from '@/app/static'

export interface SelectedPlaylistCardProps {
  playlist: Playlist
}

const SelectedPlaylistCard: React.FC<SelectedPlaylistCardProps> = ({ playlist }) => {
  const [isLoading, setIsLoading] = useState(true)

  if (!playlist) {
    return <div>{loading}</div> // Or some other loading state
  }

  const imageUrl = videoThumbnailUrl(playlist.thumbnailId)

  return (
    <div
      dir="rtl"
      className="bg-card-light dark:bg-card-dark rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700"
    >
      <div className="flex flex-col lg:flex-row">
        <div className="p-6 lg:w-1/2 flex flex-col justify-center space-y-4">
          {/* 1. Reordered Information */}
          <h1 className="text-3xl font-extrabold text-text-light dark:text-text-dark mb-2 tracking-tight">
            {playlist.channel} | {playlist.name}
          </h1>
          <p className="text-base text-gray-600 dark:text-gray-300 leading-relaxed">{playlist.description}</p>
          <div className="text-sm text-muted-light dark:text-muted-dark font-medium">
            <span>
              {withParticipation} {playlist.participants.join(', ')}
            </span>
          </div>

          {/* 2. New Multi-column metadata list */}
          <div className="grid grid-cols-2 gap-x-6 gap-y-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-2">
              <span className="material-icons-round text-base ml-1 text-primary">ondemand_video</span>
              <span className="flex flex-col">
                <span className="text-sm font-semibold text-text-light dark:text-text-dark">{videosLabel}</span>
                <span className="text-xs text-muted-light dark:text-muted-dark">
                  {playlist.episodesCount} {videoLabel}
                </span>
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="material-icons-round text-base ml-1 text-primary">schedule</span>
              <span className="flex flex-col">
                <span className="text-sm font-semibold text-text-light dark:text-text-dark">{durationLabel}</span>
                <span className="text-xs text-muted-light dark:text-muted-dark">{playlist.duration}</span>
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="material-icons-round text-base ml-1 text-primary">question_mark</span>
              <span className="flex flex-col">
                <span className="text-sm font-semibold text-text-light dark:text-text-dark">{typeLabel}</span>
                <span className="text-xs text-muted-light dark:text-muted-dark">
                  {getContentTypeLabel(playlist.type)}
                </span>
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="material-icons-round text-base ml-1 text-primary">mic</span>
              <span className="flex flex-col">
                <span className="text-sm font-semibold text-text-light dark:text-text-dark">{styleLabel}</span>
                <span className="text-xs text-muted-light dark:text-muted-dark">
                  {getPresentationStyleLabel(playlist.style)}
                </span>
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="material-icons-round text-base ml-1 text-primary">category</span>
              <span className="flex flex-col">
                <span className="text-sm font-semibold text-text-light dark:text-text-dark">{categoriesLabel}</span>
                <span className="text-xs text-muted-light dark:text-muted-dark">{playlist.categories.join(', ')}</span>
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="material-icons-round text-base ml-1 text-primary">group</span>
              <span className="flex flex-col">
                <span className="text-sm font-semibold text-text-light dark:text-text-dark">{classesLabel}</span>
                <span className="text-xs text-muted-light dark:text-muted-dark">
                  {playlist.classes.map((c) => getClassLabel(c)).join(', ')}
                </span>
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="material-icons-round text-base ml-1 text-primary">event</span>
              <span className="flex flex-col">
                <span className="text-sm font-semibold text-text-light dark:text-text-dark">{startDateLabel}</span>
                <span className="text-xs text-muted-light dark:text-muted-dark">{formatDate(playlist.startDate)}</span>
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="material-icons-round text-base ml-1 text-primary">event_available</span>
              <span className="flex flex-col">
                <span className="text-sm font-semibold text-text-light dark:text-text-dark">{endDateLabel}</span>
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
            onLoad={() => setIsLoading(false)}
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
