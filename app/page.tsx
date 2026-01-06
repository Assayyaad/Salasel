import PlaylistGrid from "./components/PlaylistGrid";
import { Playlist } from './types';
import fs from 'fs/promises';
import path from 'path';
import { transformPlaylistToCardProps } from "./lib/datatransform";

export const revalidate = 60; // Revalidate every 60 seconds

async function getPlaylists(): Promise<Playlist[]> {
  const filePath = path.join(process.cwd(), 'public', 'salasil.json');
  const jsonData = await fs.readFile(filePath, 'utf-8');
  const data = JSON.parse(jsonData);
  return data.courses.slice(0, 22);
}

export default async function Home() {
  const playlists = await getPlaylists();
  const transformedPlaylists = playlists.map(transformPlaylistToCardProps);

  return (
    <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-10">
        <h1 className="text-6xl font-bold tracking-tight text-white mb-2">سلاسل</h1>
        <p className="text-slate-400 mt-4 max-w-2xl mx-auto">
          استكشف عالمًا من المحتوى المنسق المصمم للوضوح والتركيز.
        </p>
      </div>
      <PlaylistGrid playlists={transformedPlaylists} />
    </main>
  );
}