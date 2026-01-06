// app/components/ClientHome.tsx
"use client"; // This component handles the interactivity

import React from 'react';
import { usePlaylistStore } from '../store/usePlaylistStore';
import FilterGrid from "./FilterGrid";
import PlaylistCard from "./PlaylistCard";
import { Playlist } from '../types';
import { transformPlaylistToCardProps } from '../lib/datatransform';

interface ClientHomeProps {
  initialPlaylists: Playlist[]; // Data passed from the server
}

export default function ClientHome({ initialPlaylists }: ClientHomeProps) {
  // 1. Read the filter from Zustand
  const activeFilter = usePlaylistStore((state) => state.activeFilter);

  // 2. Perform the filtering right here (Derived State)
  // Since "initialPlaylists" comes from props, this happens instantly on render.
  const filteredPlaylists = initialPlaylists.filter(playlist => {
      if (activeFilter === "تصنيف 1") {
          return true;
      }
      // Add your real filtering logic here
      // return playlist.category === activeFilter;
      return false; 
  }).slice(0, 22);

  return (
    <>
      {/* The FilterGrid uses Zustand internally to update the filter */}
      <FilterGrid />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-10">
          {filteredPlaylists.map((playlist) => (
              <PlaylistCard
                  key={playlist["معرف قائمة التشغيل"]}
                  {...transformPlaylistToCardProps(playlist)}
              />
          ))}
      </div>
    </>
  );
}
