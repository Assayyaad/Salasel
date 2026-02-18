import type { SelectedPlaylistParams } from '@/app/playlist/[id]/params'

import React from 'react'
import SelectedPlaylistCard from '@/app/playlist/[id]/components/SelectedPlaylistCard'
import SelectedPlaylistContent from '@/app/playlist/[id]/components/SelectedPlaylistContent'
import PersonalProgress from '@/app/playlist/[id]/components/PersonalProgress'
import { getPlaylist, getVideos } from '@/app/db'
import { playlistNotFound, noVideosFound } from '@/app/static'

export { generateStaticParams } from '@/app/playlist/[id]/params'
export { generateMetadata } from '@/app/playlist/[id]/meta'

export const revalidate = 3600 // Revalidate every hour

export interface SelectedPlaylistPageProps {
  params: Promise<SelectedPlaylistParams>
}

const SelectedPlaylistPage: React.FC<SelectedPlaylistPageProps> = async ({ params }) => {
  const { id } = await params
  const playlist = getPlaylist(id)

  if (!playlist) {
    return <div>{playlistNotFound}</div>
  }

  // Load videos for this playlist
  const videos = await getVideos(playlist.id)
  if (videos.length === 0) {
    return <div>{noVideosFound}</div>
  }

  return (
    <>
      <SelectedPlaylistCard playlist={playlist} />
      <PersonalProgress playlist={playlist} videos={videos} />
      <SelectedPlaylistContent playlist={playlist} videos={videos} />
    </>
  )
}

export default SelectedPlaylistPage
