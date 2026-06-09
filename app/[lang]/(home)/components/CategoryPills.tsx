'use client'

import type { Translations } from '@/app/types'
import { Categories } from '@/app/types'
import { usePlaylistStore } from '@/app/store/usePlaylistStore'

export interface CategoryPillsProps {
  t: Translations
}

const CategoryPills: React.FC<CategoryPillsProps> = ({ t }) => {
  const { filters, setCategory } = usePlaylistStore()

  const categories = Object.entries(t.categories) as [string, string][]

  const pillClass = (isActive: boolean) =>
    `px-5 py-2 rounded-full text-sm font-medium border transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary ${
      isActive
        ? 'bg-primary border-primary text-white'
        : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700 hover:border-slate-600'
    }`

  return (
    <div className="flex flex-wrap justify-center gap-2">
      {/* All pill */}
      <button onClick={() => setCategory('all')} className={pillClass(filters.category === 'all')}>
        {t.filterAllOption}
      </button>

      {/* Category pills */}
      {categories.map(([key, label]) => {
        const value = Number(key) as Categories
        return (
          <button key={key} onClick={() => setCategory(value)} className={pillClass(filters.category === value)}>
            {label}
          </button>
        )
      })}
    </div>
  )
}

export default CategoryPills
