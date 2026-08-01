import type { HomeParams } from '@/app/[lang]/(home)/params'

import React, { Suspense } from 'react'
import PlaylistGrid from '@/app/[lang]/(home)/components/PlaylistGrid'
import FilterGrid from '@/app/[lang]/(home)/components/FilterGrid'
import Librecounter from '@/app/shared/components/Librecounter'
import SearchBar from '@/app/shared/components/SearchBar'
import { getPlaylists, searchPlaylists } from '@/app/db'
import { getTranslations } from '@/app/translate'

export { generateStaticParams } from '@/app/[lang]/(home)/params'
export { generateMetadata } from '@/app/[lang]/(home)/meta'

export interface HomeProps {
  params: Promise<HomeParams>
  searchParams: Promise<{ q?: string }>
}

const Home: React.FC<HomeProps> = async ({ params, searchParams }) => {
  const { lang } = await params
  const t = getTranslations(lang)
  const playlists = getPlaylists()

  // Apply search filter if query exists
  const resolvedSearchParams = await searchParams
  const searchQuery = resolvedSearchParams.q || ''
  const filteredPlaylists = searchPlaylists(playlists, searchQuery)

  return (
    <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-10">
        <h1 className="text-6xl font-bold tracking-tight text-white mb-2">{t.appTitle}</h1>
        <p className="text-slate-400 mt-4 max-w-2xl mx-auto">
          {t.appDescription}
          <Librecounter />
        </p>
        <div className="mt-6 max-w-md mx-auto">
          <Suspense fallback={<div className="h-12" />}>
            <SearchBar t={t} />
          </Suspense>
        </div>
      </div>

      <div className="relative mb-12">
        <FilterGrid t={t} />
      </div>
      <PlaylistGrid playlists={filteredPlaylists} lang={t.__language.code} />
    </main>
  )
}

export default Home
