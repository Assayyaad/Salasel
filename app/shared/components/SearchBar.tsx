'use client'

import type { Translations } from '@/app/types'

import React, { useState, useEffect, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

export interface SearchBarProps {
  t: Translations
}

const SearchBar: React.FC<SearchBarProps> = ({ t }) => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '')
  const debounceTimer = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    // Debounce search with 300ms delay
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current)
    }

    debounceTimer.current = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString())
      if (searchTerm.trim()) {
        params.set('q', searchTerm.trim())
      } else {
        params.delete('q')
      }
      router.push(`?${params.toString()}`, { scroll: false })
    }, 300)

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current)
      }
    }
  }, [searchTerm, router])

  return (
    <div className="flex-1 max-w-xl mx-auto">
      <div className="relative group">
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
          <span className="material-icons-round text-slate-400 group-focus-within:text-primary">search</span>
        </div>
        <input
          className="block w-full pl-3 pr-10 py-1.5 border border-slate-300 dark:border-slate-600 rounded-md leading-5 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm transition-shadow duration-200"
          placeholder={t.searchPlaceholder}
          type="search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
    </div>
  )
}

export default SearchBar
