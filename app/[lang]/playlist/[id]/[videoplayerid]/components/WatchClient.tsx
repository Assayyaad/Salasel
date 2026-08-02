'use client'

import type { Translations } from '@/app/types'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { useProgressStore } from '@/app/store/useProgressStore'
import { usePreferencesStore } from '@/app/store/usePreferencesStore'
import WatchPlayer from '@/app/[lang]/playlist/[id]/[videoplayerid]/components/WatchPlayer'
import WatchNotes from '@/app/[lang]/playlist/[id]/[videoplayerid]/components/WatchNotes'

export interface WatchClientPlaylist {
  id: string
  name: string
}
export interface WatchClientVideo {
  id: string
  title: string
}
export interface WatchClientProps {
  playlist: WatchClientPlaylist
  video: WatchClientVideo
  t: Translations
}

const WatchClient: React.FC<WatchClientProps> = ({ playlist, video, t }) => {
  const lang = t.__language.code
  const notesSide = usePreferencesStore((s) => s.notesSide)
  const recordLastWatched = useProgressStore((s) => s.recordLastWatched)

  // Avoid hydration mismatch: the persisted side preference is only known client-side.
  const [isClient, setIsClient] = useState(false)
  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    recordLastWatched(playlist.id, video.id, playlist.name)
  }, [playlist.id, playlist.name, video.id, recordLastWatched])

  // 'end' = notes on the trailing side (right in LTR, left in RTL) → player first in DOM order.
  const notesFirst = isClient && notesSide === 'start'

  const player = (
    <div className="lg:col-span-2">
      <WatchPlayer videoId={video.id} playlistId={playlist.id} title={video.title} t={t} />
      <h1 className="mt-4 text-xl font-bold text-white">{video.title}</h1>
      <Link
        href={`/${lang}/playlist/${playlist.id}`}
        className="mt-2 inline-flex items-center text-sm font-medium text-primary hover:underline"
      >
        {playlist.name}
      </Link>
    </div>
  )

  const notes = (
    <div className="lg:col-span-1 lg:min-h-0">
      <WatchNotes videoId={video.id} playlistId={playlist.id} t={t} />
    </div>
  )

  return (
    <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-16">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        {notesFirst ? (
          <>
            {notes}
            {player}
          </>
        ) : (
          <>
            {player}
            {notes}
          </>
        )}
      </div>
    </main>
  )
}

export default WatchClient
