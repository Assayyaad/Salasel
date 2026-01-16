import { create } from 'zustand'
import { Playlist } from '@/app/types'
import { PlaylistCardProps } from '@/app/(home)/components/PlaylistCard'

interface PlaylistState {
  // State variables
  rawPlaylists: Playlist[] // For raw data needed by player components
  cardPlaylists: PlaylistCardProps[] // For display cards
  activeFilter: string

  // Actions
  setRawPlaylists: (playlists: Playlist[]) => void
  setCardPlaylists: (playlists: PlaylistCardProps[]) => void
  setActiveFilter: (filter: string) => void
}

export const usePlaylistStore = create<PlaylistState>((set) => ({
  rawPlaylists: [],
  cardPlaylists: [],
  activeFilter: 'الكل',

  setRawPlaylists: (playlists) => set({ rawPlaylists: playlists }),
  setCardPlaylists: (playlists) => set({ cardPlaylists: playlists }),
  setActiveFilter: (filter) => set({ activeFilter: filter }),
}))
