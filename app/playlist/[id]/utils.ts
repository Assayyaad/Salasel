import type { CalculatedPlaylist } from '@/app/types'

import playlists from '@/public/playlists.json'

export async function getPlaylist(id: string): Promise<CalculatedPlaylist | undefined> {
  return (playlists as CalculatedPlaylist[]).find((pl) => pl.id === id)
}
