import { getPlaylists } from '@/app/db'

export interface SelectedPlaylistParams {
  id: string
}

export function generateStaticParams(): SelectedPlaylistParams[] {
  const playlists = getPlaylists()
  const params: SelectedPlaylistParams[] = []

  for (const id in playlists) {
    if (!Object.hasOwn(playlists, id)) continue
    params.push({ id })
  }

  return params
}
