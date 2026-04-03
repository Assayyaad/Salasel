'use client'

import React from 'react'
import { useParams } from 'next/navigation'
import { Link } from '@/i18n/navigation'
import { useLocale, useTranslations } from 'next-intl'

const BackButton: React.FC = () => {
  const t = useTranslations()
  const locale = useLocale()
  const params = useParams()
  const isRtl = locale === 'ar'

  const playlistId = params.id as string
  const isOnVideoPlayer = !!params.videoplayerid
  const destination = isOnVideoPlayer ? `/playlist/${playlistId}` : '/'

  return (
    <Link
      href={destination}
      className="inline-flex items-center text-sm font-medium text-slate-400 hover:text-white transition-colors"
    >
      <span className="material-icons-round me-2">{isRtl ? 'arrow_forward' : 'arrow_back'}</span>
      {t('goBack')}
    </Link>
  )
}

export default BackButton
