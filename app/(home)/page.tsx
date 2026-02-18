import PlaylistGrid from '@/app/(home)/components/PlaylistGrid'
import FilterGrid from '@/app/(home)/components/FilterGrid'
import Librecounter from '@/app/shared/components/Librecounter'
import SearchBar from '@/app/shared/components/SearchBar'
import { getPlaylists, searchPlaylists } from '@/app/db'
import { appTitle, appDescription } from '@/app/static'

export interface HomePageProps {
  searchParams: Promise<{ q?: string }>
}

export default async function Home({ searchParams }: HomePageProps) {
  const playlists = getPlaylists()

  // Apply search filter if query exists
  const resolvedSearchParams = await searchParams
  const searchQuery = resolvedSearchParams.q || ''
  const filteredPlaylists = searchPlaylists(playlists, searchQuery)

  return (
    <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-10">
        <h1 className="text-6xl font-bold tracking-tight text-white mb-2">{appTitle}</h1>
        <p className="text-slate-400 mt-4 max-w-2xl mx-auto">
          {appDescription}
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
