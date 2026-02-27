'use client'

import type { CalculatedVideo, Translations } from '@/app/types'

import React, { useCallback, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useNotesStore } from '@/app/store/useNotesStore'
import { useVideoPlayerStore, formatTimestamp } from '@/app/store/useVideoPlayerStore'
import NotesExportMenu from './NotesExportMenu'

export interface NotesProps {
  playlistId: string
  videoId: string
  playlistName: string
  videoTitle: string
  videos: Record<string, Pick<CalculatedVideo, 'id' | 'title'>>
  t: Translations
}

const Notes: React.FC<NotesProps> = ({ playlistId, videoId, playlistName, videoTitle, videos, t }) => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { getVideoNotes, addNote, updateNote, deleteNote, loadNotes } = useNotesStore()
  const { getCurrentTime } = useVideoPlayerStore()

  const [notes, setNotes] = useState(getVideoNotes(playlistId, videoId))
  const [newNoteContent, setNewNoteContent] = useState('')
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null)
  const [editContent, setEditContent] = useState('')
  const [editTimestamp, setEditTimestamp] = useState('')

  useEffect(() => {
    loadNotes()
  }, [loadNotes])

  useEffect(() => {
    setNotes(getVideoNotes(playlistId, videoId))
  }, [playlistId, videoId, getVideoNotes])

  // Subscribe to store changes
  useEffect(() => {
    const unsubscribe = useNotesStore.subscribe((state) => {
      setNotes(state.getVideoNotes(playlistId, videoId))
    })
    return unsubscribe
  }, [playlistId, videoId])

  const handleAddNote = () => {
    if (!newNoteContent.trim()) return

    const currentSeconds = getCurrentTime()
    const timestamp = formatTimestamp(currentSeconds)
    addNote(playlistId, videoId, timestamp, newNoteContent.trim())
    setNewNoteContent('')
  }

  const handleEditNote = (noteId: string) => {
    const note = notes.find((n) => n.id === noteId)
    if (note) {
      setEditingNoteId(noteId)
      setEditContent(note.content)
      setEditTimestamp(note.timestamp)
    }
  }

  const handleSaveEdit = () => {
    if (editingNoteId && editContent.trim()) {
      updateNote(editingNoteId, editContent.trim(), editTimestamp.trim() || '00:00')
      setEditingNoteId(null)
      setEditContent('')
      setEditTimestamp('')
    }
  }

  const handleCancelEdit = () => {
    setEditingNoteId(null)
    setEditContent('')
    setEditTimestamp('')
  }

  const handleUpdateTimestamp = () => {
    const currentSeconds = getCurrentTime()
    const timestamp = formatTimestamp(currentSeconds)
    setEditTimestamp(timestamp)
  }

  const handleDeleteNote = (noteId: string) => {
    if (confirm(t.notesDeleteConfirmation)) {
      deleteNote(noteId)
    }
  }

  const handleTimestampClick = (timestamp: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('t', timestamp)
    router.push(`?${params.toString()}`, { scroll: false })
  }

  const getAllPlaylistNotes = useCallback(() => {
    const allNotes = useNotesStore.getState().notes
    return Object.entries(allNotes)
      .filter(([key]) => key.startsWith(`${playlistId}-`))
      .map(([key, noteList]) => {
        const vid = key.replace(`${playlistId}-`, '')
        return {
          video: { id: vid, title: videos[vid]?.title ?? vid },
          notes: noteList,
        }
      })
  }, [playlistId, videos])

  return (
    <>
      <div className="mb-3">
        <NotesExportMenu
          playlist={{ id: playlistId, name: playlistName }}
          video={{ id: videoId, title: videoTitle }}
          currentVideoNotes={notes}
          getAllPlaylistNotes={getAllPlaylistNotes}
          t={t}
        />
      </div>
      <div className="mb-4">
        <textarea
          value={newNoteContent}
          onChange={(e) => setNewNoteContent(e.target.value)}
          className="w-full h-24 p-3 text-sm bg-gray-50 dark:bg-gray-900 border border-border-light dark:border-border-dark rounded-md focus:ring-1 focus:ring-primary focus:border-primary outline-none resize-none mb-2"
          placeholder={t.notesPlaceholder}
        />
        <div className="flex justify-end">
          <button
            onClick={handleAddNote}
            className="w-full flex items-center justify-center gap-2 py-2 text-sm font-medium text-white bg-gray-600 dark:bg-gray-700 border border-transparent rounded-md hover:bg-gray-700 dark:hover:bg-gray-600 transition-colors shadow-sm"
          >
            <span className="material-icons-round text-base">add</span>
            {t.notesAddButton}
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto pr-1 space-y-4">
        {notes.length === 0 ? (
          <div className="text-center text-gray-500 dark:text-gray-400 text-sm py-8">{t.notesEmptyMessage}</div>
        ) : (
          notes.map((note) => (
            <div
              key={note.id}
              className="group flex gap-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors border border-transparent hover:border-border-light dark:hover:border-border-dark"
            >
              {editingNoteId === note.id ? (
                <>
                  <div className="flex flex-col gap-1">
                    <span className="text-primary font-mono text-xs font-semibold">{editTimestamp}</span>
                    <button
                      onClick={handleUpdateTimestamp}
                      className="text-xs text-gray-500 hover:text-primary dark:text-gray-400 dark:hover:text-primary"
                      title={t.notesUpdateTimestamp}
                    >
                      <span className="material-icons-round text-sm">update</span>
                    </button>
                  </div>
                  <div className="flex-1 flex flex-col gap-2">
                    <textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      className="w-full p-2 text-sm bg-gray-50 dark:bg-gray-900 border border-border-light dark:border-border-dark rounded focus:ring-1 focus:ring-primary outline-none resize-none"
                      rows={3}
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={handleSaveEdit}
                        className="px-3 py-1 text-xs bg-primary text-white rounded hover:bg-primary/90"
                      >
                        {t.notesSaveButton}
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="px-3 py-1 text-xs bg-gray-300 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-400 dark:hover:bg-gray-600"
                      >
                        {t.notesCancelButton}
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <span
                    onClick={() => handleTimestampClick(note.timestamp)}
                    className="text-primary font-mono text-xs font-semibold mt-1 cursor-pointer hover:underline"
                  >
                    {note.timestamp}
                  </span>
                  <div className="flex-1">
                    <p
                      className="text-sm text-gray-700 dark:text-gray-300"
                      dangerouslySetInnerHTML={{ __html: note.content.replace(/\n/g, '<br>') }}
                    />
                  </div>
                  <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => handleEditNote(note.id)} className="text-gray-400 hover:text-primary">
                      <span className="material-icons-round text-sm">edit</span>
                    </button>
                    <button onClick={() => handleDeleteNote(note.id)} className="text-gray-400 hover:text-red-500">
                      <span className="material-icons-round text-sm">delete</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          ))
        )}
      </div>
    </>
  )
}

export default Notes
