import type { CalculatedPlaylist, CalculatedVideo, Playlists, Videos } from '@/app/types'

import playlists from '@/public/playlists.json'

export function getPlaylists(): Playlists {
  return playlists as Playlists
}

export function getPlaylist(id: string): CalculatedPlaylist | undefined {
  return getPlaylists().find((pl) => pl.id === id)
}

/**
 * Load videos for a specific playlist (server-side)
 */
export async function getVideos(playlistId: string): Promise<Videos> {
  try {
    const videos = await import(`@/public/videos/${playlistId}.json`)
    return videos.default as Videos
  } catch (error) {
    console.error(`Failed to load videos for playlist ${playlistId}:`, error)
    return []
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
  if (videos.length === 0) {
    return { playlist }
  }

  const video = videos.find((v) => v.id === videoId)

  return { playlist, video }
}

/**
 * Search playlists by title and description
 * @param playlists - Array of playlists to search
 * @param query - Search query string
 * @returns Filtered playlists (name matches first, then channel matches)
 */
export function searchPlaylists(playlists: Playlists, query: string): Playlists {
  if (!query.trim()) return playlists

  const normalizedQuery = query.trim().toLowerCase()
  const channelMatches: Playlists = []
  const nameMatches: Playlists = []
  const matchedIds = new Set<string>()

  playlists.forEach((pl) => {
    const name = pl.name.toLowerCase()
    const channel = pl.channel.toLowerCase()

    // البحث في العنوان
    if (name.includes(normalizedQuery)) {
      nameMatches.push(pl)
      matchedIds.add(pl.id)
    }
    // البحث في القناة (بدون تكرار)
    else if (channel.includes(normalizedQuery)) {
      channelMatches.push(pl)
      matchedIds.add(pl.id)
    }
  })

  return [...nameMatches, ...channelMatches]
}
