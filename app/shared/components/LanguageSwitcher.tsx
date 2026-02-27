'use client'

import type { LanguageCode } from '@/app/types'

import React from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { allLanguages } from '@/app/static'

export interface LanguageSwitcherProps {
  currentLang: LanguageCode
}

const LANG_CHAR: Record<string, string> = { ar: 'ع', en: 'E', ja: '日' }

const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ currentLang }) => {
  const router = useRouter()
  const pathname = usePathname()

  const handleChange = (newLang: string) => {
    const segments = pathname.split('/')
    segments[1] = newLang
    router.push(segments.join('/'))
  }

  return (
    <select
      value={currentLang}
      onChange={(e) => handleChange(e.target.value)}
      className="px-2 py-1.5 rounded-lg text-sm font-medium bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-primary transition-all cursor-pointer"
      aria-label="Language"
    >
      {allLanguages.map((lang) => (
        <option key={lang.code} value={lang.code}>
          {LANG_CHAR[lang.code] ?? lang.code}
        </option>
      ))}
    </select>
  )
}

export default LanguageSwitcher
