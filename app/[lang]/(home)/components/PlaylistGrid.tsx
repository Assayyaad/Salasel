'use client'

import type { CalculatedPlaylist, LanguageCode, Categories, Classes } from '@/app/types'
import type { PlaylistCardPlaylist } from '@/app/[lang]/(home)/components/PlaylistCard'

import React, { ReactNode } from 'react'
import PlaylistCard from '@/app/[lang]/(home)/components/PlaylistCard'
import { usePlaylistStore } from '@/app/store/usePlaylistStore'

export type PlaylistGridPlaylist = Pick<
  CalculatedPlaylist,
  'id' | 'language' | 'type' | 'categories' | 'style' | 'classes'
>
export interface PlaylistGridProps {
  playlists: Record<string, PlaylistGridPlaylist & PlaylistCardPlaylist>
  lang: LanguageCode
}

const PlaylistGrid: React.FC<PlaylistGridProps> = ({ playlists, lang }) => {
  const { filters } = usePlaylistStore()

  const cards: ReactNode[] = []
  for (const id in playlists) {
    if (!Object.hasOwn(playlists, id)) continue

    const pl = playlists[id]

    if (
      // Language filter (mandatory)
      pl.language === filters.language &&
      // Content type filter (mandatory)
      pl.type === filters.contentType &&
      // Category filter (mandatory)
      pl.categories.includes(filters.category as Categories) &&
      // Presentation style filter (optional)
      (filters.presentationStyle === 'all' || pl.style === filters.presentationStyle) &&
      // Class filter (optional)
      (filters.class === 'all' || pl.classes.includes(filters.class as Classes))
    ) {
      // Prioritize first 6 cards for LCP optimization (first 2 rows in 3-column grid)
      const isPriority = cards.length < 6
      cards.push(<PlaylistCard key={pl.id} playlist={pl} lang={lang} priority={isPriority} />)
    }
  }

  return <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-10">{cards}</div>
}

export default PlaylistGrid
