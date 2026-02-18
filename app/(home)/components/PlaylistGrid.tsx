'use client'

import type { CalculatedPlaylist } from '@/app/types'
import type { PlaylistCardPlaylist } from '@/app/(home)/components/PlaylistCard'

import React from 'react'
import PlaylistCard from '@/app/(home)/components/PlaylistCard'
import { usePlaylistStore } from '@/app/store/usePlaylistStore'

export type PlaylistGridPlaylist = Pick<
  CalculatedPlaylist,
  'id' | 'language' | 'type' | 'categories' | 'style' | 'classes'
>
export interface PlaylistGridProps {
  playlists: (PlaylistGridPlaylist & PlaylistCardPlaylist)[]
}

const PlaylistGrid: React.FC<PlaylistGridProps> = ({ playlists }) => {
  const { filters } = usePlaylistStore()

  const filteredPlaylists = playlists.filter((pl) => {
    // Language filter (mandatory)
    if (pl.language !== filters.language) {
      return false
    }

    // Content type filter (mandatory)
    if (pl.type !== filters.contentType) {
      return false
    }

    // Category filter (mandatory)
    if (!pl.categories.includes(filters.category as any)) {
      return false
    }

    // Presentation style filter (optional)
    if (filters.presentationStyle !== 'all' && pl.style !== filters.presentationStyle) {
      return false
    }

    // Class filter (optional)
    if (filters.class !== 'all' && !pl.classes.includes(filters.class as any)) {
      return false
    }

    return true
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
