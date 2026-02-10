import { create } from 'zustand'

export interface Note {
  id: string
  videoId: string
  playlistId: string
  timestamp: string // Format: "MM:SS" or "HH:MM:SS"
  content: string
  createdAt: number
}

interface NotesState {
  notes: Record<string, Note[]> // key: `${playlistId}-${videoId}`
  addNote: (playlistId: string, videoId: string, timestamp: string, content: string) => void
  updateNote: (noteId: string, content: string, timestamp: string) => void
  deleteNote: (noteId: string) => void
  getVideoNotes: (playlistId: string, videoId: string) => Note[]
  loadNotes: () => void
}

const STORAGE_KEY = 'salasel-video-notes'

const loadNotesFromStorage = (): Record<string, Note[]> => {
  if (typeof window === 'undefined') return {}
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : {}
  } catch (error) {
    console.error('Failed to load notes from localStorage:', error)
    return {}
  }
}

const saveNotesToStorage = (notes: Record<string, Note[]>) => {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes))
  } catch (error) {
    console.error('Failed to save notes to localStorage:', error)
  }
}

export const useNotesStore = create<NotesState>((set, get) => ({
  notes: {},

  loadNotes: () => {
    const notes = loadNotesFromStorage()
    set({ notes })
  },

  addNote: (playlistId: string, videoId: string, timestamp: string, content: string) => {
    const key = `${playlistId}-${videoId}`
    const newNote: Note = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      videoId,
      playlistId,
      timestamp,
      content,
      createdAt: Date.now(),
    }

    set((state) => {
      const videoNotes = state.notes[key] || []
      const updatedNotes = {
        ...state.notes,
        [key]: [...videoNotes, newNote].sort((a, b) => {
          // Sort by timestamp
          const timeA = timeToSeconds(a.timestamp)
          const timeB = timeToSeconds(b.timestamp)
          return timeA - timeB
        }),
      }
      saveNotesToStorage(updatedNotes)
      return { notes: updatedNotes }
    })
  },

  updateNote: (noteId: string, content: string, timestamp: string) => {
    set((state) => {
      const updatedNotes = { ...state.notes }
      for (const key in updatedNotes) {
        const noteIndex = updatedNotes[key].findIndex((n) => n.id === noteId)
        if (noteIndex !== -1) {
          updatedNotes[key][noteIndex] = {
            ...updatedNotes[key][noteIndex],
            content,
            timestamp,
          }
          // Re-sort after update
          updatedNotes[key] = updatedNotes[key].sort((a, b) => {
            const timeA = timeToSeconds(a.timestamp)
            const timeB = timeToSeconds(b.timestamp)
            return timeA - timeB
          })
          break
        }
      }
      saveNotesToStorage(updatedNotes)
      return { notes: updatedNotes }
    })
  },

  deleteNote: (noteId: string) => {
    set((state) => {
      const updatedNotes = { ...state.notes }
      for (const key in updatedNotes) {
        updatedNotes[key] = updatedNotes[key].filter((n) => n.id !== noteId)
        if (updatedNotes[key].length === 0) {
          delete updatedNotes[key]
        }
      }
      saveNotesToStorage(updatedNotes)
      return { notes: updatedNotes }
    })
  },

  getVideoNotes: (playlistId: string, videoId: string) => {
    const key = `${playlistId}-${videoId}`
    return get().notes[key] || []
  },
}))

// Helper function to convert timestamp to seconds for sorting
const timeToSeconds = (timestamp: string): number => {
  const parts = timestamp.split(':').map(Number)
  if (parts.length === 2) {
    // MM:SS
    return parts[0] * 60 + parts[1]
  } else if (parts.length === 3) {
    // HH:MM:SS
    return parts[0] * 3600 + parts[1] * 60 + parts[2]
  }
  return 0
}
