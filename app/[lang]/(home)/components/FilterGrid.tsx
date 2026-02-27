'use client'

import type { Translations } from '@/app/types'

import React from 'react'
import { usePlaylistStore } from '@/app/store/usePlaylistStore'
import FilterSelect from '@/app/[lang]/(home)/components/FilterSelect'
import SortSelect from '@/app/[lang]/(home)/components/SortSelect'

export interface FilterGridProps {
  t: Translations
}

const FilterGrid: React.FC<FilterGridProps> = ({ t }) => {
  const { filters, setContentType, setPresentationStyle, setCategory, setClass } = usePlaylistStore()

  const contentOptions = Object.entries(t.contents).map(([key, value]) => ({ key, value }))
  const presentationOptions = Object.entries(t.presentations).map(([key, value]) => ({ key, value }))
  const categoryOptions = Object.entries(t.categories).map(([key, value]) => ({ key, value }))
  const classOptions = Object.entries(t.classes).map(([key, value]) => ({ key, value }))

  return (
    <div className="flex flex-wrap justify-center gap-3">
      <SortSelect t={t} />

      <FilterSelect
        id="content-type-filter"
        label={t.filterContentTypeLabel}
        value={filters.contentType}
        onChange={(value) => setContentType(Number(value))}
        options={contentOptions}
      />

      <FilterSelect
        id="category-filter"
        label={t.filterCategoryLabel}
        value={filters.category}
        onChange={(value) => setCategory(Number(value))}
        options={categoryOptions}
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
  )
}

export default FilterGrid
