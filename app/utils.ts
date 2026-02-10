import type { Video } from './types'

import { Classes, ContentTypes, PresentationStyles } from './types'

export function videoThumbnailUrl(id: string): string {
  return `https://img.youtube.com/vi/${id}/sddefault.jpg`
}

// Helper functions to convert enums to Arabic labels
export function getContentTypeLabel(type: ContentTypes): string {
  switch (type) {
    case ContentTypes.Educational:
      return 'تعليمي'
    case ContentTypes.Awareness:
      return 'توعوي'
    default:
      return '-'
  }
}

export function getPresentationStyleLabel(style: PresentationStyles): string {
  switch (style) {
    case PresentationStyles.Narration:
      return 'سرد'
    case PresentationStyles.Lecture:
      return 'محاضرة'
    case PresentationStyles.Podcast:
      return 'إذاعة'
    default:
      return '-'
  }
}

export function getClassLabel(classType: Classes): string {
  switch (classType) {
    case Classes.Kids:
      return 'أطفال'
    case Classes.Parents:
      return 'آباء'
    case Classes.Female:
      return 'إناث'
    default:
      return '-'
  }
}

export function formatDate(dateString: string): string {
  if (!dateString || dateString === '0000-00-00') return '-'
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
