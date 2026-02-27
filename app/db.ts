import type { CalculatedPlaylist, CalculatedVideo, Playlists, Videos } from '@/app/types'

import playlists from '@/public/playlists.json'

export function getPlaylists(): Playlists {
  return playlists as Playlists
}

export function getPlaylist(id: string): CalculatedPlaylist | undefined {
  return getPlaylists()[id]
}

export async function getVideos(playlistId: string): Promise<Videos> {
  try {
    const videos = await import(`@/public/videos/${playlistId}.json`)
    return videos.default as Videos
  } catch (error) {
    console.error(`Failed to load videos for playlist ${playlistId}:`, error)
    return {}
  }
}

export async function getVideo(
  playlistId: string,
  videoId: string,
): Promise<{ playlist?: CalculatedPlaylist; video?: CalculatedVideo }> {
  const playlist = getPlaylist(playlistId)
  if (!playlist) {
    return {}
  }

  const videos = await getVideos(playlist.id)
  const video = videos[videoId]

  return { playlist, video }
}

export function searchPlaylists(playlists: Playlists, query: string): Playlists {
  if (!query.trim()) return playlists

  const normalizedQuery = query.trim().toLowerCase()
  const nameMatches: Playlists = {}
  const descriptionMatches: Playlists = {}

  for (const id in playlists) {
    if (!Object.hasOwn(playlists, id)) continue

    const pl = playlists[id]
    const name = pl.name.toLowerCase()
    const description = pl.description.toLowerCase()

    if (fieldMatchesQuery(name, normalizedQuery)) {
      nameMatches[pl.id] = pl
    } else if (fieldMatchesQuery(description, normalizedQuery)) {
      descriptionMatches[pl.id] = pl
    }
  }

  return { ...nameMatches, ...descriptionMatches }
}

function fieldMatchesQuery(field: string, query: string): boolean {
  // Direct substring match (handles prefix cases: "عبادات" inside "والعبادات")
  if (field.includes(query)) return true

  // Strip prefixes from query then check if any word in field contains the root
  const queryRoot = stripArabicPrefixes(query)
  if (queryRoot === query) return false

  return field.split(/\s+/).some((word) => stripArabicPrefixes(word) === queryRoot)
}

function stripArabicPrefixes(word: string): string {
  const prefixes = ['وال', 'بال', 'فال', 'كال', 'لل', 'ال', 'و', 'ب', 'ف', 'ك', 'ل']
  let result = word
  let changed = true
  while (changed) {
    changed = false
    for (const prefix of prefixes) {
      if (result.startsWith(prefix) && result.length > prefix.length) {
        result = result.slice(prefix.length)
        changed = true
        break
      }
    }
  }
  return result
}
