import type { CalculatedPlaylist, LanguageCode, Translations } from '@/app/types'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { videoThumbnailUrl, formatTime, formatDate } from '@/app/utils'

export type ProgramPlaylistItem = Pick<
  CalculatedPlaylist,
  'id' | 'name' | 'description' | 'thumbnailId' | 'videoCount' | 'duration' | 'startDate' | 'endDate'
>

export interface ProgramPlaylistsProps {
  playlists: ProgramPlaylistItem[]
  lang: LanguageCode
  t: Translations
}

const ProgramPlaylists: React.FC<ProgramPlaylistsProps> = ({ playlists, lang, t }) => {
  if (playlists.length === 0) {
    return <p className="text-muted-light dark:text-muted-dark">{t.noVideosFound}</p>
  }

  return (
    <div className="bg-card-light dark:bg-card-dark rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
      <h2 className="text-xl font-bold text-text-light dark:text-text-dark mb-4">{t.playlistContents}</h2>
      <div className="space-y-4">
        {playlists.map((playlist, index) => (
          <Link key={playlist.id} href={`/${lang}/playlist/${playlist.id}`} className="block group">
            <div className="flex gap-4 p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-primary bg-slate-50 dark:bg-slate-800/50 transition-all duration-200 hover:shadow-md">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-sm font-bold">
                {index + 1}
              </div>
              <div className="relative w-32 h-20 flex-shrink-0 rounded-md overflow-hidden bg-gray-200 dark:bg-gray-700">
                <Image
                  src={videoThumbnailUrl(playlist.thumbnailId)}
                  alt={playlist.name}
                  fill={true}
                  sizes="128px"
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="flex-grow min-w-0">
                <h3 className="text-base font-semibold text-text-light dark:text-text-dark group-hover:text-primary transition-colors truncate">
                  {t.seasonLabel} {index + 1}: {playlist.name}
                </h3>
                {playlist.description && (
                  <p className="text-sm text-muted-light dark:text-muted-dark mt-1 line-clamp-2">
                    {playlist.description}
                  </p>
                )}
                <div className="flex gap-4 mt-2 text-xs text-muted-light dark:text-muted-dark">
                  <span className="flex items-center gap-1">
                    <span className="material-icons-round text-xs">ondemand_video</span>
                    {playlist.videoCount} {t.videosLabel}
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="material-icons-round text-xs">schedule</span>
                    {formatTime(playlist.duration)}
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="material-icons-round text-xs">event</span>
                    {formatDate(playlist.startDate)}
                  </span>
                </div>
              </div>
              <div className="flex-shrink-0 flex items-center">
                <span className="material-icons-round text-muted-light dark:text-muted-dark group-hover:text-primary transition-colors">
                  chevron_right
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default ProgramPlaylists
