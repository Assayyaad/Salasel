"use client";
import React, { useState, useEffect } from 'react';
import { Playlist } from '../types';
import { usePlaylistStore } from '../store/usePlaylistStore';
import PlaylistGrid from './PlaylistGrid';
import FilterGrid from './FilterGrid';
import { transformPlaylistToCardProps } from '../lib/datatransform';
import { PlaylistCardProps } from './PlaylistCard';

interface ClientPlaylistGridProps {
    playlists: PlaylistCardProps[];
}

const ClientPlaylistGrid: React.FC<ClientPlaylistGridProps> = ({ playlists }) => {
    const { activeFilter } = usePlaylistStore();
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);


    const filteredPlaylists = playlists.filter(playlistCard => {
        if (activeFilter === "الكل") {
            return true;
        }
        return playlistCard.tags.includes(activeFilter);
    });

    if (!isMounted) {
        return null; 
    }

    return (
        <>
            <FilterGrid />
            <PlaylistGrid playlists={filteredPlaylists} />
        </>
    );
};

export default ClientPlaylistGrid;
