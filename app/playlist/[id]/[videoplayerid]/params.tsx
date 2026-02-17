import type { CalculatedPlaylist } from '@/app/types'

import { getPlaylistVideos } from '@/app/utils'
import playlists from '@/public/playlists.json'

export interface VideoPlayerParams {
  id: string
  videoplayerid: string
}

export async function generateStaticParams() {
  const params: { id: string; videoplayerid: string }[] = []

  for (const pl of playlists as CalculatedPlaylist[]) {
    const videos = await getPlaylistVideos(pl.id)
    for (const v of videos) {
      params.push({
        id: pl.id,
        videoplayerid: v.id,
      })
    }
  }

  return params
}
