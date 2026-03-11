'use client'

import type { Videos } from '@/app/types'

import React, { useEffect, useMemo, useSyncExternalStore, useState } from 'react'
import { useTranslations } from 'next-intl'
import { useNotesStore } from '@/app/store/useNotesStore'
import { exportPlaylistSingle } from '@/app/lib/notesExport'

interface PlaylistNotesExportButtonProps {
  playlistId: string
  playlistTitle: string
}

const subscribe = () => () => {}

const PlaylistNotesExportButton: React.FC<PlaylistNotesExportButtonProps> = ({ playlistId, playlistTitle }) => {
  const t = useTranslations()
  const [isLoading, setIsLoading] = useState(false)
  const { notes, loadNotes } = useNotesStore()
  const isClient = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  )

  useEffect(() => {
    loadNotes()
  }, [loadNotes])

  const hasPlaylistNotes = useMemo(() => {
    if (!isClient) return false
    return Object.entries(notes).some(([key, videoNotes]) => key.startsWith(`${playlistId}-`) && videoNotes.length > 0)
  }, [isClient, notes, playlistId])

  const handleExport = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`/videos/${playlistId}.json`)
      if (!response.ok) throw new Error(`Failed to load video data: ${response.status}`)
      const videosData: Videos = await response.json()

      const videos = Object.entries(notes)
        .filter(([key, videoNotes]) => key.startsWith(`${playlistId}-`) && videoNotes.length > 0)
        .map(([key, videoNotes]) => {
          const vid = key.slice(playlistId.length + 1)
          const videoInfo = videosData[vid]
          return {
            id: vid,
            title: videoInfo?.title ?? vid,
            notes: videoNotes.map((n) => ({ id: n.id, timestamp: n.timestamp, content: n.content })),
          }
        })

      if (videos.length === 0) return
      exportPlaylistSingle({ id: playlistId, title: playlistTitle, videos })
    } catch (error) {
      console.error('Failed to export playlist notes:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (!isClient) return null

  return (
    <button
      onClick={handleExport}
      disabled={!hasPlaylistNotes || isLoading}
      className="inline-flex items-center gap-2 px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-gray-500 dark:bg-gray-600 hover:bg-gray-600 dark:hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none cursor-pointer"
    >
      <span className="material-icons-round">{isLoading ? 'hourglass_empty' : 'download'}</span>
      {t('notesExportPlaylist')}
    </button>
  )
}

export default PlaylistNotesExportButton
