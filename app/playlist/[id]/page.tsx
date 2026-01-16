// app/playlist/[id]/page.tsx
import SelectedPlaylistCard from './components/SelectedPlaylistCard';
import SelectedPlaylistContent from './components/SelectedPlaylistContent';
import { Playlist } from '@/app/types';
import fs from 'fs/promises';
import path from 'path';

export const revalidate = 3600; // Revalidate every hour

export async function generateStaticParams() {
  const filePath = path.join(process.cwd(), 'public', 'salasil.json');
  const jsonData = await fs.readFile(filePath, 'utf-8');
  const data = JSON.parse(jsonData);
  const playlists: Playlist[] = data.courses;

  return playlists.map((playlist) => ({
    id: playlist['معرف قائمة التشغيل'],
  }));
}

async function getPlaylist(id: string): Promise<Playlist | undefined> {
  const filePath = path.join(process.cwd(), 'public', 'salasil.json');
  const jsonData = await fs.readFile(filePath, 'utf-8');
  const data = JSON.parse(jsonData);
  return data.courses.find((course: Playlist) => course['معرف قائمة التشغيل'] === id);
}

const SelectedPlaylistPage = async ({ params: paramsPromise }: { params: Promise<{ id:string }> }) => {
  const params = await paramsPromise;
  const playlist = await getPlaylist(params.id);

  if (!playlist) {
    return <div>Playlist not found</div>;
  }


  return (
    <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <SelectedPlaylistCard playlist={playlist} />
      <SelectedPlaylistContent />
    </main>
  );
};

export default SelectedPlaylistPage;
