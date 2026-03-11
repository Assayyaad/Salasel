import React from 'react'
import BackButton from '@/app/[lang]/playlist/[id]/components/BackButton'

export interface PlaylistLayoutProps {
  children: React.ReactNode
  params: Promise<{ lang: string; id: string }>
}

const PlaylistLayout: React.FC<PlaylistLayoutProps> = async ({ children }) => {
  return (
    <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-8 space-y-4">
      <div className="mb-4">
        <BackButton />
      </div>
      {children}
    </main>
  )
}

export default PlaylistLayout
