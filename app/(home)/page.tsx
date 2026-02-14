import type { CalculatedPlaylist } from '../types'

import PlaylistGrid from './components/PlaylistGrid'
import SearchBar from '@/app/shared/components/SearchBar'
import Librecounter from '@/app/shared/components/Librecounter'
import playlists from '@/public/playlists.json'
import { title, description } from '@/app/static'
import { searchPlaylists } from '@/app/utils'
import FilterGrid from './components/FilterGrid'

export default async function Home({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const data: CalculatedPlaylist[] = playlists as CalculatedPlaylist[]

  // Apply search filter if query exists
  const resolvedSearchParams = await searchParams
  const searchQuery = resolvedSearchParams.q || ''
  const filteredPlaylists = searchPlaylists(data, searchQuery)

  return (
    <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-10">
        <h1 className="text-6xl font-bold tracking-tight text-white mb-2">{title}</h1>
        <p className="text-slate-400 mt-4 max-w-2xl mx-auto">
          {description}
          <Librecounter />
        </p>
        <div className="mt-6 max-w-md mx-auto">
          <SearchBar />
        </div>
      </div>

      <div className="relative mb-12">
        <FilterGrid />
      </div>
      <PlaylistGrid playlists={filteredPlaylists} />
    </main>
  )
}
