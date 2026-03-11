'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'

const BackButton: React.FC = () => {
  const router = useRouter()
  const t = useTranslations()

  return (
    <button
      onClick={() => router.back()}
      className="inline-flex items-center text-sm font-medium text-slate-400 hover:text-white transition-colors cursor-pointer"
    >
      <span className="material-icons-round mr-2">arrow_forward</span>
      {t('goBack')}
    </button>
  )
}

export default BackButton
