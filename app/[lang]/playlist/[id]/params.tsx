import { getPlaylists } from '@/app/db'
import { allLanguages } from '@/app/static'

export interface SelectedPlaylistParams {
  lang: string
  id: string
}

export async function generateStaticParams(): Promise<SelectedPlaylistParams[]> {
  const playlists = await getPlaylists()
  const params: SelectedPlaylistParams[] = []

  for (const id in playlists) {
    if (!Object.hasOwn(playlists, id)) continue

    // Generate params for each language
    for (const l of allLanguages) {
      params.push({ lang: l.code, id })
    }
  }

  return params
}
