'use client'

import React, { useState } from 'react'
import { Playlist as Course } from '@/app/types'
import VideoContent from './VideoContent'
import Notes from './Notes'

interface PlaylistSidebarProps {
  playlist: Course
}

const PlaylistSidebar: React.FC<PlaylistSidebarProps> = ({ playlist }) => {
  const [activeTab, setActiveTab] = useState('content')

  return (
    <div className="lg:col-span-1 bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl shadow-sm flex flex-col h-[600px]">
      <div className="flex border-b border-border-light dark:border-border-dark">
        <button
          className={`flex-1 py-3 text-sm font-medium transition-colors ${
            activeTab === 'content'
              ? 'text-primary border-b-2 border-primary bg-gray-50 dark:bg-gray-800/50'
              : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50'
          }`}
          onClick={() => setActiveTab('content')}
        >
          المحتوى
        </button>
        <button
          className={`flex-1 py-3 text-sm font-medium transition-colors ${
            activeTab === 'notes'
              ? 'text-primary border-b-2 border-primary bg-gray-50 dark:bg-gray-800/50'
              : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50'
          }`}
          onClick={() => setActiveTab('notes')}
        >
          ملاحظات
        </button>
      </div>
      <div className="flex-1 flex flex-col p-4 overflow-hidden">
        {activeTab === 'content' && playlist && playlist.الفيديوهات && playlist.الفيديوهات.length > 0 ? (
          <VideoContent videos={playlist.الفيديوهات} />
        ) : activeTab === 'content' ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500">لا يوجد محتوى متاح.</p>
          </div>
        ) : null}
        {activeTab === 'notes' && <Notes />}
      </div>
    </div>
  )
}

export default PlaylistSidebar
