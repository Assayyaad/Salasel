import type { Metadata, Viewport } from 'next'
import type { Categories, Classes, ContentTypes, Languages, PresentationStyles } from '@/app/types'

export const languages: Readonly<Record<Languages, string>> = Object.freeze({
  ar: 'العربية',
  en: 'English',
})
export const contents: Readonly<Record<ContentTypes, string>> = Object.freeze({
  0: 'تعليمي',
  1: 'توعوي',
  2: 'تزكوي',
})
export const categories: Readonly<Categories[]> = Object.freeze(['دين', 'فطرة', 'نفس'])
export const presentations: Readonly<Record<PresentationStyles, string>> = Object.freeze({
  0: 'سرد',
  1: 'محاضرة',
  2: 'إذاعة',
  3: 'قصة',
})
export const classes: Readonly<Record<Classes, string>> = Object.freeze({
  0: 'أطفال',
  1: 'إناث',
  2: 'متزوجين',
  3: 'آباء',
})

// Content type labels
export const contentTypeEducational = contents[0]
export const contentTypeAwareness = contents[1]
export const contentTypePurification = contents[2]

// Presentation style labels
export const presentationStyleNarration = presentations[0]
export const presentationStyleLecture = presentations[1]
export const presentationStylePodcast = presentations[2]
export const presentationStyleStory = presentations[3]
// Class labels
export const classKids = classes[0]
export const classFemale = classes[1]
export const classMarried = classes[2]
export const classParents = classes[3]

export const searchPlaceholder = 'ابحث عن سلسلة...'

export const loading = 'يُحمّل...'

// Filter labels
export const filterLanguageLabel = 'اللغة'
export const filterContentTypeLabel = 'نوع المحتوى'
export const filterCategoryLabel = 'التصنيف'
export const filterPresentationStyleLabel = 'الأسلوب'
export const filterClassLabel = 'الفئة'
export const filterAllOption = 'الكل'

export const searchTab = 'بحث'
export const summaryTab = 'ملخص'
export const transcriptionTab = 'النص'
export const notesTab = 'ملاحظات'

// Watch status labels
export const watchStatusCompleted = 'شوهِد'
export const watchStatusInProgress = 'يُشاهد'
export const watchStatusNotStarted = 'لم يُشاهد'

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
export const videoNotFound = 'لم يُعثر على المقطع'
export const noVideosFound = 'لا مقاطع في السلسلة'

// Default/fallback label
export const defaultLabel = '-'

export const viewport: Viewport = {
  themeColor: '#2e4b2c',
  colorScheme: 'dark',
}

export const appTitle = 'سلاسل'
export const appFullTitle = 'سلاسل - تطبيق سلاسل تعليمية وتوعوية وتزكوية'
export const appDescription = 'تطبيق سلاسل تعليمية وتوعوية وتزكوية لبناء إنسان متزن ومجتمع متماسك'

export const metadata: Metadata = {
  title: appFullTitle,
  description: appDescription,
  alternates: {
    languages: {
      ar: '/',
    },
  },
  appleWebApp: {
    title: appTitle,
  },
  applicationName: appTitle,
  metadataBase: new URL('https://salasel.app/'),
  category: 'Education',
  classification: 'Education',
  icons: {
    icon: '/img/logo.webp',
    apple: '/img/logo.webp',
  },
  manifest: '/manifest.json',
  keywords: [],
  openGraph: {
    title: appFullTitle,
    description: appDescription,
    url: 'https://salasel.app/',
    siteName: appTitle,
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
    title: appFullTitle,
    description: appDescription,
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
