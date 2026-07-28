import React from 'react'

/**
 * Route-level loading fallback for the playlist detail page.
 *
 * App Router shows this instantly on navigation (Suspense boundary) while the
 * server fetches the playlist + videos from Supabase, so the click feels
 * immediate instead of blocking on the previous page.
 *
 * No translations needed — this is a content-less skeleton.
 */
const Loading: React.FC = () => {
  return (
    <>
      {/* Playlist card skeleton — mirrors SelectedPlaylistCard */}
      <div className="bg-card-light dark:bg-card-dark rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700">
        <div className="flex flex-col lg:flex-row">
          <div className="p-6 lg:w-1/2 flex flex-col justify-center space-y-4">
            <div className="h-9 w-3/4 rounded-lg bg-slate-200 dark:bg-slate-700 animate-pulse" />
            <div className="h-7 w-32 rounded-full bg-slate-200 dark:bg-slate-700 animate-pulse" />
            <div className="space-y-2">
              <div className="h-4 w-full rounded bg-slate-200 dark:bg-slate-700 animate-pulse" />
              <div className="h-4 w-5/6 rounded bg-slate-200 dark:bg-slate-700 animate-pulse" />
            </div>

            {/* Metadata grid skeleton */}
            <div className="grid grid-cols-2 gap-x-6 gap-y-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="flex items-center space-x-2">
                  <div className="size-5 rounded bg-slate-200 dark:bg-slate-700 animate-pulse" />
                  <span className="flex flex-col gap-1.5">
                    <span className="h-3.5 w-20 rounded bg-slate-200 dark:bg-slate-700 animate-pulse" />
                    <span className="h-3 w-12 rounded bg-slate-200 dark:bg-slate-700 animate-pulse" />
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Image area — reuse the existing shimmer treatment */}
          <div className="lg:w-1/2 relative bg-gray-100 dark:bg-gray-800 aspect-video">
            <div className="shimmer-wrapper" />
          </div>
        </div>
      </div>

      {/* Content list skeleton — mirrors SelectedPlaylistContent */}
      <div className="bg-card-light dark:bg-card-dark rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="bg-gray-50 dark:bg-gray-800/50 px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-3">
            <div className="h-6 w-40 rounded bg-slate-200 dark:bg-slate-700 animate-pulse" />
            <div className="h-4 w-12 rounded bg-slate-200 dark:bg-slate-700 animate-pulse" />
          </div>
          <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden" />
        </div>

        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 px-6 py-4">
              <div className="size-5 rounded bg-slate-200 dark:bg-slate-700 animate-pulse" />
              <div className="h-4 flex-grow max-w-md rounded bg-slate-200 dark:bg-slate-700 animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

export default Loading
