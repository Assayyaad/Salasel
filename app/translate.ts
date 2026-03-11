import type { Language, LanguageCode } from './types'
import { allLanguages, defaultLanguage, languageMap } from './static'

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
