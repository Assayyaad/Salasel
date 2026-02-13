'use client'

import type { Playlist } from '@/app/types'

import React from 'react'
import PlaylistCard from './PlaylistCard'
import { usePlaylistStore } from '@/app/store/usePlaylistStore'
import { filters } from '@/app/static'

interface PlaylistGridProps {
  playlists: Playlist[]
}

const PlaylistGrid: React.FC<PlaylistGridProps> = ({ playlists }) => {
  const { activeFilter } = usePlaylistStore()

  const filteredPlaylists = playlists.filter((pl) => {
    if (activeFilter === filters[0]) {
      return true
    }
    return pl.categories.includes(activeFilter as any)
  })

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-10">
      {filteredPlaylists.map((pl) => (
        <PlaylistCard key={pl.id} playlist={pl} />
      ))}
    </div>
  )
}

export default PlaylistGrid
