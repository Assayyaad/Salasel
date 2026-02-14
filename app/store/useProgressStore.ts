import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

interface Note {
  content: string
  timestamp: number
}

interface ProgressState {
  completedVideos: Record<string, Set<string>> // playlistId -> Set<videoId>
  notes: Record<string, Note[]> // videoId -> array of notes
  videoProgress: Record<string, number> // videoId -> progress percentage
  videoTimestamps: Record<string, number> // videoId -> timestamp in seconds
  toggleVideoCompleted: (playlistId: string, videoId: string) => void
  setVideoProgress: (videoId: string, progress: number) => void
  setVideoTimestamp: (videoId: string, timestamp: number) => void
  addNote: (videoId: string, note: Note) => void
  removeNote: (videoId: string, timestamp: number) => void
}

export const useProgressStore = create<ProgressState>()(
  persist(
    (set) => ({
      completedVideos: {},
      notes: {},
      videoProgress: {},
      videoTimestamps: {},
      toggleVideoCompleted: (playlistId, videoId) =>
        set((state) => {
          const playlistCompleted = new Set(state.completedVideos[playlistId] || [])
          if (playlistCompleted.has(videoId)) {
            playlistCompleted.delete(videoId)
          } else {
            playlistCompleted.add(videoId)
          }
          return {
            completedVideos: {
              ...state.completedVideos,
              [playlistId]: playlistCompleted,
            },
          }
        }),
      setVideoProgress: (videoId, progress) =>
        set((state) => ({
          videoProgress: {
            ...state.videoProgress,
            [videoId]: progress,
          },
        })),
      setVideoTimestamp: (videoId, timestamp) =>
        set((state) => ({
          videoTimestamps: {
            ...state.videoTimestamps,
            [videoId]: timestamp,
          },
        })),
      addNote: (videoId, note) =>
        set((state) => ({
          notes: {
            ...state.notes,
            [videoId]: [...(state.notes[videoId] || []), note],
          },
        })),
      removeNote: (videoId, timestamp) =>
        set((state) => ({
          notes: {
            ...state.notes,
            [videoId]: state.notes[videoId].filter((note) => note.timestamp !== timestamp),
          },
        })),
    }),
    {
      name: 'progress-storage',
      storage: createJSONStorage(() => localStorage, {
        replacer: (key, value) => {
          if (key === 'completedVideos') {
            return Object.fromEntries(
              Object.entries(value as Record<string, Set<string>>).map(([playlistId, videoSet]) => [
                playlistId,
                Array.from(videoSet as Set<string>),
              ]),
            )
          }
          return value
        },
        reviver: (key, value) => {
          if (key === 'completedVideos') {
            const newCompletedVideos: Record<string, Set<string>> = {}
            for (const playlistId in value as Record<string, string[]>) {
              if (Array.isArray((value as Record<string, string[]>)[playlistId])) {
                newCompletedVideos[playlistId] = new Set((value as Record<string, string[]>)[playlistId])
              }
            }
            return newCompletedVideos
          }
          return value
        },
      }),
    },
  ),
)
