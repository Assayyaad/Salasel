import type { CalculatedPlaylist } from '@/app/types'

import playlists from '@/public/playlists.json'

export interface SelectedPlaylistParams {
  id: string
}

export async function generateStaticParams() {
  return (playlists as CalculatedPlaylist[]).map((pl) => ({
    id: pl.id,
  }))
}
