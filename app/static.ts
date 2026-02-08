import type { Categories } from './types'

/**
 * Static list of filters used in the application.
 * First filter is the default "All" filter.
 */
export const filters: Readonly<(Categories | 'الكل')[]> = Object.freeze(['الكل', 'دين', 'فطرة', 'نفس'])

export const title = 'سلاسل'
export const description = 'تطبيق سلاسل تعليمية وتوعوية لبناء إنسان متزن ومجتمع متماسك'

export const searchPlaceholder = 'ابحث عن عنوان سلسلة...'

export const navs = [
  { name: 'الرئيسية', href: '/' },
  { name: 'مسار', href: '/masaar' },
  { name: 'عنّا', href: '/about' },
]

export const loading = '...جار تحميل قائمة التشغيل'

export const noVideos = 'لا مقاطع في قائمة التشغيل هذه'
export const noContent = 'لا محتوى متاح'
export const by = 'تقديم'

export const searchTab = 'بحث'
export const summaryTab = 'ملخص'
export const transcriptionTab = 'النص'
export const contentTab = 'المحتوى'
export const notesTab = 'ملاحظات'
export const foundResults = 'عُثر على نتائج'

export function getVideoThumbnailUrl(videoId: string | undefined): string {
  return videoId ? `https://img.youtube.com/vi/${videoId}/sddefault.jpg` : '/next.svg'
}
