'use client'

import type { Translations } from '@/app/types'

import React from 'react'
import { useRouter } from 'next/navigation'

export interface BackButtonProps {
  t: Translations
  lang: string
}

const BackButton: React.FC<BackButtonProps> = ({ t, lang }) => {
  const router = useRouter()

  const handleBack = () => {
    if (window.history.length > 1) {
      router.back()
    } else {
      router.push(`/${lang}`)
    }
  }

  return (
    <button
      onClick={handleBack}
      className="inline-flex items-center text-sm font-medium text-slate-400 hover:text-white transition-colors cursor-pointer"
    >
      <span className="material-icons-round mr-2">arrow_forward</span>
      {t.goBack}
    </button>
  )
}

export default BackButton
