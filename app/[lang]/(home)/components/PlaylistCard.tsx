import type { CalculatedPlaylist, LanguageCode } from '@/app/types'

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { videoThumbnailUrl, fallbackThumbnailUrl } from '@/app/utils'

export type PlaylistCardPlaylist = Pick<CalculatedPlaylist, 'id' | 'name' | 'description' | 'thumbnailId'>
export interface PlaylistCardProps {
  playlist: PlaylistCardPlaylist
  lang: LanguageCode
}

const PlaylistCard: React.FC<PlaylistCardProps> = ({ playlist, lang }) => {
  const [imageUrl, setImageUrl] = useState(videoThumbnailUrl(playlist.thumbnailId))

  return (
    <Link href={`/${lang}/playlist/${playlist.id}`} className="block group">
      <article className="h-full bg-slate-800/50 rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 border border-slate-700 hover:border-primary">
        <div className="aspect-video w-full overflow-hidden relative">
          <Image
            src={imageUrl}
            alt={playlist.name}
            fill={true}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
            onError={() => setImageUrl(fallbackThumbnailUrl(playlist.thumbnailId))}
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300"></div>
        </div>
        <div className="p-4">
          <h2 className="text-lg font-semibold text-white group-hover:text-primary transition-colors">
            {playlist.name}
          </h2>
          <p className="text-sm text-slate-400 mt-1 min-h-[2.5rem]">{playlist.description}</p>
        </div>
      </article>
    </Link>
  )
}

export default PlaylistCard
