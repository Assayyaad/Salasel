import type { Language, LanguageCode, Translations } from './types'
import { allLanguages, defaultLanguage, languageMap, translationsMap } from './static'

/**
 * Get language configuration by code
 * Falls back to default language if code is invalid
 */
export function getLanguage(lang: string): Language {
  const code = isValidLanguage(lang) ? lang : defaultLanguage
  return languageMap[code]
}

/**
 * Check if a language code is valid
 */
export function isValidLanguage(lang: string): lang is LanguageCode {
  return lang in languageMap
}

/**
 * Get translations for a specific language
 * Falls back to default language if code is invalid
 */
export function getTranslations(lang: string): Translations {
  const code = isValidLanguage(lang) ? lang : defaultLanguage
  const t = translationsMap[code]
  t.__language = getLanguage(code) // Attach language config to translations
  return t
}

/**
 * Create a type-safe translation function
 */
export function createT(translations: Translations) {
  return <K extends keyof Translations>(key: K): Translations[K] => {
    return translations[key]
  }
}

/**
 * Get all supported languages
 */
export function getLanguages(): readonly Language[] {
  return allLanguages
}

/**
 * Get the default language configuration
 */
export function getDefaultLanguage(): Language {
  return languageMap[defaultLanguage]
}
