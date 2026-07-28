import type { CalculatedVideo } from '@/app/types'

/** Raw row shape returned by Supabase (snake_case) */
export interface VideoRow {
  id: string
  playlist_id: string
  title: string
  duration: number
  uploaded_at: number
  position: number
}

export function rowToVideo(row: VideoRow): CalculatedVideo {
  return {
    id: row.id,
    playlistId: row.playlist_id,
    title: row.title,
    duration: row.duration,
    uploadedAt: row.uploaded_at,
    position: row.position,
  }
}
