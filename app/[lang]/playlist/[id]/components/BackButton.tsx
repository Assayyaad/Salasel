'use client'

import type { Translations } from '@/app/types'

import React from 'react'
import Link from 'next/link'

export interface BackButtonProps {
  t: Translations
}

const BackButton: React.FC<BackButtonProps> = ({ t }) => {
  const isRtl = t.__language.dir === 'rtl'

  return (
    <Link
      href={`/${t.__language.code}`}
      className="inline-flex items-center text-sm font-medium text-slate-400 hover:text-white transition-colors"
    >
      <span className="material-icons-round mr-2">{isRtl ? 'arrow_forward' : 'arrow_back'}</span>
      {t.goBack}
    </Link>
  )
}

export default BackButton
