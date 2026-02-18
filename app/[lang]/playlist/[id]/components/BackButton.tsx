'use client'

import type { Translations } from '@/app/types'

import React from 'react'
import { useRouter } from 'next/navigation'

export interface BackButtonProps {
  t: Translations
}

const BackButton: React.FC<BackButtonProps> = ({ t }) => {
  const router = useRouter()

  return (
    <button
      onClick={() => router.back()}
      className="inline-flex items-center text-sm font-medium text-slate-400 hover:text-white transition-colors cursor-pointer"
    >
      <span className="material-icons-round mr-2">arrow_forward</span>
      {t.goBack}
    </button>
  )
}

export default BackButton
