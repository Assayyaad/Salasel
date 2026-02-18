import React from 'react'
import BackButton from '@/app/[lang]/playlist/[id]/components/BackButton'
import { getTranslations } from '@/app/translate'

export interface PlaylistLayoutProps {
  children: React.ReactNode
  params: Promise<{ lang: string; id: string }>
}

const PlaylistLayout: React.FC<PlaylistLayoutProps> = async ({ children, params }) => {
  const { lang } = await params
  const t = getTranslations(lang)

  return (
    <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-8 space-y-4">
      <div className="mb-4">
        <BackButton t={t} />
      </div>
      {children}
    </main>
  )
}

export default PlaylistLayout
