"use client";

import React from 'react';
import { PlaylistCardProps } from './PlaylistCard';
import { usePlaylistStore } from '../store/usePlaylistStore';
import FilterGrid from './FilterGrid';
import PlaylistCard from './PlaylistCard';

interface PlaylistGridProps {
    playlists: PlaylistCardProps[];
}

const PlaylistGrid: React.FC<PlaylistGridProps> = ({ playlists }) => {
    const { activeFilter } = usePlaylistStore();

    console.log('new filter: ', activeFilter)
    const filteredPlaylists = playlists.filter(playlistCard => {
        if (activeFilter === "الكل") {
            return true;
        }
        return playlistCard.tags.includes(activeFilter);
    });

    return (
        <>
            <FilterGrid />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-10">
                {filteredPlaylists.map((playlist) => (
                    <PlaylistCard
                        key={playlist.playlistId}
                        {...playlist}
                    />
                ))}
            </div>
        </>
    );
};

export default PlaylistGrid;
