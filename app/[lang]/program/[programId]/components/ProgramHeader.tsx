'use client'

import type { CalculatedProgram, Translations } from '@/app/types'

import React, { useState } from 'react'
import Image from 'next/image'
import { formatDate, videoThumbnailUrl, fallbackThumbnailUrl, formatTime } from '@/app/utils'
import { defaultLabel } from '@/app/static'

export type ProgramHeaderProgram = Pick<
  CalculatedProgram,
  | 'id'
  | 'name'
  | 'description'
  | 'thumbnailId'
  | 'participants'
  | 'playlistCount'
  | 'totalVideoCount'
  | 'totalDuration'
  | 'type'
  | 'style'
  | 'categories'
  | 'classes'
  | 'startDate'
  | 'endDate'
>

export interface ProgramHeaderProps {
  program: ProgramHeaderProgram
  t: Translations
}

const ProgramHeader: React.FC<ProgramHeaderProps> = ({ program, t }) => {
  const [isLoading, setIsLoading] = useState(true)
  const [imageUrl, setImageUrl] = useState(videoThumbnailUrl(program.thumbnailId))

  return (
    <div className="bg-card-light dark:bg-card-dark rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700">
      <div className="flex flex-col lg:flex-row">
        <div className="p-6 lg:w-1/2 flex flex-col justify-center space-y-4">
          <div className="flex items-center gap-2">
            <span className="material-icons-round text-primary text-sm">layers</span>
            <span className="text-xs font-medium text-primary uppercase tracking-wide">{t.programLabel}</span>
          </div>
          <h1 className="text-3xl font-extrabold text-text-light dark:text-text-dark mb-2 tracking-tight">
            {program.name}
          </h1>
          {program.description && (
            <p className="text-base text-gray-600 dark:text-gray-300 leading-relaxed">{program.description}</p>
          )}

          {program.participants.length > 0 && (
            <div className="text-sm text-muted-light dark:text-muted-dark font-medium">
              <span>
                {t.withParticipation} {program.participants.join(`${t.__language.comma} `)}
              </span>
            </div>
          )}

          <div className="grid grid-cols-2 gap-x-6 gap-y-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-2">
              <span className="material-icons-round text-base ml-1 text-primary">layers</span>
              <span className="flex flex-col">
                <span className="text-sm font-semibold text-text-light dark:text-text-dark">{t.seasonLabel}</span>
                <span className="text-xs text-muted-light dark:text-muted-dark">{program.playlistCount}</span>
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="material-icons-round text-base ml-1 text-primary">ondemand_video</span>
              <span className="flex flex-col">
                <span className="text-sm font-semibold text-text-light dark:text-text-dark">{t.totalVideosLabel}</span>
                <span className="text-xs text-muted-light dark:text-muted-dark">{program.totalVideoCount}</span>
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="material-icons-round text-base ml-1 text-primary">schedule</span>
              <span className="flex flex-col">
                <span className="text-sm font-semibold text-text-light dark:text-text-dark">{t.durationLabel}</span>
                <span className="text-xs text-muted-light dark:text-muted-dark">
                  {formatTime(program.totalDuration)}
                </span>
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="material-icons-round text-base ml-1 text-primary">question_mark</span>
              <span className="flex flex-col">
                <span className="text-sm font-semibold text-text-light dark:text-text-dark">{t.typeLabel}</span>
                <span className="text-xs text-muted-light dark:text-muted-dark">
                  {t.contents[program.type] || defaultLabel}
                </span>
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="material-icons-round text-base ml-1 text-primary">mic</span>
              <span className="flex flex-col">
                <span className="text-sm font-semibold text-text-light dark:text-text-dark">{t.styleLabel}</span>
                <span className="text-xs text-muted-light dark:text-muted-dark">
                  {t.presentations[program.style] || defaultLabel}
                </span>
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="material-icons-round text-base ml-1 text-primary">category</span>
              <span className="flex flex-col">
                <span className="text-sm font-semibold text-text-light dark:text-text-dark">{t.categoriesLabel}</span>
                <span className="text-xs text-muted-light dark:text-muted-dark">
                  {program.categories.map((c) => t.categories[c] || defaultLabel).join(`${t.__language.comma} `) ||
                    defaultLabel}
                </span>
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="material-icons-round text-base ml-1 text-primary">event</span>
              <span className="flex flex-col">
                <span className="text-sm font-semibold text-text-light dark:text-text-dark">{t.startDateLabel}</span>
                <span className="text-xs text-muted-light dark:text-muted-dark">{formatDate(program.startDate)}</span>
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="material-icons-round text-base ml-1 text-primary">event_available</span>
              <span className="flex flex-col">
                <span className="text-sm font-semibold text-text-light dark:text-text-dark">{t.endDateLabel}</span>
                <span className="text-xs text-muted-light dark:text-muted-dark">{formatDate(program.endDate)}</span>
              </span>
            </div>
          </div>
        </div>
        <div className="lg:w-1/2 relative bg-gray-100 dark:bg-gray-800 aspect-video">
          {isLoading && <div className="shimmer-wrapper"></div>}
          <Image
            alt={program.name}
            className={`w-full h-full object-cover transition-opacity duration-500 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
            src={imageUrl}
            fill={true}
            priority
            fetchPriority="high"
            onLoad={() => setIsLoading(false)}
            onError={() => setImageUrl(fallbackThumbnailUrl(program.thumbnailId))}
          />
          <div
            className={`absolute inset-0 bg-gradient-to-l from-transparent to-black/10 dark:to-black/30 pointer-events-none transition-opacity duration-500 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
          ></div>
        </div>
      </div>
    </div>
  )
}

export default ProgramHeader
