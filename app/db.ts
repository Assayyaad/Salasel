import type { CalculatedPlaylist, CalculatedVideo, CalculatedProgram, Playlists, Videos, Programs } from '@/app/types'

import playlists from '@/public/playlists.json'
import programs from '@/public/programs.json'

export function getPlaylists(): Playlists {
  return playlists as Playlists
}

export function getPlaylist(id: string): CalculatedPlaylist | undefined {
  return getPlaylists()[id]
}

export function getPrograms(): Programs {
  return programs as Programs
}

export function getProgram(id: string): CalculatedProgram | undefined {
  return getPrograms()[id]
}

export function getProgramPlaylists(programId: string): CalculatedPlaylist[] {
  const program = getProgram(programId)
  if (!program) return []

  const allPlaylists = getPlaylists()
  return program.playlistsOrder.map((id) => allPlaylists[id]).filter(Boolean) as CalculatedPlaylist[]
}

export async function getVideos(playlistId: string): Promise<Videos> {
  try {
    const videos = await import(`@/public/videos/${playlistId}.json`)
    return videos.default as Videos
  } catch (error) {
    console.error(`Failed to load videos for playlist ${playlistId}:`, error)
    return {}
  }
}

export async function getVideo(
  playlistId: string,
  videoId: string,
): Promise<{ playlist?: CalculatedPlaylist; video?: CalculatedVideo }> {
  const playlist = getPlaylist(playlistId)
  if (!playlist) {
    return {}
  }

  const videos = await getVideos(playlist.id)
  const video = videos[videoId]

  return { playlist, video }
}

export function searchPlaylists(playlists: Playlists, query: string): Playlists {
  if (!query.trim()) return playlists

  const normalizedQuery = query.trim().toLowerCase()
  const matches: Playlists = {}

  // create obj then assign to it to preserve order

  for (const id in playlists) {
    if (!Object.hasOwn(playlists, id)) continue

    const pl = playlists[id]
    const name = pl.name.toLowerCase()

    // البحث في العنوان
    if (name.includes(normalizedQuery)) {
      matches[pl.id] = pl
    }
  }

  return matches
}

export function searchPrograms(programs: Programs, query: string): Programs {
  if (!query.trim()) return programs

  const normalizedQuery = query.trim().toLowerCase()
  const matches: Programs = {}

  for (const id in programs) {
    if (!Object.hasOwn(programs, id)) continue

    const prog = programs[id]
    const name = prog.name.toLowerCase()

    if (name.includes(normalizedQuery)) {
      matches[prog.id] = prog
    }
  }

  return matches
}
