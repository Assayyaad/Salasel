'use client'

import type { Languages, Categories } from '@/app/types'

import React from 'react'
import { usePlaylistStore } from '@/app/store/usePlaylistStore'
import {
  languages,
  contents,
  presentations,
  categories,
  classes,
  filterLanguageLabel,
  filterContentTypeLabel,
  filterCategoryLabel,
  filterPresentationStyleLabel,
  filterClassLabel,
  filterAllOption,
} from '@/app/static'
import FilterSelect from '@/app/(home)/components/FilterSelect'

export interface FilterGridProps {}

const FilterGrid: React.FC<FilterGridProps> = () => {
  const { filters, setLanguage, setContentType, setPresentationStyle, setCategory, setClass } = usePlaylistStore()

  // Transform data to FilterOption format
  const languageOptions = Object.entries(languages).map(([key, value]) => ({ key, value }))
  const contentOptions = Object.entries(contents).map(([key, value]) => ({ key, value }))
  const presentationOptions = Object.entries(presentations).map(([key, value]) => ({ key, value }))
  const categoryOptions = categories.map((filter) => ({ key: filter, value: filter }))
  const classOptions = Object.entries(classes).map(([key, value]) => ({ key, value }))

  return (
    <div className="flex flex-wrap justify-center gap-3">
      <FilterSelect
        id="language-filter"
        label={filterLanguageLabel}
        value={filters.language}
        onChange={(value) => setLanguage(value as Languages)}
        options={languageOptions}
      />

      <FilterSelect
        id="content-type-filter"
        label={filterContentTypeLabel}
        value={filters.contentType}
        onChange={(value) => setContentType(Number(value))}
        options={contentOptions}
      />

      <FilterSelect
        id="category-filter"
        label={filterCategoryLabel}
        value={filters.category}
        onChange={(value) => setCategory(value as Categories)}
        options={categoryOptions}
      />

      <FilterSelect
        id="presentation-style-filter"
        label={filterPresentationStyleLabel}
        value={filters.presentationStyle}
        onChange={(value) => setPresentationStyle(value === 'all' ? 'all' : Number(value))}
        options={presentationOptions}
        showAllOption
        allOptionLabel={filterAllOption}
      />

      <FilterSelect
        id="class-filter"
        label={filterClassLabel}
        value={filters.class}
        onChange={(value) => setClass(value === 'all' ? 'all' : Number(value))}
        options={classOptions}
        showAllOption
        allOptionLabel={filterAllOption}
      />
    </div>
  )
}

export default FilterGrid
