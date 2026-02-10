import type { Playlist } from '@/app/types'

import React from 'react'
import SelectedPlaylistCard from './components/SelectedPlaylistCard'
import SelectedPlaylistContent from './components/SelectedPlaylistContent'
import PersonalProgress from './components/PersonalProgress'
import playlists from '@/public/playlists.json'

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
    return <div>Playlist not found</div>
  }

  // You might want a more graceful handling if no videos are present,
  // but for now, we'll return a message.
  const firstVideoId = playlist.videos?.[0]?.id
  if (!firstVideoId) {
    return <div>No videos found in this playlist.</div>
  }

  return (
    <>
      <SelectedPlaylistCard playlist={playlist} />
      <PersonalProgress playlist={playlist} />
      <SelectedPlaylistContent playlist={playlist} />
    </>
  )
}

export default SelectedPlaylistPage
