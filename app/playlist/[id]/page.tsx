import fs from 'fs'
import path from 'path'
import { Playlist, SalaselData } from '@/app/types'
import ClientPlaylistPage from './components/ClientPlaylistPage'

// Helper function to read the data for static generation
async function getSalaselData(): Promise<SalaselData> {
  const filePath = path.join(process.cwd(), 'public', 'salasel.json')
  const jsonData = await fs.promises.readFile(filePath, 'utf-8')
  return JSON.parse(jsonData)
}

// This Server-side function generates the list of all possible playlist pages
// at build time, which is great for performance and SEO (ISR).
export async function generateStaticParams() {
  const data = await getSalaselData()
  // Generate paths for the first 22 playlists
  return data.courses.slice(0, 22).map((course) => ({
    id: course['معرف قائمة التشغيل'],
  }))
}

async function getPlaylist(id: string): Promise<Playlist | undefined> {
  const data = await getSalaselData()
  return data.courses.find((course) => course['معرف قائمة التشغيل'] === id)
}

// This is the main page component. It's a Server Component.
const PlaylistPage = async (props: { params: Promise<{ id: string }> }) => {
  // Explicitly await the params promise to resolve it.
  const params = await props.params

  // On the server, we fetch the specific playlist data for the initial render.
  const playlist = await getPlaylist(params.id)

  if (!playlist) {
    return <div className="text-white text-center py-12">قائمة التشغيل غير موجودة.</div>
  }

  // We pass the id and the initial server-fetched data to the client component.
  return <ClientPlaylistPage id={params.id} initialPlaylist={playlist} />
}

export default PlaylistPage
