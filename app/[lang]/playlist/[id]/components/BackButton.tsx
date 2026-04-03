'use client'

import React from 'react'
import { useRouter } from '@/i18n/navigation'
import { useLocale, useTranslations } from 'next-intl'

const BackButton: React.FC = () => {
  const router = useRouter()
  const t = useTranslations()
  const locale = useLocale()
  const isRtl = locale === 'ar'

  return (
    <button
      onClick={() => router.back()}
      className="inline-flex items-center text-sm font-medium text-slate-400 hover:text-white transition-colors cursor-pointer"
    >
      <span className="material-icons-round me-2">{isRtl ? 'arrow_forward' : 'arrow_back'}</span>
      {t('goBack')}
    </button>
  )
}

export default BackButton
