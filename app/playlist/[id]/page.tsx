// app/playlist/[id]/page.tsx
import SelectedPlaylistCard from './components/SelectedPlaylistCard'
import SelectedPlaylistContent from './components/SelectedPlaylistContent'
import { Playlist } from '@/app/types'
import { getSalaselData } from '@/app/lib/datatransform'

export const revalidate = 3600 // Revalidate every hour

export async function generateStaticParams() {
  const { courses } = getSalaselData()
  return courses.map((playlist) => ({
    id: playlist.id,
  }))
}

async function getPlaylist(id: string): Promise<Playlist | undefined> {
  const { courses } = getSalaselData()
  return courses.find((course) => course.id === id)
}

const SelectedPlaylistPage = async ({ params: paramsPromise }: { params: Promise<{ id: string }> }) => {
  const params = await paramsPromise;
  const playlist = await getPlaylist(params.id)

  if (!playlist) {
    return <div>Playlist not found</div>
  }

  const firstVideoId = playlist.videos?.[0]?.id;

  // You might want a more graceful handling if no videos are present,
  // but for now, we'll return a message.
  if (!firstVideoId) {
    return <div>No videos found in this playlist.</div>;
  }

  return (
    <main dir="rtl" className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-8 space-y-8">
      <SelectedPlaylistCard playlist={playlist} firstVideoId={firstVideoId} />
      <SelectedPlaylistContent playlist={playlist} />
    </main>
  )
}

export default SelectedPlaylistPage
