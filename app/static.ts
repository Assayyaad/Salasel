import type { Metadata, Viewport } from 'next'
import type { Language, LanguageCode } from '@/app/types'

// ============================================================================
// Language Configuration
// ============================================================================

/** List of all supported languages */
export const allLanguages: Readonly<Language[]> = Object.freeze([
  { code: 'ar', name: 'العربية', dir: 'rtl', comma: '،' },
  { code: 'en', name: 'English', dir: 'ltr', comma: ',' },
  { code: 'ja', name: '日本語', dir: 'ltr', comma: '、' },
])

/** Default language */
export const defaultLanguage: LanguageCode = 'ar'

/** Mapping of language codes to language objects */
export const languageMap: Readonly<Record<LanguageCode, Language>> = Object.freeze(
  allLanguages.reduce(
    (acc, lang) => {
      acc[lang.code] = lang
      return acc
    },
    {} as Record<LanguageCode, Language>,
  ),
)

// ============================================================================
// Content Data (Non-translatable)
// ============================================================================

export const defaultLabel = '-'

// ============================================================================
// App Configuration
// ============================================================================

export const viewport: Viewport = {
  themeColor: '#2e4b2c',
  colorScheme: 'dark',
}

export const metadata: Metadata = {
  metadataBase: new URL('https://salasel.app/'),
  category: 'Education',
  classification: 'Education',
  icons: {
    icon: '/img/logo.webp',
    apple: '/img/logo.webp',
  },
  manifest: '/manifest.json',
  keywords: [],
  robots: {
    'index': true,
    'follow': true,
    'max-image-preview': 'large',
    'max-video-preview': -1,
    'max-snippet': -1,
  },
  other: {
    'preconnect': [
      'https://img.youtube.com',
      'https://www.youtube-nocookie.com',
      'https://fonts.googleapis.com',
      'https://fonts.gstatic.com',
    ],
    'dns-prefetch': [
      '//img.youtube.com',
      '//www.youtube-nocookie.com',
      '//fonts.googleapis.com',
      '//fonts.gstatic.com',
    ],
  },
}
