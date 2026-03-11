'use client'

import type { Translations, Videos } from '@/app/types'

import React, { useEffect, useRef, useState } from 'react'
import { useNotesStore } from '@/app/store/useNotesStore'
import { exportSingleVideo, exportPlaylistSingle, exportPlaylistZip } from '@/app/lib/notesExport'

export interface NotesExportMenuProps {
  playlistId: string
  playlistTitle: string
  videoId: string
  videoTitle: string
  t: Translations
}

const NotesExportMenu: React.FC<NotesExportMenuProps> = ({ playlistId, playlistTitle, videoId, videoTitle, t }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const { notes } = useNotesStore()

  const currentVideoNotes = (notes[`${playlistId}-${videoId}`] || []).map((n) => ({
    id: n.id,
    timestamp: n.timestamp,
    content: n.content,
  }))

  // Close the menu when clicking outside
  useEffect(() => {
    if (!isOpen) return
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen])

  // Close the menu on Escape key
  useEffect(() => {
    if (!isOpen) return
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false)
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen])

  const getPlaylistVideosWithNotes = async () => {
    const response = await fetch(`/videos/${playlistId}.json`)
    if (!response.ok) throw new Error(`Failed to load video data: ${response.status}`)
    const videosData: Videos = await response.json()

    return Object.entries(notes)
      .filter(([key, videoNotes]) => key.startsWith(`${playlistId}-`) && videoNotes.length > 0)
      .map(([key, videoNotes]) => {
        const vid = key.slice(playlistId.length + 1)
        const videoInfo = videosData[vid]
        return {
          id: vid,
          title: videoInfo?.title ?? vid,
          notes: videoNotes.map((n) => ({
            id: n.id,
            timestamp: n.timestamp,
            content: n.content,
          })),
        }
      })
  }

  const handleExportSingle = () => {
    if (currentVideoNotes.length === 0) return
    exportSingleVideo(playlistId, playlistTitle, { id: videoId, title: videoTitle, notes: currentVideoNotes })
    setIsOpen(false)
  }

  const handleExportPlaylistSingle = async () => {
    setIsLoading(true)
    try {
      const videos = await getPlaylistVideosWithNotes()
      if (videos.length === 0) return
      exportPlaylistSingle({ id: playlistId, title: playlistTitle, videos })
    } catch (error) {
      console.error('Failed to export playlist notes:', error)
    } finally {
      setIsLoading(false)
      setIsOpen(false)
    }
  }

  const handleExportPlaylistZip = async () => {
    setIsLoading(true)
    try {
      const videos = await getPlaylistVideosWithNotes()
      if (videos.length === 0) return
      await exportPlaylistZip({ id: playlistId, title: playlistTitle, videos })
    } catch (error) {
      console.error('Failed to export playlist notes as zip:', error)
    } finally {
      setIsLoading(false)
      setIsOpen(false)
    }
  }

  const menuId = `notes-export-menu-${videoId}`

  return (
    <div className="relative flex-1" ref={containerRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isLoading}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-controls={menuId}
        className="w-full flex items-center justify-center gap-2 py-2 text-sm font-medium text-white bg-gray-500 dark:bg-gray-600 border border-transparent rounded-md hover:bg-gray-600 dark:hover:bg-gray-500 transition-colors shadow-sm disabled:opacity-50"
      >
        <span className="material-icons-round text-base">{isLoading ? 'hourglass_empty' : 'download'}</span>
        {t.notesExport}
      </button>

      {isOpen && (
        <div
          id={menuId}
          role="menu"
          className="absolute top-full mt-1 start-0 end-0 bg-white dark:bg-gray-800 border border-border-light dark:border-border-dark rounded-md shadow-lg z-50 overflow-hidden text-sm"
        >
          <button
            role="menuitem"
            onClick={handleExportSingle}
            disabled={currentVideoNotes.length === 0 || isLoading}
            className="w-full px-3 py-2 text-start text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {t.notesExportSingleVideo}
          </button>
          <button
            role="menuitem"
            onClick={handleExportPlaylistSingle}
            disabled={isLoading}
            className="w-full px-3 py-2 text-start text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 border-t border-border-light dark:border-border-dark disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {t.notesExportPlaylistSingle}
          </button>
          <button
            role="menuitem"
            onClick={handleExportPlaylistZip}
            disabled={isLoading}
            className="w-full px-3 py-2 text-start text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 border-t border-border-light dark:border-border-dark disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {t.notesExportPlaylistZip}
          </button>
        </div>
      )}
    </div>
  )
}

export default NotesExportMenu
