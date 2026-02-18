import { getPlaylists, getVideos } from '@/app/db'

export interface VideoPlayerParams {
  id: string
  videoplayerid: string
}

export async function generateStaticParams(): Promise<VideoPlayerParams[]> {
  const params: VideoPlayerParams[] = []

  for (const pl of getPlaylists()) {
    const videos = await getVideos(pl.id)
    for (const v of videos) {
      params.push({
        id: pl.id,
        videoplayerid: v.id,
      })
    }
  }

  return params
}
