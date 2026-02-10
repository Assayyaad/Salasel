import type { Playlist } from '@/app/types'

import React from 'react'
import SelectedPlaylistCard from './components/SelectedPlaylistCard'
import SelectedPlaylistContent from './components/SelectedPlaylistContent'
import PersonalProgress from './components/PersonalProgress'
import { getPlaylistVideos } from '@/app/utils'
import playlists from '@/public/playlists.json'
import { playlistNotFound, noVideosFound } from '@/app/static'

export const revalidate = 3600 // Revalidate every hour

export async function generateStaticParams() {
  return (playlists as Playlist[]).map((pl) => ({
    id: pl.id,
  }))
}

async function getPlaylist(id: string): Promise<Playlist | undefined> {
  return (playlists as Playlist[]).find((pl) => pl.id === id)
}

export interface SelectedPlaylistPageProps {
  params: Promise<{ id: string }>
}

const SelectedPlaylistPage: React.FC<SelectedPlaylistPageProps> = async ({ params: paramsPromise }) => {
  const params = await paramsPromise
  const playlist = await getPlaylist(params.id)

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
