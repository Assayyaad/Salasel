import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export interface LastWatched {
  playlistId: string // YouTube playlist id (the ?list= value) of the opened video
  videoId: string // YouTube video id (the ?v= value) the user just opened
  updatedAt: number // epoch milliseconds when the user opened it
}

export interface ProgressState {
  completedVideos: Record<string, Set<string>> // playlistId -> Set<videoId>
  recentPlaylists: string[] // ordered by most recent, capped at 10
  lastWatched: LastWatched | null // most recent video the user opened inside a playlist
  toggleVideoCompleted: (playlistId: string, videoId: string) => void
  recordPlaylistVisit: (playlistId: string) => void
  recordLastWatched: (playlistId: string, videoId: string) => void
}

export const useProgressStore = create<ProgressState>()(
  persist(
    (set) => ({
      completedVideos: {},
      recentPlaylists: [],
      lastWatched: null,
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
      recordPlaylistVisit: (playlistId) =>
        set((state) => {
          const filtered = state.recentPlaylists.filter((id) => id !== playlistId)
          return { recentPlaylists: [playlistId, ...filtered].slice(0, 10) }
        }),
      recordLastWatched: (playlistId, videoId) =>
        set(() => ({
          lastWatched: { playlistId, videoId, updatedAt: Date.now() },
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
