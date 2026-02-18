'use client'

import React from 'react'
import Notes from '@/app/playlist/[id]/[videoplayerid]/components/Notes'
import { notesTab } from '@/app/static'

export interface PlaylistSidebarProps {
  playlistId: string
  videoId: string
}

const PlaylistSidebar: React.FC<PlaylistSidebarProps> = ({ playlistId, videoId }) => {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{notesTab}</h2>
      <div className="bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl shadow-sm flex flex-col">
        <div className="flex flex-col p-6 overflow-hidden" style={{ maxHeight: '600px' }}>
          <Notes playlistId={playlistId} videoId={videoId} />
        </div>
      </div>
    </div>
  )
}

export default PlaylistSidebar
