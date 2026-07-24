import type { NoteRecord } from '@/app/types'
import { formatNoteTimestamp, sanitizeFileName } from '@/app/utils'

/** Build the text-file body for a single video's note. */
export function buildVideoNoteFile(note: NoteRecord, videoTitle: string, locale: string): string {
  const lines = [
    videoTitle,
    `https://www.youtube.com/watch?v=${note.videoId}${note.playlistId ? `&list=${note.playlistId}` : ''}`,
    `${formatNoteTimestamp(note.updatedAt, locale)}`,
    '',
    note.text,
    '',
  ]
  return lines.join('\n')
}

/** File name for a single video note download. */
export function videoNoteFileName(videoTitle: string): string {
  return `${sanitizeFileName(videoTitle)}.txt`
}

/** Build the text-file body aggregating every note in a playlist. */
export function buildPlaylistNotesFile(
  playlistName: string,
  notes: NoteRecord[],
  titleFor: (videoId: string) => string | undefined,
  locale: string,
): string {
  const sections = notes.map((note) => {
    const title = titleFor(note.videoId) ?? note.videoId
    return buildVideoNoteFile(note, title, locale)
  })
  return [playlistName, '='.repeat(Math.min(playlistName.length, 40)), '', sections.join('\n----------\n\n')].join('\n')
}

/** File name for a playlist notes download. */
export function playlistNotesFileName(playlistName: string): string {
  return `${sanitizeFileName(playlistName)} - notes.txt`
}
