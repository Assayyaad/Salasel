import type { Note } from '@/app/store/useNotesStore'
import type { CalculatedPlaylist, CalculatedVideo } from '@/app/types'

import JSZip from 'jszip'

function sanitizeFilename(name: string): string {
  return name
    .replace(/[/\\?%*:|"<>]/g, '-')
    .replace(/\s+/g, '_')
    .substring(0, 200)
}

function buildFrontmatter(playlistId: string, videoId?: string): string {
  const timestamp = new Date().toISOString()
  const videoLine = videoId ? `video_id: "${videoId}"\n` : ''
  return `---\nplaylist_id: "${playlistId}"\n${videoLine}export_timestamp: "${timestamp}"\n---\n\n`
}

function buildVideoSection(videoTitle: string, notes: Note[]): string {
  let section = `## ${videoTitle}\n\n`
  for (const note of notes) {
    section += `### ${note.timestamp}\n\n${note.content}\n\n`
  }
  return section
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

export function exportSingleVideoNotes(
  playlist: Pick<CalculatedPlaylist, 'id' | 'name'>,
  video: Pick<CalculatedVideo, 'id' | 'title'>,
  notes: Note[],
) {
  const content =
    buildFrontmatter(playlist.id, video.id) + `# ${playlist.name}\n\n` + buildVideoSection(video.title, notes)
  const blob = new Blob([content], { type: 'text/markdown' })
  downloadBlob(blob, `${sanitizeFilename(video.title)}.md`)
}

export function exportPlaylistNotesSingleFile(
  playlist: Pick<CalculatedPlaylist, 'id' | 'name'>,
  videoNotes: { video: Pick<CalculatedVideo, 'id' | 'title'>; notes: Note[] }[],
) {
  let content = buildFrontmatter(playlist.id) + `# ${playlist.name}\n\n`
  for (const { video, notes } of videoNotes) {
    if (notes.length > 0) content += buildVideoSection(video.title, notes)
  }
  const blob = new Blob([content], { type: 'text/markdown' })
  downloadBlob(blob, `${sanitizeFilename(playlist.name)}.md`)
}

export async function exportPlaylistNotesZip(
  playlist: Pick<CalculatedPlaylist, 'id' | 'name'>,
  videoNotes: { video: Pick<CalculatedVideo, 'id' | 'title'>; notes: Note[] }[],
) {
  const zip = new JSZip()
  for (const { video, notes } of videoNotes) {
    if (notes.length === 0) continue
    const content =
      buildFrontmatter(playlist.id, video.id) + `# ${playlist.name}\n\n` + buildVideoSection(video.title, notes)
    zip.file(`${sanitizeFilename(video.title)}.md`, content)
  }
  const blob = await zip.generateAsync({ type: 'blob' })
  downloadBlob(blob, `${sanitizeFilename(playlist.name)}.zip`)
}
