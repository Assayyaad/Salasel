'use client'

import type { CalculatedPlaylist, CalculatedVideo, Translations } from '@/app/types'

import React, { useMemo, useState, useEffect } from 'react'
import Link from 'next/link'
import { useProgressStore } from '@/app/store/useProgressStore'

export type PersonalProgressPlaylist = Pick<CalculatedPlaylist, 'id' | 'name' | 'videoCount'>
export type PersonalProgressVideo = Pick<CalculatedVideo, 'id' | 'title'>
export interface PersonalProgressProps {
  playlist: PersonalProgressPlaylist
  videos: Record<string, PersonalProgressVideo>
  t: Translations
}

const PersonalProgress: React.FC<PersonalProgressProps> = ({ playlist, videos, t }) => {
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
    return Math.round((playlistCompletedVideos.size / playlist.videoCount) * 100)
  }, [isClient, playlistCompletedVideos, playlist.videoCount])

  const notesCount = useMemo(() => {
    let count = 0
    if (!isClient) return count
    for (const id in videos) {
      if (!Object.hasOwn(videos, id)) continue

      const v = videos[id]
      count += notes[v.id]?.length || 0
    }
    return count
  }, [isClient, notes, videos])

  const { nextVideo, continueWatchingId } = useMemo(() => {
    const vKeys = Object.keys(videos)
    if (!isClient || vKeys.length === 0) return { nextVideo: '...', continueWatchingId: vKeys[0] || '' }

    let nextVideo: PersonalProgressVideo | undefined
    for (const id in videos) {
      if (!Object.hasOwn(videos, id)) continue

      const v = videos[id]
      if (!playlistCompletedVideos.has(v.id)) {
        nextVideo = v
        break
      }
    }

    if (!nextVideo) {
      // All videos completed, default to first video
      nextVideo = videos[vKeys[0]]
    }

    return { nextVideo: nextVideo.title, continueWatchingId: nextVideo.id }
  }, [isClient, videos, playlistCompletedVideos])

  const videoProgress = isClient ? videoProgressMap[continueWatchingId] || 0 : 0

  if (!isClient) {
    // You can render a loading skeleton here if you want
    return null
  }

  return (
    <div className="bg-card-light dark:bg-card-dark rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
      <h2 className="text-xl font-bold text-text-light dark:text-text-dark mb-4">{t.personalProgressTitle}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Next Video */}
        <div className="flex flex-col space-y-2">
          <span className="text-sm font-semibold text-muted-light dark:text-muted-dark">{t.nextToWatch}</span>
          <span className="text-base font-bold text-text-light dark:text-text-dark">{nextVideo}</span>
        </div>

        {/* Notes Count */}
        <div className="flex flex-col space-y-2">
          <span className="text-sm font-semibold text-muted-light dark:text-muted-dark">{t.totalNotes}</span>
          <span className="text-base font-bold text-text-light dark:text-text-dark">{notesCount}</span>
        </div>

        {/* Progress Bars */}
        <div className="lg:col-span-2 flex flex-col space-y-4">
          {/* Video Progress */}
          <div>
            <div className="flex justify-between text-xs font-semibold text-muted-light dark:text-muted-dark mb-1">
              <span>{t.currentVideoProgress}</span>
              <span>{videoProgress}%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 overflow-hidden">
              <div className="bg-green-500 h-2.5 rounded-full" style={{ width: `${videoProgress}%` }}></div>
            </div>
          </div>
          {/* Playlist Progress */}
          <div>
            <div className="flex justify-between text-xs font-semibold text-muted-light dark:text-muted-dark mb-1">
              <span>{t.playlistProgress}</span>
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
          href={`/${t.__language.code}/playlist/${playlist.id}/${continueWatchingId}`}
          className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all transform hover:scale-105 cursor-pointer"
        >
          <span className="material-icons-round mr-2">play_arrow</span>
          {playlistProgress > 0 ? t.continueWatching : t.startWatching}
        </Link>
      </div>
    </div>
  )
}

export default PersonalProgress
