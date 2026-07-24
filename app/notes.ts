import type { NoteRecord } from '@/app/types'

/** MIME type for Markdown note exports. */
export const MARKDOWN_MIME = 'text/markdown;charset=utf-8'

/** True when a note has non-whitespace content worth exporting. */
export function hasContent(note: NoteRecord): boolean {
  return typeof note.text === 'string' && note.text.trim().length > 0
}

/** ISO timestamp for a note's updatedAt, or empty string when unknown. */
function isoTimestamp(epochMs: number): string {
  if (!Number.isFinite(epochMs) || epochMs <= 0) return ''
  try {
    return new Date(epochMs).toISOString()
  } catch {
    return ''
  }
}

/**
 * Build one Markdown section for a single video's note, matching the format the
 * extension uses so files are consistent across both apps:
 *
 * ## [<videoId>](https://www.youtube.com/watch?v=<videoId>)
 * - **Playlist:** <playlistId | —>
 * - **Updated:** <ISO timestamp>
 *
 * <note text>
 */
function buildNoteSection(note: NoteRecord): string {
  const url = `https://www.youtube.com/watch?v=${note.videoId}`
  return [
    `## [${note.videoId}](${url})`,
    `- **Playlist:** ${note.playlistId ?? '—'}`,
    `- **Updated:** ${isoTimestamp(note.updatedAt)}`,
    '',
    note.text.trim(),
  ].join('\n')
}

/** Markdown body for a single video's note download. */
export function buildVideoNoteMarkdown(note: NoteRecord): string {
  return `${buildNoteSection(note)}\n`
}

/** File name for a single video note download. */
export function videoNoteFileName(videoId: string): string {
  return `salasel-notes-${videoId}.md`
}

/**
 * Markdown body aggregating every (non-empty) note in a playlist. Sections are
 * separated by a `---` line and preceded by a title + export blockquote header.
 */
export function buildPlaylistNotesMarkdown(playlistId: string, notes: NoteRecord[]): string {
  const included = notes.filter(hasContent)
  const header = [
    `# Salasel notes — playlist ${playlistId}`,
    `> Exported ${new Date().toISOString()} · ${included.length} video${included.length === 1 ? '' : 's'}`,
    '',
  ].join('\n')
  const body = included.map(buildNoteSection).join('\n\n---\n\n')
  return `${header}\n${body}\n`
}

/** File name for a playlist notes download. */
export function playlistNotesFileName(playlistId: string): string {
  return `salasel-notes-playlist-${playlistId}.md`
}
