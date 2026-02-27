'use client'

import type { CalculatedPlaylist, LanguageCode } from '@/app/types'
import type { PlaylistCardPlaylist } from '@/app/[lang]/(home)/components/PlaylistCard'

import React from 'react'
import PlaylistCard from '@/app/[lang]/(home)/components/PlaylistCard'
import { usePlaylistStore } from '@/app/store/usePlaylistStore'
import { sortPlaylists } from '@/app/utils'

export type PlaylistGridPlaylist = Pick<
  CalculatedPlaylist,
  | 'id'
  | 'language'
  | 'type'
  | 'categories'
  | 'style'
  | 'classes'
  | 'duration'
  | 'videoCount'
  | 'startDate'
  | 'endDate'
  | 'name'
>
export interface PlaylistGridProps {
  playlists: Record<string, PlaylistGridPlaylist & PlaylistCardPlaylist>
  lang: LanguageCode
  isSearching?: boolean
}

const PlaylistGrid: React.FC<PlaylistGridProps> = ({ playlists, lang, isSearching = false }) => {
  const { filters, sortBy } = usePlaylistStore()

  const filteredEntries = Object.entries(playlists).filter(
    ([, pl]) =>
      isSearching ||
      (pl.language === filters.language &&
        pl.type === filters.contentType &&
        pl.categories.includes(filters.category as any) &&
        (filters.presentationStyle === 'all' || pl.style === filters.presentationStyle) &&
        (filters.class === 'all' || pl.classes.includes(filters.class as any))),
  )

  const sortedEntries = sortPlaylists(filteredEntries, sortBy)

  const cards = sortedEntries.map(([, pl]) => <PlaylistCard key={pl.id} playlist={pl} lang={lang} />)

  return <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-10">{cards}</div>
}

export default PlaylistGrid
