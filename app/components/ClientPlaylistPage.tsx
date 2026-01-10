"use client";

import React, { useEffect, useState } from 'react';
import { usePlaylistStore } from '@/app/store/usePlaylistStore';
import VideoPlayer from '@/app/components/VideoPlayer';
import PlaylistSidebar from '@/app/components/PlaylistSidebar';
import VideoDetailsTabs from '@/app/components/VideoDetailsTabs';
import { transformSinglePlaylist } from '@/app/lib/datatransform';
import { Playlist } from '@/app/types';

interface ClientPlaylistPageProps {
  id: string;
  initialPlaylist: Playlist;
}

const ClientPlaylistPage: React.FC<ClientPlaylistPageProps> = ({ id, initialPlaylist }) => {
  const [playlistData, setPlaylistData] = useState<Playlist>(() => transformSinglePlaylist(initialPlaylist));
  
  const rawPlaylists = usePlaylistStore((state) => state.rawPlaylists);

  useEffect(() => {
    if (rawPlaylists.length > 0) {
      const foundPlaylist = rawPlaylists.find(
        (p) => p["معرف قائمة التشغيل"] === id
      );

      if (foundPlaylist) {
        const transformed = transformSinglePlaylist(foundPlaylist);
        setPlaylistData(transformed);
      }
    }
  }, [rawPlaylists, id]);

  if (!playlistData) {
    return <div className="text-white text-center py-12">...جار تحميل قائمة التشغيل</div>;
  }

  return (
    <main className="max-w-7xl mx-auto px-4 py-8 md:px-6 md:py-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        <div className="lg:col-span-2 flex flex-col gap-6">
          <VideoPlayer playlist={playlistData} />
        </div>
        <div className="lg:col-span-1">
          <PlaylistSidebar playlist={playlistData} />
        </div>
      </div>
      <VideoDetailsTabs />
    </main>
  );
};

export default ClientPlaylistPage;
