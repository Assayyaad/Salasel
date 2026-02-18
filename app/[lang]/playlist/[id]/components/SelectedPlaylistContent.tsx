'use client'

import type { CalculatedPlaylist, CalculatedVideo, Translations } from '@/app/types'

import React, { useState, useEffect, ReactNode } from 'react'
import ContentCard from '@/app/[lang]/playlist/[id]/components/ContentCard'
import { useProgressStore } from '@/app/store/useProgressStore'

export type SelectedPlaylistContentPlaylist = Pick<CalculatedPlaylist, 'id' | 'name'>
export type SelectedPlaylistContentVideo = Pick<CalculatedVideo, 'id' | 'title' | 'playlistId'>
export interface SelectedPlaylistContentProps {
  playlist: SelectedPlaylistContentPlaylist
  videos: Record<string, SelectedPlaylistContentVideo>
  t: Translations
}

const SelectedPlaylistContent: React.FC<SelectedPlaylistContentProps> = ({ playlist, videos, t }) => {
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
    return <div>{t.loading}</div>
  }

  if (!isClient) {
    // You can render a loading skeleton here if you want
    return null
  }

  const cards: ReactNode[] = []
  for (const id in videos) {
    if (!Object.hasOwn(videos, id)) continue

    const v = videos[id]
    cards.push(
      <ContentCard
        key={v.id}
        title={v.title}
        videoId={v.id}
        playlistId={v.playlistId}
        status={getStatus(v.id)}
        notesCount={getNotesCount(v.id)}
        onToggle={() => toggleVideoCompleted(v.playlistId, v.id)}
        t={t}
      />,
    )
  }

  return (
    <div
      dir="rtl"
      className="bg-card-light dark:bg-card-dark rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden"
    >
      <div className="bg-gray-50 dark:bg-gray-800/50 px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-bold text-text-light dark:text-text-dark">{t.playlistContents}</h2>
      </div>
      <div className="divide-y divide-gray-200 dark:divide-gray-700">{cards}</div>
    </div>
  )
}

export default SelectedPlaylistContent
