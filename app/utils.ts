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

/**
 * Sanitize a string so it can be used safely as a file name.
 * Strips path separators and control/reserved characters, collapses whitespace.
 */
export function sanitizeFileName(name: string): string {
  const cleaned = name
    // eslint-disable-next-line no-control-regex
    .replace(/[\u0000-\u001f/\\:*?"<>|]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
  return cleaned.slice(0, 120) || 'note'
}

/**
 * Trigger a client-side download of a plain-text file. No-op during SSR.
 */
export function downloadTextFile(fileName: string, content: string): void {
  if (typeof window === 'undefined') return

  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = fileName
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

/**
 * Format an epoch-milliseconds timestamp into a localized date-time string.
 * Used for note `updatedAt` values delivered by the extension.
 */
export function formatNoteTimestamp(epochMs: number, locale: string): string {
  if (!Number.isFinite(epochMs) || epochMs <= 0) {
    return defaultLabel
  }

  try {
    const date = new Date(epochMs)
    return new Intl.DateTimeFormat(locale, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date)
  } catch {
    return defaultLabel
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
