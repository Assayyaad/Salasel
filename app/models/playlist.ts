import type { CalculatedPlaylist } from '@/app/types'

/** Raw row shape returned by Supabase (snake_case) */
export interface PlaylistRow {
  id: string
  name: string
  thumbnail_id: string
  description: string
  participants: string[]
  language: string
  type: number
  style: number
  categories: number[]
  classes: number[]
  video_count: number
  duration: number
  start_date: number
  end_date: number
}

export function rowToPlaylist(row: PlaylistRow): CalculatedPlaylist {
  return {
    id: row.id,
    name: row.name,
    thumbnailId: row.thumbnail_id,
    description: row.description,
    participants: row.participants ?? [],
    language: row.language as CalculatedPlaylist['language'],
    type: row.type as CalculatedPlaylist['type'],
    style: row.style as CalculatedPlaylist['style'],
    categories: (row.categories ?? []) as CalculatedPlaylist['categories'],
    classes: (row.classes ?? []) as CalculatedPlaylist['classes'],
    videoCount: row.video_count,
    duration: row.duration,
    startDate: row.start_date,
    endDate: row.end_date,
  }
}
