import type { SelectedPlaylistParams } from './params'

import React from 'react'
import SelectedPlaylistCard from './components/SelectedPlaylistCard'
import SelectedPlaylistContent from './components/SelectedPlaylistContent'
import PersonalProgress from './components/PersonalProgress'
import { getPlaylist } from './utils'
import { getPlaylistVideos } from '@/app/utils'
import { playlistNotFound, noVideosFound } from '@/app/static'

export { generateStaticParams } from './params'
export { generateMetadata } from './meta'

export const revalidate = 3600 // Revalidate every hour

export interface SelectedPlaylistPageProps {
  params: Promise<SelectedPlaylistParams>
}

const SelectedPlaylistPage: React.FC<SelectedPlaylistPageProps> = async ({ params }) => {
  const { id } = await params
  const playlist = await getPlaylist(id)

  if (!playlist) {
    return <div>{playlistNotFound}</div>
  }

  // Load videos for this playlist
  const videos = await getPlaylistVideos(playlist.id)
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
