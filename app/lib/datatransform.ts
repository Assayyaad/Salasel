import { Categories, ContentTypes, Playlist, PresentationTypes, SalaselData, Video } from '@/app/types'
import jsonData from '@/public/salasel.json'

// This is the "plug in and plug out" function
export function getSalaselData(): SalaselData {
  return {
    courses: jsonData.courses.map(transformSinglePlaylist),
  }
}

export function transformSinglePlaylist(originalPlaylist: any): Playlist {
  const videos =
    originalPlaylist.الفيديوهات?.map((video: any) =>
      transformJsonVideo(video, originalPlaylist['معرف قائمة التشغيل']),
    ) ?? []

  return {
    id: originalPlaylist['معرف قائمة التشغيل'],
    channel: 'فاهم بودكاست',
    name: originalPlaylist['الاسم'],
    description: originalPlaylist['وصف مختصر'],
    participants: originalPlaylist['المقدمين']
      ? originalPlaylist['المقدمين'].split(',').map((p: string) => p.trim())
      : [],
    language: originalPlaylist['اللغة'] === 'العربية' ? 'ar' : 'en',
    type: mapContentType(originalPlaylist['المجال']),
    presentation: PresentationTypes.Podcast, // Assuming Podcast for now
    categories: mapCategories(originalPlaylist['التصانيف']),
    duration: originalPlaylist['المدة الإجمالية (بالساعات)'],
    episodesCount: originalPlaylist['عدد الحلقات'],
    startDate: originalPlaylist['تاريخ أول حلقة'],
    endDate: originalPlaylist['تاريخ آخر حلقة'],
    videos: videos,
  }
}

function transformJsonVideo(originalVideo: any, playlistId: string): Video {
  return {
    id: originalVideo['معرف الفيديو'],
    playlistId: playlistId,
    title: originalVideo['عنوان'],
    duration: originalVideo['مدة'],
    date: originalVideo['تاريخ'],
  }
}

function mapContentType(domain: string): ContentTypes {
  switch (domain) {
    case 'تزكوي':
      return ContentTypes.Awareness
    default:
      return ContentTypes.Educational
  }
}

function mapCategories(categories: string): Categories[] {
  if (!categories) {
    return []
  }
  return categories
    .split(',')
    .map((c) => {
      const trimmed = c.trim()
      if (trimmed === 'فطرة' || trimmed === 'دين' || trimmed === 'نفس') {
        return trimmed as Categories
      }
      // Handle cases where the category is not one of the allowed values
      // For now, we'll filter them out, but you might want to handle this differently
      return null
    })
    .filter((c) => c !== null) as Categories[]
}
