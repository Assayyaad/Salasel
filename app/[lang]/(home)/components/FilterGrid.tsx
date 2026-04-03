'use client'

import type { Languages } from '@/app/types'

import React, { useEffect } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { useRouter, usePathname } from '@/i18n/navigation'
import { usePlaylistStore } from '@/app/store/usePlaylistStore'
import { allLanguages } from '@/app/static'
import FilterSelect from '@/app/[lang]/(home)/components/FilterSelect'

import type { FilterOption } from '@/app/[lang]/(home)/components/FilterSelect'

function rawToOptions(raw: unknown): FilterOption[] {
  return Object.entries(raw as Record<string, string>).map(([key, value]) => ({ key, value }))
}

const FilterGrid: React.FC = () => {
  const router = useRouter()
  const pathname = usePathname()
  const locale = useLocale()
  const { filters, setLanguage, setContentType, setPresentationStyle, setCategory, setClass, setSortBy } =
    usePlaylistStore()
  const t = useTranslations()

  // Sync locale to store so playlist filtering stays in sync with UI language
  useEffect(() => {
    if (locale !== filters.language) {
      setLanguage(locale as Languages)
    }
  }, [locale, filters.language, setLanguage])

  const handleLanguageChange = (newLang: string) => {
    router.replace(pathname, { locale: newLang })
  }

  // Transform data to FilterOption format
  const languageOptions = allLanguages.map((l) => ({ key: l.code, value: l.name }))
  const contentOptions = Object.entries(t.raw('contents') as Record<string, string>).map(([key, value]) => ({
    key,
    value,
  }))
  const presentationOptions = Object.entries(t.raw('presentations') as Record<string, string>).map(([key, value]) => ({
    key,
    value,
  }))
  const categoryOptions = Object.entries(t.raw('categories') as Record<string, string>).map(([key, value]) => ({
    key,
    value,
  }))
  const classOptions = Object.entries(t.raw('classes') as Record<string, string>).map(([key, value]) => ({
    key,
    value,
  }))
  const sortOptions = Object.entries(t.raw('sortOptions') as Record<string, string>).map(([key, value]) => ({
    key,
    value,
  }))

  return (
    <div className="flex flex-wrap justify-center gap-3">
      <FilterSelect
        id="language-filter"
        label={t('filterLanguageLabel')}
        value={filters.language}
        onChange={handleLanguageChange}
        options={languageOptions}
      />

      <FilterSelect
        id="content-type-filter"
        label={t('filterContentTypeLabel')}
        value={filters.contentType}
        onChange={(value) => setContentType(Number(value))}
        options={contentOptions}
      />

      <FilterSelect
        id="category-filter"
        label={t('filterCategoryLabel')}
        value={filters.category}
        onChange={(value) => setCategory(Number(value))}
        options={categoryOptions}
      />

      <FilterSelect
        id="presentation-style-filter"
        label={t('filterPresentationStyleLabel')}
        value={filters.presentationStyle}
        onChange={(value) => setPresentationStyle(value === 'all' ? 'all' : Number(value))}
        options={presentationOptions}
        showAllOption
        allOptionLabel={t('filterAllOption')}
      />

      <FilterSelect
        id="class-filter"
        label={t('filterClassLabel')}
        value={filters.class}
        onChange={(value) => setClass(value === 'all' ? 'all' : Number(value))}
        options={classOptions}
        showAllOption
        allOptionLabel={t('filterAllOption')}
      />

      <FilterSelect
        id="sort-filter"
        label={t('filterSortLabel')}
        value={filters.sortBy}
        onChange={(value) => setSortBy(value as Parameters<typeof setSortBy>[0])}
        options={sortOptions}
      />
    </div>
  )
}

export default FilterGrid
