import React from 'react'
import FilterButton from './FilterButton'
import { filters } from '@/app/static'

const FilterGrid: React.FC = () => {
  return (
    <div className="relative mb-12">
      <div aria-label="Content filters" className="flex flex-wrap justify-center gap-3" role="group">
        {filters.map((filter) => (
          <FilterButton key={filter} text={filter} />
        ))}
      </div>
    </div>
  )
}

export default FilterGrid
