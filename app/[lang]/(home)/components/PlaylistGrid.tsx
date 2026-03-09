'use client'

import type { CalculatedPlaylist, CalculatedProgram, LanguageCode, Categories, Classes } from '@/app/types'
import type { PlaylistCardPlaylist } from '@/app/[lang]/(home)/components/PlaylistCard'
import type { ProgramCardProgram } from '@/app/[lang]/(home)/components/ProgramCard'

import React, { ReactNode } from 'react'
import PlaylistCard from '@/app/[lang]/(home)/components/PlaylistCard'
import ProgramCard from '@/app/[lang]/(home)/components/ProgramCard'
import { usePlaylistStore } from '@/app/store/usePlaylistStore'

export type PlaylistGridPlaylist = Pick<
  CalculatedPlaylist,
  'id' | 'language' | 'type' | 'categories' | 'style' | 'classes'
>
export type PlaylistGridProgram = Pick<
  CalculatedProgram,
  'id' | 'language' | 'type' | 'categories' | 'style' | 'classes'
>

export interface PlaylistGridProps {
  playlists: Record<string, PlaylistGridPlaylist & PlaylistCardPlaylist>
  programs: Record<string, PlaylistGridProgram & ProgramCardProgram>
  lang: LanguageCode
}

const PlaylistGrid: React.FC<PlaylistGridProps> = ({ playlists, programs, lang }) => {
  const { filters } = usePlaylistStore()

  const cards: ReactNode[] = []

  // Add program cards first
  for (const id in programs) {
    if (!Object.hasOwn(programs, id)) continue

    const prog = programs[id]

    if (
      prog.language === filters.language &&
      prog.type === filters.contentType &&
      prog.categories.includes(filters.category as Categories) &&
      (filters.presentationStyle === 'all' || prog.style === filters.presentationStyle) &&
      (filters.class === 'all' || prog.classes.includes(filters.class as Classes))
    ) {
      const isPriority = cards.length < 6
      cards.push(<ProgramCard key={`program-${prog.id}`} program={prog} lang={lang} priority={isPriority} />)
    }
  }

  // Add standalone playlist cards
  for (const id in playlists) {
    if (!Object.hasOwn(playlists, id)) continue

    const pl = playlists[id]

    if (
      pl.language === filters.language &&
      pl.type === filters.contentType &&
      pl.categories.includes(filters.category as Categories) &&
      (filters.presentationStyle === 'all' || pl.style === filters.presentationStyle) &&
      (filters.class === 'all' || pl.classes.includes(filters.class as Classes))
    ) {
      const isPriority = cards.length < 6
      cards.push(<PlaylistCard key={pl.id} playlist={pl} lang={lang} priority={isPriority} />)
    }
  }

  return <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-10">{cards}</div>
}

export default PlaylistGrid
