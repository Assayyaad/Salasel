'use client'

import React from 'react'
import { usePlaylistStore } from '@/app/store/usePlaylistStore'
import FilterGrid from './FilterGrid'
import PlaylistCard from './PlaylistCard'

const PlaylistGrid: React.FC = () => {
  // This component now gets all its data directly from the client-side store
  const { activeFilter, cardPlaylists } = usePlaylistStore()

  const filteredPlaylists = cardPlaylists.filter((playlistCard) => {
    if (activeFilter === 'الكل') {
      return true
    }
    // The 'tags' property exists on the 'PlaylistCardProps' type in the store
    return playlistCard.tags.includes(activeFilter)
  })

  return (
    <>
      <FilterGrid />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-10">
        {filteredPlaylists.map((playlist) => (
          <PlaylistCard key={playlist.playlistId} {...playlist} />
        ))}
      </div>
    </>
  )
}

export default PlaylistGrid
