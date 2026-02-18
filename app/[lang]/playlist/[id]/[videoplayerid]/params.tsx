import { getPlaylists, getVideos } from '@/app/db'
import { allLanguages } from '@/app/static'

export interface VideoPlayerParams {
  lang: string
  id: string
  videoplayerid: string
}

export async function generateStaticParams(): Promise<VideoPlayerParams[]> {
  const playlists = getPlaylists()
  const params: VideoPlayerParams[] = []

  for (const plId in playlists) {
    if (!Object.hasOwn(playlists, plId)) continue

    const videos = await getVideos(plId)

    for (const vId in videos) {
      if (!Object.hasOwn(videos, vId)) continue

      // Generate params for each language
      for (const l of allLanguages) {
        params.push({ lang: l.code, id: plId, videoplayerid: vId })
      }
    }
  }

  return params
}
