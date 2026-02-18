import { getPlaylists } from '@/app/db'

export interface SelectedPlaylistParams {
  id: string
}

export function generateStaticParams(): SelectedPlaylistParams[] {
  return getPlaylists().map((pl) => ({ id: pl.id }))
}
