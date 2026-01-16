'use client'

import React from 'react'
import { usePlaylistStore } from '@/app/store/usePlaylistStore'

interface FilterButtonProps {
  text: string
}

const FilterButton: React.FC<FilterButtonProps> = ({ text }) => {
  const activeClasses = 'bg-primary text-white shadow-md hover:bg-primary-hover'
  const inactiveClasses = 'bg-slate-800 text-slate-300 hover:bg-slate-700'

  const activeFilter = usePlaylistStore((state) => state.activeFilter)
  const setActiveFilter = usePlaylistStore((state) => state.setActiveFilter)

  const isActive = activeFilter === text
  return (
    <button
      onClick={() => setActiveFilter(text)}
      className={`px-5 py-2 rounded-full text-sm font-medium transition-all transform hover:-translate-y-0.5 cursor-pointer ${
        isActive ? activeClasses : inactiveClasses
      }`}
    >
      {text}
    </button>
  )
}

export default FilterButton
