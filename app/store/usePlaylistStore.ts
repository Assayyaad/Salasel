import { create } from 'zustand'
import { filters } from '@/app/static'

interface PlaylistState {
  // Keeping the name for now as it relates to playlist filtering
  activeFilter: string
  setActiveFilter: (filter: string) => void
}

export const usePlaylistStore = create<PlaylistState>((set) => ({
  activeFilter: filters[0],
  setActiveFilter: (filter) => set({ activeFilter: filter }),
}))
