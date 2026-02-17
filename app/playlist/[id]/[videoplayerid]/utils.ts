import type { CalculatedPlaylist, CalculatedVideo } from '@/app/types'

import { getPlaylistVideos } from '@/app/utils'
import playlists from '@/public/playlists.json'

export async function getPlaylist(id: string): Promise<CalculatedPlaylist | undefined> {
  return (playlists as CalculatedPlaylist[]).find((pl) => pl.id === id)
}

export async function getVideo(
  playlistId: string,
  videoId: string,
): Promise<{ playlist: CalculatedPlaylist; video: CalculatedVideo } | null> {
  const playlist = await getPlaylist(playlistId)

  if (!playlist) {
    return null
  }

  const videos = await getPlaylistVideos(playlist.id)

  if (videos.length === 0) {
    return null
  }

  const video = videos.find((v) => v.id === videoId)

  if (!video) {
    return null
  }

  return { playlist, video }
}
