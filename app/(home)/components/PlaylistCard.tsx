import type { Playlist } from '@/app/types'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { videoThumbnailUrl } from '@/app/utils'

interface PlaylistCardProps {
  playlist: Playlist
}

const PlaylistCard: React.FC<PlaylistCardProps> = ({ playlist }) => {
  const { name, description, id, videos } = playlist
  const imageUrl = videoThumbnailUrl(videos[0]?.id)

  return (
    <Link href={`/playlist/${id}`}>
      <article className="group cursor-pointer">
        <div className="aspect-video w-full overflow-hidden rounded-lg bg-slate-800 relative shadow-sm group-hover:shadow-lg transition-shadow duration-300">
          <Image
            src={imageUrl}
            alt={name}
            fill={true}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300"></div>
        </div>
        <div className="mt-4" dir="rtl">
          <h3 className="text-lg font-semibold text-white group-hover:text-primary transition-colors">{name}</h3>
          <p className="text-sm text-slate-400">{description}</p>
        </div>
      </article>
    </Link>
  )
}

export default PlaylistCard
