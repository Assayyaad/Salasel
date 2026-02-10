'use client'

import type { Playlist } from '@/app/types'

import React from 'react'
import FilterGrid from './FilterGrid'
import PlaylistCard from './PlaylistCard'
import { usePlaylistStore } from '@/app/store/usePlaylistStore'
import { filters } from '@/app/static'

interface PlaylistGridProps {
  playlists: Playlist[]
}

const PlaylistGrid: React.FC<PlaylistGridProps> = ({ playlists }) => {
  const { activeFilter } = usePlaylistStore()

  const filteredPlaylists = playlists.filter((playlist) => {
    if (activeFilter === filters[0]) {
      return true
    }
    return playlist.categories.includes(activeFilter as any)
  })

  return (
    <>
      <FilterGrid />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-10">
        {filteredPlaylists.map((playlist) => (
          <PlaylistCard key={playlist.id} playlist={playlist} />
        ))}
      </div>
    </>
  )
}

export default PlaylistGrid
