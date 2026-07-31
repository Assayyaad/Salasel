'use client'

import type { LanguageCode, Translations } from '@/app/types'

import React, { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { allLanguages, defaultLanguage } from '@/app/static'
import { isValidLanguage } from '@/app/translate'
import { usePreferencesStore } from '@/app/store/usePreferencesStore'
import { usePlaylistStore } from '@/app/store/usePlaylistStore'

export interface LanguagePickerProps {
  currentLang: LanguageCode
  t: Translations
}

/** Best-guess language from the browser, falling back to the app default. */
function detectBrowserLanguage(): LanguageCode {
  if (typeof navigator === 'undefined') return defaultLanguage
  const candidates = [navigator.language, ...(navigator.languages ?? [])]
  for (const raw of candidates) {
    const code = raw?.slice(0, 2).toLowerCase()
    if (code && isValidLanguage(code)) return code
  }
  return defaultLanguage
}

/**
 * First-visit language gate. If the user has no stored preferred language, a
 * dialog asks them to choose (pre-highlighting their browser language). Once a
 * preference exists, subsequent visits silently redirect to it when the URL
 * language differs. The choice is persisted via usePreferencesStore.
 */
const LanguagePicker: React.FC<LanguagePickerProps> = ({ currentLang, t }) => {
  const router = useRouter()
  const pathname = usePathname()
  const preferredLanguage = usePreferencesStore((s) => s.preferredLanguage)
  const setPreferredLanguage = usePreferencesStore((s) => s.setPreferredLanguage)
  const setLanguage = usePlaylistStore((s) => s.setLanguage)

  const [hydrated, setHydrated] = useState(false)
  const [highlighted, setHighlighted] = useState<LanguageCode>(currentLang)

  useEffect(() => {
    setHydrated(true)
    setHighlighted(detectBrowserLanguage())
  }, [])

  const applyLanguage = (code: LanguageCode) => {
    setPreferredLanguage(code)
    setLanguage(code)
    if (code !== currentLang) {
      const segments = pathname.split('/')
      segments[1] = code
      router.push(segments.join('/'))
    }
  }

  // Once we know the stored preference, silently honor it on later visits.
  useEffect(() => {
    if (!hydrated || !preferredLanguage) return
    if (preferredLanguage !== currentLang) {
      const segments = pathname.split('/')
      segments[1] = preferredLanguage
      router.replace(segments.join('/'))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hydrated, preferredLanguage])

  // Nothing to show until hydrated, or once a preference already exists.
  if (!hydrated || preferredLanguage) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="language-picker-title"
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
    >
      <div className="w-full max-w-sm rounded-2xl border border-slate-700 bg-slate-800 shadow-2xl overflow-hidden">
        <div className="p-6 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/15 text-primary">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
              <path d="M2 12h20" />
            </svg>
          </div>
          <h2 id="language-picker-title" className="text-lg font-bold text-white">
            {t.languagePickerTitle}
          </h2>
          <p className="mt-1.5 text-sm text-slate-400">{t.languagePickerDescription}</p>
        </div>

        <ul className="flex flex-col gap-1 px-4 pb-5">
          {allLanguages.map((lang) => {
            const isHighlighted = lang.code === highlighted
            return (
              <li key={lang.code}>
                <button
                  type="button"
                  onClick={() => applyLanguage(lang.code)}
                  dir={lang.dir}
                  className={`w-full rounded-lg px-4 py-3 text-start text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer ${
                    isHighlighted
                      ? 'bg-primary/15 text-primary border border-primary/40'
                      : 'bg-slate-900/40 text-slate-200 border border-slate-700 hover:border-primary hover:text-primary'
                  }`}
                >
                  {lang.name}
                </button>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}

export default LanguagePicker
