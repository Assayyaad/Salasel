'use client'

import type { Translations } from '@/app/types'

import React, { useState } from 'react'
import { usePlaylistStore } from '@/app/store/usePlaylistStore'
import { allLanguages } from '@/app/static'
import FilterSelect from '@/app/[lang]/(home)/components/FilterSelect'
import CategoryPills from '@/app/[lang]/(home)/components/CategoryPills'

export interface FilterGridProps {
  t: Translations
}

const FilterGrid: React.FC<FilterGridProps> = ({ t }) => {
  const { filters, setLanguage, setContentType, setPresentationStyle, setCategory, setClass } = usePlaylistStore()
  const [showAdvanced, setShowAdvanced] = useState(false)

  // Transform data to FilterOption format
  const languageOptions = allLanguages.map((l) => ({ key: l.code, value: l.name }))
  const contentOptions = Object.entries(t.contents).map(([key, value]) => ({ key, value }))
  const presentationOptions = Object.entries(t.presentations).map(([key, value]) => ({ key, value }))
  const categoryOptions = Object.entries(t.categories).map(([key, value]) => ({ key, value }))
  const classOptions = Object.entries(t.classes).map(([key, value]) => ({ key, value }))

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Simple view: category pills */}
      <CategoryPills t={t} />

      {/* Toggle button */}
      <button
        onClick={() => setShowAdvanced((prev) => !prev)}
        className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-300 transition-colors cursor-pointer focus:outline-none"
        aria-expanded={showAdvanced}
      >
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
          className={`transition-transform ${showAdvanced ? 'rotate-180' : ''}`}
          aria-hidden="true"
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
        {t.filterAdvancedLabel}
      </button>

      {/* Advanced filters */}
      {showAdvanced && (
        <div className="flex flex-wrap justify-center gap-3 pt-1">
          <FilterSelect
            id="language-filter"
            label={t.filterLanguageLabel}
            value={filters.language}
            onChange={(value) => setLanguage(value as typeof filters.language)}
            options={languageOptions}
            showAllOption
            allOptionLabel={t.filterAllOption}
          />

          <FilterSelect
            id="content-type-filter"
            label={t.filterContentTypeLabel}
            value={filters.contentType}
            onChange={(value) => setContentType(value === 'all' ? 'all' : Number(value))}
            options={contentOptions}
            showAllOption
            allOptionLabel={t.filterAllOption}
          />

          <FilterSelect
            id="category-filter"
            label={t.filterCategoryLabel}
            value={filters.category}
            onChange={(value) => setCategory(value === 'all' ? 'all' : Number(value))}
            options={categoryOptions}
            showAllOption
            allOptionLabel={t.filterAllOption}
          />

          <FilterSelect
            id="presentation-style-filter"
            label={t.filterPresentationStyleLabel}
            value={filters.presentationStyle}
            onChange={(value) => setPresentationStyle(value === 'all' ? 'all' : Number(value))}
            options={presentationOptions}
            showAllOption
            allOptionLabel={t.filterAllOption}
          />

          <FilterSelect
            id="class-filter"
            label={t.filterClassLabel}
            value={filters.class}
            onChange={(value) => setClass(value === 'all' ? 'all' : Number(value))}
            options={classOptions}
            showAllOption
            allOptionLabel={t.filterAllOption}
          />
        </div>
      )}
    </div>
  )
}

export default FilterGrid
