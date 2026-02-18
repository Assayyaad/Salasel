'use client'

import type { CalculatedPlaylist, CalculatedVideo } from '@/app/types'

import React, { useMemo, useState, useEffect } from 'react'
import Link from 'next/link'
import { useProgressStore } from '@/app/store/useProgressStore'
import {
  personalProgressTitle,
  nextToWatch,
  totalNotes,
  currentVideoProgress,
  playlistProgress as playlistProgressLabel,
  continueWatching,
  startWatching,
} from '@/app/static'

export type PersonalProgressPlaylist = Pick<CalculatedPlaylist, 'id' | 'name'>
export type PersonalProgressVideo = Pick<CalculatedVideo, 'id' | 'title'>
export interface PersonalProgressProps {
  playlist: PersonalProgressPlaylist
  videos: PersonalProgressVideo[]
}

const PersonalProgress: React.FC<PersonalProgressProps> = ({ playlist, videos }) => {
  const { completedVideos, notes, videoProgress: videoProgressMap } = useProgressStore()
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  const playlistCompletedVideos = useMemo(() => {
    if (!isClient) return new Set()
    return new Set(completedVideos[playlist.id] || [])
  }, [isClient, completedVideos, playlist.id])

  const playlistProgress = useMemo(() => {
    if (!isClient) {
      return 0
    }
    return Math.round((playlistCompletedVideos.size / videos.length) * 100)
  }, [isClient, playlistCompletedVideos, videos])

  const notesCount = useMemo(() => {
    if (!isClient) return 0
    return videos.reduce((acc, video) => acc + (notes[video.id]?.length || 0), 0)
  }, [isClient, notes, videos])

  const { nextVideo, continueWatchingId } = useMemo(() => {
    if (!isClient) return { nextVideo: '...', continueWatchingId: videos[0].id }

    const nextVideo = videos.find((v) => !playlistCompletedVideos.has(v.id)) || videos[0]
    return { nextVideo: nextVideo.title, continueWatchingId: nextVideo.id }
  }, [isClient, videos, playlistCompletedVideos])

  const videoProgress = isClient ? videoProgressMap[continueWatchingId] || 0 : 0

  if (!isClient) {
    // You can render a loading skeleton here if you want
    return null
  }

  return (
    <div className="bg-card-light dark:bg-card-dark rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
      <h2 className="text-xl font-bold text-text-light dark:text-text-dark mb-4">{personalProgressTitle}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Next Video */}
        <div className="flex flex-col space-y-2">
          <span className="text-sm font-semibold text-muted-light dark:text-muted-dark">{nextToWatch}</span>
          <span className="text-base font-bold text-text-light dark:text-text-dark">{nextVideo}</span>
        </div>

        {/* Notes Count */}
        <div className="flex flex-col space-y-2">
          <span className="text-sm font-semibold text-muted-light dark:text-muted-dark">{totalNotes}</span>
          <span className="text-base font-bold text-text-light dark:text-text-dark">{notesCount}</span>
        </div>

        {/* Progress Bars */}
        <div className="lg:col-span-2 flex flex-col space-y-4">
          {/* Video Progress */}
          <div>
            <div className="flex justify-between text-xs font-semibold text-muted-light dark:text-muted-dark mb-1">
              <span>{currentVideoProgress}</span>
              <span>{videoProgress}%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 overflow-hidden">
              <div className="bg-green-500 h-2.5 rounded-full" style={{ width: `${videoProgress}%` }}></div>
            </div>
          </div>
          {/* Playlist Progress */}
          <div>
            <div className="flex justify-between text-xs font-semibold text-muted-light dark:text-muted-dark mb-1">
              <span>{playlistProgressLabel}</span>
              <span>{playlistProgress}%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 overflow-hidden">
              <div className="bg-primary h-2.5 rounded-full" style={{ width: `${playlistProgress}%` }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Button */}
      <div className="mt-6">
        <Link
          href={`/playlist/${playlist.id}/${continueWatchingId}`}
          className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all transform hover:scale-105 cursor-pointer"
        >
          <span className="material-icons-round mr-2">play_arrow</span>
          {playlistProgress > 0 ? continueWatching : startWatching}
        </Link>
      </div>
    </div>
  )
}

export default PersonalProgress
