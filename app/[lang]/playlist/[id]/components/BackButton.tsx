'use client'

import type { Translations } from '@/app/types'

import React from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'

export interface BackButtonProps {
  t: Translations
}

const BackButton: React.FC<BackButtonProps> = ({ t }) => {
  const { id, videoplayerid } = useParams<{ id: string; videoplayerid?: string }>()
  const isRtl = t.__language.dir === 'rtl'
  const href = videoplayerid ? `/${t.__language.code}/playlist/${id}` : `/${t.__language.code}`

  return (
    <Link
      href={href}
      className="inline-flex items-center text-sm font-medium text-slate-400 hover:text-white transition-colors"
    >
      <span className="material-icons-round mr-2">{isRtl ? 'arrow_forward' : 'arrow_back'}</span>
      {t.goBack}
    </Link>
  )
}

export default BackButton
