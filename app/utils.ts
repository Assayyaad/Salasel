import { defaultLabel } from './static'

export function videoThumbnailUrl(id: string): string {
  return `https://img.youtube.com/vi/${id}/sddefault.jpg`
}

export function fallbackThumbnailUrl(id: string): string {
  return `https://i.ytimg.com/vi/${id}/hqdefault.jpg`
}

/** Outbound YouTube watch URL for a video, optionally within a playlist. */
export function youtubeWatchUrl(videoId: string, playlistId?: string): string {
  const base = `https://www.youtube.com/watch?v=${videoId}`
  return playlistId ? `${base}&list=${playlistId}` : base
}

/**
 * Privacy-friendly YouTube embed URL with distractions minimised:
 * - youtube-nocookie.com domain (no tracking cookies until playback)
 * - rel=0 keeps related videos to the same channel
 * - modestbranding=1 / iv_load_policy=3 trim branding and annotations
 * Note: YouTube still shows end-screen suggestions by design; these cannot be
 * fully removed from an official embed.
 */
export function youtubeEmbedUrl(videoId: string, playlistId?: string): string {
  const params = new URLSearchParams({
    rel: '0',
    modestbranding: '1',
    iv_load_policy: '3',
    playsinline: '1',
  })
  if (playlistId) params.set('list', playlistId)
  return `https://www.youtube-nocookie.com/embed/${videoId}?${params.toString()}`
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

/**
 * Trigger a client-side download of a text file. No-op during SSR.
 * `mimeType` defaults to plain text; pass `text/markdown;charset=utf-8` for .md.
 */
export function downloadTextFile(fileName: string, content: string, mimeType = 'text/plain;charset=utf-8'): void {
  if (typeof window === 'undefined') return

  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = fileName
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
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
