import type { Categories } from './types'
import type { Metadata, Viewport } from 'next'

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
