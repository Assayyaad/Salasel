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
  const titleMatches: Playlists = {}
  const descriptionMatches: Playlists = {}

  // create obj then assign to it to preserve order (title matches first)

  for (const id in playlists) {
    if (!Object.hasOwn(playlists, id)) continue

    const pl = playlists[id]
    const name = pl.name.toLowerCase()
    const description = pl.description.toLowerCase()

    // البحث في العنوان أولاً
    if (name.includes(normalizedQuery)) {
      titleMatches[pl.id] = pl
    }
    // البحث في الوصف ثانياً (بدون تكرار)
    else if (description.includes(normalizedQuery)) {
      descriptionMatches[pl.id] = pl
    }
  }

  return { ...titleMatches, ...descriptionMatches }
}
