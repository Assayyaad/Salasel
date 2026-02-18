import { getPlaylists, getVideos } from '@/app/db'

export interface VideoPlayerParams {
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
      params.push({ id: plId, videoplayerid: vId })
    }
  }

  return params
}
