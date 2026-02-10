import type { Video } from './types'

export function videoThumbnailUrl(id: string): string {
  return `https://img.youtube.com/vi/${id}/sddefault.jpg`
}

/**
 * Load videos for a specific playlist (server-side)
 */
export async function getPlaylistVideos(playlistId: string): Promise<Video[]> {
  try {
    const videos = await import(`@/public/videos/${playlistId}.json`)
    return videos.default as Video[]
  } catch (error) {
    console.error(`Failed to load videos for playlist ${playlistId}:`, error)
    return []
  }
}

/**
 * Load videos for a specific playlist (client-side)
 */
export async function fetchPlaylistVideos(playlistId: string): Promise<Video[]> {
  try {
    const res = await fetch(`/videos/${playlistId}.json`)
    if (!res.ok) {
      throw new Error(`Failed to fetch videos: ${res.statusText}`)
    }
    return await res.json()
  } catch (error) {
    console.error(`Failed to fetch videos for playlist ${playlistId}:`, error)
    return []
  }
}
