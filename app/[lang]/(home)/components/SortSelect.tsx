'use client'

import type { Translations } from '@/app/types'
import type { SortOption } from '@/app/store/usePlaylistStore'

import React from 'react'
import { usePlaylistStore } from '@/app/store/usePlaylistStore'

export interface SortSelectProps {
  t: Translations
}

const SORT_OPTIONS: { value: SortOption; labelKey: keyof Translations }[] = [
  { value: 'newest', labelKey: 'sortNewest' },
  { value: 'oldest', labelKey: 'sortOldest' },
  { value: 'longest', labelKey: 'sortLongest' },
  { value: 'shortest', labelKey: 'sortShortest' },
  { value: 'most-videos', labelKey: 'sortMostVideos' },
  { value: 'least-videos', labelKey: 'sortLeastVideos' },
  { value: 'alphabetical', labelKey: 'sortAlphabetical' },
  { value: 'counter-alphabetical', labelKey: 'sortCounterAlphabetical' },
]

const SortSelect: React.FC<SortSelectProps> = ({ t }) => {
  const { sortBy, setSortBy } = usePlaylistStore()

  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs text-slate-400 text-center">{t.sortLabel}</label>
      <select
        value={sortBy}
        onChange={(e) => setSortBy(e.target.value as SortOption)}
        className="px-4 py-2 rounded-lg text-sm font-medium bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-primary transition-all cursor-pointer"
      >
        {SORT_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {t[opt.labelKey] as string}
          </option>
        ))}
      </select>
    </div>
  )
}

export default SortSelect
