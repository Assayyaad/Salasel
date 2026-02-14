import type { CalculatedPlaylist, CalculatedVideo } from './types'

import { Classes, ContentTypes, PresentationStyles } from './types'
import {
  contentTypeEducational,
  contentTypeAwareness,
  presentationStyleNarration,
  presentationStyleLecture,
  presentationStylePodcast,
  classKids,
  classParents,
  classFemale,
  defaultLabel,
} from './static'

export function videoThumbnailUrl(id: string): string {
  return `https://img.youtube.com/vi/${id}/sddefault.jpg`
}

export function fallbackThumbnailUrl(id: string): string {
  return `https://i.ytimg.com/vi/${id}/hqdefault.jpg`
}

// Helper functions to convert enums to Arabic labels
export function getContentTypeLabel(type: ContentTypes): string {
  switch (type) {
    case ContentTypes.Educational:
      return contentTypeEducational
    case ContentTypes.Awareness:
      return contentTypeAwareness
    default:
      return defaultLabel
  }
}

export function getPresentationStyleLabel(style: PresentationStyles): string {
  switch (style) {
    case PresentationStyles.Narration:
      return presentationStyleNarration
    case PresentationStyles.Lecture:
      return presentationStyleLecture
    case PresentationStyles.Podcast:
      return presentationStylePodcast
    default:
      return defaultLabel
  }
}

export function getClassLabel(classType: Classes): string {
  switch (classType) {
    case Classes.Kids:
      return classKids
    case Classes.Parents:
      return classParents
    case Classes.Female:
      return classFemale
    default:
      return defaultLabel
  }
}

export function formatTime(seconds: number): string {
  if (seconds <= 0) {
    return defaultLabel
  }

  const hrs = Math.floor(seconds / 3600)
  const mins = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60

  return `${pad(hrs)}:${pad(mins)}:${pad(secs)}`

  function pad(num: number): string {
    return String(num).padStart(2, '0')
  }
}

export function formatDate(seconds: number): string {
  if (seconds <= 0) {
    return defaultLabel
  }

  try {
    const date = new Date(seconds * 1000)
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }
    const hijriStr = Intl.DateTimeFormat('ar-SA-u-ca-islamic', options).format(date)
    return hijriStr
  } catch {
    return defaultLabel
  }
}

/**
 * Load videos for a specific playlist (server-side)
 */
export async function getPlaylistVideos(playlistId: string): Promise<CalculatedVideo[]> {
  try {
    const videos = await import(`@/public/videos/${playlistId}.json`)
    return videos.default as CalculatedVideo[]
  } catch (error) {
    console.error(`Failed to load videos for playlist ${playlistId}:`, error)
    return []
  }
}

/**
 * Load videos for a specific playlist (client-side)
 */
export async function fetchPlaylistVideos(playlistId: string): Promise<CalculatedVideo[]> {
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

/**
 * Search playlists by title and description
 * @param playlists - Array of playlists to search
 * @param query - Search query string
 * @returns Filtered playlists (name matches first, then channel matches)
 */
export function searchPlaylists(playlists: CalculatedPlaylist[], query: string): CalculatedPlaylist[] {
  if (!query.trim()) return playlists

  const normalizedQuery = query.trim().toLowerCase()
  const channelMatches: CalculatedPlaylist[] = []
  const nameMatches: CalculatedPlaylist[] = []
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
