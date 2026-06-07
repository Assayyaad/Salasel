import type { CalculatedPlaylist, CalculatedVideo, Translations } from '@/app/types'

import React, { ReactNode } from 'react'
import ContentCard from '@/app/[lang]/playlist/[id]/components/ContentCard'

export type SelectedPlaylistContentPlaylist = Pick<CalculatedPlaylist, 'id' | 'name'>
export type SelectedPlaylistContentVideo = Pick<CalculatedVideo, 'id' | 'title' | 'playlistId'>
export interface SelectedPlaylistContentProps {
  playlist: SelectedPlaylistContentPlaylist
  videos: Record<string, SelectedPlaylistContentVideo>
  t: Translations
}

const SelectedPlaylistContent: React.FC<SelectedPlaylistContentProps> = ({ playlist, videos, t }) => {
  if (!playlist) {
    return <div>{t.loading}</div>
  }

  const cards: ReactNode[] = []
  for (const id in videos) {
    if (!Object.hasOwn(videos, id)) continue

    const v = videos[id]
    // Prioritize first 4 videos for LCP optimization (above the fold)
    const isPriority = cards.length < 4
    cards.push(
      <ContentCard key={v.id} title={v.title} videoId={v.id} playlistId={v.playlistId} t={t} priority={isPriority} />,
    )
  }

  return (
    <div className="bg-card-light dark:bg-card-dark rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="bg-gray-50 dark:bg-gray-800/50 px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-bold text-text-light dark:text-text-dark">{t.playlistContents}</h2>
      </div>
      <div className="divide-y divide-gray-200 dark:divide-gray-700">{cards}</div>
    </div>
  )
}

export default SelectedPlaylistContent
