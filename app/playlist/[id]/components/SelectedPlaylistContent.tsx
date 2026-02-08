'use client'
// app/playlist/[id]/components/SelectedPlaylistContent.tsx
import ContentCard from './ContentCard'
import { Playlist } from '@/app/types'
import { useProgressStore } from '@/app/store/useProgressStore'
import React, { useState, useEffect } from 'react'

interface SelectedPlaylistContentProps {
  playlist: Playlist
}

const SelectedPlaylistContent: React.FC<SelectedPlaylistContentProps> = ({ playlist }) => {
  const { completedVideos, videoProgress, notes, toggleVideoCompleted } = useProgressStore()
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  const getStatus = (videoId: string): any => {
    if (!isClient) return 'not-started'
    const isCompleted = completedVideos[playlist.id]?.has(videoId)
    if (isCompleted) {
      return 'completed'
    }
    if (videoProgress[videoId] > 0) {
      return 'in-progress'
    }
    return 'not-started'
  }

  const getNotesCount = (videoId: string): number => {
    if (!isClient) return 0
    return notes[videoId]?.length || 0
  }

  if (!playlist) {
    return <div>Loading...</div>
  }

  if (!isClient) {
    // You can render a loading skeleton here if you want
    return null
  }

  return (
    <div
      dir="rtl"
      className="bg-card-light dark:bg-card-dark rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden"
    >
      <div className="bg-gray-50 dark:bg-gray-800/50 px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-bold text-text-light dark:text-text-dark">محتويات السلسلة</h2>
      </div>
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {playlist.videos.map((video) => (
          <ContentCard
            key={video.id}
            title={video.title}
            videoId={video.id}
            playlistId={playlist.id}
            status={getStatus(video.id)}
            notesCount={getNotesCount(video.id)}
            onToggle={() => toggleVideoCompleted(playlist.id, video.id)}
          />
        ))}
      </div>
    </div>
  )
}

export default SelectedPlaylistContent
