import JSZip from 'jszip'

const MAX_FILENAME_LENGTH = 200

export interface ExportNote {
  id: string
  timestamp: string
  content: string
}

export interface VideoData {
  id: string
  title: string
  notes: ExportNote[]
}

export interface PlaylistData {
  id: string
  title: string
  videos: VideoData[]
}

function generateFrontmatter(playlistId: string, videoId?: string): string {
  const lines = ['---', `playlist_id: "${playlistId}"`]
  if (videoId) lines.push(`video_id: "${videoId}"`)
  lines.push(`export_timestamp: "${new Date().toISOString()}"`, '---', '')
  return lines.join('\n') + '\n'
}

function generateVideoSection(video: VideoData): string {
  let content = `## ${video.title}\n\n`
  video.notes.forEach((note) => {
    content += `### ${note.timestamp}\n\n${note.content}\n\n`
  })
  return content
}

export function exportSingleVideo(playlistId: string, playlistTitle: string, video: VideoData): void {
  const frontmatter = generateFrontmatter(playlistId, video.id)
  const content = `# ${playlistTitle}\n\n${generateVideoSection(video)}`
  downloadFile(frontmatter + content, `${sanitizeFilename(video.title)}.md`, 'text/markdown')
}

export function exportPlaylistSingle(playlist: PlaylistData): void {
  const frontmatter = generateFrontmatter(playlist.id)
  let content = `# ${playlist.title}\n\n`
  playlist.videos.forEach((video) => {
    content += generateVideoSection(video)
  })
  downloadFile(frontmatter + content, `${sanitizeFilename(playlist.title)}.md`, 'text/markdown')
}

export async function exportPlaylistZip(playlist: PlaylistData): Promise<void> {
  const zip = new JSZip()
  playlist.videos.forEach((video) => {
    const frontmatter = generateFrontmatter(playlist.id, video.id)
    const content = `# ${playlist.title}\n\n${generateVideoSection(video)}`
    zip.file(`${sanitizeFilename(video.title)}.md`, frontmatter + content)
  })
  const blob = await zip.generateAsync({ type: 'blob' })
  downloadFile(blob, `${sanitizeFilename(playlist.title)}.zip`, 'application/zip')
}

function sanitizeFilename(name: string): string {
  return name
    .replace(/[/\\?%*:|"<>]/g, '-')
    .replace(/\s+/g, '_')
    .substring(0, MAX_FILENAME_LENGTH)
}

function downloadFile(content: string | Blob, filename: string, mimeType: string): void {
  const blob = content instanceof Blob ? content : new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
