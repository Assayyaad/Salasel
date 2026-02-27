import type { SortOption } from '@/app/store/usePlaylistStore'

import { defaultLabel } from './static'

export function videoThumbnailUrl(id: string): string {
  return `https://img.youtube.com/vi/${id}/sddefault.jpg`
}

export function fallbackThumbnailUrl(id: string): string {
  return `https://i.ytimg.com/vi/${id}/hqdefault.jpg`
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

interface SortablePlaylist {
  duration: number
  videoCount: number
  startDate: number
  endDate: number
  name: string
}

export function sortPlaylists<T extends SortablePlaylist>(entries: [string, T][], sortBy: SortOption): [string, T][] {
  const sorted = [...entries]

  switch (sortBy) {
    case 'longest':
      return sorted.sort(([, a], [, b]) => b.duration - a.duration)
    case 'shortest':
      return sorted.sort(([, a], [, b]) => a.duration - b.duration)
    case 'most-videos':
      return sorted.sort(([, a], [, b]) => b.videoCount - a.videoCount)
    case 'least-videos':
      return sorted.sort(([, a], [, b]) => a.videoCount - b.videoCount)
    case 'oldest':
      return sorted.sort(([, a], [, b]) => a.startDate - b.startDate)
    case 'newest':
      return sorted.sort(([, a], [, b]) => b.startDate - a.startDate)
    case 'alphabetical':
      return sorted.sort(([, a], [, b]) => b.name.localeCompare(a.name, 'ar'))
    case 'counter-alphabetical':
      return sorted.sort(([, a], [, b]) => a.name.localeCompare(b.name, 'ar'))
    default:
      return sorted
  }
}
