'use client'

import React from 'react'
import type { Translations } from '@/app/types'
import { Categories } from '@/app/types'
import { usePlaylistStore } from '@/app/store/usePlaylistStore'

export interface CategoryPillsProps {
  t: Translations
}

const CategoryPills: React.FC<CategoryPillsProps> = ({ t }) => {
  const { filters, setCategory, setBookmarkedOnly } = usePlaylistStore()

  const categories = Object.entries(t.categories) as [string, string][]

  const pillClass = (isActive: boolean) =>
    `px-5 py-2 rounded-full text-sm font-medium border transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary ${
      isActive
        ? 'bg-primary border-primary text-white'
        : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700 hover:border-slate-600'
    }`

  const handleAll = () => {
    setCategory('all')
    setBookmarkedOnly(false)
  }

  const handleCategory = (value: Categories) => {
    setCategory(value)
    setBookmarkedOnly(false)
  }

  const handleBookmarks = () => {
    setCategory('all')
    setBookmarkedOnly(true)
  }

  const isAllActive = !filters.bookmarkedOnly && filters.category === 'all'

  return (
    <div className="flex flex-wrap justify-center gap-2">
      {/* All pill */}
      <button onClick={handleAll} className={pillClass(isAllActive)}>
        {t.filterAllOption}
      </button>

      {/* Category pills */}
      {categories.map(([key, label]) => {
        const value = Number(key) as Categories
        return (
          <button
            key={key}
            onClick={() => handleCategory(value)}
            className={pillClass(!filters.bookmarkedOnly && filters.category === value)}
          >
            {label}
          </button>
        )
      })}

      {/* Bookmarks pill */}
      <button onClick={handleBookmarks} className={pillClass(filters.bookmarkedOnly)}>
        <span className="flex items-center gap-1.5">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill={filters.bookmarkedOnly ? 'currentColor' : 'none'}
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M19 21l-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
          </svg>
          {t.filterBookmarksLabel}
        </span>
      </button>
    </div>
  )
}

export default CategoryPills
