'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { goBack } from '@/app/static'

export interface PlaylistLayoutProps {
  children: React.ReactNode
}

export const PlaylistLayout: React.FC<PlaylistLayoutProps> = ({ children }) => {
  const router = useRouter()

  return (
    <main dir="rtl" className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-8 space-y-4">
      <div className="mb-4">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center text-sm font-medium text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          <span className="material-icons-round mr-2">arrow_forward</span>
          {goBack}
        </button>
      </div>
      {children}
    </main>
  )
}

export default PlaylistLayout
