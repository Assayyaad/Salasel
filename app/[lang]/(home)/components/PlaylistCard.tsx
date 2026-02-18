import type { CalculatedPlaylist, LanguageCode } from '@/app/types'

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { videoThumbnailUrl, fallbackThumbnailUrl } from '@/app/utils'

export type PlaylistCardPlaylist = Pick<CalculatedPlaylist, 'id' | 'channel' | 'name' | 'description' | 'thumbnailId'>
export interface PlaylistCardProps {
  playlist: PlaylistCardPlaylist
  lang: LanguageCode
}

const PlaylistCard: React.FC<PlaylistCardProps> = ({ playlist, lang }) => {
  const [imageUrl, setImageUrl] = useState(videoThumbnailUrl(playlist.thumbnailId))

  return (
    <Link href={`/${lang}/playlist/${playlist.id}`}>
      <article className="group cursor-pointer">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-white group-hover:text-primary transition-colors">
            {playlist.channel} | {playlist.name}
          </h3>
          <p className="text-sm text-slate-400">{playlist.description}</p>
        </div>
        <div className="aspect-video w-full overflow-hidden rounded-lg bg-slate-800 relative shadow-sm group-hover:shadow-lg transition-shadow duration-300">
          <Image
            src={imageUrl}
            alt={playlist.name}
            fill={true}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
            onError={() => setImageUrl(fallbackThumbnailUrl(playlist.thumbnailId))}
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300"></div>
        </div>
      </article>
    </Link>
  )
}

export default PlaylistCard
