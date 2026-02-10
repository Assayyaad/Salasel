import type { Categories } from './types'
import type { Metadata, Viewport } from 'next'

/**
 * Static list of filters used in the application.
 * First filter is the default "All" filter.
 */
export const filters: Readonly<(Categories | 'الكل')[]> = Object.freeze(['الكل', 'دين', 'فطرة', 'نفس'])

export const title = 'سلاسل'
export const description = 'تطبيق سلاسل تعليمية وتوعوية لبناء إنسان متزن ومجتمع متماسك'

export const searchPlaceholder = 'ابحث عن سلسلة...'

export const loading = 'يُحمّل...'

export const searchTab = 'بحث'
export const summaryTab = 'ملخص'
export const transcriptionTab = 'النص'
export const notesTab = 'ملاحظات'

// Watch status labels
export const watchStatusCompleted = 'شوهِد'
export const watchStatusInProgress = 'قيد المشاهدة'
export const watchStatusNotStarted = 'لم يُشاهد بعد'

// Notes component
export const notesDeleteConfirmation = 'أمتأكد من حذف الملاحظة؟'
export const notesPlaceholder = 'اكتب هنا...'
export const notesAddButton = 'أضف ملاحظة'
export const notesEmptyMessage = 'لا ملاحظات'
export const notesUpdateTimestamp = 'تحديث الطابع الزمني'
export const notesSaveButton = 'حفظ'
export const notesCancelButton = 'إلغاء'

// Personal Progress
export const personalProgressTitle = 'التقدم الشخصي'
export const nextToWatch = 'التالي للمشاهدة'
export const totalNotes = 'مجموع الملاحظات'
export const currentVideoProgress = 'تقدم المقطع الحالي'
export const playlistProgress = 'تقدم السلسلة'
export const continueWatching = 'متابعة المشاهدة'
export const startWatching = 'ابدأ المشاهدة'

// Playlist Card labels
export const withParticipation = 'بمشاركة:'
export const videosLabel = 'المقاطع'
export const videoLabel = 'مقطع'
export const durationLabel = 'المدة'
export const typeLabel = 'النوع'
export const styleLabel = 'الأسلوب'
export const categoriesLabel = 'التصانيف'
export const classesLabel = 'الفئات'
export const startDateLabel = 'تاريخ البداية'
export const endDateLabel = 'تاريخ النهاية'

// Playlist Content
export const playlistContents = 'محتويات السلسلة'
export const episodeLabel = 'الحلقة'

// Navigation
export const goBack = 'العودة للخلف'

// Error messages
export const playlistNotFound = 'لم يُعثر على السلسلة'
export const noVideosFound = 'لا مقاطع في السلسلة'

// Content type labels
export const contentTypeEducational = 'تعليمي'
export const contentTypeAwareness = 'توعوي'

// Presentation style labels
export const presentationStyleNarration = 'سرد'
export const presentationStyleLecture = 'محاضرة'
export const presentationStylePodcast = 'إذاعة'

// Class labels
export const classKids = 'أطفال'
export const classParents = 'آباء'
export const classFemale = 'إناث'

// Default/fallback label
export const defaultLabel = '-'

export const viewport: Viewport = {
  themeColor: '#2e4b2c',
  colorScheme: 'dark',
}

export const metadata: Metadata = {
  title: 'سلاسل - تطبيق سلاسل تعليمية وتوعوية',
  description: 'تطبيق سلاسل تعليمية وتوعوية لبناء إنسان متزن ومجتمع متماسك',
  abstract: 'تطبيق سلاسل تعليمية وتوعوية لبناء إنسان متزن ومجتمع متماسك',
  alternates: {
    languages: {
      ar: '/',
    },
  },
  appleWebApp: {
    title: 'سلاسل',
  },
  applicationName: 'سلاسل',
  metadataBase: new URL('https://salasel.app'),
  category: 'Education',
  classification: 'Education',
  icons: {
    icon: '/img/logo.webp',
    apple: '/img/logo.webp',
  },
  manifest: '/manifest.json',
  keywords: [],
  openGraph: {
    title: 'سلاسل - تطبيق سلاسل تعليمية وتوعوية',
    description: 'تطبيق سلاسل تعليمية وتوعوية لبناء إنسان متزن ومجتمع متماسك',
    url: 'https://salasel.app/',
    siteName: 'سلاسل',
    type: 'website',
    locale: 'ar',
  },
  robots: {
    'index': true,
    'follow': true,
    'max-image-preview': 'large',
    'max-video-preview': -1,
    'max-snippet': -1,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'سلاسل - تطبيق سلاسل تعليمية وتوعوية',
    description: 'تطبيق سلاسل تعليمية وتوعوية لبناء إنسان متزن ومجتمع متماسك',
    site: '@SalaselApp',
  },
  other: {
    'preconnect': [
      'https://img.youtube.com',
      'https://youtube.com',
      'https://www.youtube.com',
      'https://fonts.googleapis.com',
      'https://fonts.gstatic.com',
    ],
    'dns-prefetch': [
      '//img.youtube.com',
      '//youtube.com',
      '//www.youtube.com',
      '//fonts.googleapis.com',
      '//fonts.gstatic.com',
    ],
  },
}
