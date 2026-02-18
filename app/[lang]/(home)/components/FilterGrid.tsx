'use client'

import type { Languages, Categories, Translations } from '@/app/types'

import React, { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { usePlaylistStore } from '@/app/store/usePlaylistStore'
import { allLanguages, categories } from '@/app/static'
import FilterSelect from '@/app/[lang]/(home)/components/FilterSelect'

export interface FilterGridProps {
  t: Translations
}

const FilterGrid: React.FC<FilterGridProps> = ({ t }) => {
  const router = useRouter()
  const pathname = usePathname()
  const { filters, setLanguage, setContentType, setPresentationStyle, setCategory, setClass } = usePlaylistStore()

  // Sync language from URL to store on mount and when pathname changes
  useEffect(() => {
    const pathSegments = pathname.split('/')
    if (pathSegments.length > 1) {
      const currentLang = pathSegments[1] as Languages
      if (currentLang !== filters.language) {
        setLanguage(currentLang)
      }
    }
  }, [pathname, filters.language, setLanguage])

  // Handle language change by updating the route
  const handleLanguageChange = (newLang: string) => {
    // Extract current language from pathname (format: /[lang]/...)
    const pathSegments = pathname.split('/')
    if (pathSegments.length > 1) {
      pathSegments[1] = newLang
      const newPath = pathSegments.join('/')
      router.push(newPath)
    }
  }

  // Transform data to FilterOption format
  const languageOptions = allLanguages.map((l) => ({ key: l.code, value: l.name }))
  const contentOptions = Object.entries(t.contents).map(([key, value]) => ({ key, value }))
  const presentationOptions = Object.entries(t.presentations).map(([key, value]) => ({ key, value }))
  const categoryOptions = categories.map((filter) => ({ key: filter, value: filter }))
  const classOptions = Object.entries(t.classes).map(([key, value]) => ({ key, value }))

  return (
    <div className="flex flex-wrap justify-center gap-3">
      <FilterSelect
        id="language-filter"
        label={t.filterLanguageLabel}
        value={filters.language}
        onChange={handleLanguageChange}
        options={languageOptions}
      />

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
        onChange={(value) => setCategory(value as Categories)}
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
