import { Classes, ContentTypes, PresentationStyles } from '@/app/types'
import {
  contentTypeEducational,
  contentTypeAwareness,
  contentTypePurification,
  presentationStyleNarration,
  presentationStyleLecture,
  presentationStylePodcast,
  presentationStyleStory,
  classKids,
  classFemale,
  classMarried,
  classParents,
  defaultLabel,
} from '@/app/static'

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
    case ContentTypes.Purification:
      return contentTypePurification
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
    case PresentationStyles.Story:
      return presentationStyleStory
    default:
      return defaultLabel
  }
}

export function getClassLabel(classType: Classes): string {
  switch (classType) {
    case Classes.Kids:
      return classKids
    case Classes.Female:
      return classFemale
    case Classes.Married:
      return classMarried
    case Classes.Parents:
      return classParents
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
