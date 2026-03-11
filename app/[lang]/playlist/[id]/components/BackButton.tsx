'use client'

import type { Translations } from '@/app/types'

import React from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'

export interface BackButtonProps {
  t: Translations
  lang: string
  playlistId: string
}

const BackButton: React.FC<BackButtonProps> = ({ t, lang, playlistId }) => {
  const router = useRouter()
  const pathname = usePathname()

  // Path segments: ['lang', 'playlist', 'id'] = 3 segments (playlist page)
  // Path segments: ['lang', 'playlist', 'id', 'videoId'] = 4 segments (video page)
  const isVideoPage = pathname.split('/').filter(Boolean).length > 3

  const parentUrl = isVideoPage ? `/${lang}/playlist/${playlistId}` : `/${lang}`
  const parentLabel = isVideoPage ? t.goToPlaylist : t.goToHome
  const parentIcon = isVideoPage ? 'playlist_play' : 'home'

  const goBack = () => {
    // document.referrer and window are only accessed in this click handler (browser-only)
    if (typeof window !== 'undefined' && document.referrer.startsWith(window.location.origin)) {
      router.back()
    } else {
      router.push(parentUrl)
    }
  }

  return (
    <div className="flex items-center gap-4">
      <button
        onClick={goBack}
        className="inline-flex items-center text-sm font-medium text-slate-400 hover:text-white transition-colors cursor-pointer"
      >
        <span className="material-icons-round mr-2">arrow_forward</span>
        {t.goBack}
      </button>
      <Link
        href={parentUrl}
        className="inline-flex items-center text-sm font-medium text-slate-400 hover:text-white transition-colors"
      >
        <span className="material-icons-round mr-2">{parentIcon}</span>
        {parentLabel}
      </Link>
    </div>
  )
}

export default BackButton
