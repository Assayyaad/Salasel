import { Playlist } from '@/app/types'
import { PlaylistCardProps } from '@/app/(home)/components/PlaylistCard'

export function transformPlaylistToCardProps(playlist: Playlist): PlaylistCardProps {
  const rawTags = playlist['التصانيف']
  const tagsArray =
    typeof rawTags === 'string' && rawTags.trim() !== '' ? rawTags.split(',').map((tag) => tag.trim()) : []

  return {
    title: playlist['الاسم'],
    description: playlist['وصف مختصر'],
    imageUrl:
      playlist.الفيديوهات && playlist.الفيديوهات.length > 0 ? playlist.الفيديوهات[0]['صورة مصغرة'] : '/next.svg',
    playlistId: playlist['معرف قائمة التشغيل'],
    course: playlist['الفيديوهات'],
    tags: tagsArray,
  }
}

export function transformSinglePlaylist(playlist: Playlist): Playlist {
  const transformedVideos = playlist.الفيديوهات.map((video) => ({
    ...video,
    youtubeUrl: video['رابط'], // Use the existing 'رابط' as youtubeUrl
  }))

  return {
    ...playlist,
    الفيديوهات: transformedVideos,
  }
}
