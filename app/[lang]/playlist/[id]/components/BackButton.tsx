'use client'

import type { Translations } from '@/app/types'

import React from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'

export interface BackButtonProps {
  t: Translations
  lang: string
  id: string
}

const BackButton: React.FC<BackButtonProps> = ({ t, lang, id }) => {
  const router = useRouter()
  const pathname = usePathname()

  const playlistUrl = `/${lang}/playlist/${id}`
  const homeUrl = `/${lang}`
  const isVideoPage = pathname !== playlistUrl
  const parentUrl = isVideoPage ? playlistUrl : homeUrl

  const goBack = () => {
    if (document.referrer.startsWith(window.location.origin)) {
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
        <span className="material-icons-round mr-2">arrow_upward</span>
        {t.goUp}
      </Link>
    </div>
  )
}

export default BackButton
