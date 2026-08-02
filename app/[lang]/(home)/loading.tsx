import React from 'react'

/**
 * Route-level loading fallback for the home page.
 *
 * App Router wraps page.tsx in a Suspense boundary using this file, so
 * navigating to the home page commits instantly and shows this skeleton
 * while getPlaylists() resolves from Supabase, instead of blocking on the
 * previous page.
 *
 * No translations needed — this is a content-less skeleton.
 */
const Loading: React.FC = () => {
  return (
    <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-12">
      {/* Header — title, description, search */}
      <div className="flex flex-col items-center text-center mb-10">
        <div className="h-14 w-72 rounded-lg bg-slate-200 dark:bg-slate-700 animate-pulse" />
        <div className="mt-4 h-4 w-96 max-w-full rounded bg-slate-200 dark:bg-slate-700 animate-pulse" />
        <div className="mt-6 h-12 w-full max-w-md rounded-lg bg-slate-200 dark:bg-slate-700 animate-pulse" />
      </div>

      {/* Filter area — category pills */}
      <div className="flex flex-col items-center gap-4 mb-12">
        <div className="flex flex-wrap justify-center gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-8 w-24 rounded-full bg-slate-200 dark:bg-slate-700 animate-pulse" />
          ))}
        </div>
        <div className="h-4 w-32 rounded bg-slate-200 dark:bg-slate-700 animate-pulse" />
      </div>

      {/* Playlist grid skeleton — mirrors PlaylistGrid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-10">
        {Array.from({ length: 9 }).map((_, i) => (
          <div key={i} className="h-full bg-slate-800/50 rounded-lg overflow-hidden shadow-md border border-slate-700">
            <div className="aspect-video w-full relative bg-gray-100 dark:bg-gray-800">
              <div className="shimmer-wrapper" />
            </div>
            <div className="p-4 space-y-2">
              <div className="h-5 w-3/4 rounded bg-slate-200 dark:bg-slate-700 animate-pulse" />
              <div className="h-4 w-full rounded bg-slate-200 dark:bg-slate-700 animate-pulse" />
              <div className="h-4 w-5/6 rounded bg-slate-200 dark:bg-slate-700 animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </main>
  )
}

export default Loading
