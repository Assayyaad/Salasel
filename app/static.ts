import type { Categories } from './types'

/**
 * Static list of filters used in the application.
 * First filter is the default "All" filter.
 */
export const filters: Readonly<(Categories | 'الكل')[]> = Object.freeze(['الكل', 'دين', 'فطرة', 'نفس'])

export const title = 'سلاسل'
export const description = 'تطبيق سلاسل تعليمية وتوعوية لبناء إنسان متزن ومجتمع متماسك'

export const searchPlaceholder = 'ابحث عن عنوان سلسلة...'

export const loading = '...جار تحميل قائمة التشغيل'

export const searchTab = 'بحث'
export const summaryTab = 'ملخص'
export const transcriptionTab = 'النص'
export const notesTab = 'ملاحظات'

export function getVideoThumbnailUrl(videoId: string | undefined): string {
  return videoId ? `https://img.youtube.com/vi/${videoId}/sddefault.jpg` : '/next.svg'
}
