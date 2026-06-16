import type { CalculatedPlaylist, CalculatedVideo, Videos } from '@/app/types'
import { supabase } from '@/app/lib/supabase'
import { rowToVideo, type VideoRow } from '@/app/models/video'

export async function getVideos(playlistId: string): Promise<Videos> {
  const { data, error } = await supabase.from('videos').select('*').eq('playlist_id', playlistId).order('uploaded_at')

  if (error) {
    console.error(`getVideos error (${playlistId}):`, error.message)
    return {}
  }

  const result: Videos = {}
  for (const row of data as VideoRow[]) {
    result[row.id] = rowToVideo(row)
  }
  return result
}

export async function getVideo(
  playlistId: string,
  videoId: string,
): Promise<{ playlist?: CalculatedPlaylist; video?: CalculatedVideo }> {
  const { getPlaylist } = await import('@/app/api/playlists')
  const [playlist, videos] = await Promise.all([getPlaylist(playlistId), getVideos(playlistId)])

  if (!playlist) return {}
  return { playlist, video: videos[videoId] }
}
