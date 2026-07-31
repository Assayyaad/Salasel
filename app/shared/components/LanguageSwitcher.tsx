'use client'

import React, { useEffect, useRef, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { allLanguages } from '@/app/static'
import { usePlaylistStore } from '@/app/store/usePlaylistStore'
import { usePreferencesStore } from '@/app/store/usePreferencesStore'
import type { Language } from '@/app/types'

export interface LanguageSwitcherProps {
  currentLang: string
  dir: 'rtl' | 'ltr'
}

const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ currentLang, dir }) => {
  const router = useRouter()
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const { setLanguage } = usePlaylistStore()
  const setPreferredLanguage = usePreferencesStore((s) => s.setPreferredLanguage)

  const current = allLanguages.find((l) => l.code === currentLang) ?? allLanguages[0]

  const handleSwitch = (lang: Language) => {
    setOpen(false)
    if (lang.code === currentLang) return
    // Sync the playlist content filter to match the new UI language
    setLanguage(lang.code)
    // Remember the explicit choice so it persists across visits
    setPreferredLanguage(lang.code)
    const segments = pathname.split('/')
    segments[1] = lang.code
    router.push(segments.join('/'))
  }

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [])

  return (
    <div ref={containerRef} className="relative">
      {/* Trigger button */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium bg-slate-800/80 backdrop-blur-sm border border-slate-700 text-slate-300 hover:bg-slate-700 hover:text-slate-100 transition-colors focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer"
      >
        {/* Globe icon */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="15"
          height="15"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          className="shrink-0"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
          <path d="M2 12h20" />
        </svg>

        <span>{current.name}</span>

        {/* Chevron — flips when open */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          className={`shrink-0 transition-transform ${open ? 'rotate-180' : ''}`}
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>

      {/* Dropdown — anchors to the correct side based on dir */}
      {open && (
        <ul
          role="listbox"
          aria-label="Select language"
          className={`absolute top-full mt-1.5 min-w-full w-max bg-slate-800 border border-slate-700 rounded-lg shadow-xl overflow-hidden z-50 ${
            dir === 'rtl' ? 'left-0' : 'right-0'
          }`}
        >
          {allLanguages.map((lang) => {
            const isActive = lang.code === currentLang
            return (
              <li key={lang.code} role="option" aria-selected={isActive}>
                <button
                  onClick={() => handleSwitch(lang)}
                  className={`w-full px-4 py-2 text-sm text-start transition-colors focus:outline-none focus:bg-slate-700 ${
                    isActive
                      ? 'bg-primary/20 text-primary font-medium cursor-default'
                      : 'text-slate-300 hover:bg-slate-700 hover:text-slate-100 cursor-pointer'
                  }`}
                >
                  {lang.name}
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}

export default LanguageSwitcher
