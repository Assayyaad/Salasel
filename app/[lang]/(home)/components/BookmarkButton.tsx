'use client'

import React from 'react'
import { useBookmarkStore } from '@/app/store/useBookmarkStore'

export interface BookmarkButtonProps {
  playlistId: string
}

const BookmarkButton: React.FC<BookmarkButtonProps> = ({ playlistId }) => {
  const [isClient, setIsClient] = React.useState(false)
  const bookmarkedPlaylists = useBookmarkStore((state) => state.bookmarkedPlaylists)
  const toggleBookmark = useBookmarkStore((state) => state.toggleBookmark)

  React.useEffect(() => {
    setIsClient(true)
  }, [])

  const bookmarked = isClient && bookmarkedPlaylists.has(playlistId)

  return (
    <button
      onClick={(e) => {
        e.preventDefault() // prevent the card Link from firing
        toggleBookmark(playlistId)
      }}
      aria-label={bookmarked ? 'Remove bookmark' : 'Bookmark playlist'}
      className="p-2.5 rounded-full bg-slate-900/70 backdrop-blur-sm border border-slate-700 text-slate-400 hover:text-primary hover:border-primary transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary"
    >
      {bookmarked ? (
        // Filled bookmark
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="text-primary"
          aria-hidden="true"
        >
          <path d="M5 3a2 2 0 0 0-2 2v16l9-4 9 4V5a2 2 0 0 0-2-2H5z" />
        </svg>
      ) : (
        // Outlined bookmark
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M19 21l-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
        </svg>
      )}
    </button>
  )
}

export default BookmarkButton
