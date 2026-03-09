'use client'

import type { CalculatedProgram, LanguageCode } from '@/app/types'

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { videoThumbnailUrl, fallbackThumbnailUrl } from '@/app/utils'

export type ProgramCardProgram = Pick<
  CalculatedProgram,
  'id' | 'name' | 'description' | 'thumbnailId' | 'playlistCount'
>
export interface ProgramCardProps {
  program: ProgramCardProgram
  lang: LanguageCode
  priority?: boolean
}

const ProgramCard: React.FC<ProgramCardProps> = ({ program, lang, priority = false }) => {
  const [imageUrl, setImageUrl] = useState(videoThumbnailUrl(program.thumbnailId))

  return (
    <Link href={`/${lang}/program/${program.id}`} className="block group">
      <article className="h-full bg-slate-800/50 rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 border border-slate-700 hover:border-primary">
        <div className="aspect-video w-full overflow-hidden relative">
          <Image
            src={imageUrl}
            alt={program.name}
            fill={true}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
            priority={priority}
            fetchPriority={priority ? 'high' : undefined}
            onError={() => setImageUrl(fallbackThumbnailUrl(program.thumbnailId))}
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300"></div>
          <div className="absolute top-2 start-2 bg-primary/90 text-white text-xs font-semibold px-2 py-1 rounded-full flex items-center gap-1">
            <span className="material-icons-round text-xs">layers</span>
            <span>{program.playlistCount}</span>
          </div>
        </div>
        <div className="p-4">
          <h2 className="text-lg font-semibold text-white group-hover:text-primary transition-colors">
            {program.name}
          </h2>
          <p className="text-sm text-slate-400 mt-1 min-h-[2.5rem]">{program.description}</p>
        </div>
      </article>
    </Link>
  )
}

export default ProgramCard
