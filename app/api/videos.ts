import type { CalculatedPlaylist, CalculatedVideo, Videos } from '@/app/types'
import { unstable_cache } from 'next/cache'
import { supabase } from '@/app/lib/supabase'
import { rowToVideo, type VideoRow } from '@/app/models/video'

/** Cache tag for all video data — revalidate this after content edits. */
export const VIDEOS_TAG = 'videos'

/** How long (seconds) before cached video data is considered stale. */
const VIDEOS_REVALIDATE = 60 * 60 // 1 hour

/**
 * Fetch the videos for a playlist from Supabase, cached per playlist id.
 *
 * `unstable_cache` includes the function arguments in the cache key, so each
 * playlist gets its own cache entry. Revisiting a playlist serves from cache
 * until revalidated by the time window or `revalidateTag(VIDEOS_TAG)`.
 */
export const getVideos = unstable_cache(
  async (playlistId: string): Promise<Videos> => {
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
  },
  ['videos'],
  { tags: [VIDEOS_TAG], revalidate: VIDEOS_REVALIDATE },
)

export async function getVideo(
  playlistId: string,
  videoId: string,
): Promise<{ playlist?: CalculatedPlaylist; video?: CalculatedVideo }> {
  const { getPlaylist } = await import('@/app/api/playlists')
  const [playlist, videos] = await Promise.all([getPlaylist(playlistId), getVideos(playlistId)])

  if (!playlist) return {}
  return { playlist, video: videos[videoId] }
}
