import type { CalculatedPlaylist, Playlists } from '@/app/types'
import { supabase } from '@/app/lib/supabase'
import { rowToPlaylist, type PlaylistRow } from '@/app/models/playlist'

export async function getPlaylists(): Promise<Playlists> {
  const { data, error } = await supabase.from('playlists').select('*').order('id')

  if (error) {
    console.error('getPlaylists error:', error.message)
    return {}
  }

  const result: Playlists = {}
  for (const row of data as PlaylistRow[]) {
    result[row.id] = rowToPlaylist(row)
  }
  return result
}

export async function getPlaylist(id: string): Promise<CalculatedPlaylist | undefined> {
  const { data, error } = await supabase.from('playlists').select('*').eq('id', id).single()

  if (error || !data) return undefined
  return rowToPlaylist(data as PlaylistRow)
}

export function searchPlaylists(playlists: Playlists, query: string): Playlists {
  if (!query.trim()) return playlists

  const normalizedQuery = query.trim().toLowerCase()
  const matches: Playlists = {}

  for (const id in playlists) {
    if (!Object.hasOwn(playlists, id)) continue
    const pl = playlists[id]
    if (pl.name.toLowerCase().includes(normalizedQuery)) {
      matches[pl.id] = pl
    }
  }

  return matches
}
