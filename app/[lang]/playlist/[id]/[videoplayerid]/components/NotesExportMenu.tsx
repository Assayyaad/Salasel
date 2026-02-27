'use client'

import type { Translations } from '@/app/types'
import type { Note } from '@/app/store/useNotesStore'
import type { CalculatedPlaylist, CalculatedVideo } from '@/app/types'

import React, { useState, useRef, useEffect } from 'react'
import { exportSingleVideoNotes, exportPlaylistNotesSingleFile, exportPlaylistNotesZip } from '@/app/lib/notesExport'

export interface NotesExportMenuProps {
  playlist: Pick<CalculatedPlaylist, 'id' | 'name'>
  video: Pick<CalculatedVideo, 'id' | 'title'>
  currentVideoNotes: Note[]
  getAllPlaylistNotes: () => { video: Pick<CalculatedVideo, 'id' | 'title'>; notes: Note[] }[]
  t: Translations
}

const NotesExportMenu: React.FC<NotesExportMenuProps> = ({
  playlist,
  video,
  currentVideoNotes,
  getAllPlaylistNotes,
  t,
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const buttonClass = 'w-full px-4 py-3 text-sm text-start hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors'

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen((v) => !v)}
        className="flex items-center gap-2 px-3 py-1.5 text-sm text-slate-400 hover:text-white border border-slate-600 rounded-md transition-colors"
      >
        <span className="material-icons-round text-base">download</span>
        {t.notesExport}
      </button>

      {isOpen && (
        <div className="absolute start-0 mt-1 w-72 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-10">
          <button
            className={buttonClass}
            onClick={() => {
              exportSingleVideoNotes(playlist, video, currentVideoNotes)
              setIsOpen(false)
            }}
          >
            {t.notesExportSingleVideo}
          </button>
          <button
            className={`${buttonClass} border-t border-gray-200 dark:border-gray-700`}
            onClick={() => {
              exportPlaylistNotesSingleFile(playlist, getAllPlaylistNotes())
              setIsOpen(false)
            }}
          >
            {t.notesExportPlaylistSingle}
          </button>
          <button
            className={`${buttonClass} border-t border-gray-200 dark:border-gray-700`}
            onClick={async () => {
              await exportPlaylistNotesZip(playlist, getAllPlaylistNotes())
              setIsOpen(false)
            }}
          >
            {t.notesExportPlaylistZip}
          </button>
        </div>
      )}
    </div>
  )
}

export default NotesExportMenu
