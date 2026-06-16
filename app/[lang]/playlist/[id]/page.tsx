import type { SelectedPlaylistParams } from '@/app/[lang]/playlist/[id]/params'

import React from 'react'
import SelectedPlaylistCard from '@/app/[lang]/playlist/[id]/components/SelectedPlaylistCard'
import SelectedPlaylistContent from '@/app/[lang]/playlist/[id]/components/SelectedPlaylistContent'
import RecordVisit from '@/app/[lang]/playlist/[id]/components/RecordVisit'
import { getPlaylist, getVideos } from '@/app/db'
import { getTranslations } from '@/app/translate'

export { generateStaticParams } from '@/app/[lang]/playlist/[id]/params'
export { generateMetadata } from '@/app/[lang]/playlist/[id]/meta'

export const revalidate = 3600 // Revalidate every hour

export interface SelectedPlaylistPageProps {
  params: Promise<SelectedPlaylistParams>
}

const SelectedPlaylistPage: React.FC<SelectedPlaylistPageProps> = async ({ params }) => {
  const { lang, id } = await params
  const t = getTranslations(lang)
  const playlist = await getPlaylist(id)

  if (!playlist) {
    return <div>{t.playlistNotFound}</div>
  }

  // Load videos for this playlist
  const videos = await getVideos(playlist.id)
  if (Object.keys(videos).length === 0) {
    return <div>{t.noVideosFound}</div>
  }

  return (
    <>
      <RecordVisit playlistId={playlist.id} />
      <SelectedPlaylistCard playlist={playlist} t={t} />
      <SelectedPlaylistContent playlist={playlist} videos={videos} t={t} />
    </>
  )
}

export default SelectedPlaylistPage
