import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export interface ProgressState {
  completedVideos: Record<string, Set<string>> // playlistId -> Set<videoId>
  toggleVideoCompleted: (playlistId: string, videoId: string) => void
}

export const useProgressStore = create<ProgressState>()(
  persist(
    (set) => ({
      completedVideos: {},
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
