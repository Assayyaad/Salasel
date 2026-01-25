'use client'

import React from 'react'
import Notes from './Notes'
import { notesTab } from '@/app/static'

const PlaylistSidebar: React.FC = () => {
  return (
    <div className="lg:col-span-1 bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl shadow-sm flex flex-col h-full">
      {/* Header for the Notes section */}
      <div className="px-6 py-3 border-b border-border-light dark:border-border-dark">
        <h2 className="text-lg font-semibold text-text-light dark:text-text-dark">{notesTab}</h2>
      </div>
      <div className="flex-1 flex flex-col p-4 overflow-hidden">
        <Notes />
      </div>
    </div>
  )
}

export default PlaylistSidebar