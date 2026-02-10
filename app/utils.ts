import type { Video } from './types'

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

export function formatDate(dateString: string): string {
  if (!dateString || dateString === '0000-00-00') return defaultLabel
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString('ar-SA', { year: 'numeric', month: 'long', day: 'numeric' })
  } catch {
    return dateString
  }
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
