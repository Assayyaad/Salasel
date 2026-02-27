'use client'

import type { CalculatedVideo, Translations } from '@/app/types'

import React from 'react'
import Notes from '@/app/[lang]/playlist/[id]/[videoplayerid]/components/Notes'

export interface PlaylistSidebarProps {
  playlistId: string
  videoId: string
  playlistName: string
  videoTitle: string
  videos: Record<string, Pick<CalculatedVideo, 'id' | 'title'>>
  t: Translations
  notesOnly?: boolean
}

const PlaylistSidebar: React.FC<PlaylistSidebarProps> = ({
  playlistId,
  videoId,
  playlistName,
  videoTitle,
  videos,
  t,
  notesOnly,
}) => {
  return (
    <div className="flex flex-col gap-4 h-full">
      {!notesOnly && <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{t.notesTab}</h2>}
      <div className="bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl shadow-sm flex flex-col flex-1">
        <div className="flex flex-col p-6 overflow-hidden flex-1" style={{ maxHeight: '600px' }}>
          <Notes
            playlistId={playlistId}
            videoId={videoId}
            playlistName={playlistName}
            videoTitle={videoTitle}
            videos={videos}
            t={t}
          />
        </div>
      </div>
    </div>
  )
}

export default PlaylistSidebar
