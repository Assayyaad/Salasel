'use client'

import type { Playlist } from '@/app/types'
import React, { useState } from 'react'
import VideoContent from './VideoContent'
import Notes from './Notes'
import { contentTab, noContent, notesTab } from '@/app/static'

interface PlaylistSidebarProps {
  playlist: Playlist;
  currentVideoId: string;
}

const PlaylistSidebar: React.FC<PlaylistSidebarProps> = ({ playlist, currentVideoId }) => {
  const [activeTab, setActiveTab] = useState('content')

  return (
    <div className="lg:col-span-1 bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl shadow-sm flex flex-col h-full">
      <div className="flex border-b border-border-light dark:border-border-dark">
        <button
          className={`flex-1 py-3 text-sm font-medium transition-colors ${
            activeTab === 'content'
              ? 'text-primary border-b-2 border-primary bg-gray-50 dark:bg-gray-800/50'
              : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50'
          }`}
          onClick={() => setActiveTab('content')}
        >
          {contentTab}
        </button>
        <button
          className={`flex-1 py-3 text-sm font-medium transition-colors ${
            activeTab === 'notes'
              ? 'text-primary border-b-2 border-primary bg-gray-50 dark:bg-gray-800/50'
              : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50'
          }`}
          onClick={() => setActiveTab('notes')}
        >
          {notesTab}
        </button>
      </div>
      <div className="flex-1 flex flex-col p-4 overflow-hidden">
        {activeTab === 'content' && playlist && playlist.videos && playlist.videos.length > 0 ? (
          <VideoContent videos={playlist.videos} currentVideoId={currentVideoId} playlistId={playlist.id} />
        ) : activeTab === 'content' ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500">{noContent}</p>
          </div>
        ) : null}
        {activeTab === 'notes' && <Notes />}
      </div>
    </div>
  )
}

export default PlaylistSidebar