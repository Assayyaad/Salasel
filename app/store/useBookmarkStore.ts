import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export interface BookmarkState {
  bookmarkedPlaylists: Set<string>
  toggleBookmark: (playlistId: string) => void
  isBookmarked: (playlistId: string) => boolean
}

export const useBookmarkStore = create<BookmarkState>()(
  persist(
    (set, get) => ({
      bookmarkedPlaylists: new Set(),
      toggleBookmark: (playlistId) =>
        set((state) => {
          const next = new Set(state.bookmarkedPlaylists)
          if (next.has(playlistId)) {
            next.delete(playlistId)
          } else {
            next.add(playlistId)
          }
          return { bookmarkedPlaylists: next }
        }),
      isBookmarked: (playlistId) => get().bookmarkedPlaylists.has(playlistId),
    }),
    {
      name: 'bookmark-storage',
      storage: createJSONStorage(() => localStorage, {
        replacer: (key, value) => {
          if (key === 'bookmarkedPlaylists') {
            return Array.from(value as Set<string>)
          }
          return value
        },
        reviver: (key, value) => {
          if (key === 'bookmarkedPlaylists') {
            return new Set(value as string[])
          }
          return value
        },
      }),
    },
  ),
)
